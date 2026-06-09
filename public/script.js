const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const modals = {
  appointment: $("#appointment-modal"),
  callback: $("#callback-modal")
};

const state = {
  settings: null
};

const DEFAULT_OFFICE_MAP_URL =
  "https://yandex.ru/map-widget/v1/?ll=39.869363%2C57.630114&mode=search&oid=1787836671&ol=biz&z=19.97";

initialize().catch((error) => {
  console.error(error);
});

async function initialize() {
  setupAnchorNavigation();
  setupBurgerMenu();
  setupFaq();
  setupModals();
  setupServiceSelection();
  setupSmoothScroll();
  setupCursorDot();

  await loadSiteSettings();
  await loadAppointmentSlots();
  syncProcessLineMetrics();

  setupReveal();
  setupStatCounters();
  setupLeadForm();
  setupCallbackForms();
  setupAppointmentForm();
  setupDocumentForm();
  window.addEventListener("resize", syncProcessLineMetrics, { passive: true });
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
  refreshFaqHeights();

  $$(".faq-item button").forEach((button) => {
    button.setAttribute(
      "aria-expanded",
      button.closest(".faq-item")?.classList.contains("is-open") ? "true" : "false"
    );

    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const shouldOpen = !item?.classList.contains("is-open");

      $$(".faq-item").forEach((faq) => {
        faq.classList.remove("is-open");
        $("button", faq)?.setAttribute("aria-expanded", "false");
      });

      if (item && shouldOpen) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
      }

      refreshFaqHeights();
    });
  });

  window.addEventListener("resize", refreshFaqHeights, { passive: true });
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
  setImage("#documents-art-image", settings.branding.documentArtPath, "Папка с документами");

  setText("#footer-description", settings.contacts.footerDescription);
  setContactLink("#topbar-phone", settings.contacts.phoneDisplay, settings.contacts.phoneHref, "☎");
  setContactLink("#footer-phone", settings.contacts.phoneDisplay, settings.contacts.phoneHref);
  setText("#footer-email", settings.contacts.email);
  setText("#footer-hours", settings.contacts.workingHours);
  setText("#footer-address", settings.contacts.cityAddress);
  setText("#topbar-hours", settings.contacts.workingHours, '<span class="icon">◷</span> ');
  setText("#topbar-address", settings.contacts.cityAddress, '<span class="icon">⌖</span> ');

  setImage("#social-telegram-icon", settings.contacts.telegramIconPath, "Telegram");
  setImage("#social-whatsapp-icon", settings.contacts.whatsappIconPath, "WhatsApp");
  setImage("#social-vk-icon", settings.contacts.vkIconPath, "ВКонтакте");
  setImage("#social-max-icon", settings.contacts.maxIconPath, "MAX");
  setSocialLink("#social-telegram", settings.contacts.telegramUrl);
  setSocialLink("#social-whatsapp", settings.contacts.whatsappUrl);
  setSocialLink("#social-vk", settings.contacts.vkUrl);
  setSocialLink("#social-max", settings.contacts.maxUrl);

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
  if (!link) {
    return;
  }

  if (!url || url === "#") {
    link.removeAttribute("href");
    link.removeAttribute("target");
    link.removeAttribute("rel");
    link.classList.add("is-disabled");
    return;
  }

  link.classList.remove("is-disabled");
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
  const visiblePrices = prices.slice(0, 3);
  const detectedFeaturedIndex = visiblePrices.findIndex((price) => Boolean(price.featured));
  const featuredIndex = detectedFeaturedIndex >= 0 ? detectedFeaturedIndex : 1;

  visiblePrices.forEach((price, index) => {
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
      featuredCard.classList.toggle("price-card--featured", index === featuredIndex);
    }

    const flag = $(`[data-price-popular="${index}"]`);
    if (flag) {
      flag.hidden = index !== featuredIndex;
    }
  });
}

function applyDocumentSettings(documents) {
  setText("#documents-title", documents.title);
  setText("#documents-description", documents.description);
  const uploadHint = $("#documents-upload-hint");
  if (uploadHint) {
    const primaryHint = String(documents.uploadHint || "").trim();
    const description = String(documents.description || "").trim();
    uploadHint.textContent = [primaryHint, description].filter(Boolean).join(" ");
  }
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

  const mapEmbedUrl = office.mapEmbedUrl || DEFAULT_OFFICE_MAP_URL;

  if (mapEmbedUrl) {
    mapContainer.innerHTML = `
      <iframe
        src="${escapeHtmlAttribute(mapEmbedUrl)}"
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
      showFormStatus(form, data.error || "Не удалось отправить заявку.", "error");
      return;
    }

    form.reset();
    showFormStatus(form, data.message, "success");
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
        showFormStatus(form, data.error || "Не удалось отправить запрос.", "error");
        return;
      }

      form.reset();
      showFormStatus(form, data.message, "success");
      window.setTimeout(closeModals, 1400);
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
      showFormStatus(form, data.error || "Не удалось отправить запись.", "error");
      return;
    }

    form.reset();
    $("#selected-slot").value = "";
    $$(".slot-btn").forEach((button) => button.classList.remove("is-selected"));
    showFormStatus(form, data.message, "success");
    window.setTimeout(closeModals, 1400);
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
      showFormStatus(form, data.error || "Не удалось отправить документы.", "error");
      return;
    }

    form.reset();
    syncUploadText(uploadText, 0);
    showFormStatus(form, data.message, "success");
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
      if (group.classList.contains("process-flow")) {
        const line = $(".process-flow__line", group);
        const cards = $$(":scope > article", group);
        syncProcessLineMetrics();
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: group,
            start: "top 82%"
          }
        });

        if (line) {
          timeline.fromTo(
            line,
            { scaleX: 0, opacity: 0.72 },
            { scaleX: 1, opacity: 1, duration: 3.2, ease: "power2.inOut" }
          );
        }

        timeline.to(
          cards,
          {
            opacity: 1,
            y: 0,
            duration: 0.78,
            ease: "power3.out",
            stagger: 0.4
          },
          line ? 0.24 : 0
        );
        return;
      }

      if (group.classList.contains("pricing")) {
        gsap.to($$(":scope > .price-card", group), {
          opacity: 1,
          y: 0,
          duration: 0.78,
          ease: "power3.out",
          stagger: 0.26,
          scrollTrigger: {
            trigger: group,
            start: "top 84%"
          }
        });
        return;
      }

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
          if (entry.target.classList.contains("reveal")) {
            animateRevealItem(entry.target);
          } else if (entry.target.classList.contains("process-flow")) {
            animateRevealProcess(entry.target);
          } else if (entry.target.classList.contains("pricing")) {
            animateRevealGroup($$(":scope > .price-card", entry.target), 260);
          } else if (entry.target.classList.contains("reveal-group")) {
            animateRevealGroup($$(":scope > *", entry.target), 120);
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  $$(".reveal, .reveal-group").forEach((element) => observer.observe(element));
}

function animateRevealProcess(group) {
  const line = $(".process-flow__line", group);
  const cards = $$(":scope > article", group);
  syncProcessLineMetrics();

  if (line) {
    line.animate(
      [
        { transform: "scaleX(0)", opacity: 0.72 },
        { transform: "scaleX(1)", opacity: 1 }
      ],
      {
        duration: 3200,
        easing: "cubic-bezier(.4,0,.2,1)",
        fill: "forwards"
      }
    );
  }

  animateRevealGroup(cards, 400, line ? 240 : 0);
}

function animateRevealGroup(elements, staggerMs, initialDelay = 0) {
  elements.forEach((element, index) => {
    window.setTimeout(() => {
      animateRevealItem(element);
    }, initialDelay + index * staggerMs);
  });
}

function animateRevealItem(element) {
  element.animate(
    [
      { opacity: 0, transform: "translateY(24px)" },
      { opacity: 1, transform: "translateY(0)" }
    ],
    {
      duration: 720,
      easing: "cubic-bezier(.2,.8,.2,1)",
      fill: "forwards"
    }
  );
}

function refreshFaqHeights() {
  $$(".faq-item").forEach((item) => {
    const content = $("p", item);
    if (!content) {
      return;
    }

    item.style.setProperty("--faq-height", `${content.scrollHeight + 26}px`);
  });
}

function syncProcessLineMetrics() {
  const group = $(".process-flow");
  const line = $(".process-flow__line", group);
  const circles = group ? $$(":scope > article > span", group) : [];

  if (!group || !line || circles.length < 2 || window.innerWidth <= 980) {
    return;
  }

  const groupRect = group.getBoundingClientRect();
  const firstRect = circles[0].getBoundingClientRect();
  const lastRect = circles[circles.length - 1].getBoundingClientRect();
  const left = firstRect.left + firstRect.width / 2 - groupRect.left;
  const right = groupRect.right - (lastRect.left + lastRect.width / 2);
  const top = firstRect.top + firstRect.height / 2 - groupRect.top - line.offsetHeight / 2;

  line.style.left = `${left}px`;
  line.style.right = `${right}px`;
  line.style.top = `${top}px`;
}

function setupSmoothScroll() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (prefersReducedMotion || hasCoarsePointer) {
    return;
  }

  let velocity = 0;
  let frameId = 0;
  let isAnimating = false;
  const wheelStrength = 0.14;
  const damping = 0.84;
  const maxVelocity = 56;

  const maxScroll = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  const animate = () => {
    if (Math.abs(velocity) < 0.2) {
      velocity = 0;
      isAnimating = false;
      frameId = 0;
      return;
    }

    const nextScrollY = Math.min(
      maxScroll(),
      Math.max(0, window.scrollY + velocity)
    );

    if (nextScrollY === window.scrollY) {
      velocity = 0;
      isAnimating = false;
      frameId = 0;
      return;
    }

    window.scrollTo(0, nextScrollY);
    velocity *= damping;
    frameId = window.requestAnimationFrame(animate);
  };

  const startAnimation = () => {
    if (isAnimating) {
      return;
    }

    isAnimating = true;
    frameId = window.requestAnimationFrame(animate);
  };

  const canHandleWheel = (event) => {
    if (event.ctrlKey || event.metaKey) {
      return false;
    }

    const dialog = event.target.closest(".modal__dialog");
    if (dialog && dialog.scrollHeight > dialog.clientHeight) {
      return false;
    }

    return true;
  };

  window.addEventListener(
    "wheel",
    (event) => {
      if (!canHandleWheel(event)) {
        return;
      }

      event.preventDefault();
      velocity += event.deltaY * wheelStrength;
      velocity = Math.max(-maxVelocity, Math.min(maxVelocity, velocity));
      startAnimation();
    },
    { passive: false }
  );

  window.addEventListener(
    "resize",
    () => {
      if (window.scrollY > maxScroll()) {
        window.scrollTo(0, maxScroll());
      }
    },
    { passive: true }
  );

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden && frameId) {
        window.cancelAnimationFrame(frameId);
        isAnimating = false;
        frameId = 0;
      }
    },
    { passive: true }
  );
}

function setupCursorDot() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (prefersReducedMotion || hasCoarsePointer) {
    return;
  }

  const cursorDot = document.createElement("div");
  cursorDot.className = "cursor-dot";
  cursorDot.innerHTML = `
    <span class="cursor-dot__halo"></span>
    <span class="cursor-dot__core"></span>
  `;
  document.body.appendChild(cursorDot);
  document.documentElement.classList.add("has-cursor-dot");

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let rafId = 0;
  let isVisible = false;
  const hotspotOffsetX = 1;
  const hotspotOffsetY = 1;
  const interactiveSelector =
    'a, button, .btn, .service-card, .price-card, .social-hub__card, .slot-btn, .faq-item button, .burger';

  const render = () => {
    currentX += (targetX - currentX) * 0.18;
    currentY += (targetY - currentY) * 0.18;
    cursorDot.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    rafId = window.requestAnimationFrame(render);
  };

  document.addEventListener(
    "pointermove",
    (event) => {
      targetX = event.clientX + hotspotOffsetX;
      targetY = event.clientY + hotspotOffsetY;
      cursorDot.classList.toggle(
        "is-hovering",
        Boolean(event.target.closest(interactiveSelector))
      );

      if (!isVisible) {
        isVisible = true;
        cursorDot.classList.add("is-visible");
      }
    },
    { passive: true }
  );

  document.addEventListener(
    "pointerdown",
    () => {
      cursorDot.classList.add("is-pressed");
    },
    { passive: true }
  );

  document.addEventListener(
    "pointerup",
    () => {
      cursorDot.classList.remove("is-pressed");
    },
    { passive: true }
  );

  document.addEventListener(
    "pointerleave",
    () => {
      cursorDot.classList.remove("is-visible");
      cursorDot.classList.remove("is-hovering");
    },
    { passive: true }
  );

  rafId = window.requestAnimationFrame(render);

  window.addEventListener(
    "beforeunload",
    () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    },
    { passive: true }
  );
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

function showFormStatus(form, message, type = "success") {
  let status = $(".form-status", form);

  if (!status) {
    status = document.createElement("div");
    status.className = "form-status";
    form.appendChild(status);
  }

  status.dataset.type = type;
  status.textContent = message;
  status.classList.add("is-visible");

  clearTimeout(status.timeoutId);
  status.timeoutId = window.setTimeout(() => {
    status.classList.remove("is-visible");
  }, 6000);
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
