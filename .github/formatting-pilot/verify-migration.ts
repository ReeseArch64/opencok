import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { syntax } from "./syntax";

const root = resolve(import.meta.dir, "../..");
const base = process.argv[2];

assert.ok(base, "Usage: bun verify-migration.ts <baseline-commit>");

function git(args: string[]): string {
  const result = Bun.spawnSync(["git", ...args], { cwd: root, stdout: "pipe", stderr: "pipe" });

  assert.equal(result.exitCode, 0, result.stderr.toString());

  return result.stdout.toString();
}

const files = git(["diff", "--name-only", "--diff-filter=M", "-z", base, "--"])
  .split("\0")
  .filter((file) => /\.(?:[cm]?[jt]sx?)$/.test(file));

for (const file of files) {
  assert.ok(!/^(?:data\/|\.husky\/_\/|packages\/drizzle\/migrations\/)/.test(file), file);
  assert.ok(!/(?:^|\/)(?:node_modules|dist|coverage|__snapshots__)\//.test(file), file);
  assert.ok(!file.startsWith("packages/drizzle/tests/fixtures/"), file);

  const before = git(["show", `${base}:${file}`]);
  const after = readFileSync(resolve(root, file), "utf8");

  assert.deepEqual(syntax(after, file), syntax(before, file), `AST mismatch: ${file}`);
}

for (const [left, right] of [
  ["const value = 1;", "let value = 1;"],
  ["const value = -1;", "const value = +1;"],
  ["import type { A } from 'a';", "import { A } from 'a';"],
  ["const value = { a: 1, b: 2 };", "const value = { b: 2, a: 1 };"],
  ["function value() { return { a: 1 }; }", "function value() { return\n{ a: 1 }; }"],
]) {
  assert.notDeepEqual(syntax(left, "negative.ts"), syntax(right, "negative.ts"));
}

console.log(`PASS: ${files.length} modified source ASTs match ${base}; semantic negative controls pass`);
