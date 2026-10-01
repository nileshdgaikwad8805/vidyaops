const loginForm = document.querySelector("#admin-login-form");
const loginFeedback = document.querySelector("#admin-login-feedback");
const adminTokenKey = "vidyaops_admin_token";
const apiBase = String(window.VIDYAOPS_CONFIG?.apiBase || "").replace(/\/$/, "");
const apiUrl = (pathname) => (apiBase ? `${apiBase}${pathname}` : pathname);

async function redirectIfLoggedIn() {
  const token = window.localStorage.getItem(adminTokenKey);
  if (!token) {
    return;
  }

  try {
    const response = await fetch(apiUrl("/api/admin/session"), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      window.location.replace("/admin.html");
      return;
    }
  } catch (error) {
    // Ignore transient validation issues and allow normal login flow.
  }

  window.localStorage.removeItem(adminTokenKey);
}

redirectIfLoggedIn();

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "").trim();

    try {
      const response = await fetch(apiUrl("/api/admin/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to login.");
      }

      if (payload.token) {
        window.localStorage.setItem(adminTokenKey, payload.token);
      }

      window.location.href = "/admin.html";
    } catch (error) {
      if (loginFeedback) {
        loginFeedback.hidden = false;
        loginFeedback.textContent =
          error instanceof Error ? error.message : "Unable to login.";
      }
    }
  });
}
