import { readFile, rm } from "node:fs/promises";
import { createMutationWorkspace } from "../../../.github/testing/mutation-workspace.ts";

const app = new URL("../", import.meta.url);
const directory = await createMutationWorkspace("opencok-auth-mutations-");
const authFile = new URL("../../../packages/identity/src/mobile.ts", import.meta.url).pathname;
const mutations = [
    ["signature", "if (!equal(signature, expected))", "if (false)"],
    ["device binding", "if (!equal(deviceUuid, text(profile, \"deviceUuid\")))", "if (false)"],
    ["account activation", "num(a, \"active\") === 0", "true"],
    ["realm binding", "num(a, \"server\") === config.kingdomId", "true"],
    ["account device", "equal(text(a, \"uuid\"), deviceUuid)", "true"],
    ["profile ban", "num(profile, \"banFlag\") !== 0", "false"],
    ["profile ban deadline", "long(profile, \"banTime\") > BigInt(now)", "false"],
] as const;
async function run(source: string)
{
    const result = await Bun.build({
        entrypoints: [new URL("test/login.test.ts", app).pathname],
        outdir: directory,
        target: "bun",
        external: ["bun:test"],
        plugins: [
            {
                name: "auth-mutation",
                setup(build)
                {
                    build.onLoad({ filter: /identity\/src\/mobile\.ts$/ }, () => ({
                        contents: source,
                        loader: "ts",
                    }));
                },
            },
        ],
    });
    if (!result.success)
    {
        throw new Error("Auth mutation bundle failed");
    }
    const child = Bun.spawn([process.execPath, "--no-env-file", "test", "login.test.js"], {
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
    const original = await readFile(authFile, "utf8");
    if (await run(original))
    {
        throw new Error("Auth mutation baseline failed");
    }
    for (const [name, from, to] of mutations)
    {
        if (original.split(from).length !== 2)
        {
            throw new Error(`Auth mutation target changed: ${name}`);
        }
        if ((await run(original.replace(from, to))) === 0)
        {
            throw new Error(`Critical auth mutation survived: ${name}`);
        }
        console.log(`Killed: ${name}`);
    }
    console.log(`${mutations.length} critical auth mutations killed`);
}
finally
{
    await rm(directory, { recursive: true, force: true });
}
