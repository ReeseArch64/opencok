import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const app = new URL("../", import.meta.url),
  directory = await mkdtemp(join(tmpdir(), "opencok-progression-domain-mutations-"));
const mutations = [
  [
    "science prerequisites",
    "research",
    "rules",
    "research",
    'throw new GameError(errors.researchPrerequisite, "research_prerequisite");',
    "void 0;",
  ],
  [
    "academy prerequisites",
    "research",
    "rules",
    "research",
    'throw new GameError(errors.researchPrerequisite, "research_building");',
    "void 0;",
  ],
  ["research resource discount", "research", "rules", "research", "effect(181) +", "0 +"],
  [
    "pinned research target",
    "research",
    "services",
    "research",
    'level !== num(row, "level") + 1',
    "false",
  ],
  [
    "research power",
    "research",
    "services",
    "research",
    "context.power(cityAmount(after.power ?? 0) - cityAmount(before.power ?? 0));",
    "context.power(0n);",
  ],
  [
    "troop overspending",
    "military",
    "rules",
    "military",
    'throw new GameError(errors.invalid, "troop_quantity");',
    "void 0;",
  ],
  [
    "future training quantity",
    "military",
    "rules",
    "military",
    'cityInteger(num(army ?? {}, "train"))',
    "0",
  ],
  [
    "training capacity",
    "military",
    "services",
    "training",
    'throw new GameError(errors.invalid, "training_capacity");',
    "void 0;",
  ],
  [
    "fortification capacity",
    "military",
    "services",
    "fortifications",
    'throw new GameError(errors.fortCapacity, "fortification_capacity");',
    "void 0;",
  ],
  [
    "healing cancellation",
    "military",
    "services",
    "hospital",
    "return { ...row, dead, heal: 0, finishTime: 0n };",
    "return { ...row, heal: 0, finishTime: 0n };",
  ],
  [
    "healing credit",
    "military",
    "services",
    "hospital",
    'transferTroops(count, num(army, "free"), count)',
    'transferTroops(count, num(army, "free"), 0)',
  ],
] as const;
async function run(suite: string, module?: string, file?: string, source?: string) {
  const built = await Bun.build({
    entrypoints: [new URL(`test/${suite}.test.ts`, app).pathname],
    outdir: directory,
    target: "bun",
    external: ["bun:test"],
    plugins: [
      {
        name: "progression-domain-mutation",
        setup(build) {
          if (module)
            build.onLoad({ filter: new RegExp(`${module}/src/${file}\\.ts$`) }, () => ({
              contents: source!,
              loader: "ts",
            }));
        },
      },
    ],
  });
  if (!built.success) throw new Error("Progression mutation bundle failed");
  const child = Bun.spawn([process.execPath, "--no-env-file", "test", `${suite}.test.js`], {
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
  for (const suite of new Set(mutations.map((entry) => entry[1])))
    if (await run(suite)) throw new Error(`Progression mutation baseline failed: ${suite}`);
  for (const [name, suite, module, file, from, to] of mutations) {
    const source = await readFile(
      new URL(`../../../packages/${module}/src/${file}.ts`, import.meta.url),
      "utf8",
    );
    if (source.split(from).length !== 2)
      throw new Error(`Progression mutation target changed: ${name}`);
    if ((await run(suite, module, file, source.replace(from, to))) === 0)
      throw new Error(`Critical progression mutation survived: ${name}`);
    console.log(`Killed: ${name}`);
  }
} finally {
  await rm(directory, { recursive: true, force: true });
}
