require("dotenv").config();

const fs = require("fs");
const path = require("path");
const multer = require("multer");
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const config = require("./config");
const {
  createLead,
  createFormSubmission,
  listRecentSubmissions,
  getSiteSettings,
  saveSiteSettings,
  authenticateAdmin,
  hasAdminUsers,
  createAdminUser,
  createAdminSession,
  getAdminSession,
  deleteAdminSession
} = require("./db");

const app = express();
const publicDir = path.resolve(process.cwd(), "public");
const uploadsDir = config.uploadsPath;
const adminCookieName = "admin_session";

fs.mkdirSync(uploadsDir, { recursive: true });

const demoAppointmentSlots = [
  { date: "Пн, 10 июня", time: "10:00", available: true },
  { date: "Пн, 10 июня", time: "12:30", available: true },
  { date: "Пн, 10 июня", time: "16:00", available: false },
  { date: "Вт, 11 июня", time: "11:00", available: true },
  { date: "Вт, 11 июня", time: "14:30", available: true },
  { date: "Ср, 12 июня", time: "17:00", available: true }
];

const assetFieldMap = {
  logoHeader: ["branding", "logoHeaderPath"],
  logoFooter: ["branding", "logoFooterPath"],
  favicon: ["branding", "faviconPath"],
  heroImage: ["branding", "heroImagePath"],
  contactImage: ["branding", "contactImagePath"],
  documentArt: ["branding", "documentArtPath"],
  quickHelpIcon: ["branding", "quickHelpIconPath"],
  serviceImage0: ["services", 0, "imagePath"],
  serviceImage1: ["services", 1, "imagePath"],
  serviceImage2: ["services", 2, "imagePath"],
  serviceImage3: ["services", 3, "imagePath"],
  serviceImage4: ["services", 4, "imagePath"],
  serviceImage5: ["services", 5, "imagePath"],
  serviceImage6: ["services", 6, "imagePath"],
  serviceImage7: ["services", 7, "imagePath"],
  serviceImage8: ["services", 8, "imagePath"],
  serviceImage9: ["services", 9, "imagePath"],
  telegramIcon: ["contacts", "telegramIconPath"],
  whatsappIcon: ["contacts", "whatsappIconPath"],
  vkIcon: ["contacts", "vkIconPath"],
  maxIcon: ["contacts", "maxIconPath"]
};

const allowedScriptSources = [
  "'self'",
  "'unsafe-inline'",
  "https://cdnjs.cloudflare.com",
  "https://cdn-ru.bitrix24.ru",
  "https://mc.yandex.ru",
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com"
];

const allowedConnectSources = [
  "'self'",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
  "https://cdn-ru.bitrix24.ru",
  "https://*.bitrix24.ru",
  "https://mc.yandex.ru",
  "https://www.google-analytics.com",
  "https://region1.google-analytics.com"
];

const assetUpload = multer({
  storage: multer.diskStorage({
    destination(_req, _file, callback) {
      const targetDir = path.join(uploadsDir, "site-assets");
      fs.mkdirSync(targetDir, { recursive: true });
      callback(null, targetDir);
    },
    filename(_req, file, callback) {
      callback(null, createStoredFileName(file.originalname));
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

const documentUpload = multer({
  storage: multer.diskStorage({
    destination(_req, _file, callback) {
      const settings = getSiteSettings();
      const targetDir = path.join(
        uploadsDir,
        sanitizeSubdirectory(settings.documents.uploadDirectory || "documents")
      );
      fs.mkdirSync(targetDir, { recursive: true });
      callback(null, targetDir);
    },
    filename(_req, file, callback) {
      callback(null, createStoredFileName(file.originalname));
    }
  }),
  limits: {
    fileSize: 20 * 1024 * 1024,
    files: 10
  }
});

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "https://mc.yandex.ru", "https://cdn-ru.bitrix24.ru", "https://*.bitrix24.ru"],
        scriptSrc: allowedScriptSources,
        connectSrc: allowedConnectSources,
        fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
        frameSrc: ["'self'", "https://yandex.ru", "https://yandex.com", "https://*.yandex.ru", "https://cdn-ru.bitrix24.ru", "https://*.bitrix24.ru"],
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
app.use(express.json({ limit: "2mb" }));
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

app.use("/uploads", express.static(uploadsDir, { maxAge: "1d" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get("/api/runtime-config", (_req, res) => {
  const settings = getSiteSettings();
  res.json({
    ok: true,
    site: {
      name: settings.branding.siteTitle,
      phone: settings.contacts.phoneDisplay,
      email: settings.contacts.email,
      address: settings.contacts.cityAddress
    },
    analytics: {
      yandexMetrikaId:
        settings.analytics.yandexMetrikaId || config.analytics.yandexMetrikaId,
      googleTagManagerId:
        settings.analytics.googleTagManagerId || config.analytics.googleTagManagerId
    }
  });
});

app.get("/api/site-config", (_req, res) => {
  const settings = getSiteSettings();

  res.json({
    ok: true,
    settings: {
      ...settings,
      analytics: {
        yandexMetrikaId:
          settings.analytics.yandexMetrikaId || config.analytics.yandexMetrikaId,
        googleTagManagerId:
          settings.analytics.googleTagManagerId || config.analytics.googleTagManagerId
      }
    }
  });
});

app.get("/api/appointment-slots", (_req, res) => {
  res.json({
    ok: true,
    slots: demoAppointmentSlots
  });
});

app.post("/api/leads", (req, res) => {
  const payload = normalizeLeadPayload(req.body);

  const validationError = validateLeadPayload(payload);
  if (validationError) {
    return res.status(400).json({
      ok: false,
      error: validationError
    });
  }

  const lead = createLead(payload);
  createFormSubmission({
    type: "lead",
    name: payload.name,
    phone: payload.phone,
    service: payload.service,
    message: payload.comment,
    meta: payload
  });

  triggerConfiguredWebhooks("lead", payload).catch(console.error);

  return res.status(201).json({
    ok: true,
    message: "Заявка отправлена. Мы свяжемся с вами в ближайшее время.",
    leadId: lead.id
  });
});

app.post("/api/forms/callback", async (req, res) => {
  const phone = String(req.body.phone || "").trim();

  if (phone.length < 10) {
    return res.status(400).json({
      ok: false,
      error: "Укажите корректный телефон."
    });
  }

  const submission = createFormSubmission({
    type: "callback",
    phone,
    message: String(req.body.message || "").trim(),
    meta: req.body
  });

  await triggerConfiguredWebhooks("callback", {
    phone,
    message: req.body.message || ""
  });

  res.status(201).json({
    ok: true,
    message: "Запрос на обратный звонок отправлен.",
    submissionId: submission.id
  });
});

app.post("/api/forms/appointment", async (req, res) => {
  const name = String(req.body.name || "").trim();
  const phone = String(req.body.phone || "").trim();

  if (phone.length < 10) {
    return res.status(400).json({
      ok: false,
      error: "Укажите корректный телефон."
    });
  }

  const submission = createFormSubmission({
    type: "appointment",
    name,
    phone,
    service: String(req.body.service || "").trim(),
    message: String(req.body.message || "").trim(),
    meta: {
      slot: String(req.body.slot || "").trim()
    }
  });

  await triggerConfiguredWebhooks("appointment", {
    name,
    phone,
    service: req.body.service || "",
    message: req.body.message || "",
    slot: req.body.slot || ""
  });

  res.status(201).json({
    ok: true,
    message: "Запись отправлена. Мы подтвердим удобное время.",
    submissionId: submission.id
  });
});

app.post("/api/forms/document", documentUpload.array("documents", 10), async (req, res) => {
  const settings = getSiteSettings();
  const phone = String(req.body.phone || "").trim();
  const files = req.files || [];
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const maxTotalSizeBytes = Number(settings.documents.maxTotalSizeMb || 50) * 1024 * 1024;

  if (phone.length < 10) {
    cleanupUploadedFiles(files);
    return res.status(400).json({
      ok: false,
      error: "Укажите корректный телефон."
    });
  }

  if (files.length === 0) {
    return res.status(400).json({
      ok: false,
      error: "Приложите хотя бы один файл."
    });
  }

  if (totalSize > maxTotalSizeBytes) {
    cleanupUploadedFiles(files);
    return res.status(400).json({
      ok: false,
      error: "Размер файлов превышает допустимый лимит."
    });
  }

  const publicFiles = files.map(toPublicUploadUrl);
  const submission = createFormSubmission({
    type: "document",
    name: String(req.body.name || "").trim(),
    phone,
    message: String(req.body.message || "").trim(),
    filePaths: publicFiles,
    meta: {
      originalNames: files.map((file) => file.originalname)
    }
  });

  await triggerConfiguredWebhooks("document", {
    name: req.body.name || "",
    phone,
    message: req.body.message || "",
    files: publicFiles
  });

  res.status(201).json({
    ok: true,
    message: settings.documents.successMessage,
    submissionId: submission.id,
    files: publicFiles
  });
});

app.post("/api/admin/login", (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");
  const user = authenticateAdmin(username, password);

  if (!user) {
    return res.status(401).json({
      ok: false,
      error: "Неверный логин или пароль."
    });
  }

  const token = createAdminSession({
    userId: user.id,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"] || ""
  });

  setAdminCookie(res, token);

  return res.json({
    ok: true,
    user
  });
});

app.get("/api/admin/bootstrap-status", (_req, res) => {
  return res.json({
    ok: true,
    requiresSetup: !hasAdminUsers()
  });
});

app.post("/api/admin/setup", (req, res) => {
  if (hasAdminUsers()) {
    return res.status(409).json({
      ok: false,
      error: "Администратор уже создан. Используйте обычный вход."
    });
  }

  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");

  if (username.length < 3 || password.length < 8) {
    return res.status(400).json({
      ok: false,
      error: "Укажите логин от 3 символов и пароль не короче 8 символов."
    });
  }

  try {
    const user = createAdminUser(username, password);
    const token = createAdminSession({
      userId: user.id,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"] || ""
    });

    setAdminCookie(res, token);

    return res.status(201).json({
      ok: true,
      user
    });
  } catch (error) {
    if (error.message === "ADMIN_USERNAME_EXISTS") {
      return res.status(409).json({
        ok: false,
        error: "Пользователь с таким логином уже существует."
      });
    }

    if (error.message === "INVALID_ADMIN_CREDENTIALS") {
      return res.status(400).json({
        ok: false,
        error: "Укажите корректные данные администратора."
      });
    }

    return res.status(500).json({
      ok: false,
      error: "Не удалось создать администратора."
    });
  }
});

app.post("/api/admin/logout", requireAdmin, (req, res) => {
  deleteAdminSession(req.adminSession.token);
  clearAdminCookie(res);

  res.json({
    ok: true
  });
});

app.get("/api/admin/session", (req, res) => {
  const session = resolveAdminSession(req);

  if (!session) {
    return res.status(401).json({
      ok: false
    });
  }

  return res.json({
    ok: true,
    user: session.user
  });
});

app.get("/api/admin/settings", requireAdmin, (_req, res) => {
  res.json({
    ok: true,
    settings: getSiteSettings(),
    submissions: listRecentSubmissions(40)
  });
});

app.put("/api/admin/settings", requireAdmin, (req, res) => {
  const settings = sanitizeSettings(req.body.settings || {});
  const saved = saveSiteSettings(settings);

  res.json({
    ok: true,
    settings: saved
  });
});

app.post("/api/admin/assets/:field", requireAdmin, assetUpload.single("file"), (req, res) => {
  const settingPath = assetFieldMap[req.params.field];

  if (!settingPath || !req.file) {
    return res.status(400).json({
      ok: false,
      error: "Некорректный запрос загрузки."
    });
  }

  const settings = getSiteSettings();
  const previousPath = getNestedValue(settings, settingPath);

  setNestedValue(settings, settingPath, toPublicUploadUrl(req.file));
  const saved = saveSiteSettings(settings);

  removeStoredFile(previousPath);

  res.json({
    ok: true,
    settings: saved,
    path: toPublicUploadUrl(req.file)
  });
});

app.delete("/api/admin/assets/:field", requireAdmin, (req, res) => {
  const settingPath = assetFieldMap[req.params.field];

  if (!settingPath) {
    return res.status(400).json({
      ok: false,
      error: "Неизвестное поле файла."
    });
  }

  const settings = getSiteSettings();
  const currentPath = getNestedValue(settings, settingPath);
  setNestedValue(settings, settingPath, "");
  const saved = saveSiteSettings(settings);
  removeStoredFile(currentPath);

  res.json({
    ok: true,
    settings: saved
  });
});

app.get("/", (_req, res, next) => {
  renderPage("index.html", res, next);
});

app.get(["/admin", "/admin.html"], (req, res, next) => {
  renderAdminEntry(req, res, next);
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
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      ok: false,
      error: "Ошибка загрузки файла."
    });
  }

  console.error(error);
  return res.status(500).json({
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

function renderAdminEntry(req, res, next) {
  const session = resolveAdminSession(req);
  renderPage(session ? "admin.html" : "admin-login.html", res, next);
}

function normalizeLeadPayload(body) {
  return {
    name: String(body.name || "").trim(),
    phone: String(body.phone || "").trim(),
    service: String(body.service || "").trim(),
    comment: String(body.comment || "").trim(),
    sourceUrl: String(body.sourceUrl || "").trim(),
    utmSource: String(body.utmSource || "").trim(),
    utmMedium: String(body.utmMedium || "").trim(),
    utmCampaign: String(body.utmCampaign || "").trim(),
    utmTerm: String(body.utmTerm || "").trim(),
    utmContent: String(body.utmContent || "").trim(),
    referrer: String(body.referrer || "").trim()
  };
}

function validateLeadPayload(payload) {
  if (!payload.name || payload.name.length < 2) {
    return "Укажите имя.";
  }

  if (!payload.phone || payload.phone.length < 10) {
    return "Укажите корректный телефон.";
  }

  if (!payload.service) {
    return "Выберите услугу.";
  }

  return "";
}

function parseCookies(cookieHeader) {
  return String(cookieHeader || "")
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((cookies, entry) => {
      const separatorIndex = entry.indexOf("=");
      if (separatorIndex === -1) {
        return cookies;
      }

      const key = entry.slice(0, separatorIndex).trim();
      const value = entry.slice(separatorIndex + 1).trim();
      cookies[key] = decodeURIComponent(value);
      return cookies;
    }, {});
}

function resolveAdminSession(req) {
  const cookies = parseCookies(req.headers.cookie || "");
  const token = cookies[adminCookieName];
  return getAdminSession(token);
}

function requireAdmin(req, res, next) {
  const session = resolveAdminSession(req);

  if (!session) {
    return res.status(401).json({
      ok: false,
      error: "Требуется авторизация."
    });
  }

  req.adminSession = session;
  return next();
}

function setAdminCookie(res, token) {
  const maxAge = config.admin.sessionTtlDays * 24 * 60 * 60;
  const secureFlag = config.admin.cookieSecure ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${adminCookieName}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secureFlag}`
  );
}

function clearAdminCookie(res) {
  const secureFlag = config.admin.cookieSecure ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${adminCookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag}`
  );
}

function createStoredFileName(originalName) {
  const extension = path.extname(originalName || "").toLowerCase();
  const baseName = path.basename(originalName || "file", extension);
  const safeBaseName = baseName
    .toLowerCase()
    .replace(/[^a-z0-9а-яё_-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50) || "file";

  return `${Date.now()}-${safeBaseName}${extension}`;
}

function toPublicUploadUrl(file) {
  const absolutePath = typeof file === "string" ? file : file.path;
  const relativePath = path.relative(uploadsDir, absolutePath).replace(/\\/g, "/");
  return `/uploads/${relativePath}`;
}

function removeStoredFile(publicPath) {
  if (!publicPath || !String(publicPath).startsWith("/uploads/")) {
    return;
  }

  const absolutePath = path.join(
    uploadsDir,
    String(publicPath).replace(/^\/uploads\//, "").replace(/\//g, path.sep)
  );

  if (absolutePath.startsWith(uploadsDir) && fs.existsSync(absolutePath)) {
    fs.rmSync(absolutePath, { force: true });
  }
}

function cleanupUploadedFiles(files) {
  for (const file of files || []) {
    if (file?.path && fs.existsSync(file.path)) {
      fs.rmSync(file.path, { force: true });
    }
  }
}

function sanitizeSubdirectory(value) {
  return String(value || "documents")
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "documents";
}

function sanitizeSettings(settings) {
  const sanitized = JSON.parse(JSON.stringify(settings || {}));

  if (sanitized.documents) {
    sanitized.documents.uploadDirectory = sanitizeSubdirectory(
      sanitized.documents.uploadDirectory
    );
  }

  return sanitized;
}

function setNestedValue(target, pathParts, value) {
  let current = target;

  for (let index = 0; index < pathParts.length - 1; index += 1) {
    const key = pathParts[index];
    current[key] = current[key] || {};
    current = current[key];
  }

  current[pathParts[pathParts.length - 1]] = value;
}

function getNestedValue(target, pathParts) {
  let current = target;

  for (const key of pathParts) {
    if (!current || typeof current !== "object") {
      return "";
    }

    current = current[key];
  }

  return current;
}

async function triggerConfiguredWebhooks(type, payload) {
  const settings = getSiteSettings();
  const webhookCandidates = [
    settings.crm.bitrixWebhookUrl,
    type === "lead" ? settings.crm.leadWebhookUrl : "",
    type === "callback" ? settings.crm.callbackWebhookUrl : "",
    type === "appointment" ? settings.crm.appointmentWebhookUrl : "",
    type === "document" ? settings.crm.documentWebhookUrl || settings.documents.webhookUrl : ""
  ].filter(Boolean);

  await Promise.all(
    webhookCandidates.map((url) =>
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type,
          payload,
          sentAt: new Date().toISOString()
        })
      }).catch(() => {})
    )
  );
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
