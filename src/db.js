const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const config = require("./config");
const defaultSettings = require("./default-settings");
const { hashPassword, verifyPassword, createToken } = require("./security");

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

  CREATE TABLE IF NOT EXISTS form_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    name TEXT,
    phone TEXT,
    email TEXT,
    service TEXT,
    message TEXT,
    file_paths_json TEXT,
    payload_json TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    settings_json TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    ip_address TEXT,
    user_agent TEXT,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at);
  CREATE INDEX IF NOT EXISTS idx_leads_service ON leads (service);
  CREATE INDEX IF NOT EXISTS idx_form_submissions_type ON form_submissions (type);
  CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions (created_at);
  CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions (expires_at);
`);

ensureSiteSettings();
ensureAdminUser();

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

const insertFormSubmissionStatement = db.prepare(`
  INSERT INTO form_submissions (
    type,
    name,
    phone,
    email,
    service,
    message,
    file_paths_json,
    payload_json
  ) VALUES (
    @type,
    @name,
    @phone,
    @email,
    @service,
    @message,
    @filePathsJson,
    @payloadJson
  )
`);

function createLead(payload) {
  const result = insertLeadStatement.run(payload);

  return db.prepare("SELECT * FROM leads WHERE id = ?").get(result.lastInsertRowid);
}

function createFormSubmission(payload) {
  const result = insertFormSubmissionStatement.run({
    type: payload.type,
    name: payload.name || "",
    phone: payload.phone || "",
    email: payload.email || "",
    service: payload.service || "",
    message: payload.message || "",
    filePathsJson: JSON.stringify(payload.filePaths || []),
    payloadJson: JSON.stringify(payload.meta || {})
  });

  return db
    .prepare("SELECT * FROM form_submissions WHERE id = ?")
    .get(result.lastInsertRowid);
}

function listRecentSubmissions(limit = 30) {
  return db
    .prepare(`
      SELECT id, type, name, phone, email, service, message, file_paths_json, payload_json, created_at
      FROM form_submissions
      ORDER BY created_at DESC, id DESC
      LIMIT ?
    `)
    .all(limit)
    .map((row) => ({
      ...row,
      filePaths: parseJson(row.file_paths_json, []),
      meta: parseJson(row.payload_json, {})
    }));
}

function getSiteSettings() {
  const row = db
    .prepare("SELECT settings_json FROM site_settings WHERE id = 1")
    .get();

  return mergeDeep(structuredCloneSafe(defaultSettings), parseJson(row?.settings_json, {}));
}

function saveSiteSettings(settings) {
  const normalized = mergeDeep(getSiteSettings(), settings);

  db.prepare(`
    UPDATE site_settings
    SET settings_json = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = 1
  `).run(JSON.stringify(normalized));

  return normalized;
}

function authenticateAdmin(username, password) {
  const user = db
    .prepare("SELECT id, username, password_hash FROM admin_users WHERE username = ?")
    .get(String(username || "").trim());

  if (!user) {
    return null;
  }

  if (!verifyPassword(password, user.password_hash)) {
    return null;
  }

  return {
    id: user.id,
    username: user.username
  };
}

function createAdminSession({ userId, ipAddress, userAgent }) {
  const token = createToken();
  const expiresAt = new Date(
    Date.now() + config.admin.sessionTtlDays * 24 * 60 * 60 * 1000
  ).toISOString();

  db.prepare(`
    INSERT INTO admin_sessions (token, user_id, ip_address, user_agent, expires_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(token, userId, ipAddress || "", userAgent || "", expiresAt);

  return token;
}

function getAdminSession(token) {
  if (!token) {
    return null;
  }

  const session = db
    .prepare(`
      SELECT s.token, s.expires_at, u.id AS user_id, u.username
      FROM admin_sessions s
      INNER JOIN admin_users u ON u.id = s.user_id
      WHERE s.token = ?
    `)
    .get(token);

  if (!session) {
    return null;
  }

  if (new Date(session.expires_at).getTime() <= Date.now()) {
    deleteAdminSession(token);
    return null;
  }

  return {
    token: session.token,
    expiresAt: session.expires_at,
    user: {
      id: session.user_id,
      username: session.username
    }
  };
}

function deleteAdminSession(token) {
  db.prepare("DELETE FROM admin_sessions WHERE token = ?").run(token);
}

function ensureSiteSettings() {
  const row = db.prepare("SELECT id FROM site_settings WHERE id = 1").get();

  if (!row) {
    db.prepare(`
      INSERT INTO site_settings (id, settings_json)
      VALUES (1, ?)
    `).run(JSON.stringify(defaultSettings));
  }
}

function ensureAdminUser() {
  const countRow = db.prepare("SELECT COUNT(*) AS count FROM admin_users").get();

  if (countRow.count > 0) {
    return;
  }

  db.prepare(`
    INSERT INTO admin_users (username, password_hash)
    VALUES (?, ?)
  `).run(config.admin.username, hashPassword(config.admin.password));
}

function parseJson(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value));
}

function mergeDeep(target, source) {
  for (const [key, value] of Object.entries(source || {})) {
    if (Array.isArray(value)) {
      target[key] = value;
      continue;
    }

    if (value && typeof value === "object") {
      target[key] = mergeDeep(
        target[key] && typeof target[key] === "object" && !Array.isArray(target[key])
          ? target[key]
          : {},
        value
      );
      continue;
    }

    target[key] = value;
  }

  return target;
}

module.exports = {
  db,
  createLead,
  createFormSubmission,
  listRecentSubmissions,
  getSiteSettings,
  saveSiteSettings,
  authenticateAdmin,
  createAdminSession,
  getAdminSession,
  deleteAdminSession
};
