import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = new URL("../../../", import.meta.url);
const directory = await mkdtemp(join(tmpdir(), "opencok-shops-mutations-"));
const mutations = [
  [
    "realm stock",
    "packages/repositories/src/shops.ts",
    "stock[0]!.purchased + BigInt(purchase.count)",
    "stock[0]!.purchased",
  ],
  [
    "currency debit",
    "packages/services/src/shops.ts",
    "profile[key] = before - debit;",
    "profile[key] = before;",
  ],
  [
    "cycle limit",
    "packages/rules/src/shops.ts",
    "(maximum && counters.total + count > maximum)",
    "false",
  ],
  [
    "trade consumption",
    "packages/services/src/inventory.ts",
    "planner.spendItems(cost.itemId, inventoryCount(cost.count));",
    "inventoryCount(cost.count);",
  ],
] as const;
async function run(path?: string, source?: string) {
  const testPath = new URL("apps/server/integration/shops.test.ts", root).pathname;
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
        name: "shops-mutation",
        setup(build) {
          build.onLoad({ filter: /integration\/shops\.test\.ts$/ }, () => ({
            contents: test,
            loader: "ts",
          }));
          if (path)
            build.onLoad({ filter: new RegExp(path.replaceAll(".", "\\.") + "$") }, () => ({
              contents: source!,
              loader: "ts",
            }));
        },
      },
    ],
  });
  if (!result.success) throw new Error("Shop mutation bundle failed");
  const child = Bun.spawn([process.execPath, "--no-env-file", "test", "shops.test.js"], {
    cwd: directory,
    stdout: "pipe",
    stderr: "pipe",
    stdin: "ignore",
  });
  const [, , code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  return code;
}
try {
  if (await run()) throw new Error("Shop mutation baseline failed");
  for (const [name, path, from, to] of mutations) {
    const source = await readFile(new URL(path, root), "utf8");
    if (source.split(from).length !== 2) throw new Error(`Mutation target changed: ${name}`);
    if ((await run(path, source.replace(from, to))) === 0)
      throw new Error(`Critical mutation survived: ${name}`);
    console.log(`Killed: ${name}`);
  }
} finally {
  await rm(directory, { recursive: true, force: true });
}
