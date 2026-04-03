const db = require("./index");

const insertInquiry = db.prepare(`
  INSERT INTO contact_inquiries (name, email, organization, interest, message, source, ai_score, ai_summary, ai_next_step, ai_followup_subject, ai_followup_body, ai_followup_sent, nurture_stage, nurture_next_run_at, nurture_last_sent_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const selectAdminUser = db.prepare(`
  SELECT id, username, password_hash, created_at, updated_at
  FROM admin_users
  ORDER BY id ASC
  LIMIT 1
`);
const insertAdminUser = db.prepare(`
  INSERT INTO admin_users (username, password_hash)
  VALUES (?, ?)
`);
const updateAdminPassword = db.prepare(`
  UPDATE admin_users
  SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`);
const insertLead = db.prepare(`
  INSERT INTO chatbot_leads (session_id, name, contact, learner_type, interest, status, notes, ai_score, ai_summary, ai_next_step, ai_followup_subject, ai_followup_body, ai_followup_sent, nurture_stage, nurture_next_run_at, nurture_last_sent_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const insertChatMessage = db.prepare(`
  INSERT INTO chat_messages (session_id, role, content)
  VALUES (?, ?, ?)
`);
const selectInquiryCount = db.prepare(`SELECT COUNT(*) AS count FROM contact_inquiries`);
const selectLeadCount = db.prepare(`SELECT COUNT(*) AS count FROM chatbot_leads`);
const selectChatCount = db.prepare(`SELECT COUNT(*) AS count FROM chat_messages`);
const selectWorkshopCount = db.prepare(`SELECT COUNT(*) AS count FROM workshops`);
const selectEnrollmentCount = db.prepare(`SELECT COUNT(*) AS count FROM enrollments`);
const selectRecentInquiries = db.prepare(`
  SELECT id, name, email, organization, interest, message, source, ai_score, ai_summary, ai_next_step, ai_followup_subject, ai_followup_body, ai_followup_sent, nurture_stage, nurture_next_run_at, nurture_last_sent_at, created_at
  FROM contact_inquiries
  ORDER BY id DESC
  LIMIT 20
`);
const selectRecentLeads = db.prepare(`
  SELECT id, session_id, name, contact, learner_type, interest, status, notes, ai_score, ai_summary, ai_next_step, ai_followup_subject, ai_followup_body, ai_followup_sent, nurture_stage, nurture_next_run_at, nurture_last_sent_at, created_at, updated_at
  FROM chatbot_leads
  ORDER BY id DESC
  LIMIT 20
`);
const selectRecentChats = db.prepare(`
  SELECT id, session_id, role, content, created_at
  FROM chat_messages
  ORDER BY id DESC
  LIMIT 30
`);
const selectWorkshops = db.prepare(`
  SELECT id, title, type, description, schedule_text, duration_text, level_text, cta_text, cta_link, ai_workshop_description, ai_announcement, ai_social_posts, is_active, created_at, updated_at
  FROM workshops
  ORDER BY id DESC
`);
const selectPublicWorkshops = db.prepare(`
  SELECT id, title, type, description, schedule_text, duration_text, level_text, cta_text, cta_link
  FROM workshops
  WHERE is_active = 1
  ORDER BY id DESC
`);
const insertWorkshop = db.prepare(`
  INSERT INTO workshops (title, type, description, schedule_text, duration_text, level_text, cta_text, cta_link, ai_workshop_description, ai_announcement, ai_social_posts, is_active)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const updateWorkshop = db.prepare(`
  UPDATE workshops
  SET title = ?, type = ?, description = ?, schedule_text = ?, duration_text = ?, level_text = ?, cta_text = ?, cta_link = ?, ai_workshop_description = ?, ai_announcement = ?, ai_social_posts = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`);
const selectWorkshopById = db.prepare(`
  SELECT id, title, type, description, schedule_text, duration_text, level_text, cta_text, cta_link, is_active
  FROM workshops
  WHERE id = ?
`);
const deleteWorkshop = db.prepare(`DELETE FROM workshops WHERE id = ?`);
const updateLeadStatus = db.prepare(`
  UPDATE chatbot_leads
  SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`);
const insertEnrollment = db.prepare(`
  INSERT INTO enrollments (
    product_id,
    product_name,
    product_type,
    amount_inr,
    currency,
    learner_name,
    learner_email,
    learner_phone,
    learner_type,
    learner_goal,
    status,
    payment_provider,
    provider_order_id,
    access_token,
    onboarding_sent
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const updateEnrollmentOrder = db.prepare(`
  UPDATE enrollments
  SET provider_order_id = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`);
const updateEnrollmentPayment = db.prepare(`
  UPDATE enrollments
  SET status = ?, provider_payment_id = ?, provider_signature = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`);
const updateEnrollmentOnboarding = db.prepare(`
  UPDATE enrollments
  SET onboarding_sent = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`);
const selectEnrollmentById = db.prepare(`
  SELECT *
  FROM enrollments
  WHERE id = ?
`);
const selectEnrollmentByToken = db.prepare(`
  SELECT *
  FROM enrollments
  WHERE access_token = ?
`);
const selectRecentEnrollments = db.prepare(`
  SELECT *
  FROM enrollments
  ORDER BY id DESC
  LIMIT 20
`);
const selectDueInquiryNurtures = db.prepare(`
  SELECT id, name, email, organization, interest, message, ai_summary, ai_next_step, nurture_stage, nurture_next_run_at
  FROM contact_inquiries
  WHERE ai_followup_sent = 1 AND nurture_next_run_at != '' AND nurture_next_run_at <= ?
  ORDER BY id ASC
  LIMIT 10
`);
const selectDueLeadNurtures = db.prepare(`
  SELECT id, name, contact, learner_type, interest, status, ai_summary, ai_next_step, nurture_stage, nurture_next_run_at
  FROM chatbot_leads
  WHERE ai_followup_sent = 1 AND nurture_next_run_at != '' AND nurture_next_run_at <= ?
  ORDER BY id ASC
  LIMIT 10
`);
const updateInquiryNurture = db.prepare(`
  UPDATE contact_inquiries
  SET nurture_stage = ?, nurture_next_run_at = ?, nurture_last_sent_at = ?
  WHERE id = ?
`);
const updateLeadNurture = db.prepare(`
  UPDATE chatbot_leads
  SET nurture_stage = ?, nurture_next_run_at = ?, nurture_last_sent_at = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`);

module.exports = {
  db,
  insertInquiry,
  selectAdminUser,
  insertAdminUser,
  updateAdminPassword,
  insertLead,
  insertChatMessage,
  selectInquiryCount,
  selectLeadCount,
  selectChatCount,
  selectWorkshopCount,
  selectEnrollmentCount,
  selectRecentInquiries,
  selectRecentLeads,
  selectRecentChats,
  selectWorkshops,
  selectPublicWorkshops,
  insertWorkshop,
  updateWorkshop,
  selectWorkshopById,
  deleteWorkshop,
  updateLeadStatus,
  insertEnrollment,
  updateEnrollmentOrder,
  updateEnrollmentPayment,
  updateEnrollmentOnboarding,
  selectEnrollmentById,
  selectEnrollmentByToken,
  selectRecentEnrollments,
  selectDueInquiryNurtures,
  selectDueLeadNurtures,
  updateInquiryNurture,
  updateLeadNurture,
};
