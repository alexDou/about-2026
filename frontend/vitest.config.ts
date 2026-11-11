import { octane } from "@octanejs/vite-plugin";
import { defineConfig } from "vitest/config";

// Unit tests only. Vitest runs on Vite, which compiles with Oxc. The app itself is bundled by Rspack.
export default defineConfig({
  plugins: [octane()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "tools/**/*.test.ts"],
    css: { modules: { classNameStrategy: "non-scoped" } },
  },
});
