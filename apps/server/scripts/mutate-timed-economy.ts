import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const app = new URL("../", import.meta.url);
const directory = await mkdtemp(join(tmpdir(), "opencok-timed-economy-mutations-"));
const timedFile = new URL("../../../packages/rules/src/timed-activity.ts", import.meta.url)
  .pathname;
const mutations = [
  ["generation version", "activity.version !== expectedVersion", "false"],
  ["terminal state", "activity.status !== 0", "false"],
  ["finish deadline", 'action === "finish" && !due', "false"],
  ["fraction conservation", "remainder = numerator % denominator", "remainder = 0n"],
  ["capacity", "amount += room", "amount += produced"],
  ["checkpoint advance", "settledAt: now", "settledAt: account.settledAt"],
  ["rate boundary", "next !== undefined && next < now ? next : now", "now"],
] as const;
async function run(source: string) {
  const result = await Bun.build({
    entrypoints: [new URL("test/timed-economy.test.ts", app).pathname],
    outdir: directory,
    target: "bun",
    external: ["bun:test"],
    plugins: [
      {
        name: "timed-economy-mutation",
        setup(build) {
          build.onLoad({ filter: /rules\/src\/timed-activity\.ts$/ }, () => ({
            contents: source,
            loader: "ts",
          }));
        },
      },
    ],
  });
  if (!result.success) throw new Error("Timed economy mutation bundle failed");
  const child = Bun.spawn([process.execPath, "--no-env-file", "test", "timed-economy.test.js"], {
    cwd: directory,
    stdin: "ignore",
    stdout: "pipe",
    stderr: "pipe",
  });
  const [, , code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  return code;
}
try {
  const original = await readFile(timedFile, "utf8");
  if (await run(original)) throw new Error("Timed economy mutation baseline failed");
  for (const [name, from, to] of mutations) {
    if (original.split(from).length !== 2)
      throw new Error(`Timed economy mutation target changed: ${name}`);
    if ((await run(original.replace(from, to))) === 0)
      throw new Error(`Critical timed-economy mutation survived: ${name}`);
    console.log(`Killed: ${name}`);
  }
  console.log(`${mutations.length} critical timed-economy mutations killed`);
} finally {
  await rm(directory, { recursive: true, force: true });
}
