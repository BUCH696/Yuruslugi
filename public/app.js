const form = document.getElementById("lead-form");
const formStatus = document.getElementById("form-status");
const cookieBanner = document.getElementById("cookie-banner");
const cookieAcceptButton = document.getElementById("cookie-accept");
const header = document.getElementById("page-header");
const serviceTriggers = document.querySelectorAll("[data-service]");
const serviceSelect = form ? form.querySelector("select[name='service']") : null;

const consentKey = "analytics-consent";
const attributionKey = "lead-attribution";

document.getElementById("current-year").textContent = String(new Date().getFullYear());

storeAttribution();
setupRevealAnimation();
setupForm();
setupAnalyticsConsent();
setupHeaderState();
setupServiceShortcuts();

async function setupForm() {
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setFormStatus("", "");

    const formData = new FormData(form);
    const attribution = readAttribution();
    const payload = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      service: formData.get("service"),
      comment: formData.get("comment"),
      sourceUrl: window.location.href,
      referrer: document.referrer,
      ...attribution
    };

    const submitButton = form.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.textContent = "Отправка...";

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Не удалось отправить заявку.");
      }

      setFormStatus("success", data.message);
      form.reset();
      trackGoal("lead_submitted");
    } catch (error) {
      setFormStatus("error", error.message || "Произошла ошибка.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Отправить заявку";
    }
  });
}

function setFormStatus(state, message) {
  formStatus.dataset.state = state;
  formStatus.textContent = message;
}

function setupServiceShortcuts() {
  if (!form || !serviceSelect || serviceTriggers.length === 0) {
    return;
  }

  serviceTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      serviceSelect.value = trigger.dataset.service || "";
      form.classList.add("is-highlighted");
      form.scrollIntoView({ behavior: "smooth", block: "center" });

      const phoneField = form.querySelector("input[name='phone']");
      window.setTimeout(() => {
        phoneField.focus();
      }, 320);

      window.setTimeout(() => {
        form.classList.remove("is-highlighted");
      }, 1800);
    });
  });
}

function storeAttribution() {
  const url = new URL(window.location.href);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  const payload = {};
  let hasValues = false;

  keys.forEach((key) => {
    const value = url.searchParams.get(key);
    if (value) {
      payload[camelizeUtmKey(key)] = value;
      hasValues = true;
    }
  });

  if (hasValues) {
    localStorage.setItem(attributionKey, JSON.stringify(payload));
  }
}

function readAttribution() {
  try {
    const raw = localStorage.getItem(attributionKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function camelizeUtmKey(value) {
  return value.replace(/_([a-z])/g, (_match, letter) => letter.toUpperCase());
}

function setupRevealAnimation() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupHeaderState() {
  if (!header) {
    return;
  }

  const syncHeader = () => {
    header.classList.toggle("is-condensed", window.scrollY > 24);
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
}

function setupAnalyticsConsent() {
  const hasConsent = localStorage.getItem(consentKey) === "accepted";

  if (hasConsent) {
    bootstrapAnalytics();
    return;
  }

  cookieBanner.hidden = false;
  cookieAcceptButton.addEventListener("click", async () => {
    localStorage.setItem(consentKey, "accepted");
    cookieBanner.hidden = true;
    await bootstrapAnalytics();
  });
}

async function bootstrapAnalytics() {
  try {
    const response = await fetch("/api/runtime-config");
    const data = await response.json();

    if (!data.ok) {
      return;
    }

    const { yandexMetrikaId, googleTagManagerId } = data.analytics;

    if (yandexMetrikaId) {
      loadYandexMetrika(yandexMetrikaId);
    }

    if (googleTagManagerId) {
      loadGoogleTagManager(googleTagManagerId);
    }
  } catch (_error) {
    // The landing should keep working even if analytics failed to initialize.
  }
}

function loadYandexMetrika(counterId) {
  if (window.__yandexMetrikaLoaded) {
    return;
  }

  window.__yandexMetrikaLoaded = true;
  window.dataLayer = window.dataLayer || [];

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

function loadGoogleTagManager(containerId) {
  if (window.__gtmLoaded) {
    return;
  }

  window.__gtmLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js"
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`;
  document.head.appendChild(script);
}

function trackGoal(goalName) {
  if (typeof window.ym === "function") {
    fetch("/api/runtime-config")
      .then((response) => response.json())
      .then((data) => {
        if (data.ok && data.analytics.yandexMetrikaId) {
          window.ym(data.analytics.yandexMetrikaId, "reachGoal", goalName);
        }
      })
      .catch(() => {});
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: goalName
    });
  }
}
