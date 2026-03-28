import { getStoredAccessToken } from "./session";

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
}

export function buildApiUrl(path: string) {
  const baseUrl = getApiBaseUrl().replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

export function buildJsonHeaders(includeAuth = false) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  if (includeAuth) {
    const token = getStoredAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}
