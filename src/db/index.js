const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");
const { loadAppConfig } = require("../../app-config");

const ROOT = path.join(__dirname, "../../");
const APP_CONFIG = loadAppConfig(ROOT);
const DATA_DIR = APP_CONFIG.dataDir;
const DB_PATH = APP_CONFIG.dbPath;

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS contact_inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    organization TEXT,
    interest TEXT NOT NULL,
    message TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'contact_form',
    ai_score INTEGER NOT NULL DEFAULT 0,
    ai_summary TEXT NOT NULL DEFAULT '',
    ai_next_step TEXT NOT NULL DEFAULT '',
    ai_followup_subject TEXT NOT NULL DEFAULT '',
    ai_followup_body TEXT NOT NULL DEFAULT '',
    ai_followup_sent INTEGER NOT NULL DEFAULT 0,
    nurture_stage INTEGER NOT NULL DEFAULT 0,
    nurture_next_run_at TEXT NOT NULL DEFAULT '',
    nurture_last_sent_at TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS chatbot_leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    learner_type TEXT NOT NULL,
    interest TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    notes TEXT NOT NULL DEFAULT '',
    ai_score INTEGER NOT NULL DEFAULT 0,
    ai_summary TEXT NOT NULL DEFAULT '',
    ai_next_step TEXT NOT NULL DEFAULT '',
    ai_followup_subject TEXT NOT NULL DEFAULT '',
    ai_followup_body TEXT NOT NULL DEFAULT '',
    ai_followup_sent INTEGER NOT NULL DEFAULT 0,
    nurture_stage INTEGER NOT NULL DEFAULT 0,
    nurture_next_run_at TEXT NOT NULL DEFAULT '',
    nurture_last_sent_at TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS workshops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    schedule_text TEXT NOT NULL,
    duration_text TEXT NOT NULL,
    level_text TEXT NOT NULL,
    cta_text TEXT NOT NULL,
    cta_link TEXT NOT NULL,
    ai_workshop_description TEXT NOT NULL DEFAULT '',
    ai_announcement TEXT NOT NULL DEFAULT '',
    ai_social_posts TEXT NOT NULL DEFAULT '',
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_type TEXT NOT NULL,
    amount_inr INTEGER NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'INR',
    learner_name TEXT NOT NULL,
    learner_email TEXT NOT NULL,
    learner_phone TEXT NOT NULL,
    learner_type TEXT NOT NULL,
    learner_goal TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending',
    payment_provider TEXT NOT NULL DEFAULT '',
    provider_order_id TEXT NOT NULL DEFAULT '',
    provider_payment_id TEXT NOT NULL DEFAULT '',
    provider_signature TEXT NOT NULL DEFAULT '',
    access_token TEXT NOT NULL UNIQUE,
    onboarding_sent INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS volunteer_trainers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    linkedin_url TEXT NOT NULL,
    topic_of_choice TEXT NOT NULL,
    resume_path TEXT NOT NULL,
    photo_path TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS site_content (
    key_name TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  INSERT OR IGNORE INTO site_content (key_name, content) VALUES
  ('home_hero_title', 'Practical tech learning for students ready to move.'),
  ('home_hero_copy', 'VidyaOps helps college students, freshers, early professionals, and knowledge seekers build useful capability in Cloud, Data Analysis, AI, and Cybersecurity through workshops, guided tracks, and career-aware mentorship.'),
  ('home_cta_title', 'Take the next step in your tech career with confidence.'),
  ('home_cta_copy', 'Choose a workshop to get started, or book a direct consultation to map out a practical learning path for your current level and goals.')
`);

function ensureColumn(tableName, columnName, columnDefinition) {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
  const exists = columns.some((column) => column.name === columnName);
  if (!exists) {
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`);
  }
}

ensureColumn("chatbot_leads", "status", "TEXT NOT NULL DEFAULT 'new'");
ensureColumn("chatbot_leads", "notes", "TEXT NOT NULL DEFAULT ''");
ensureColumn("chatbot_leads", "updated_at", "TEXT");
ensureColumn("chatbot_leads", "ai_score", "INTEGER NOT NULL DEFAULT 0");
ensureColumn("chatbot_leads", "ai_summary", "TEXT NOT NULL DEFAULT ''");
ensureColumn("chatbot_leads", "ai_next_step", "TEXT NOT NULL DEFAULT ''");
ensureColumn("chatbot_leads", "ai_followup_subject", "TEXT NOT NULL DEFAULT ''");
ensureColumn("chatbot_leads", "ai_followup_body", "TEXT NOT NULL DEFAULT ''");
ensureColumn("chatbot_leads", "ai_followup_sent", "INTEGER NOT NULL DEFAULT 0");
ensureColumn("chatbot_leads", "nurture_stage", "INTEGER NOT NULL DEFAULT 0");
ensureColumn("chatbot_leads", "nurture_next_run_at", "TEXT NOT NULL DEFAULT ''");
ensureColumn("chatbot_leads", "nurture_last_sent_at", "TEXT NOT NULL DEFAULT ''");
ensureColumn("contact_inquiries", "ai_score", "INTEGER NOT NULL DEFAULT 0");
ensureColumn("contact_inquiries", "ai_summary", "TEXT NOT NULL DEFAULT ''");
ensureColumn("contact_inquiries", "ai_next_step", "TEXT NOT NULL DEFAULT ''");
ensureColumn("contact_inquiries", "ai_followup_subject", "TEXT NOT NULL DEFAULT ''");
ensureColumn("contact_inquiries", "ai_followup_body", "TEXT NOT NULL DEFAULT ''");
ensureColumn("contact_inquiries", "ai_followup_sent", "INTEGER NOT NULL DEFAULT 0");
ensureColumn("contact_inquiries", "nurture_stage", "INTEGER NOT NULL DEFAULT 0");
ensureColumn("contact_inquiries", "nurture_next_run_at", "TEXT NOT NULL DEFAULT ''");
ensureColumn("contact_inquiries", "nurture_last_sent_at", "TEXT NOT NULL DEFAULT ''");
ensureColumn("workshops", "ai_workshop_description", "TEXT NOT NULL DEFAULT ''");
ensureColumn("workshops", "ai_announcement", "TEXT NOT NULL DEFAULT ''");
ensureColumn("workshops", "ai_social_posts", "TEXT NOT NULL DEFAULT ''");

db.exec(`
  UPDATE chatbot_leads
  SET updated_at = COALESCE(updated_at, created_at),
      status = COALESCE(status, 'new'),
      notes = COALESCE(notes, ''),
      ai_score = COALESCE(ai_score, 0),
      ai_summary = COALESCE(ai_summary, ''),
      ai_next_step = COALESCE(ai_next_step, ''),
      ai_followup_subject = COALESCE(ai_followup_subject, ''),
      ai_followup_body = COALESCE(ai_followup_body, ''),
      ai_followup_sent = COALESCE(ai_followup_sent, 0),
      nurture_stage = COALESCE(nurture_stage, 0),
      nurture_next_run_at = COALESCE(nurture_next_run_at, ''),
      nurture_last_sent_at = COALESCE(nurture_last_sent_at, '')
`);
db.exec(`
  UPDATE contact_inquiries
  SET ai_score = COALESCE(ai_score, 0),
      ai_summary = COALESCE(ai_summary, ''),
      ai_next_step = COALESCE(ai_next_step, ''),
      ai_followup_subject = COALESCE(ai_followup_subject, ''),
      ai_followup_body = COALESCE(ai_followup_body, ''),
      ai_followup_sent = COALESCE(ai_followup_sent, 0),
      nurture_stage = COALESCE(nurture_stage, 0),
      nurture_next_run_at = COALESCE(nurture_next_run_at, ''),
      nurture_last_sent_at = COALESCE(nurture_last_sent_at, '')
`);
db.exec(`
  UPDATE contact_inquiries
  SET nurture_next_run_at = datetime('now', '+2 day'),
      nurture_last_sent_at = COALESCE(NULLIF(nurture_last_sent_at, ''), CURRENT_TIMESTAMP)
  WHERE ai_followup_sent = 1 AND nurture_stage = 0 AND nurture_next_run_at = ''
`);
db.exec(`
  UPDATE workshops
  SET ai_workshop_description = COALESCE(ai_workshop_description, ''),
      ai_announcement = COALESCE(ai_announcement, ''),
      ai_social_posts = COALESCE(ai_social_posts, '')
`);
db.exec(`
  UPDATE chatbot_leads
  SET nurture_next_run_at = datetime('now', '+2 day'),
      nurture_last_sent_at = COALESCE(NULLIF(nurture_last_sent_at, ''), CURRENT_TIMESTAMP)
  WHERE ai_followup_sent = 1 AND nurture_stage = 0 AND nurture_next_run_at = ''
`);

module.exports = db;
