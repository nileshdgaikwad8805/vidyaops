const crypto = require("crypto");
const {
  insertInquiry,
  insertLead,
  insertChatMessage,
  insertEnrollment,
  updateEnrollmentOrder,
  updateEnrollmentPayment,
  selectEnrollmentById,
  selectEnrollmentByToken
} = require("../db/repositories");
const {
  generateInquiryAutomation,
  generateLeadAutomation,
  callGemini,
  GEMINI_API_KEY,
  GEMINI_MODEL
} = require("../services/gemini");
const {
  sendAutomatedFollowup,
  sendLearnerOnboardingEmail,
  notifyInquirySaved,
  notifyLeadSaved,
} = require("../services/email");
const {
  getProductById,
  PRODUCT_CATALOG,
  razorpayConfigured,
  RAZORPAY_KEY_ID,
  createRazorpayOrder,
  verifyRazorpaySignature
} = require("../services/payment");
const { extractEmailAddress, toIsoDateOffset, nowIso, NURTURE_DELAYS_DAYS } = require("../utils");

function handleProductCatalog(req, res) {
  return res.status(200).json({
    products: PRODUCT_CATALOG,
    razorpayEnabled: razorpayConfigured,
    razorpayKeyId: razorpayConfigured ? RAZORPAY_KEY_ID : "",
  });
}

function handleLearnerSession(req, res) {
  const token = String(req.query.token || "").trim();
  if (!token) {
    return res.status(400).json({ error: "Learner token is required." });
  }

  const enrollment = selectEnrollmentByToken.get(token);
  if (!enrollment) {
    return res.status(404).json({ error: "Learner session not found." });
  }

  return res.status(200).json({
    enrollment: {
      id: enrollment.id,
      productName: enrollment.product_name,
      productType: enrollment.product_type,
      amountInr: enrollment.amount_inr,
      learnerName: enrollment.learner_name,
      learnerEmail: enrollment.learner_email,
      learnerPhone: enrollment.learner_phone,
      learnerType: enrollment.learner_type,
      learnerGoal: enrollment.learner_goal,
      status: enrollment.status,
      onboardingSent: Boolean(enrollment.onboarding_sent),
      createdAt: enrollment.created_at,
    },
  });
}

async function handleChat(req, res) {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not set. Add it to your environment before starting the local server.",
      });
    }

    const sessionId = String(req.body.sessionId || "anonymous").trim();
    const messages = Array.isArray(req.body.messages) ? req.body.messages : [];
    const latestUserMessage = String(req.body.message || "").trim();
    const chatMode = String(req.body.mode || "default").trim().toLowerCase();

    if (!messages.length || !latestUserMessage) {
      return res.status(400).json({ error: "A session, history, and latest message are required." });
    }

    const baseInstructions =
      "You are VidyaOps AI, the admissions and learner guidance assistant for VidyaOps in Pune, Maharashtra. " +
      "VidyaOps offers Cloud, Data Analysis, AI, and Cybersecurity trainings plus free and paid workshops. " +
      "Primary audience: college students, freshers, early professionals, and knowledge seekers. " +
      "Keep replies concise, warm, practical, and conversion-aware. " +
      "Do not invent prices, schedules, certifications, job guarantees, or promises that are not provided. " +
      "If asked for location, say VidyaOps is based in Pune, Maharashtra. " +
      "If asked who VidyaOps is for, mention college students, freshers, early professionals, and knowledge seekers. " +
      "When a user shows buying intent, wants to enroll, asks for dates, fees, next batch, or deeper details not present in site context, tell them to contact VidyaOps directly at phone 9284543320, email contact@vidyaops.com, or WhatsApp.";

    const counselorInstructions =
      baseInstructions +
      " You are acting as a smart counselor. " +
      "Read the learner profile in the conversation carefully and recommend the single best starting path. " +
      "Use the learner's stage, interest area, and goal to choose between a free workshop, paid workshop, or full training track. " +
      "Briefly explain why that recommendation fits them, then mention one logical next alternative. " +
      "End with a soft next step toward Contact or WhatsApp.";

    const defaultInstructions =
      baseInstructions +
      " Your job is to guide visitors toward the right training or workshop, answer clearly, and help convert interest into inquiry. " +
      "When a user seems unsure, recommend the best starting option based on their stage. " +
      "End high-intent replies with a soft call to action such as inviting the learner to use Contact or WhatsApp.";

    const contents = messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: String(message.content || "") }],
    }));

    const reply =
      (await callGemini({
        caller: "handleChat",
        instructions: chatMode === "counselor" ? counselorInstructions : defaultInstructions,
        contents,
      })) || "I could not generate a reply right now. Please try again.";

    insertChatMessage.run(sessionId, "user", latestUserMessage);
    insertChatMessage.run(sessionId, "assistant", reply);

    return res.status(200).json({
      reply,
      model: GEMINI_MODEL,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unexpected server error." });
  }
}

async function handleContactInquiry(req, res) {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim();
    const organization = String(req.body.organization || "").trim();
    const interest = String(req.body.interest || "").trim();
    const message = String(req.body.message || "").trim();
    const source = String(req.body.source || "contact_form").trim();

    if (!name || !email || !interest || !message) {
      return res.status(400).json({ error: "Name, email, interest, and message are required." });
    }

    const { aiScore, aiSummary, aiNextStep, aiFollowupSubject, aiFollowupBody } = await generateInquiryAutomation({
      name,
      organization,
      interest,
      message,
    });

    const aiFollowupSent = (await sendAutomatedFollowup({
      to: email,
      subject: aiFollowupSubject,
      body: aiFollowupBody,
    })) ? 1 : 0;
    
    const nurtureStage = 0;
    const nurtureNextRunAt = aiFollowupSent ? toIsoDateOffset(NURTURE_DELAYS_DAYS[0]) : "";
    const nurtureLastSentAt = aiFollowupSent ? nowIso() : "";

    const result = insertInquiry.run(
      name,
      email,
      organization,
      interest,
      message,
      source,
      aiScore,
      aiSummary,
      aiNextStep,
      aiFollowupSubject,
      aiFollowupBody,
      aiFollowupSent,
      nurtureStage,
      nurtureNextRunAt,
      nurtureLastSentAt
    );
    const inquiryId = Number(result.lastInsertRowid);

    await notifyInquirySaved({
      name,
      email,
      organization,
      interest,
      message,
      source,
      inquiryId,
      aiSummary,
      aiNextStep,
    });

    return res.status(201).json({ success: true, inquiryId });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unexpected server error." });
  }
}

async function handleLeadCapture(req, res) {
  try {
    const sessionId = String(req.body.sessionId || "").trim();
    const name = String(req.body.name || "").trim();
    const contact = String(req.body.contact || "").trim();
    const learnerType = String(req.body.learnerType || "").trim();
    const interest = String(req.body.interest || "").trim();
    const status = "new";
    const notes = "";

    if (!name || !contact || !learnerType || !interest) {
      return res.status(400).json({ error: "Name, contact, learner type, and interest are required." });
    }

    const { aiScore, aiSummary, aiNextStep, aiFollowupSubject, aiFollowupBody } = await generateLeadAutomation({
      name,
      learnerType,
      interest,
      contact,
    });

    const leadEmail = extractEmailAddress(contact);
    const aiFollowupSent = (await sendAutomatedFollowup({
      to: leadEmail,
      subject: aiFollowupSubject,
      body: aiFollowupBody,
    })) ? 1 : 0;
    
    const computedStatus = aiFollowupSent ? "contacted" : status;
    const nurtureStage = 0;
    const nurtureNextRunAt = aiFollowupSent ? toIsoDateOffset(NURTURE_DELAYS_DAYS[0]) : "";
    const nurtureLastSentAt = aiFollowupSent ? nowIso() : "";

    const result = insertLead.run(
      sessionId,
      name,
      contact,
      learnerType,
      interest,
      computedStatus,
      notes,
      aiScore,
      aiSummary,
      aiNextStep,
      aiFollowupSubject,
      aiFollowupBody,
      aiFollowupSent,
      nurtureStage,
      nurtureNextRunAt,
      nurtureLastSentAt
    );
    const leadId = Number(result.lastInsertRowid);

    await notifyLeadSaved({
      name,
      contact,
      learnerType,
      interest,
      leadId,
      status: computedStatus,
      aiSummary,
      aiNextStep,
    });

    return res.status(201).json({ success: true, leadId });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unexpected server error." });
  }
}

async function handleFreeEnrollment(req, res) {
  try {
    const { productId = "", name: learnerName = "", email: learnerEmail = "", phone: learnerPhone = "", learnerType = "", goal: learnerGoal = "" } = req.body;
    const product = getProductById(productId);

    if (!product || product.type !== "free") {
      return res.status(400).json({ error: "Invalid free product selection." });
    }

    if (!learnerName || !learnerEmail || !learnerPhone || !learnerType) {
      return res.status(400).json({ error: "Name, email, phone, and learner type are required." });
    }

    const accessToken = crypto.randomUUID();
    const result = insertEnrollment.run(
      product.id,
      product.name,
      product.type,
      product.priceInr,
      "INR",
      learnerName,
      learnerEmail,
      learnerPhone,
      learnerType,
      learnerGoal,
      "enrolled",
      "free",
      "",
      accessToken,
      0
    );

    const enrollment = selectEnrollmentById.get(Number(result.lastInsertRowid));
    await sendLearnerOnboardingEmail({ request: req, enrollment });

    return res.status(201).json({
      success: true,
      enrollmentId: enrollment.id,
      accessToken: enrollment.access_token,
      redirectUrl: `/learner-dashboard.html?token=${encodeURIComponent(enrollment.access_token)}`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unable to complete free registration." });
  }
}

async function handleRazorpayOrderCreate(req, res) {
  try {
    if (!razorpayConfigured) {
      return res.status(503).json({ error: "Razorpay is not configured yet." });
    }

    const { productId = "", name: learnerName = "", email: learnerEmail = "", phone: learnerPhone = "", learnerType = "", goal: learnerGoal = "" } = req.body;
    const product = getProductById(productId);

    if (!product || product.type !== "paid") {
      return res.status(400).json({ error: "Invalid paid product selection." });
    }

    if (!learnerName || !learnerEmail || !learnerPhone || !learnerType) {
      return res.status(400).json({ error: "Name, email, phone, and learner type are required." });
    }

    const accessToken = crypto.randomUUID();
    const insertResult = insertEnrollment.run(
      product.id,
      product.name,
      product.type,
      product.priceInr,
      "INR",
      learnerName,
      learnerEmail,
      learnerPhone,
      learnerType,
      learnerGoal,
      "payment_pending",
      "razorpay",
      "",
      accessToken,
      0
    );
    const enrollmentId = Number(insertResult.lastInsertRowid);

    const order = await createRazorpayOrder({
      amountInr: product.priceInr,
      receipt: `vidyaops_${enrollmentId}`,
      notes: {
        enrollment_id: String(enrollmentId),
        product_id: product.id,
        learner_email: learnerEmail,
      },
    });

    updateEnrollmentOrder.run(String(order.id || ""), enrollmentId);

    return res.status(201).json({
      success: true,
      enrollmentId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
      product,
      learner: {
        name: learnerName,
        email: learnerEmail,
        contact: learnerPhone,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unable to create Razorpay order." });
  }
}

async function handleRazorpayVerify(req, res) {
  try {
    const enrollmentId = Number(req.body.enrollmentId || 0);
    const orderId = String(req.body.razorpay_order_id || "").trim();
    const paymentId = String(req.body.razorpay_payment_id || "").trim();
    const signature = String(req.body.razorpay_signature || "").trim();

    if (!enrollmentId || !orderId || !paymentId || !signature) {
      return res.status(400).json({ error: "Payment verification details are required." });
    }

    const enrollment = selectEnrollmentById.get(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found." });
    }

    if (enrollment.provider_order_id !== orderId) {
      return res.status(400).json({ error: "Payment order mismatch." });
    }

    if (!verifyRazorpaySignature({ orderId, paymentId, signature })) {
      return res.status(400).json({ error: "Invalid payment signature." });
    }

    updateEnrollmentPayment.run("enrolled", paymentId, signature, enrollmentId);
    const updatedEnrollment = selectEnrollmentById.get(enrollmentId);
    await sendLearnerOnboardingEmail({ request: req, enrollment: updatedEnrollment });

    return res.status(200).json({
      success: true,
      redirectUrl: `/payment-success.html?token=${encodeURIComponent(updatedEnrollment.access_token)}`,
      accessToken: updatedEnrollment.access_token,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unable to verify payment." });
  }
}

module.exports = {
  handleProductCatalog,
  handleLearnerSession,
  handleChat,
  handleContactInquiry,
  handleLeadCapture,
  handleFreeEnrollment,
  handleRazorpayOrderCreate,
  handleRazorpayVerify
};
