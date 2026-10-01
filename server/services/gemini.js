const path = require("path");
const { loadAppConfig } = require("../config/app-config");

const ROOT = path.join(__dirname, "../../");
const APP_CONFIG = loadAppConfig(ROOT);
const GEMINI_API_KEY = APP_CONFIG.geminiApiKey;
const GEMINI_MODEL = APP_CONFIG.geminiModel;

function extractGeminiText(payload) {
  if (!Array.isArray(payload?.candidates)) {
    return "";
  }

  const firstCandidate = payload.candidates[0];
  const parts = firstCandidate?.content?.parts;

  if (!Array.isArray(parts)) {
    return "";
  }

  return parts
    .map((part) => (typeof part?.text === "string" ? part.text : ""))
    .join("\n")
    .trim();
}

async function callGemini({ instructions, contents, caller }) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: instructions }],
        },
        contents,
      }),
    }
  );

  const payload = await geminiResponse.json();

  if (!geminiResponse.ok) {
    const tag = caller ? `[${caller}] ` : "";
    console.error(`${tag}Gemini API error (model=${GEMINI_MODEL}):`, JSON.stringify(payload?.error || payload));
    throw new Error(payload?.error?.message || "Gemini request failed.");
  }

  return extractGeminiText(payload) || "";
}

async function generateInquiryAutomation({ name, organization, interest, message }) {
  if (!GEMINI_API_KEY) {
    return { aiScore: 0, aiSummary: "", aiNextStep: "", aiFollowupSubject: "", aiFollowupBody: "" };
  }

  const output = await callGemini({
    caller: "generateInquiryAutomation",
    instructions:
      "You are VidyaOps's internal AI intake assistant. " +
      "Summarize incoming inquiries for admins. " +
      "Return exactly these lines: SCORE: ..., SUMMARY: ..., NEXT_STEP: ..., FOLLOWUP_SUBJECT: ..., FOLLOWUP_BODY: ... " +
      "Use an integer score from 1 to 100. " +
      "Keep summary and next step concise, practical, and actionable. " +
      "The follow-up should be a short email body from VidyaOps that warmly guides the learner to the best next step. " +
      "Do not invent details.",
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              `Name: ${name}\n` +
              `Organization: ${organization || "Not provided"}\n` +
              `Interest: ${interest}\n` +
              `Message: ${message}\n`,
          },
        ],
      },
    ],
  });

  const scoreMatch = output.match(/SCORE:\s*(\d+)/i);
  const summaryMatch = output.match(/SUMMARY:\s*(.+)/i);
  const nextStepMatch = output.match(/NEXT_STEP:\s*(.+)/i);
  const subjectMatch = output.match(/FOLLOWUP_SUBJECT:\s*(.+)/i);
  const bodyMatch = output.match(/FOLLOWUP_BODY:\s*([\s\S]*)$/i);

  return {
    aiScore: Number(scoreMatch?.[1] || 0),
    aiSummary: summaryMatch?.[1]?.trim() || "",
    aiNextStep: nextStepMatch?.[1]?.trim() || "",
    aiFollowupSubject: subjectMatch?.[1]?.trim() || "",
    aiFollowupBody: bodyMatch?.[1]?.trim() || "",
  };
}

async function generateLeadAutomation({ name, learnerType, interest, contact }) {
  if (!GEMINI_API_KEY) {
    return { aiScore: 0, aiSummary: "", aiNextStep: "", aiFollowupSubject: "", aiFollowupBody: "" };
  }

  const output = await callGemini({
    caller: "generateLeadAutomation",
    instructions:
      "You are VidyaOps's internal AI lead triage assistant. " +
      "Summarize a lead and recommend the best next step for the VidyaOps team. " +
      "Return exactly these lines: SCORE: ..., SUMMARY: ..., NEXT_STEP: ..., FOLLOWUP_SUBJECT: ..., FOLLOWUP_BODY: ... " +
      "Use an integer score from 1 to 100. " +
      "Keep the advice actionable and short. " +
      "The follow-up should be a short outreach email from VidyaOps that matches the lead's learner type and interest. " +
      "Do not invent fees, dates, or commitments.",
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              `Name: ${name}\n` +
              `Learner type: ${learnerType}\n` +
              `Interest: ${interest}\n` +
              `Contact: ${contact}\n`,
          },
        ],
      },
    ],
  });

  const scoreMatch = output.match(/SCORE:\s*(\d+)/i);
  const summaryMatch = output.match(/SUMMARY:\s*(.+)/i);
  const nextStepMatch = output.match(/NEXT_STEP:\s*(.+)/i);
  const subjectMatch = output.match(/FOLLOWUP_SUBJECT:\s*(.+)/i);
  const bodyMatch = output.match(/FOLLOWUP_BODY:\s*([\s\S]*)$/i);

  return {
    aiScore: Number(scoreMatch?.[1] || 0),
    aiSummary: summaryMatch?.[1]?.trim() || "",
    aiNextStep: nextStepMatch?.[1]?.trim() || "",
    aiFollowupSubject: subjectMatch?.[1]?.trim() || "",
    aiFollowupBody: bodyMatch?.[1]?.trim() || "",
  };
}

async function generateWorkshopAutomation({ title, type, description, scheduleText, durationText, levelText }) {
  if (!GEMINI_API_KEY) {
    return {
      aiWorkshopDescription: "",
      aiAnnouncement: "",
      aiSocialPosts: "",
    };
  }

  const output = await callGemini({
    caller: "generateWorkshopAutomation",
    instructions:
      "You are VidyaOps's internal AI marketing assistant. " +
      "Create ready-to-use marketing assets for a workshop. " +
      "Return exactly these sections: WORKSHOP_DESCRIPTION:, ANNOUNCEMENT:, SOCIAL_POSTS:. " +
      "Keep it polished and practical. " +
      "Do not invent prices, venues, or extra details not provided.",
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              `Title: ${title}\n` +
              `Type: ${type}\n` +
              `Description: ${description}\n` +
              `Schedule: ${scheduleText}\n` +
              `Duration: ${durationText}\n` +
              `Level: ${levelText}\n` +
              `Brand: VidyaOps, Pune, Maharashtra. Knowledge is the power.\n`,
          },
        ],
      },
    ],
  });

  const descriptionMatch = output.match(/WORKSHOP_DESCRIPTION:\s*([\s\S]*?)ANNOUNCEMENT:/i);
  const announcementMatch = output.match(/ANNOUNCEMENT:\s*([\s\S]*?)SOCIAL_POSTS:/i);
  const socialMatch = output.match(/SOCIAL_POSTS:\s*([\s\S]*)$/i);

  return {
    aiWorkshopDescription: descriptionMatch?.[1]?.trim() || "",
    aiAnnouncement: announcementMatch?.[1]?.trim() || "",
    aiSocialPosts: socialMatch?.[1]?.trim() || "",
  };
}

module.exports = {
  extractGeminiText,
  callGemini,
  generateInquiryAutomation,
  generateLeadAutomation,
  generateWorkshopAutomation,
  GEMINI_API_KEY,
  GEMINI_MODEL
};
