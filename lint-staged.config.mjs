export default {
  "*.ts": [
    "vp lint --config .oxlintrc.json --fix --deny-warnings",
    "dprint fmt --config dprint.json",
  ],
  "*.{tsx,mts,cts,js,jsx,mjs,cjs}": [
    "vp lint --config .oxlintrc.json --fix --deny-warnings",
    "vp fmt --config .oxfmtrc.json --write",
  ],
  "*.{json,jsonc,json5,yaml,yml,md,mdx,css,scss,less,html,vue,svelte,astro,toml,graphql,gql}":
    "vp fmt --config .oxfmtrc.json --write",
};
