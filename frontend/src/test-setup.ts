import "@testing-library/jest-dom/vitest";
import { cleanup } from "@octanejs/testing-library";
import { afterEach } from "vitest";
import { destroyTestRouters } from "./hooks/useRoute";

// Auto-cleanup only registers with Vitest globals enabled, so do it explicitly.
afterEach(cleanup);
// Routers patch the browser history; end each test's so they do not pile up.
afterEach(destroyTestRouters);
