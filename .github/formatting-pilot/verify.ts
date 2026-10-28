import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { syntax } from "./syntax";

const pilot = dirname(fileURLToPath(import.meta.url));
const root = resolve(pilot, "../..");
const output = mkdtempSync(join(tmpdir(), "opencok-formatting-pilot-"));
const dprint = join(pilot, "node_modules/.bin/dprint");
const oxfmt = join(root, "node_modules/.bin/oxfmt");
const oxlint = join(root, "node_modules/.bin/oxlint");
const config = join(pilot, "dprint.pilot.json");

function run(command: string[], input?: string): string {
  const result = Bun.spawnSync(command, {
    cwd: root,
    stdin: input === undefined ? undefined : Buffer.from(input),
    stdout: "pipe",
    stderr: "pipe",
  });

  assert.equal(result.exitCode, 0, result.stderr.toString() + result.stdout.toString());

  return result.stdout.toString();
}

function format(source: string, name: string): string {
  return run([dprint, "fmt", "--config", config, "--stdin", name], source);
}

const files = [
  "packages/identity/src/mobile.ts",
  "packages/storage/src/discovery-redis.ts",
  "packages/services/src/game.service.ts",
];
const baseline = JSON.parse(readFileSync(join(root, ".oxfmtrc.json"), "utf8"));
const comparisonConfig = join(output, "oxfmt-four-spaces.json");

writeFileSync(comparisonConfig, JSON.stringify({ ...baseline, tabWidth: 4 }));

for (const [index, file] of files.entries()) {
  const source = run(["git", "show", `ab051aaa224676e62f0cb6fea1589406b6c33541:${file}`]);
  const formatted = format(source, file);
  const oxfmtResult = run([oxfmt, "--config", comparisonConfig, "--stdin-filepath", file], source);

  assert.equal(format(formatted, file), formatted, `Non-idempotent dprint: ${file}`);
  assert.equal(
    run([oxfmt, "--config", comparisonConfig, "--stdin-filepath", file], oxfmtResult),
    oxfmtResult,
  );
  assert.deepEqual(syntax(formatted, file), syntax(source, file), `AST mismatch: ${file}`);
  assert.deepEqual(syntax(oxfmtResult, file), syntax(source, file), `Oxfmt AST mismatch: ${file}`);
  writeFileSync(join(output, `${index}-before.txt`), source);
  writeFileSync(join(output, `${index}-dprint.txt`), formatted);
  writeFileSync(join(output, `${index}-oxfmt.txt`), oxfmtResult);
  console.log(
    JSON.stringify({
      file,
      beforeLines: source.split("\n").length - 1,
      dprintLines: formatted.split("\n").length - 1,
      oxfmtLines: oxfmtResult.split("\n").length - 1,
      sourceSha256: createHash("sha256").update(source).digest("hex"),
      dprintSha256: createHash("sha256").update(formatted).digest("hex"),
    }),
  );
}

const fixtures = [
  `function value() { return { answer: 42 }; } const arrow = () => ({ answer: 42 }); return [value(), arrow()];`,
  `function value() { return\n{ answer: 42 }; } return value();`,
  `let result = ""; if (true) if (false) result = "inner"; else result = "outer"; return result;`,
  `let result = 0; for (let i = 0; i < 2; i++) result++; for (const n of [1, 2]) result += n; for (const k in { a: 1 }) result += k.length; while (result < 7) result++; do result++; while (result < 8); return result;`,
  "class Box<T> { constructor(readonly value: T) {} read(): T { return this.value; } } const values = [1, 2].map((n) => ({ n })); return [new Box(values).read(), `value=${values[0].n}`];",
  `let value = 1;\n\nvalue++;\n\nreturn value;`,
];

for (const [index, source] of fixtures.entries()) {
  const wrapped = `function fixture() { ${source} }`;
  const formatted = format(wrapped, "fixture.ts");

  assert.equal(format(formatted, "fixture.ts"), formatted);
  assert.deepEqual(syntax(formatted, "fixture.ts"), syntax(wrapped, "fixture.ts"));

  const evaluate = (text: string) =>
    new Function(
      new Bun.Transpiler({ loader: "ts" }).transformSync(text) + "\nreturn fixture();",
    )();

  assert.deepEqual(evaluate(formatted), evaluate(wrapped), `Runtime mismatch: fixture ${index}`);
}

const tsx = `type Props<T> = { value: T }; export const View = <T,>({ value }: Props<T>) => <section data-id="sample">{String(value)}</section>;`;
const formattedTsx = format(tsx, "fixture.tsx");

assert.deepEqual(syntax(formattedTsx, "fixture.tsx"), syntax(tsx, "fixture.tsx"));
assert.equal(format(formattedTsx, "fixture.tsx"), formattedTsx);

const emitTsx = (source: string) =>
  ts.transpileModule(source, {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ESNext },
  }).outputText;

assert.deepEqual(syntax(emitTsx(formattedTsx), "emitted.js"), syntax(emitTsx(tsx), "emitted.js"));

const padding = format(
  "class Example {\nfirst() {}\n\nsecond() {}\n}\nfunction value() {\nconst result = 1;\n\nreturn result;\n}\n",
  "padding.ts",
);

assert.match(padding, /first\(\)[\s\S]*?\n\n    second/);
assert.match(padding, /const result = 1;\n\n    return result;/);
assert.doesNotMatch(padding, /\n\n\n/);

const curlyConfig = join(output, "oxlint-curly.json");
const curlyFile = join(output, "curly.ts");
const negative = `export function check(a: boolean, b: boolean) { if (\na &&\nb\n) return 1; else if (a) if (b) return 2; else return 3; for (const n of [1]) if (n) break; for (const k in {}) if (k) break; for (;;) break; while (a) break; do break; while (b); return 0; }`;

writeFileSync(curlyConfig, JSON.stringify({ rules: { curly: ["error", "all"] } }));
writeFileSync(curlyFile, negative);

const rejected = Bun.spawnSync([oxlint, "--config", curlyConfig, "--deny-warnings", curlyFile], {
  stdout: "pipe",
  stderr: "pipe",
});

assert.notEqual(rejected.exitCode, 0);
assert.match(rejected.stdout.toString(), /curly/);
writeFileSync(curlyFile, format(negative, "curly.ts"));
run([oxlint, "--config", curlyConfig, "--deny-warnings", "--fix", curlyFile]);
writeFileSync(curlyFile, format(readFileSync(curlyFile, "utf8"), "curly.ts"));
run([oxlint, "--config", curlyConfig, "--deny-warnings", curlyFile]);
assert.deepEqual(syntax(readFileSync(curlyFile, "utf8"), "curly.ts"), syntax(negative, "curly.ts"));
console.log(
  "PASS: AST equivalence, two-pass idempotence, ASI/runtime fixtures, TSX, preserved padding, curly negative/positive fixtures",
);
console.log(`Artifacts: ${output}`);
