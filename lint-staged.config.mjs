export default {
  "*.ts": ["oxlint --fix --deny-warnings", "dprint fmt --config dprint.json"],
  "*.{tsx,cjs,mjs}": ["oxlint --fix --deny-warnings", "oxfmt --write"],
  "*.{yml,md,mdx,css,scss,html,astro,toml}": "oxfmt --write",
};
