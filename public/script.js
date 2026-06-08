const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const modals = {
  appointment: $("#appointment-modal"),
  callback: $("#callback-modal")
};

const state = {
  settings: null
};

initialize().catch((error) => {
  console.error(error);
});

async function initialize() {
  setupAnchorNavigation();
  setupBurgerMenu();
  setupFaq();
  setupModals();
  setupServiceSelection();

  await loadSiteSettings();
  await loadAppointmentSlots();

  setupReveal();
  setupStatCounters();
  setupLeadForm();
  setupCallbackForms();
  setupAppointmentForm();
  setupDocumentForm();
}

function setupAnchorNavigation() {
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = $(link.getAttribute("href"));
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      $(".nav-links")?.classList.remove("is-open");
    });
  });
}

function setupBurgerMenu() {
  $(".burger")?.addEventListener("click", () => {
    $(".nav-links")?.classList.toggle("is-open");
  });
}

function setupFaq() {
  $$(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      $$(".faq-item").forEach((faq) => {
        if (faq !== item) {
          faq.classList.remove("is-open");
        }
      });
      item.classList.toggle("is-open");
    });
  });
}

function setupModals() {
  $$("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      openModal(button.dataset.openModal);
    });
  });

  $$("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", closeModals);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModals();
    }
  });
}

function setupServiceSelection() {
  $$(".service-card").forEach((card) => {
    card.addEventListener("click", () => {
      const selected = $("#selected-service");
      if (selected) {
        selected.value = card.dataset.service || "";
      }

      $$(".service-card").forEach((item) => item.classList.remove("is-active"));
      card.classList.add("is-active");
    });
  });
}

async function loadSiteSettings() {
  const response = await fetch("/api/site-config");
  const data = await response.json();

  if (!response.ok || !data.ok) {
    return;
  }

  state.settings = data.settings;
  applySiteSettings(data.settings);
  bootstrapAnalytics(data.settings.analytics || {});
}

function applySiteSettings(settings) {
  setMeta(settings);
  setText("#hero-eyebrow", settings.hero.eyebrow);
  setText("#hero-title", settings.hero.title);
  setText("#hero-text", settings.hero.text);
  setText("#hero-badge-title", settings.hero.badgeTitle);
  setText("#hero-badge-text", settings.hero.badgeText);

  setImage("#brand-logo", settings.branding.logoHeaderPath, settings.branding.siteTitle);
  setImage("#footer-logo", settings.branding.logoFooterPath, settings.branding.siteTitle);
  setImage("#hero-image", settings.branding.heroImagePath, "Юридическая консультация");
  setImage("#contact-image", settings.branding.contactImagePath, "Юрист изучает документы");

  setText("#footer-description", settings.contacts.footerDescription);
  setContactLink("#topbar-phone", settings.contacts.phoneDisplay, settings.contacts.phoneHref, "☎");
  setContactLink("#footer-phone", settings.contacts.phoneDisplay, settings.contacts.phoneHref);
  setText("#footer-email", settings.contacts.email);
  setText("#footer-hours", settings.contacts.workingHours);
  setText("#footer-address", settings.contacts.cityAddress);
  setText("#topbar-hours", settings.contacts.workingHours, '<span class="icon">◷</span> ');
  setText("#topbar-address", settings.contacts.cityAddress, '<span class="icon">⌖</span> ');

  setSocialLink("#social-telegram", settings.contacts.telegramUrl);
  setSocialLink("#social-whatsapp", settings.contacts.whatsappUrl);
  setSocialLink("#social-vk", settings.contacts.vkUrl);

  bindAction("#hero-primary-action", {
    label: settings.hero.primaryButtonLabel,
    type: settings.hero.primaryButtonType,
    value: settings.hero.primaryButtonValue
  });
  bindAction("#hero-secondary-action", {
    label: settings.hero.secondaryButtonLabel,
    type: settings.hero.secondaryButtonType,
    value: settings.hero.secondaryButtonValue
  });
  bindAction("#urgent-button", {
    label: settings.actions.urgentButtonLabel,
    type: settings.actions.urgentButtonType,
    value: settings.actions.urgentButtonValue
  });
  bindNavbarAction(settings);
  bindAction("#office-button", {
    label: settings.actions.officeButtonLabel,
    type: settings.actions.officeButtonType,
    value: settings.actions.officeButtonValue
  });

  applyPrices(settings.prices || []);
  applyDocumentSettings(settings.documents || {});
  applyOfficeSettings(settings.office || {});
}

function setMeta(settings) {
  document.title = `${settings.branding.siteTitle} — юридические услуги для граждан и бизнеса`;
  const description = $('meta[name="description"]');
  if (description) {
    description.setAttribute("content", settings.branding.siteDescription);
  }
}

function setText(selector, value, prefix = "") {
  const element = $(selector);
  if (!element || value === undefined || value === null || value === "") {
    return;
  }

  if (prefix) {
    element.innerHTML = `${prefix}${escapeHtml(value)}`;
    return;
  }

  element.textContent = value;
}

function setImage(selector, path, alt) {
  const image = $(selector);
  if (!image || !path) {
    return;
  }

  image.src = path;
  if (alt) {
    image.alt = alt;
  }
}

function setContactLink(selector, label, phone, icon = "") {
  const element = $(selector);
  if (!element) {
    return;
  }

  if (element.tagName === "A") {
    element.href = `tel:${String(phone || "").replace(/[^\d+]/g, "")}`;
  }

  element.innerHTML = icon ? `${icon} ${escapeHtml(label)}` : escapeHtml(label);
}

function setSocialLink(selector, url) {
  const link = $(selector);
  if (!link || !url) {
    return;
  }

  link.href = url;
  link.target = "_blank";
  link.rel = "noreferrer";
}

function bindAction(selector, action) {
  const element = $(selector);
  if (!element) {
    return;
  }

  if (action.label) {
    element.textContent = action.label;
  }

  const cloned = element.cloneNode(true);
  element.replaceWith(cloned);

  if (action.type === "anchor") {
    bindAnchorAction(cloned, action.value || "#lead");
    return;
  }

  if (action.type === "modal") {
    cloned.setAttribute("data-open-modal", action.value || "callback");
    cloned.addEventListener("click", () => openModal(action.value || "callback"));
    return;
  }

  if (action.type === "url" || action.type === "tel" || action.type === "mailto") {
    const href = action.type === "url" ? action.value : `${action.type}:${action.value || ""}`;
    bindHrefAction(cloned, href);
  }
}

function bindNavbarAction(settings) {
  const button = $("#navbar-cta");
  if (!button) {
    return;
  }

  const cloned = button.cloneNode(true);
  button.replaceWith(cloned);
  cloned.textContent = settings.contacts.phoneDisplay || "+7 (495) 128-24-24";

  cloned.addEventListener("click", () => {
    const telHref = `tel:${String(settings.contacts.phoneHref || settings.contacts.phoneDisplay || "").replace(/[^\d+]/g, "")}`;
    const isMobileViewport = window.matchMedia("(max-width: 980px)").matches;

    if (isMobileViewport) {
      window.location.href = telHref;
      return;
    }

    $("#contacts")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function bindAnchorAction(element, selector) {
  if (element.tagName === "A") {
    element.href = selector;
  } else {
    element.addEventListener("click", () => {
      $(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

function bindHrefAction(element, href) {
  if (element.tagName === "A") {
    element.href = href;
  } else {
    element.addEventListener("click", () => {
      window.location.href = href;
    });
  }
}

function applyPrices(prices) {
  prices.slice(0, 3).forEach((price, index) => {
    setText(`[data-price-title="${index}"]`, price.title);
    setText(`[data-price-description="${index}"]`, price.description);
    setText(`[data-price-amount="${index}"]`, price.price);

    const featuresList = $(`[data-price-features="${index}"]`);
    if (featuresList) {
      featuresList.innerHTML = (price.features || [])
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("");
    }

    bindAction(`[data-price-button="${index}"]`, {
      label: price.buttonLabel,
      type: price.buttonType,
      value: price.buttonValue
    });

    const featuredCard = $(`[data-price-featured="${index}"]`);
    if (featuredCard) {
      featuredCard.classList.toggle("price-card--featured", Boolean(price.featured));
    }

    const flag = $(`[data-price-popular="${index}"]`);
    if (flag) {
      flag.hidden = !price.featured;
    }
  });
}

function applyDocumentSettings(documents) {
  setText("#documents-title", documents.title);
  setText("#documents-description", documents.description);
  setText("#documents-upload-hint", documents.uploadHint);
  setText("#documents-submit-label", documents.buttonLabel);
}

function applyOfficeSettings(office) {
  setText("#office-eyebrow", office.eyebrow);
  setText("#office-title", office.title);
  setText("#office-text", office.text);
  setText("#office-map-title", office.mapTitle);
  setText("#office-map-subtitle", office.mapSubtitle);

  const points = $("#office-points");
  if (points && Array.isArray(office.points)) {
    points.innerHTML = office.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("");
  }

  const mapContainer = $("#office-map");
  if (!mapContainer) {
    return;
  }

  if (office.mapEmbedUrl) {
    mapContainer.innerHTML = `
      <iframe
        src="${escapeHtmlAttribute(office.mapEmbedUrl)}"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
        title="Карта офиса"
      ></iframe>
    `;
    mapContainer.classList.add("office-map--embedded");
    return;
  }

  mapContainer.classList.remove("office-map--embedded");
  mapContainer.innerHTML = `
    <span>⌖</span>
    <strong id="office-map-title">${escapeHtml(office.mapTitle || "Тверская, 16")}</strong>
    <small id="office-map-subtitle">${escapeHtml(office.mapSubtitle || "офис 812")}</small>
  `;
}

async function loadAppointmentSlots() {
  const grid = $("#slot-grid");
  if (!grid) {
    return;
  }

  try {
    const response = await fetch("/api/appointment-slots");
    const data = await response.json();

    if (!response.ok || !data.ok) {
      return;
    }

    renderSlots(data.slots || []);
  } catch (_error) {
    renderSlots([]);
  }
}

function renderSlots(slots) {
  const grid = $("#slot-grid");
  if (!grid) {
    return;
  }

  grid.innerHTML = slots
    .map((slot, index) => `
      <button class="slot-btn" type="button" data-slot-index="${index}" data-slot-value="${escapeHtmlAttribute(`${slot.date} ${slot.time}`)}" ${slot.available ? "" : "disabled"}>
        ${escapeHtml(slot.date)}<br>${escapeHtml(slot.time)}
      </button>
    `)
    .join("");

  $$(".slot-btn", grid).forEach((button) => {
    button.addEventListener("click", () => {
      $$(".slot-btn", grid).forEach((item) => item.classList.remove("is-selected"));
      button.classList.add("is-selected");
      const selectedSlot = $("#selected-slot");
      if (selectedSlot) {
        selectedSlot.value = button.dataset.slotValue || "";
      }
    });
  });
}

function setupLeadForm() {
  const form = $(".lead-form");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      service: String(formData.get("service") || "Общий запрос").trim(),
      comment: String(formData.get("message") || "").trim(),
      sourceUrl: window.location.href,
      referrer: document.referrer
    };

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      alert(data.error || "Не удалось отправить заявку.");
      return;
    }

    form.reset();
    alert(data.message);
  });
}

function setupCallbackForms() {
  [$(".quick-form"), $(".callback-form")].filter(Boolean).forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const payload = {
        phone: String(new FormData(form).get("phone") || "").trim()
      };

      const response = await fetch("/api/forms/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        alert(data.error || "Не удалось отправить запрос.");
        return;
      }

      form.reset();
      closeModals();
      alert(data.message);
    });
  });
}

function setupAppointmentForm() {
  const form = $(".appointment-form");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/forms/appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      alert(data.error || "Не удалось отправить запись.");
      return;
    }

    form.reset();
    $("#selected-slot").value = "";
    $$(".slot-btn").forEach((button) => button.classList.remove("is-selected"));
    closeModals();
    alert(data.message);
  });
}

function setupDocumentForm() {
  const form = $(".doc-form");
  const upload = $(".upload-wide");
  const fileInput = $("#docs-input");
  const uploadText = $("#documents-upload-text");

  if (!form || !upload || !fileInput) {
    return;
  }

  ["dragenter", "dragover"].forEach((name) => {
    upload.addEventListener(name, (event) => {
      event.preventDefault();
      upload.classList.add("is-dragover");
    });
  });

  ["dragleave", "drop"].forEach((name) => {
    upload.addEventListener(name, (event) => {
      event.preventDefault();
      upload.classList.remove("is-dragover");
    });
  });

  upload.addEventListener("drop", (event) => {
    fileInput.files = event.dataTransfer.files;
    syncUploadText(uploadText, fileInput.files.length);
  });

  fileInput.addEventListener("change", () => {
    syncUploadText(uploadText, fileInput.files.length);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = new FormData(form);

    const response = await fetch("/api/forms/document", {
      method: "POST",
      body: payload
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      alert(data.error || "Не удалось отправить документы.");
      return;
    }

    form.reset();
    syncUploadText(uploadText, 0);
    alert(data.message);
  });
}

function syncUploadText(element, count) {
  if (!element) {
    return;
  }

  element.textContent = count
    ? `Выбрано файлов: ${count}`
    : "Перетащите файлы сюда или выберите на компьютере";
}

function openModal(name) {
  const modal = modals[name];
  if (!modal) {
    return;
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModals() {
  Object.values(modals).forEach((modal) => {
    modal?.classList.remove("is-open");
    modal?.setAttribute("aria-hidden", "true");
  });
  document.body.style.overflow = "";
}

function setupReveal() {
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);

    $$(".reveal").forEach((element) => {
      gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 88%"
        }
      });
    });

    $$(".reveal-group").forEach((group) => {
      gsap.to($$(":scope > *", group), {
        opacity: 1,
        y: 0,
        duration: 0.72,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: group,
          start: "top 82%"
        }
      });
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.animate(
            [
              { opacity: 0, transform: "translateY(24px)" },
              { opacity: 1, transform: "translateY(0)" }
            ],
            {
              duration: 700,
              easing: "cubic-bezier(.2,.8,.2,1)",
              fill: "forwards"
            }
          );
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  $$(".reveal, .reveal-group > *").forEach((element) => observer.observe(element));
}

function setupStatCounters() {
  const counters = $$(".stat-value[data-counter]");
  if (!counters.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.target.dataset.counted === "true") {
          return;
        }

        animateCounter(entry.target);
        entry.target.dataset.counted = "true";
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function animateCounter(element) {
  const target = Number(element.dataset.counter || "0");
  const suffix = element.dataset.suffix || "";
  const duration = 1400;
  const startTime = performance.now();

  const step = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.round(target * eased);
    element.textContent = `${formatCounter(currentValue)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

function formatCounter(value) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function bootstrapAnalytics(analytics) {
  if (analytics.yandexMetrikaId) {
    loadYandexMetrika(analytics.yandexMetrikaId);
  }
}

function loadYandexMetrika(counterId) {
  if (window.__yandexMetrikaLoaded) {
    return;
  }

  window.__yandexMetrikaLoaded = true;

  (function (m, e, t, r, i, k, a) {
    m[i] =
      m[i] ||
      function () {
        (m[i].a = m[i].a || []).push(arguments);
      };
    m[i].l = Number(new Date());
    k = e.createElement(t);
    a = e.getElementsByTagName(t)[0];
    k.async = 1;
    k.src = r;
    a.parentNode.insertBefore(k, a);
  })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

  window.ym(counterId, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true
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

function escapeHtmlAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}
