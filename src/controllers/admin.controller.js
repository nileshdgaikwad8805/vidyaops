const crypto = require("crypto");
const path = require("path");
const { loadAppConfig } = require("../../app-config");
const { verifyPassword, createPasswordHash } = require("../services/auth");
const { adminSessions } = require("../services/session");
const { sendNotificationEmail, resendConfigured } = require("../services/email");
const { toCsv } = require("../utils");
const { callGemini, GEMINI_API_KEY } = require("../services/gemini");
const {
  selectAdminUser,
  updateAdminPassword,
  selectInquiryCount,
  selectLeadCount,
  selectChatCount,
  selectWorkshopCount,
  selectEnrollmentCount,
  selectRecentInquiries,
  selectRecentLeads,
  selectRecentChats,
  selectWorkshops,
  selectRecentEnrollments,
  updateLeadStatus,
} = require("../db/repositories");

const ROOT = path.join(__dirname, "../../");
const APP_CONFIG = loadAppConfig(ROOT);
const SESSION_COOKIE = APP_CONFIG.sessionCookie;
const NOTIFY_EMAIL_TO = APP_CONFIG.notifyEmailTo;

async function handleAdminLogin(req, res) {
  try {
    const { username = "", password = "" } = req.body;
    const adminUser = selectAdminUser.get();

    if (!adminUser || adminUser.username !== username || !verifyPassword(password, adminUser.password_hash)) {
      return res.status(401).json({ error: "Invalid admin credentials." });
    }

    const token = crypto.randomUUID();
    adminSessions.set(token, {
      id: adminUser.id,
      username: adminUser.username,
      createdAt: Date.now(),
    });

    res.cookie(SESSION_COOKIE, token, { httpOnly: true, secure: true, path: "/", sameSite: "strict" });
    return res.status(200).json({ success: true, username: adminUser.username, token });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unexpected server error." });
  }
}

function handleAdminLogout(req, res) {
  const authorization = req.headers.authorization || "";
  const headerToken = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";
  const token = headerToken || req.cookies[SESSION_COOKIE];
  
  if (token) {
    adminSessions.delete(token);
  }

  res.cookie(SESSION_COOKIE, "", { httpOnly: true, secure: true, path: "/", maxAge: 0, sameSite: "strict" });
  return res.status(200).json({ success: true });
}

function handleAdminSession(req, res) {
  if (!req.adminSession) {
    return res.status(401).json({ authenticated: false });
  }
  return res.status(200).json({
    authenticated: true,
    username: req.adminSession.username,
  });
}

function handleAdminOverview(req, res) {
  try {
    return res.status(200).json({
      session: {
        username: req.adminSession.username,
      },
      counts: {
        inquiries: selectInquiryCount.get().count,
        leads: selectLeadCount.get().count,
        chatMessages: selectChatCount.get().count,
        workshops: selectWorkshopCount.get().count,
        enrollments: selectEnrollmentCount.get().count,
      },
      notifications: {
        enabled: resendConfigured,
        recipient: NOTIFY_EMAIL_TO || "Not configured",
      },
      inquiries: selectRecentInquiries.all(),
      leads: selectRecentLeads.all(),
      chatMessages: selectRecentChats.all(),
      workshops: selectWorkshops.all(),
      enrollments: selectRecentEnrollments.all(),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unexpected server error." });
  }
}

async function handleAdminChangePassword(req, res) {
  try {
    const { currentPassword = "", newPassword = "", confirmPassword = "" } = req.body;
    const adminUser = selectAdminUser.get();

    if (!adminUser || adminUser.id !== req.adminSession.id) {
      return res.status(401).json({ error: "Admin session is invalid." });
    }

    if (!verifyPassword(currentPassword, adminUser.password_hash)) {
      return res.status(400).json({ error: "Current password is incorrect." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "New password and confirm password must match." });
    }

    updateAdminPassword.run(createPasswordHash(newPassword), adminUser.id);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unexpected server error." });
  }
}

async function handleAdminTestEmail(req, res) {
  try {
    if (!resendConfigured) {
      return res.status(400).json({
        error: "Email notifications are not configured yet. Add Resend settings to .env first.",
      });
    }

    await sendNotificationEmail({
      subject: "VidyaOps notification test",
      text: "This is a VidyaOps test email. Gmail SMTP is configured correctly if you received this message.",
      html: "<h2>VidyaOps notification test</h2><p>Gmail SMTP is configured correctly if you received this message.</p>",
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unexpected server error." });
  }
}

function handleCsvExport(req, res) {
  const kind = req.params.kind;
  const rows =
    kind === "inquiries"
      ? selectRecentInquiries.all()
      : kind === "leads"
        ? selectRecentLeads.all()
        : selectWorkshops.all();

  const csv = toCsv(rows);
  res.setHeader("Content-Disposition", `attachment; filename="vidyaops-${kind}.csv"`);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  return res.status(200).send(csv);
}

async function handleAdminAiContent(req, res) {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured." });
    }

    const format = String(req.body.format || "").trim();
    const topic = String(req.body.topic || "").trim();
    const audience = String(req.body.audience || "").trim();
    const goal = String(req.body.goal || "").trim();
    const tone = String(req.body.tone || "professional").trim();

    if (!format || !topic || !audience || !goal) {
      return res.status(400).json({ error: "Format, topic, audience, and goal are required." });
    }

    const instructions =
      "You are VidyaOps's internal AI content assistant for admins. " +
      "Generate polished marketing content for a training brand in Pune offering Cloud, Data Analysis, AI, Cybersecurity, and workshop-based learning. " +
      "Write in a premium, practical, human tone. " +
      "Keep the output ready to use, specific, and clear. " +
      "Do not invent dates, fees, workshop seats, certifications, outcomes, or client names that were not provided. " +
      "If needed, use placeholders like [add date] or [add venue]. " +
      "Return only the requested content, with light formatting. " +
      "If format is workshop_description, produce a title, short intro, 4 bullet highlights, who it is for, and a CTA. " +
      "If format is announcement, produce a short promotional announcement suitable for website or WhatsApp broadcast. " +
      "If format is social_post, produce 3 distinct social post drafts with short captions and CTA lines.";

    const prompt =
      `Format: ${format}\n` +
      `Topic: ${topic}\n` +
      `Audience: ${audience}\n` +
      `Goal: ${goal}\n` +
      `Tone: ${tone}\n` +
      `Brand message: Knowledge is the power.\n` +
      `Location: Pune, Maharashtra.\n`;

    const output = await callGemini({
      instructions,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    return res.status(200).json({ success: true, output });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unable to generate AI content." });
  }
}

async function handleAdminLeadUpdate(req, res) {
  try {
    const leadId = parseInt(req.params.id, 10);
    const status = String(req.body.status || "").trim().toLowerCase();
    const notes = String(req.body.notes || "").trim();
    const allowedStatuses = ["new", "contacted", "qualified", "enrolled", "closed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid lead status." });
    }

    updateLeadStatus.run(status, notes, leadId);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Unexpected server error." });
  }
}

module.exports = {
  handleAdminLogin,
  handleAdminLogout,
  handleAdminSession,
  handleAdminOverview,
  handleAdminChangePassword,
  handleAdminTestEmail,
  handleCsvExport,
  handleAdminAiContent,
  handleAdminLeadUpdate
};
