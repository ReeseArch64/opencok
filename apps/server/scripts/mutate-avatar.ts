import { readFile, rm } from "node:fs/promises";
import { createMutationWorkspace } from "../../../.github/testing/mutation-workspace.ts";

const app = new URL("../", import.meta.url);
const directory = await createMutationWorkspace("opencok-avatar-mutations-");
const ruleFile = new URL("../../../packages/rules/src/avatar-moderation.ts", import.meta.url)
    .pathname;
const mutations = [
    ["repeat rejection", "if (version >= 3000000)", "if (false)"],
    ["approval ban reset", "? { banTime: 0n, stat: 1 }", "? { banTime: 1n, stat: 1 }"],
    ["ban escalation", "BigInt(banCount) * interval", "interval"],
    [
        "signed counter overflow",
        "BigInt.asIntN(32, BigInt(savedCount) + 1n)",
        "BigInt(savedCount) + 1n",
    ],
] as const;
async function run(source: string)
{
    const result = await Bun.build({
        entrypoints: [new URL("test/avatar-lifecycle.test.ts", app).pathname],
        outdir: directory,
        target: "bun",
        external: ["bun:test"],
        plugins: [
            {
                name: "avatar-mutation",
                setup(build)
                {
                    build.onLoad({ filter: /rules\/src\/avatar-moderation\.ts$/ }, () => ({
                        contents: source,
                        loader: "ts",
                    }));
                },
            },
        ],
    });
    if (!result.success)
    {
        throw new Error("Avatar mutation bundle failed");
    }
    const child = Bun.spawn(
        [process.execPath, "--no-env-file", "test", "avatar-lifecycle.test.js"],
        {
            cwd: directory,
            stdin: "ignore",
            stdout: "pipe",
            stderr: "pipe",
        },
    );
    const [, , code] = await Promise.all([
        new Response(child.stdout).text(),
        new Response(child.stderr).text(),
        child.exited,
    ]);
    return code;
}
try
{
    const original = await readFile(ruleFile, "utf8");
    if (await run(original))
    {
        throw new Error("Avatar mutation baseline failed");
    }
    for (const [name, from, to] of mutations)
    {
        if (original.split(from).length !== 2)
        {
            throw new Error(`Avatar mutation target changed: ${name}`);
        }
        if ((await run(original.replace(from, to))) === 0)
        {
            throw new Error(`Critical avatar mutation survived: ${name}`);
        }
        console.log(`Killed: ${name}`);
    }
    console.log(`${mutations.length} critical avatar mutations killed`);
}
finally
{
    await rm(directory, { recursive: true, force: true });
}
