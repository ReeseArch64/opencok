import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = new URL("../../../", import.meta.url);
const directory = await mkdtemp(join(tmpdir(), "opencok-foundation-mutations-"));
const mutations = [
  [
    "stale owner fence",
    "packages/repositories/src/realm-authority.ts",
    'if (rows.length !== 1) throw new DependencyError("realm authority");',
    "",
  ],
  ["durable replay", "packages/repositories/src/mutation.ts", "if (receipt) {", "if (false) {"],
  [
    "receipt content binding",
    "packages/repositories/src/mutation.ts",
    "if (receipt.command !== command || !receipt.request.equals(request))",
    "if (false)",
  ],
  [
    "credit/debit sign",
    "packages/ledger/src/posting.ts",
    "return posting.after - posting.before;",
    "return posting.before - posting.after;",
  ],
] as const;
async function run(path?: string, source?: string) {
  const testPath = new URL("apps/server/integration/mutation-foundation.test.ts", root).pathname;
  const test = (await readFile(testPath, "utf8")).replace(
    '"../../../packages/drizzle/migrations/kingdom"',
    JSON.stringify(new URL("packages/drizzle/migrations/kingdom", root).href),
  );
  const result = await Bun.build({
    entrypoints: [testPath],
    outdir: directory,
    target: "bun",
    external: ["bun:test"],
    plugins: [
      {
        name: "foundation-mutation",
        setup(build) {
          build.onLoad({ filter: /integration\/mutation-foundation\.test\.ts$/ }, () => ({
            contents: test,
            loader: "ts",
          }));
          if (path)
            {build.onLoad({ filter: new RegExp(path.replaceAll(".", "\\.") + "$") }, () => ({
              contents: source!,
              loader: "ts",
            }));}
        },
      },
    ],
  });
  if (!result.success) {throw new Error("Foundation mutation bundle failed");}
  const child = Bun.spawn(
    [process.execPath, "--no-env-file", "test", "mutation-foundation.test.js"],
    { cwd: directory, stdout: "pipe", stderr: "pipe", stdin: "ignore" },
  );
  const [, , code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  return code;
}
try {
  if (await run()) {throw new Error("Foundation mutation baseline failed");}
  for (const [name, path, from, to] of mutations) {
    const source = await readFile(new URL(path, root), "utf8");
    if (source.split(from).length !== 2) {throw new Error(`Mutation target changed: ${name}`);}
    if ((await run(path, source.replace(from, to))) === 0)
      {throw new Error(`Critical mutation survived: ${name}`);}
    console.log(`Killed: ${name}`);
  }
} finally {
  await rm(directory, { recursive: true, force: true });
}
