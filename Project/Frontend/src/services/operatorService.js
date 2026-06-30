import { API_BASE_URL } from "../config/api";

// Helper: try a GET request and return json or throw
const tryGet = async (url) => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
};

const getOperatorById = async (id) => {
  if (!id) throw new Error("Missing operator id");

  // Backend endpoints to try (in order)
  const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";
  const urlsToTry = [];
  if (base) {
    urlsToTry.push(`${base}/operators/${id}`);
    urlsToTry.push(`${base}/users/${id}`);
    urlsToTry.push(`${base}/operators/me`);
  }

  for (const url of urlsToTry) {
    try {
      const data = await tryGet(url);
      if (data) return data;
    } catch (err) {
      // try next
    }
  }

  // Try static credentials served from public/ (dev mode)
  try {
    const creds = await tryGet("/Credentials.json");
    const list = creds?.operator || [];
    const found = list.find(
      (o) => o.id === id || o.userID === id || o.email === id,
    );
    if (found) {
      return {
        id: found.id,
        name:
          [found.firstName, found.lastName].filter(Boolean).join(" ") ||
          found.name ||
          found.userID,
        email: found.email,
        phone: found.phone,
        role: "Operator",
        location: found.location || "",
      };
    }
  } catch (err) {
    // ignore
  }

  throw new Error("Operator not found");
};

const getProfile = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return null;
  const possibleId = user.userID || user.id || user.email;
  if (!possibleId) return user; // return stored object if no id-like field
  try {
    return await getOperatorById(possibleId);
  } catch (err) {
    return user;
  }
};

const updateOperator = async (id, data) => {
  if (!id) throw new Error("Missing operator id");

  const base = API_BASE_URL ? API_BASE_URL.replace(/\/$/, "") : "";
  const url = base ? `${base}/operators/${id}` : null;
  if (url) {
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Failed to update operator (${res.status}): ${txt}`);
      }
      return res.json();
    } catch (err) {
      // fallback to localStorage
    }
  }

  // fallback: merge into localStorage so UI reflects changes
  const stored = JSON.parse(localStorage.getItem("user") || "null") || {};
  const merged = { ...stored, ...data, id };
  localStorage.setItem("user", JSON.stringify(merged));
  return merged;
};

export default {
  getOperatorById,
  getProfile,
  updateOperator,
};
