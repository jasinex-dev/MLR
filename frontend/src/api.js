export async function api(path, options = {}) {
  const url = path.startsWith('/') ? path : `/api${path}`;
  const res = await fetch(url, { headers:{'Content-Type':'application/json'}, ...options });
  const text = await res.text();
  if (!res.ok) {
    try { const j = JSON.parse(text); throw new Error(j.error || text); }
    catch { throw new Error(text || `HTTP ${res.status}`); }
  }
  return text ? JSON.parse(text) : null;
}
