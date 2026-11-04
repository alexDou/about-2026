import { octane } from "@octanejs/vite-plugin";
import { defineConfig } from "vitest/config";

// Unit tests only. Vitest runs on Vite, which compiles with Oxc. The app itself is bundled by Rspack.
export default defineConfig({
  plugins: [octane()],
  css: { modules: { localsConvention: "camelCaseOnly" } },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: { modules: { classNameStrategy: "non-scoped" } },
  },
});
