import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";

export default defineConfig({
  root: fileURLToPath(new URL("./node_modules/.cache/www-astro/", import.meta.url)),
  srcDir: fileURLToPath(new URL("./src/", import.meta.url)),
  outDir: fileURLToPath(new URL("./dist/", import.meta.url)),
  publicDir: fileURLToPath(new URL("./node_modules/.cache/www-public/", import.meta.url)),
  cacheDir: fileURLToPath(new URL("./node_modules/.cache/astro/", import.meta.url)),
  output: "static",
  trailingSlash: "always",
  server: { port: 4321 },
});
