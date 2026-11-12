import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.spec.ts"],
    coverage: {
      provider: "v8",
      include: ["src/binary.ts", "src/world.ts"],
      reportsDirectory: "coverage/vitest",
      reporter: ["text", "html", "lcov"],
    },
  },
});
