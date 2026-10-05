const {
  selectDueInquiryNurtures,
  selectDueLeadNurtures,
  updateInquiryNurture,
  updateLeadNurture,
} = require("../db/repositories");
const { resendConfigured, sendAutomatedFollowup } = require("./email");
const { extractEmailAddress, toIsoDateOffset, nowIso, NURTURE_DELAYS_DAYS } = require("../utils");

let nurtureLoopActive = false;

function buildInquiryNurtureMessage(record) {
  const stage = Number(record.nurture_stage || 0) + 1;
  const subject = stage === 1
    ? `Still exploring ${record.interest}? VidyaOps can guide you`
    : stage === 2
      ? `A clearer next step for your ${record.interest} journey`
      : `Last follow-up from VidyaOps on ${record.interest}`;
  const body =
    `Hi ${record.name},\n\n` +
    `We wanted to follow up on your interest in ${record.interest}. ` +
    `${record.ai_summary || "You reached out to VidyaOps for guidance."}\n\n` +
    `Recommended next step: ${record.ai_next_step || "Start with a guided conversation so we can suggest the right path."}\n\n` +
    `If you would like, reply to this email or reach us on WhatsApp/Contact and we will help you choose the best starting point.\n\n` +
    `VidyaOps\nKnowledge is the power.`;

  return { subject, body };
}

function buildLeadNurtureMessage(record) {
  const stage = Number(record.nurture_stage || 0) + 1;
  const subject = stage === 1
    ? `VidyaOps follow-up for your ${record.interest} interest`
    : stage === 2
      ? `A practical next step for your ${record.interest} goals`
      : `Checking in from VidyaOps`;
  const body =
    `Hi ${record.name},\n\n` +
    `You recently showed interest in ${record.interest} at VidyaOps. ` +
    `${record.ai_summary || "We wanted to make sure you have a clear next step."}\n\n` +
    `Suggested next move: ${record.ai_next_step || "Talk with VidyaOps so we can recommend the right workshop or training."}\n\n` +
    `If you are ready, reply here or connect through WhatsApp/Contact and we will guide you personally.\n\n` +
    `VidyaOps\nKnowledge is the power.`;

  return { subject, body };
}

async function runNurtureCycle() {
  if (nurtureLoopActive || !resendConfigured) {
    return;
  }

  nurtureLoopActive = true;

  try {
    const currentTime = nowIso();
    const dueInquiries = selectDueInquiryNurtures.all(currentTime);
    for (const inquiry of dueInquiries) {
      const { subject, body } = buildInquiryNurtureMessage(inquiry);
      const sent = await sendAutomatedFollowup({
        to: inquiry.email,
        subject,
        body,
      });

      if (!sent) {
        continue;
      }

      const nextStage = Number(inquiry.nurture_stage || 0) + 1;
      const nextRunAt =
        nextStage >= NURTURE_DELAYS_DAYS.length ? "" : toIsoDateOffset(NURTURE_DELAYS_DAYS[nextStage]);
      updateInquiryNurture.run(nextStage, nextRunAt, nowIso(), inquiry.id);
    }

    const dueLeads = selectDueLeadNurtures.all(currentTime);
    for (const lead of dueLeads) {
      const email = extractEmailAddress(lead.contact);
      if (!email) {
        updateLeadNurture.run(Number(lead.nurture_stage || 0) + 1, "", nowIso(), lead.id);
        continue;
      }

      const { subject, body } = buildLeadNurtureMessage(lead);
      const sent = await sendAutomatedFollowup({
        to: email,
        subject,
        body,
      });

      if (!sent) {
        continue;
      }

      const nextStage = Number(lead.nurture_stage || 0) + 1;
      const nextRunAt =
        nextStage >= NURTURE_DELAYS_DAYS.length ? "" : toIsoDateOffset(NURTURE_DELAYS_DAYS[nextStage]);
      updateLeadNurture.run(nextStage, nextRunAt, nowIso(), lead.id);
    }
  } catch (error) {
    console.error("Nurture cycle failed:", error);
  } finally {
    nurtureLoopActive = false;
  }
}

module.exports = {
  runNurtureCycle
};
