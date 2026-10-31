import config from "./packages/config/tsconfig.base.json" with { type: "json" };

const compilerOptions = Object.entries({ ...config.compilerOptions, incremental: false })
  .flatMap(([name, value]) => [`--${name}`, Array.isArray(value) ? value.join(",") : String(value)])
  .join(" ");

export default {
  "*.{ts,tsx}": `tsc --ignoreConfig ${compilerOptions}`,
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
