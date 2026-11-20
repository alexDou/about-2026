import type { ErrorResponse } from "./types";

export class ApiError extends Error {
  readonly status: number;
  /** The `detail` of the error body, when the backend sent the contract's `{ detail }`. */
  readonly detail: string | undefined;

  constructor(status: number, message: string, detail?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

function isErrorResponse(body: unknown): body is ErrorResponse {
  return (
    typeof body === "object" && body !== null && typeof (body as ErrorResponse).detail === "string"
  );
}

async function apiError(response: Response, request: string): Promise<ApiError> {
  // A proxy or the platform may answer with HTML or nothing: then there is no detail to read.
  const body: unknown = await response.json().catch(() => undefined);
  const detail = isErrorResponse(body) ? body.detail : undefined;
  return new ApiError(response.status, `${request} -> ${response.status}`, detail);
}

/** Fetches JSON from the backend (`/api/*`, proxied to the Worker in dev). */
export async function getJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: { Accept: "application/json", ...init?.headers },
  });
  if (!response.ok) throw await apiError(response, `GET /api${path}`);
  return (await response.json()) as T;
}

/** Posts `body` as JSON to the backend. Resolves on any 2xx; throws `ApiError` otherwise. */
export async function postJson(path: string, body: unknown, init?: RequestInit): Promise<void> {
  const response = await fetch(`/api${path}`, {
    ...init,
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json", ...init?.headers },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw await apiError(response, `POST /api${path}`);
}
