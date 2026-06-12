const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const state = {
  user: null,
  settings: null
};

const views = {
  login: $("#login-view"),
  admin: $("#admin-view")
};

async function readApiResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  if (response.status === 413) {
    return {
      ok: false,
      error: "Файл слишком большой для загрузки на сервер. Увеличьте лимит в nginx или выберите файл меньше."
    };
  }

  if (text.includes("<html")) {
    return {
      ok: false,
      error: `Сервер вернул HTML вместо JSON. HTTP ${response.status}. Проверьте nginx и лимиты загрузки.`
    };
  }

  return {
    ok: false,
    error: `Некорректный ответ сервера. HTTP ${response.status}.`
  };
}

initialize().catch((error) => {
  console.error(error);
  showStatus("Не удалось загрузить админ-панель.", "error");
});

async function initialize() {
  ensureReviewsNavLink();
  bindLoginForm();
  bindSettingsForm();
  bindLogout();
  bindAssetActions();
  bindReviewEditors();
  bindRefreshButton();
  bindMapPreview();

  const session = await fetchAdminSession();
  if (session) {
    await showAdmin(session.user);
    return;
  }

  showLogin();
}

function bindLoginForm() {
  $("#login-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const submitButton = $('button[type="submit"]', form);
    const payload = Object.fromEntries(new FormData(form).entries());

    submitButton.disabled = true;
    showStatus("Проверяем учетные данные...", "info");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const data = await readApiResponse(response);

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Не удалось выполнить вход.");
      }

      form.reset();
      await showAdmin(data.user);
      showStatus("Авторизация выполнена.", "success");
    } catch (error) {
      showStatus(error.message, "error");
    } finally {
      submitButton.disabled = false;
    }
  });
}

function bindSettingsForm() {
  $("#settings-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!state.settings) {
      return;
    }

    const submitButton = $('.admin-btn--primary[type="submit"]', event.currentTarget);
    submitButton.disabled = true;

    try {
      const partialSettings = collectFormValues(event.currentTarget);
      mergeDeep(partialSettings, collectReviewsSettings());
      const nextSettings = mergeDeep(structuredCloneSafe(state.settings), partialSettings);

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ settings: nextSettings })
      });
      const data = await readApiResponse(response);

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Не удалось сохранить настройки.");
      }

      state.settings = data.settings;
      renderSettings();
      showStatus("Настройки сохранены.", "success");
    } catch (error) {
      showStatus(error.message, "error");
    } finally {
      submitButton.disabled = false;
    }
  });
}

function bindLogout() {
  $("#logout-button")?.addEventListener("click", async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST"
      });
    } finally {
      state.user = null;
      state.settings = null;
      showLogin();
      showStatus("Сессия завершена.", "info");
    }
  });
}

function bindAssetActions() {
  $$("[data-asset-upload]").forEach((button) => {
    button.addEventListener("click", async () => {
      const card = button.closest("[data-asset-field]");
      const input = $(".asset-input", card);
      const field = card?.dataset.assetField;

      if (!field || !input?.files?.length) {
        showStatus("Выберите файл для загрузки.", "error");
        return;
      }

      const formData = new FormData();
      formData.append("file", input.files[0]);
      button.disabled = true;

      try {
        const response = await fetch(`/api/admin/assets/${field}`, {
          method: "POST",
          body: formData
        });
        const data = await readApiResponse(response);

        if (!response.ok || !data.ok) {
          throw new Error(data.error || "Не удалось загрузить файл.");
        }

        state.settings = data.settings;
        input.value = "";
        renderAssetPreviews();
        showStatus("Файл загружен.", "success");
      } catch (error) {
        showStatus(error.message, "error");
      } finally {
        button.disabled = false;
      }
    });
  });

  $$("[data-asset-delete]").forEach((button) => {
    button.addEventListener("click", async () => {
      const card = button.closest("[data-asset-field]");
      const field = card?.dataset.assetField;

      if (!field) {
        return;
      }

      button.disabled = true;

      try {
        const response = await fetch(`/api/admin/assets/${field}`, {
          method: "DELETE"
        });
        const data = await readApiResponse(response);

        if (!response.ok || !data.ok) {
          throw new Error(data.error || "Не удалось удалить файл.");
        }

        state.settings = data.settings;
        renderAssetPreviews();
        showStatus("Файл удален.", "success");
      } catch (error) {
        showStatus(error.message, "error");
      } finally {
        button.disabled = false;
      }
    });
  });
}

function bindReviewEditors() {
  $("#add-review-platform")?.addEventListener("click", () => {
    syncReviewsFromEditor();
    const reviews = ensureReviewsSettings();
    reviews.platforms.push({
      id: `platform-${Date.now()}`,
      name: "Новая платформа",
      logoPath: ""
    });
    renderReviewsEditor();
  });

  $("#add-review-item")?.addEventListener("click", () => {
    syncReviewsFromEditor();
    const reviews = ensureReviewsSettings();
    reviews.items.push({
      platformId: reviews.platforms[0]?.id || "",
      date: "",
      rating: "5.0",
      imagePath: ""
    });
    renderReviewsEditor();
  });

  $("#review-platforms")?.addEventListener("click", handleReviewPlatformActions);
  $("#review-items")?.addEventListener("click", handleReviewItemActions);
}

function bindRefreshButton() {
  $("#reload-submissions")?.addEventListener("click", async () => {
    try {
      await loadAdminData();
      showStatus("Данные обновлены.", "success");
    } catch (error) {
      showStatus(error.message, "error");
    }
  });
}

function ensureReviewsNavLink() {
  const nav = $(".admin-nav");
  if (!nav || $('[href="#reviews"]', nav)) {
    return;
  }

  const analyticsLink = $('[href="#analytics"]', nav);
  const link = document.createElement("a");
  link.href = "#reviews";
  link.textContent = "Отзывы";

  if (analyticsLink) {
    nav.insertBefore(link, analyticsLink);
    return;
  }

  nav.append(link);
}

function bindMapPreview() {
  $("#map-embed-url")?.addEventListener("input", (event) => {
    renderMapPreview(event.currentTarget.value);
  });
}

async function fetchAdminSession() {
  try {
    const response = await fetch("/api/admin/session");
    const data = await readApiResponse(response);
    if (!response.ok || !data.ok) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

async function showAdmin(user) {
  state.user = user;
  $("#admin-user").textContent = user.username;
  views.login.hidden = true;
  views.admin.hidden = false;
  await loadAdminData();
}

function showLogin() {
  $("#admin-user").textContent = "";
  views.login.hidden = false;
  views.admin.hidden = true;
}

async function loadAdminData() {
  const response = await fetch("/api/admin/settings");
  const data = await readApiResponse(response);

  if (!response.ok || !data.ok) {
    if (response.status === 401) {
      showLogin();
      throw new Error("Сессия истекла. Выполните вход снова.");
    }

    throw new Error(data.error || "Не удалось загрузить данные.");
  }

  state.settings = data.settings;
  renderSettings();
  renderSubmissions(data.submissions || []);
}

function renderSettings() {
  if (!state.settings) {
    return;
  }

  fillForm($("#settings-form"), state.settings);
  renderAssetPreviews();
  renderReviewsEditor();
  renderMapPreview(getNestedValue(state.settings, ["office", "mapEmbedUrl"]));
}

function renderAssetPreviews() {
  const assetPathMap = {
    logoHeader: ["branding", "logoHeaderPath"],
    logoFooter: ["branding", "logoFooterPath"],
    favicon: ["branding", "faviconPath"],
    heroImage: ["branding", "heroImagePath"],
    contactImage: ["branding", "contactImagePath"],
    documentArt: ["branding", "documentArtPath"],
    quickHelpIcon: ["branding", "quickHelpIconPath"],
    reviewsBackground: ["reviews", "backgroundImagePath"],
    reviewsColumn: ["reviews", "columnImagePath"],
    reviewsLaurelLeft: ["reviews", "laurelLeftPath"],
    reviewsLaurelRight: ["reviews", "laurelRightPath"],
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

  Object.entries(assetPathMap).forEach(([field, pathParts]) => {
    const image = $(`[data-asset-preview="${field}"]`);
    if (!image) {
      return;
    }

    const src = getNestedValue(state.settings, pathParts) || "";
    image.src = src || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    image.style.opacity = src ? "1" : ".25";
  });

  const faviconPath = getNestedValue(state.settings, ["branding", "faviconPath"]);
  const favicon = document.querySelector("#site-favicon");
  if (favicon && faviconPath) {
    favicon.setAttribute("href", faviconPath);
  }
}

function renderReviewsEditor() {
  const reviews = ensureReviewsSettings();
  const platformRoot = $("#review-platforms");
  const itemRoot = $("#review-items");

  if (!platformRoot || !itemRoot) {
    return;
  }

  platformRoot.innerHTML = reviews.platforms
    .map(
      (platform, index) => `
        <article class="dynamic-card" data-review-platform-index="${index}">
          <div class="dynamic-card__preview">
            <img src="${escapeHtmlAttribute(platform.logoPath || transparentPixel())}" alt="${escapeHtmlAttribute(platform.name || "Платформа")}" data-review-platform-preview="${index}" style="opacity:${platform.logoPath ? "1" : ".22"}" />
          </div>
          <div class="dynamic-card__fields">
            <label class="field">
              <span>Код платформы</span>
              <input type="text" value="${escapeHtmlAttribute(platform.id || "")}" data-review-platform-id />
            </label>
            <label class="field">
              <span>Название платформы</span>
              <input type="text" value="${escapeHtmlAttribute(platform.name || "")}" data-review-platform-name />
            </label>
            <input class="asset-input" type="file" accept="image/*" data-review-platform-file />
            <input type="hidden" value="${escapeHtmlAttribute(platform.logoPath || "")}" data-review-platform-logo />
            <div class="asset-actions">
              <button class="admin-btn admin-btn--secondary" type="button" data-review-platform-upload>Загрузить логотип</button>
              <button class="admin-btn admin-btn--ghost" type="button" data-review-platform-clear-logo>Удалить логотип</button>
              <button class="admin-btn admin-btn--ghost" type="button" data-review-platform-remove>Удалить платформу</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  itemRoot.innerHTML = reviews.items
    .map(
      (item, index) => `
        <article class="dynamic-card" data-review-item-index="${index}">
          <div class="dynamic-card__preview dynamic-card__preview--wide">
            <img src="${escapeHtmlAttribute(item.imagePath || transparentPixel())}" alt="Скриншот отзыва" data-review-item-preview="${index}" style="opacity:${item.imagePath ? "1" : ".22"}" />
          </div>
          <div class="dynamic-card__fields">
            <label class="field">
              <span>Источник</span>
              <select data-review-item-platform>
                ${reviews.platforms
                  .map(
                    (platform) =>
                      `<option value="${escapeHtmlAttribute(platform.id || "")}" ${platform.id === item.platformId ? "selected" : ""}>${escapeHtml(platform.name || "Платформа")}</option>`
                  )
                  .join("")}
              </select>
            </label>
            <label class="field">
              <span>Дата отзыва</span>
              <input type="text" value="${escapeHtmlAttribute(item.date || "")}" data-review-item-date />
            </label>
            <label class="field">
              <span>Оценка</span>
              <input type="text" value="${escapeHtmlAttribute(item.rating || "")}" data-review-item-rating />
            </label>
            <input class="asset-input" type="file" accept="image/*" data-review-item-file />
            <input type="hidden" value="${escapeHtmlAttribute(item.imagePath || "")}" data-review-item-image />
            <div class="asset-actions">
              <button class="admin-btn admin-btn--secondary" type="button" data-review-item-upload>Загрузить скриншот</button>
              <button class="admin-btn admin-btn--ghost" type="button" data-review-item-clear-image>Удалить изображение</button>
              <button class="admin-btn admin-btn--ghost" type="button" data-review-item-remove>Удалить отзыв</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function ensureReviewsSettings() {
  if (!state.settings) {
    return {
      platforms: [],
      items: []
    };
  }

  state.settings.reviews = state.settings.reviews || {};
  state.settings.reviews.platforms = Array.isArray(state.settings.reviews.platforms)
    ? state.settings.reviews.platforms
    : [];
  state.settings.reviews.items = Array.isArray(state.settings.reviews.items)
    ? state.settings.reviews.items
    : [];

  return state.settings.reviews;
}

function renderMapPreview(url) {
  const container = $("#map-preview");
  if (!container) {
    return;
  }

  if (!url) {
    container.innerHTML = '<div class="map-preview__empty">Укажите URL iframe Яндекс.Карт, чтобы увидеть превью.</div>';
    return;
  }

  container.innerHTML = `
    <iframe
      src="${escapeHtmlAttribute(url)}"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
      title="Превью карты"
    ></iframe>
  `;
}

async function handleReviewPlatformActions(event) {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const card = button.closest("[data-review-platform-index]");
  const index = Number(card?.dataset.reviewPlatformIndex);
  const reviews = ensureReviewsSettings();

  if (!card || Number.isNaN(index)) {
    return;
  }

  if (button.hasAttribute("data-review-platform-remove")) {
    syncReviewsFromEditor();
    const removedPlatform = reviews.platforms[index];
    const removedLogoPath = removedPlatform?.logoPath || "";
    const removedPlatformId = removedPlatform?.id || "";
    reviews.platforms.splice(index, 1);
    reviews.items = reviews.items.map((item) =>
      item.platformId === removedPlatformId
        ? {
            ...item,
            platformId: reviews.platforms[0]?.id || ""
          }
        : item
    );
    renderReviewsEditor();
    showStatus("Платформа удалена. Сохраните настройки.", "info");
    return;
  }

  if (button.hasAttribute("data-review-platform-clear-logo")) {
    syncReviewsFromEditor();
    const path = reviews.platforms[index]?.logoPath || "";
    reviews.platforms[index].logoPath = "";
    renderReviewsEditor();
    if (path) {
      await deleteUploadedFile(path);
    }
    showStatus("Логотип удален. Сохраните настройки.", "info");
    return;
  }

  if (button.hasAttribute("data-review-platform-upload")) {
    syncReviewsFromEditor();
    const currentCard = $(`[data-review-platform-index="${index}"]`);
    const input = $('[data-review-platform-file]', currentCard);
    if (!input?.files?.length) {
      showStatus("Выберите файл логотипа.", "error");
      return;
    }

    button.disabled = true;
    try {
      const previousPath = reviews.platforms[index]?.logoPath || "";
      const path = await uploadDynamicAsset(input.files[0]);
      reviews.platforms[index].logoPath = path;
      renderReviewsEditor();
      if (previousPath && previousPath !== path) {
        await deleteUploadedFile(previousPath);
      }
      showStatus("Логотип загружен. Сохраните настройки.", "success");
    } catch (error) {
      showStatus(error.message, "error");
    } finally {
      button.disabled = false;
    }
  }
}

async function handleReviewItemActions(event) {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const card = button.closest("[data-review-item-index]");
  const index = Number(card?.dataset.reviewItemIndex);
  const reviews = ensureReviewsSettings();

  if (!card || Number.isNaN(index)) {
    return;
  }

  if (button.hasAttribute("data-review-item-remove")) {
    syncReviewsFromEditor();
    const path = reviews.items[index]?.imagePath || "";
    reviews.items.splice(index, 1);
    renderReviewsEditor();
    if (path) {
      await deleteUploadedFile(path);
    }
    showStatus("Отзыв удален. Сохраните настройки.", "info");
    return;
  }

  if (button.hasAttribute("data-review-item-clear-image")) {
    syncReviewsFromEditor();
    const path = reviews.items[index]?.imagePath || "";
    reviews.items[index].imagePath = "";
    renderReviewsEditor();
    if (path) {
      await deleteUploadedFile(path);
    }
    showStatus("Изображение удалено. Сохраните настройки.", "info");
    return;
  }

  if (button.hasAttribute("data-review-item-upload")) {
    syncReviewsFromEditor();
    const currentCard = $(`[data-review-item-index="${index}"]`);
    const input = $('[data-review-item-file]', currentCard);
    if (!input?.files?.length) {
      showStatus("Выберите файл отзыва.", "error");
      return;
    }

    button.disabled = true;
    try {
      const previousPath = reviews.items[index]?.imagePath || "";
      const path = await uploadDynamicAsset(input.files[0]);
      reviews.items[index].imagePath = path;
      renderReviewsEditor();
      if (previousPath && previousPath !== path) {
        await deleteUploadedFile(previousPath);
      }
      showStatus("Изображение отзыва загружено. Сохраните настройки.", "success");
    } catch (error) {
      showStatus(error.message, "error");
    } finally {
      button.disabled = false;
    }
  }
}

async function uploadDynamicAsset(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    body: formData
  });
  const data = await readApiResponse(response);

  if (!response.ok || !data.ok || !data.path) {
    throw new Error(data.error || "Не удалось загрузить файл.");
  }

  return data.path;
}

async function deleteUploadedFile(path) {
  if (!path || !String(path).startsWith("/uploads/")) {
    return;
  }

  await fetch("/api/admin/uploads", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ path })
  }).catch(() => {});
}

function renderSubmissions(submissions) {
  const body = $("#submissions-body");
  if (!body) {
    return;
  }

  if (!submissions.length) {
    body.innerHTML = `
      <tr>
        <td colspan="5">Пока нет заявок.</td>
      </tr>
    `;
    return;
  }

  body.innerHTML = submissions
    .map((submission) => {
      const contact = [submission.name, submission.phone, submission.email]
        .filter(Boolean)
        .map(escapeHtml)
        .join("<br>");
      const summary = [submission.service, submission.message]
        .filter(Boolean)
        .map(escapeHtml)
        .join("<br>");
      const files = (submission.filePaths || []).length
        ? `
            <div class="submission-files">
              ${submission.filePaths
                .map(
                  (file) =>
                    `<a href="${escapeHtmlAttribute(file)}" target="_blank" rel="noreferrer">${escapeHtml(file.split("/").pop() || file)}</a>`
                )
                .join("")}
            </div>
          `
        : "—";

      return `
        <tr>
          <td>${escapeHtml(formatDateTime(submission.created_at))}</td>
          <td><span class="submission-type">${escapeHtml(mapSubmissionType(submission.type))}</span></td>
          <td>${contact || "—"}</td>
          <td>${summary || "—"}</td>
          <td>${files}</td>
        </tr>
      `;
    })
    .join("");
}

function fillForm(form, data) {
  $$("[name]", form).forEach((field) => {
    const pathParts = parsePath(field.name);
    const value = getNestedValue(data, pathParts);

    if (field.dataset.array === "lines") {
      field.value = Array.isArray(value) ? value.join("\n") : "";
      return;
    }

    if (field.type === "checkbox") {
      field.checked = Boolean(value);
      return;
    }

    field.value = value ?? "";
  });
}

function collectFormValues(form) {
  const result = {};

  $$("[name]", form).forEach((field) => {
    let value;

    if (field.dataset.array === "lines") {
      value = String(field.value || "")
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);
    } else if (field.type === "checkbox") {
      value = field.checked;
    } else if (field.dataset.number === "integer") {
      value = Number.parseInt(field.value || "0", 10) || 0;
    } else {
      value = field.value;
    }

    setNestedValue(result, parsePath(field.name), value);
  });

  return result;
}

function collectReviewsSettings() {
  return {
    reviews: {
      platforms: $$("[data-review-platform-index]").map((card) => ({
        id:
          slugify($('[data-review-platform-id]', card)?.value || $('[data-review-platform-name]', card)?.value || "") ||
          `platform-${Date.now()}`,
        name: String($('[data-review-platform-name]', card)?.value || "").trim(),
        logoPath: String($('[data-review-platform-logo]', card)?.value || "").trim()
      })),
      items: $$("[data-review-item-index]").map((card) => ({
        platformId: String($('[data-review-item-platform]', card)?.value || "").trim(),
        date: String($('[data-review-item-date]', card)?.value || "").trim(),
        rating: String($('[data-review-item-rating]', card)?.value || "").trim(),
        imagePath: String($('[data-review-item-image]', card)?.value || "").trim()
      }))
      }
    };
  }

function syncReviewsFromEditor() {
  if (!state.settings || !$("#review-platforms") || !$("#review-items")) {
    return;
  }

  mergeDeep(state.settings, collectReviewsSettings());
}

function transparentPixel() {
  return "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parsePath(path) {
  return String(path)
    .split(".")
    .map((part) => (/^\d+$/.test(part) ? Number(part) : part));
}

function setNestedValue(target, pathParts, value) {
  let current = target;

  for (let index = 0; index < pathParts.length; index += 1) {
    const part = pathParts[index];
    const isLast = index === pathParts.length - 1;
    const nextPart = pathParts[index + 1];

    if (isLast) {
      current[part] = value;
      return;
    }

    if (current[part] === undefined) {
      current[part] = typeof nextPart === "number" ? [] : {};
    }

    current = current[part];
  }
}

function getNestedValue(target, pathParts) {
  return pathParts.reduce((current, key) => {
    if (current === null || current === undefined) {
      return undefined;
    }
    return current[key];
  }, target);
}

function mergeDeep(target, source) {
  Object.entries(source || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      target[key] = value;
      return;
    }

    if (value && typeof value === "object") {
      target[key] = mergeDeep(
        target[key] && typeof target[key] === "object" && !Array.isArray(target[key])
          ? target[key]
          : {},
        value
      );
      return;
    }

    target[key] = value;
  });

  return target;
}

function mapSubmissionType(type) {
  return {
    lead: "Лид",
    callback: "Звонок",
    appointment: "Офис",
    document: "Документы"
  }[type] || type;
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value || "";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date);
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value));
}

function showStatus(message, type = "info") {
  const status = $("#app-status");
  if (!status) {
    return;
  }

  status.hidden = false;
  status.dataset.type = type;
  status.textContent = message;

  clearTimeout(showStatus.timeoutId);
  showStatus.timeoutId = window.setTimeout(() => {
    status.hidden = true;
  }, 5000);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeHtmlAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}
