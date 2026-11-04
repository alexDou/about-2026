import "@testing-library/jest-dom/vitest";
import { cleanup } from "@octanejs/testing-library";
import { afterEach } from "vitest";

// Auto-cleanup only registers with Vitest globals enabled, so do it explicitly.
afterEach(cleanup);
