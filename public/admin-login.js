const loginForm = document.querySelector("#login-form");
const statusNode = document.querySelector("#app-status");
const authKicker = document.querySelector("#auth-kicker");
const authTitle = document.querySelector("#auth-title");
const authText = document.querySelector("#auth-text");
const authSubmit = document.querySelector("#auth-submit");

let requiresSetup = false;

initializeLogin().catch((error) => {
  showStatus(error.message || "Не удалось открыть страницу входа.", "error");
});

async function initializeLogin() {
  const sessionResponse = await fetch("/api/admin/session", {
    credentials: "same-origin"
  });

  if (sessionResponse.ok) {
    window.location.replace("/admin");
    return;
  }

  const bootstrapResponse = await fetch("/api/admin/bootstrap-status", {
    credentials: "same-origin"
  });
  const bootstrapData = await bootstrapResponse.json();
  requiresSetup = Boolean(bootstrapData?.requiresSetup);

  if (requiresSetup) {
    if (authKicker) {
      authKicker.textContent = "Первичная настройка";
    }
    if (authTitle) {
      authTitle.textContent = "Создайте первого администратора";
    }
    if (authText) {
      authText.textContent = "В проекте нет активных администраторов. Укажите логин и пароль, чтобы создать первую учетную запись и сразу открыть доступ к панели.";
    }
    if (authSubmit) {
      authSubmit.textContent = "Создать администратора";
    }
  }

  loginForm?.addEventListener("submit", handleLoginSubmit);
}

async function handleLoginSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');
  const formData = new FormData(form);
  const payload = {
    username: String(formData.get("username") || "").trim(),
    password: String(formData.get("password") || "")
  };

  submitButton.disabled = true;
  showStatus(
    requiresSetup ? "Создаем администратора..." : "Проверяем учетные данные...",
    "info"
  );

  try {
    const response = await fetch(
      requiresSetup ? "/api/admin/setup" : "/api/admin/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify(payload)
      }
    );
    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(
        data.error ||
          (requiresSetup
            ? "Не удалось создать администратора."
            : "Не удалось выполнить вход.")
      );
    }

    showStatus(
      requiresSetup
        ? "Администратор создан. Перенаправляем..."
        : "Вход выполнен. Перенаправляем...",
      "success"
    );
    window.setTimeout(() => {
      window.location.replace("/admin");
    }, 250);
  } catch (error) {
    showStatus(
      error.message ||
        (requiresSetup
          ? "Не удалось создать администратора."
          : "Не удалось выполнить вход."),
      "error"
    );
  } finally {
    submitButton.disabled = false;
  }
}

function showStatus(message, type) {
  if (!statusNode) {
    return;
  }

  statusNode.hidden = false;
  statusNode.dataset.type = type;
  statusNode.textContent = message;
}
