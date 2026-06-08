const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const config = require("./config");

const storageDir = path.dirname(config.databasePath);
fs.mkdirSync(storageDir, { recursive: true });

const db = new Database(config.databasePath);

db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL");
db.pragma("foreign_keys = ON");
db.pragma("busy_timeout = 5000");

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT NOT NULL,
    comment TEXT,
    source_url TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    referrer TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at);
  CREATE INDEX IF NOT EXISTS idx_leads_service ON leads (service);
`);

const insertLeadStatement = db.prepare(`
  INSERT INTO leads (
    name,
    phone,
    service,
    comment,
    source_url,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    referrer
  ) VALUES (
    @name,
    @phone,
    @service,
    @comment,
    @sourceUrl,
    @utmSource,
    @utmMedium,
    @utmCampaign,
    @utmTerm,
    @utmContent,
    @referrer
  )
`);

function createLead(payload) {
  const result = insertLeadStatement.run(payload);

  return db
    .prepare("SELECT * FROM leads WHERE id = ?")
    .get(result.lastInsertRowid);
}

module.exports = {
  db,
  createLead
};

