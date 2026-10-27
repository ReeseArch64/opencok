import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const app = new URL("../", import.meta.url),
  directory = await mkdtemp(join(tmpdir(), "opencok-city-mutations-"));
const mutations = [
  ["integer lower bound", "rules", "result < minimum", "false"],
  ["integer upper bound", "rules", "result > maximum", "false"],
  ["currency overflow", "rules", "result > 9223372036854775807n", "false"],
  ["minimum duration", "rules", "    3000,", "    0,"],
  ["paid refund bound", "services", "cityAmount(value) / 2n", "cityAmount(value)"],
] as const;
async function run(changed?: string, source?: string) {
  const result = await Bun.build({
    entrypoints: [new URL("test/city-progression.test.ts", app).pathname],
    outdir: directory,
    target: "bun",
    external: ["bun:test"],
    plugins: [
      {
        name: "city-mutation",
        setup(build) {
          if (changed)
            {build.onLoad({ filter: new RegExp(`${changed}/src/city-progression\\.ts$`) }, () => ({
              contents: source!,
              loader: "ts",
            }));}
        },
      },
    ],
  });
  if (!result.success) {throw new Error("City mutation bundle failed");}
  const child = Bun.spawn([process.execPath, "--no-env-file", "test", "city-progression.test.js"], {
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
  if (await run()) {throw new Error("City mutation baseline failed");}
  for (const [name, module, from, to] of mutations) {
    const source = await readFile(
      new URL(`../../../packages/${module}/src/city-progression.ts`, import.meta.url),
      "utf8",
    );
    if (source.split(from).length !== 2) {throw new Error(`City mutation target changed: ${name}`);}
    if ((await run(module, source.replace(from, to))) === 0)
      {throw new Error(`Critical city mutation survived: ${name}`);}
    console.log(`Killed: ${name}`);
  }
} finally {
  await rm(directory, { recursive: true, force: true });
}
