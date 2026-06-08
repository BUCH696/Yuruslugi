require("dotenv").config();

const fs = require("fs");
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const config = require("./config");
const { createLead } = require("./db");

const app = express();
const publicDir = path.resolve(process.cwd(), "public");

const allowedScriptSources = [
  "'self'",
  "'unsafe-inline'",
  "https://cdnjs.cloudflare.com",
  "https://mc.yandex.ru",
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com"
];

const allowedConnectSources = [
  "'self'",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
  "https://mc.yandex.ru",
  "https://www.google-analytics.com",
  "https://region1.google-analytics.com"
];

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https://mc.yandex.ru"],
        scriptSrc: allowedScriptSources,
        connectSrc: allowedConnectSources,
        fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: false
  })
);
app.use(compression());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false }));
app.use(morgan(config.env === "production" ? "combined" : "dev"));

app.use(
  "/api",
  rateLimit({
    windowMs: 60 * 1000,
    limit: config.requestRateLimit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      ok: false,
      error: "Слишком много запросов. Повторите попытку позже."
    }
  })
);

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get("/api/runtime-config", (_req, res) => {
  res.json({
    ok: true,
    site: {
      name: config.siteName,
      phone: config.sitePhone,
      email: config.siteEmail,
      address: config.siteAddress
    },
    analytics: config.analytics
  });
});

app.post("/api/leads", (req, res) => {
  const name = String(req.body.name || "").trim();
  const phone = String(req.body.phone || "").trim();
  const service = String(req.body.service || "").trim();
  const comment = String(req.body.comment || "").trim();
  const sourceUrl = String(req.body.sourceUrl || "").trim();
  const utmSource = String(req.body.utmSource || "").trim();
  const utmMedium = String(req.body.utmMedium || "").trim();
  const utmCampaign = String(req.body.utmCampaign || "").trim();
  const utmTerm = String(req.body.utmTerm || "").trim();
  const utmContent = String(req.body.utmContent || "").trim();
  const referrer = String(req.body.referrer || "").trim();

  if (!name || name.length < 2) {
    return res.status(400).json({
      ok: false,
      error: "Укажите имя."
    });
  }

  if (!phone || phone.length < 10) {
    return res.status(400).json({
      ok: false,
      error: "Укажите корректный телефон."
    });
  }

  if (!service) {
    return res.status(400).json({
      ok: false,
      error: "Выберите услугу."
    });
  }

  const lead = createLead({
    name,
    phone,
    service,
    comment,
    sourceUrl,
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
    referrer
  });

  return res.status(201).json({
    ok: true,
    message: "Заявка отправлена. Мы свяжемся с вами в ближайшее время.",
    leadId: lead.id
  });
});

app.get("/", (_req, res, next) => {
  renderPage("index.html", res, next);
});

app.get("/privacy.html", (_req, res, next) => {
  renderPage("privacy.html", res, next);
});

app.use((req, res, next) => {
  if (path.extname(req.path)) {
    return next();
  }

  return renderPage("index.html", res, next);
});

app.use(
  express.static(publicDir, {
    index: false,
    maxAge: config.env === "production" ? "1h" : 0,
    setHeaders(res, filePath) {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-store");
      }
    }
  })
);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Маршрут не найден."
  });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    ok: false,
    error: "Внутренняя ошибка сервера."
  });
});

app.listen(config.port, config.host, () => {
  console.log(`Server started on http://${config.host}:${config.port}`);
});

function renderPage(fileName, res, next) {
  const filePath = path.join(publicDir, fileName);

  fs.readFile(filePath, "utf8", (error, html) => {
    if (error) {
      return next(error);
    }

    const rendered = html
      .replace(/__SITE_NAME__/g, escapeHtml(config.siteName))
      .replace(/__SITE_PHONE__/g, escapeHtml(config.sitePhone))
      .replace(/__SITE_EMAIL__/g, escapeHtml(config.siteEmail))
      .replace(/__SITE_ADDRESS__/g, escapeHtml(config.siteAddress))
      .replace(/__SITE_URL__/g, escapeHtml(config.siteUrl));

    return res.send(rendered);
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
