export function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
}
