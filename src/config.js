const path = require("path");

const normalizeBooleanId = (value) => {
  if (!value) {
    return "";
  }

  return String(value).trim();
};

const config = {
  env: process.env.NODE_ENV || "development",
  host: process.env.HOST || "0.0.0.0",
  port: Number(process.env.PORT || 3000),
  siteUrl: process.env.SITE_URL || "http://localhost:3000",
  siteName: process.env.SITE_NAME || "ЮрУслуги",
  sitePhone: process.env.SITE_PHONE || "+7 (999) 000-00-00",
  siteEmail: process.env.SITE_EMAIL || "info@example.com",
  siteAddress: process.env.SITE_ADDRESS || "Москва, Пресненская набережная, 12",
  leadsEmail: process.env.LEADS_EMAIL || "leads@example.com",
  databasePath: path.resolve(process.cwd(), process.env.DATABASE_PATH || "./storage/app.db"),
  requestRateLimit: Number(process.env.REQUEST_RATE_LIMIT || 15),
  analytics: {
    yandexMetrikaId: normalizeBooleanId(process.env.YANDEX_METRIKA_ID),
    googleTagManagerId: normalizeBooleanId(process.env.GOOGLE_TAG_MANAGER_ID)
  }
};

module.exports = config;

