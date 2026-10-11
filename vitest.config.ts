import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";

// Minimal config: resolves the "@/..." alias used across src/ so lib modules
// import cleanly. Tests live in tests/ and run in the node environment (all
// covered code is server-side by design).
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
