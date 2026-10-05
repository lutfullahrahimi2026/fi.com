// Shared fetch helpers for talking to the site's Express/SQLite backend (server/).
window.api = (function () {
  async function handle(res) {
    let body = null;
    try {
      body = await res.json();
    } catch (err) {
      body = null;
    }
    if (!res.ok) {
      const message = (body && body.error) || `Request failed (${res.status})`;
      throw new Error(message);
    }
    return body;
  }

  function apiGet(path) {
    return fetch(path, { credentials: "same-origin" }).then(handle);
  }

  function apiPost(path, data) {
    return fetch(path, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data || {}),
    }).then(handle);
  }

  function apiPut(path, data) {
    return fetch(path, {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data || {}),
    }).then(handle);
  }

  function apiPatch(path, data) {
    return fetch(path, {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data || {}),
    }).then(handle);
  }

  function apiDelete(path) {
    return fetch(path, { method: "DELETE", credentials: "same-origin" }).then(handle);
  }

  function apiUpload(path, formData) {
    return fetch(path, { method: "POST", credentials: "same-origin", body: formData }).then(handle);
  }

  return { get: apiGet, post: apiPost, put: apiPut, patch: apiPatch, delete: apiDelete, upload: apiUpload };
})();
