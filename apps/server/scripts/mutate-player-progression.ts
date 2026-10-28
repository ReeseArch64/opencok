import { readFile, rm } from "node:fs/promises";
import { createMutationWorkspace } from "../../../.github/testing/mutation-workspace.ts";

const app = new URL("../", import.meta.url),
    directory = await createMutationWorkspace("opencok-player-progression-mutations-");
const mutations = [
    [
        "general talent ownership",
        "general-abilities",
        "rules",
        "general-talents",
        "skill.skill_group !== base.talent ||",
        "false ||",
    ],
    [
        "draw free allowance",
        "general-draws",
        "rules",
        "general-draws",
        "gold: BigInt(unit) * BigInt(paid)",
        "gold: BigInt(unit) * BigInt(count)",
    ],
    [
        "general battle eligibility",
        "general-combat",
        "services",
        "general-combat",
        "num(row, \"state\") !== 3",
        "false",
    ],
    [
        "talent budget",
        "player-effects",
        "rules",
        "player-effects",
        "if (used > maximum) invalid();\n  return cityInteger(maximum - used);",
        "return Math.max(0,maximum-used);",
    ],
    [
        "talent tree ownership",
        "player-effects",
        "rules",
        "player-effects",
        "if (!allowed.has(id)) invalid();",
        "if (false) invalid();",
    ],
    [
        "effect expiry",
        "player-effects",
        "rules",
        "power-effects",
        "long(row, \"endTime\") <= BigInt(now)",
        "false",
    ],
    [
        "recipe material family",
        "equipment",
        "rules",
        "equipment",
        "Math.trunc(Number(id) / 10) === Math.trunc(Number(base) / 10)",
        "true",
    ],
    [
        "equipped power",
        "equipment",
        "services",
        "equipment",
        "context.power(power(changed) - power([row, ...old]));",
        "context.power(0n);",
    ],
    [
        "claimed task terminal state",
        "quests",
        "rules",
        "quests",
        "if (row.state !== 0) return row;",
        "if (false) return row;",
    ],
] as const;
async function run(suite: string, module?: string, file?: string, source?: string)
{
    const built = await Bun.build({
        entrypoints: [new URL(`test/${suite}.test.ts`, app).pathname],
        outdir: directory,
        target: "bun",
        external: ["bun:test"],
        plugins: [
            {
                name: "player-progression-mutation",
                setup(build)
                {
                    if (module)
                    {
                        build.onLoad({ filter: new RegExp(`${module}/src/${file}\\.ts$`) }, () => ({
                            contents: source!,
                            loader: "ts",
                        }));
                    }
                },
            },
        ],
    });
    if (!built.success)
    {
        throw new Error("Player progression mutation bundle failed");
    }
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
try
{
    for (const suite of new Set(mutations.map((entry) => entry[1])))
    {
        if (await run(suite))
        {
            throw new Error(`Player progression mutation baseline failed: ${suite}`);
        }
    }
    for (const [name, suite, module, file, from, to] of mutations)
    {
        const source = await readFile(
            new URL(`../../../packages/${module}/src/${file}.ts`, import.meta.url),
            "utf8",
        );
        if (source.split(from).length !== 2)
        {
            throw new Error(`Player progression mutation target changed: ${name}`);
        }
        if ((await run(suite, module, file, source.replace(from, to))) === 0)
        {
            throw new Error(`Critical player progression mutation survived: ${name}`);
        }
        console.log(`Killed: ${name}`);
    }
}
finally
{
    await rm(directory, { recursive: true, force: true });
}
