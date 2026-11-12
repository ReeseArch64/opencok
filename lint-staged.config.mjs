export default {
  "*.{ts,tsx}": () => "tsc --project tsconfig.json --noEmit",
  "*.ts": ["oxlint --fix --deny-warnings", "dprint fmt --config dprint.json"],
  "*.{js,jsx,tsx,cjs,mjs}": ["oxlint --fix --deny-warnings", "oxfmt --write"],
  "*.{json,jsonc,yaml,yml,md,mdx,css,scss,html,astro,toml}": "oxfmt --write",
};
