const path = require("path");
const { loadAppConfig } = require("../../app-config");
const { updateEnrollmentOnboarding } = require("../db/repositories");
const { getBaseUrl } = require("../utils");

const ROOT = path.join(__dirname, "../../");
const APP_CONFIG = loadAppConfig(ROOT);
const RESEND_API_KEY = APP_CONFIG.resendApiKey;
const RESEND_FROM_EMAIL = APP_CONFIG.resendFromEmail;
const NOTIFY_EMAIL_TO = APP_CONFIG.notifyEmailTo;

const resendConfigured = Boolean(RESEND_API_KEY && RESEND_FROM_EMAIL && NOTIFY_EMAIL_TO);

async function sendNotificationEmail({ subject, text, html }) {
  if (!resendConfigured) {
    return false;
  }
  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to: [NOTIFY_EMAIL_TO],
      subject,
      text,
      html,
    }),
  });

  const resendPayload = await resendResponse.json();
  if (!resendResponse.ok) {
    throw new Error(resendPayload?.message || resendPayload?.error || "Resend request failed.");
  }

  return true;
}

async function sendTransactionalEmail({ to, subject, text, html }) {
  if (!resendConfigured || !to) {
    return false;
  }

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to: [to],
      subject,
      text,
      html,
    }),
  });

  const resendPayload = await resendResponse.json();
  if (!resendResponse.ok) {
    throw new Error(resendPayload?.message || resendPayload?.error || "Resend request failed.");
  }

  return true;
}

async function notifyInquirySaved({ name, email, organization, interest, message, source, inquiryId, aiSummary, aiNextStep }) {
  try {
    await sendNotificationEmail({
      subject: `VidyaOps inquiry #${inquiryId}: ${interest}`,
      text:
        `A new VidyaOps inquiry was saved.\n\n` +
        `Inquiry ID: ${inquiryId}\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Organization: ${organization || "Not provided"}\n` +
        `Interest: ${interest}\n` +
        `Source: ${source}\n\n` +
        `AI Summary: ${aiSummary || "Not generated"}\n` +
        `AI Next Step: ${aiNextStep || "Not generated"}\n\n` +
        `Message:\n${message}`,
      html:
        `<h2>New VidyaOps inquiry</h2>` +
        `<p><strong>Inquiry ID:</strong> ${inquiryId}</p>` +
        `<p><strong>Name:</strong> ${name}</p>` +
        `<p><strong>Email:</strong> ${email}</p>` +
        `<p><strong>Organization:</strong> ${organization || "Not provided"}</p>` +
        `<p><strong>Interest:</strong> ${interest}</p>` +
        `<p><strong>Source:</strong> ${source}</p>` +
        `<p><strong>AI Summary:</strong> ${aiSummary || "Not generated"}</p>` +
        `<p><strong>AI Next Step:</strong> ${aiNextStep || "Not generated"}</p>` +
        `<p><strong>Message:</strong><br>${message.replace(/\n/g, "<br>")}</p>`,
    });
  } catch (error) {
    console.error("Inquiry notification failed:", error);
  }
}

async function notifyLeadSaved({ name, contact, learnerType, interest, leadId, status, aiSummary, aiNextStep }) {
  try {
    await sendNotificationEmail({
      subject: `VidyaOps chatbot lead #${leadId}: ${interest}`,
      text:
        `A new chatbot lead was saved.\n\n` +
        `Lead ID: ${leadId}\n` +
        `Name: ${name}\n` +
        `Contact: ${contact}\n` +
        `Learner Type: ${learnerType}\n` +
        `Interest: ${interest}\n` +
        `Status: ${status}\n` +
        `AI Summary: ${aiSummary || "Not generated"}\n` +
        `AI Next Step: ${aiNextStep || "Not generated"}`,
      html:
        `<h2>New VidyaOps chatbot lead</h2>` +
        `<p><strong>Lead ID:</strong> ${leadId}</p>` +
        `<p><strong>Name:</strong> ${name}</p>` +
        `<p><strong>Contact:</strong> ${contact}</p>` +
        `<p><strong>Learner Type:</strong> ${learnerType}</p>` +
        `<p><strong>Interest:</strong> ${interest}</p>` +
        `<p><strong>Status:</strong> ${status}</p>` +
        `<p><strong>AI Summary:</strong> ${aiSummary || "Not generated"}</p>` +
        `<p><strong>AI Next Step:</strong> ${aiNextStep || "Not generated"}</p>`,
    });
  } catch (error) {
    console.error("Lead notification failed:", error);
  }
}

async function sendAutomatedFollowup({ to, subject, body }) {
  if (!to || !subject || !body) {
    return false;
  }

  try {
    await sendTransactionalEmail({
      to,
      subject,
      text: body,
      html: `<p>${body.replace(/\n/g, "<br>")}</p>`,
    });
    return true;
  } catch (error) {
    console.error("Automated follow-up failed:", error);
    return false;
  }
}

async function sendLearnerOnboardingEmail({ request, enrollment }) {
  if (!enrollment?.learner_email) {
    return false;
  }

  const baseUrl = getBaseUrl(request);
  const dashboardLink = baseUrl
    ? `${baseUrl}/learner-dashboard.html?token=${encodeURIComponent(enrollment.access_token)}`
    : `learner-dashboard.html?token=${encodeURIComponent(enrollment.access_token)}`;

  const subject = `Welcome to ${enrollment.product_name}`;
  const text =
    `Hi ${enrollment.learner_name},\n\n` +
    `Your VidyaOps enrollment is confirmed for ${enrollment.product_name}.\n` +
    `Use your learner dashboard here: ${dashboardLink}\n\n` +
    `We will guide you through the next steps, onboarding, and workshop readiness from there.\n\n` +
    `VidyaOps\nKnowledge is the power.`;

  const html =
    `<p>Hi ${enrollment.learner_name},</p>` +
    `<p>Your VidyaOps enrollment is confirmed for <strong>${enrollment.product_name}</strong>.</p>` +
    `<p><a href="${dashboardLink}">Open your learner dashboard</a></p>` +
    `<p>We will guide you through the next steps, onboarding, and workshop readiness from there.</p>` +
    `<p>VidyaOps<br>Knowledge is the power.</p>`;

  try {
    await sendTransactionalEmail({
      to: enrollment.learner_email,
      subject,
      text,
      html,
    });
    updateEnrollmentOnboarding.run(1, enrollment.id);
    return true;
  } catch (error) {
    console.error("Learner onboarding email failed:", error);
    return false;
  }
}

module.exports = {
  resendConfigured,
  sendNotificationEmail,
  sendTransactionalEmail,
  notifyInquirySaved,
  notifyLeadSaved,
  sendAutomatedFollowup,
  sendLearnerOnboardingEmail
};
