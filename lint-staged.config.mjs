export default {
  "*.{ts,tsx}": "tsc --noEmit --ignoreConfig",
  "*.ts": [
    "vp lint --config .oxlintrc.json --fix --deny-warnings",
    "dprint fmt --config dprint.json",
  ],
  "*.{tsx,cjs,mjs}": [
    "vp lint --config .oxlintrc.json --fix --deny-warnings",
    "vp fmt --config .oxfmtrc.json --write",
  ],
  "*.{json,jsonc,yaml,yml,md,mdx,css,scss,html,astro,toml}":
    "vp fmt --config .oxfmtrc.json --write",
};
