let token = localStorage.getItem("token");
export const setToken = t => { token = t; t ? localStorage.setItem("token", t) : localStorage.removeItem("token"); };
export async function api(path, body, method) {
  const m = method || (body ? "POST" : "GET");
  const r = await fetch("/api" + path, { method: m,
    headers: { "Content-Type": "application/json", ...(token && { Authorization: "Bearer " + token }) },
    body: body && JSON.stringify(body) });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || "Permintaan gagal.");
  return data;
}
