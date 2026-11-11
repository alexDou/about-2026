import { createScope } from "octane/signals";
import { fetchHealth } from "../../../services/api";
import { API_HEALTH } from "./config";
import type { ApiHealth } from "./types";

/**
 * The backend's health, shared by everything that shows it (the Landing badge, the offline notes):
 * one value in one signal, one request at a time. The site has one backend, so one state.
 */
const scope = createScope({ scopeKey: "api-health" });
const state$ = scope.signal$<ApiHealth>("state", API_HEALTH.checking);

/** The request in flight, if any. Only its answer counts. */
let pending: AbortController | undefined;
let pageLoadAsked = false;

/** What the last answer said; `checking` until the first one. */
export const health$ = scope.derived$("health", () => state$.get());

/** Takes the answer of `request`, unless a newer request has replaced it. */
function answer(request: AbortController, health: ApiHealth) {
  if (pending !== request) return;
  pending = undefined;
  state$.set(health);
}

/** Asks the backend now. A request still in flight is dropped; the last health stays until the answer. */
export function checkHealth() {
  pageLoadAsked = true;
  pending?.abort();
  const request = new AbortController();
  pending = request;
  fetchHealth(request.signal).then(
    () => answer(request, API_HEALTH.ok),
    () => answer(request, API_HEALTH.down),
  );
}

/** Asks the backend unless the page load has asked already. */
export function checkHealthOnce() {
  if (!pageLoadAsked) checkHealth();
}

/** Forgets everything, as at a page load (tests). */
export function resetHealth() {
  pending?.abort();
  pending = undefined;
  pageLoadAsked = false;
  state$.set(API_HEALTH.checking);
}
