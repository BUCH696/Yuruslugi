const loginForm = document.querySelector("#login-form");
const statusNode = document.querySelector("#app-status");

initializeLogin().catch((error) => {
  showStatus(error.message || "Не удалось открыть страницу входа.", "error");
});

async function initializeLogin() {
  const response = await fetch("/api/admin/session", {
    credentials: "same-origin"
  });

  if (response.ok) {
    window.location.replace("/admin");
    return;
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
  showStatus("Проверяем учетные данные...", "info");

  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin",
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.error || "Не удалось выполнить вход.");
    }

    showStatus("Вход выполнен. Перенаправляем...", "success");
    window.setTimeout(() => {
      window.location.replace("/admin");
    }, 250);
  } catch (error) {
    showStatus(error.message || "Не удалось выполнить вход.", "error");
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
