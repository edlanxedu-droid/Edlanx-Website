/* ============================================================
   Shared helpers for every admin/*.html page: auth guard,
   fetch wrapper, and logout wiring.
   ============================================================ */

async function adminApi(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "same-origin",
  });
  if (res.status === 401) {
    window.location.href = "/admin/login.html";
    throw new Error("Not authenticated");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

async function requireAdminAuth() {
  try {
    const me = await adminApi("/api/admin/me");
    const nameEl = document.getElementById("admin-username");
    if (nameEl) nameEl.textContent = me.username;
    return me;
  } catch {
    window.location.href = "/admin/login.html";
    throw new Error("redirecting");
  }
}

function wireLogout() {
  const btn = document.getElementById("admin-logout");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login.html";
  });
}

document.addEventListener("DOMContentLoaded", wireLogout);
