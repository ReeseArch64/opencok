import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.spec.ts"],
    exclude: ["**/database.spec.ts"],
    coverage: {
      provider: "v8",
      reportsDirectory: "coverage/vitest",
      reporter: ["text", "lcov", "json-summary"],
      include: [
        "src/factories/kingdom-database.ts",
        "src/validators/world-cell.ts",
        "src/validators/repository.ts",
        "src/cache/codecs.ts",
        "src/models/kingdom/world-layout.ts",
        "src/schemas/kingdom/world-layout.ts",
      ],
    },
  },
});
