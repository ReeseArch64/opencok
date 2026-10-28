import { readFile, rm } from "node:fs/promises";
import { createMutationWorkspace } from "../../../.github/testing/mutation-workspace.ts";

const app = new URL("../", import.meta.url);
const directory = await createMutationWorkspace("opencok-profile-mutations-");
const authFile = new URL("../../../packages/services/src/nickname-command.ts", import.meta.url)
    .pathname;
const mutations = [
    ["owner binding", "profile.uid !== owner", "false"],
    ["realm binding", "profile.serverId !== kingdomId", "false"],
    ["profile ban", "(profile.banFlag ?? 0) !== 0", "false"],
    ["ban deadline", "((profile.banTime as bigint) ?? 0n) > BigInt(now)", "false"],
] as const;
async function run(source: string)
{
    const result = await Bun.build({
        entrypoints: [new URL("test/nickname-mutation-command.test.ts", app).pathname],
        outdir: directory,
        target: "bun",
        external: ["bun:test"],
        plugins: [
            {
                name: "profile-mutation",
                setup(build)
                {
                    build.onLoad({ filter: /services\/src\/nickname-command\.ts$/ }, () => ({
                        contents: source,
                        loader: "ts",
                    }));
                },
            },
        ],
    });
    if (!result.success)
    {
        throw new Error("Profile mutation bundle failed");
    }
    const child = Bun.spawn(
        [process.execPath, "--no-env-file", "test", "nickname-mutation-command.test.js"],
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
    const original = await readFile(authFile, "utf8");
    if (await run(original))
    {
        throw new Error("Profile mutation baseline failed");
    }
    for (const [name, from, to] of mutations)
    {
        if (original.split(from).length !== 2)
        {
            throw new Error(`Profile mutation target changed: ${name}`);
        }
        if ((await run(original.replace(from, to))) === 0)
        {
            throw new Error(`Critical profile mutation survived: ${name}`);
        }
        console.log(`Killed: ${name}`);
    }
    console.log(`${mutations.length} critical profile mutations killed`);
}
finally
{
    await rm(directory, { recursive: true, force: true });
}
