import { Draft, User, mapAdoption, mapOrder, mapSpecies, record } from "./model";
export class DataError extends Error {
  constructor(
    public status: number,
    message = "REQUEST_FAILED",
  ) {
    super(message);
  }
}
const tokenKey = "access_token";
let refreshing: Promise<boolean> | null = null;
export const session = {
  token: () => localStorage.getItem(tokenKey),
  save: (access: string, refresh?: string) => {
    localStorage.setItem(tokenKey, access);
    if (refresh) localStorage.setItem("refresh_token", refresh);
    window.dispatchEvent(new Event("auth-change"));
  },
  clear: () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem("refresh_token");
    window.dispatchEvent(new Event("auth-change"));
  },
};
async function refreshSession() {
  const token = localStorage.getItem("refresh_token");
  if (!token) return false;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: token }),
        signal: AbortSignal.timeout(15000),
      },
    );
    if (!response.ok) return false;
    const data = record(record(await response.json()).data);
    // Temporary compatibility with the current backend's misspelled field.
    const access = data.accessToken ?? data.accestToken;
    if (typeof access !== "string") return false;
    session.save(
      access,
      typeof data.refreshToken === "string" ? data.refreshToken : undefined,
    );
    return true;
  } catch {
    return false;
  }
}
export async function request(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<unknown> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new DataError(503, "API_NOT_CONFIGURED");
  const token = session.token();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let response: Response;
  try {
    response = await fetch(`${base}${path}`, {
      ...options,
      headers,
      signal: options.signal ?? AbortSignal.timeout(15000),
    });
  } catch {
    throw new DataError(503);
  }
  if (
    response.status === 401 &&
    retry &&
    !path.includes("/auth/login") &&
    !path.includes("/auth/register")
  ) {
    if (!refreshing)
      refreshing = refreshSession().finally(() => {
        refreshing = null;
      });
    if (await refreshing) return request(path, options, false);
    session.clear();
  }
  if (!response.ok) throw new DataError(response.status);
  if (response.status === 204) return null;
  const envelope = record(await response.json());
  if (envelope.success === false) throw new DataError(502);
  return envelope.data;
}
function array(value: unknown) {
  if (!Array.isArray(value)) throw new DataError(502, "INVALID_DATA");
  return value;
}
export const api = {
  async species() {

    return array(await request("/api/v1/trees/species")).map(mapSpecies);
  },
  async speciesById(id: string) {

    return mapSpecies(
      await request(`/api/v1/trees/species/${encodeURIComponent(id)}`),
    );
  },
  async user(): Promise<User | null> {

    if (!session.token()) return null;
    const u = record(await request("/api/v1/auth/me"));
    return {
      id: String(u.id),
      name: String(u.fullName || ""),
      email: String(u.email || ""),
    };
  },
  async login(email: string, password: string, fullName?: string) {
    const u = record(
      await request(`/api/v1/auth/${fullName ? "register" : "login"}`, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          ...(fullName ? { fullName } : {}),
        }),
      }),
    );
    if (typeof u.accessToken !== "string") throw new DataError(502);
    session.save(
      u.accessToken,
      typeof u.refreshToken === "string" ? u.refreshToken : undefined,
    );
    return this.user();
  },

  async orders() {

    return array(await request("/api/v1/orders")).map(mapOrder);
  },
  async order(id: string) {

    return mapOrder(await request(`/api/v1/orders/${encodeURIComponent(id)}`));
  },
  async createOrder(draft: Draft) {
    if (
      ![1, 3].includes(draft.duration) ||
      !draft.tag.trim() ||
      draft.tag.trim().length > 30
    )
      throw new DataError(422);

    return mapOrder(
      await request("/api/v1/orders", {
        method: "POST",
        body: JSON.stringify({
          speciesId: draft.speciesId,
          nameOnTag: draft.tag.trim(),
          durationYears: draft.duration,
        }),
      }),
    );
  },

  async cancel(id: string) {
    await request(`/api/v1/orders/${encodeURIComponent(id)}/cancel`, {
      method: "PATCH",
    });
    return this.order(id);
  },
  async payment(id: string) {
    return record(
      await request(`/api/v1/orders/${encodeURIComponent(id)}/payment`, {
        method: "POST",
      }),
    );
  },
  async adoptions() {

    return array(await request("/api/v1/adoptions")).map(mapAdoption);
  },
  async adoption(id: string) {

    return mapAdoption(
      await request(`/api/v1/adoptions/${encodeURIComponent(id)}`),
    );
  },
};
