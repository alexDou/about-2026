export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Fetches JSON from the backend (`/api/*`, proxied to FastAPI in dev). */
export async function getJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
  });
  if (!response.ok) throw new ApiError(response.status, `GET /api${path} -> ${response.status}`);
  return (await response.json()) as T;
}
