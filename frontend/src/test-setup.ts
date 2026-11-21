import "@testing-library/jest-dom/vitest";
import { cleanup } from "@octanejs/testing-library";
import { afterEach, vi } from "vitest";
import { destroyTestRouters } from "./hooks/use-route";

// Auto-cleanup only registers with Vitest globals enabled, so do it explicitly.
afterEach(cleanup);
// Routers patch the browser history; end each test's so they do not pile up.
afterEach(destroyTestRouters);

// The real ALTCHA widget solves a proof of work with Web Workers and Web Crypto, which jsdom does
// not have. Tests that submit the Contact form define a stand-in for the element instead.
vi.mock("altcha", () => ({}));
