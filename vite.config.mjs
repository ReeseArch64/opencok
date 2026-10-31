import { defineConfig } from "vite-plus";

export default defineConfig({
  run: { cache: { scripts: false, tasks: true } },
});
