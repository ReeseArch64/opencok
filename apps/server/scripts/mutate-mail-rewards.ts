import { readFile, rm } from "node:fs/promises";
import { createMutationWorkspace } from "../../../.github/testing/mutation-workspace.ts";

const root = new URL("../../../", import.meta.url);
const directory = await createMutationWorkspace("opencok-mail-rewards-mutations-");
const mutations = [
    [
        "durable mail identity",
        "packages/repositories/src/mail-rewards.ts",
        "return receipt;",
        "return undefined;",
    ],
    [
        "claimed flag",
        "packages/repositories/src/mail-rewards.ts",
        ".set({ status: 1, rewardStatus: 1 })",
        ".set({ status: 1, rewardStatus: 0 })",
    ],
    [
        "owner selection",
        "packages/repositories/src/mail-rewards.ts",
        "eq(mail.toUser, owner),\n                batch ?",
        "undefined,\n                batch ?",
    ],
    [
        "reward credit",
        "packages/services/src/mail-rewards.ts",
        "after = before + BigInt(amount);",
        "after = before;",
    ],
] as const;
async function run(path?: string, source?: string)
{
    const testPath = new URL("apps/server/integration/mail-rewards.test.ts", root).pathname;
    const test = (await readFile(testPath, "utf8")).replace(
        "\"../../../packages/drizzle/migrations/kingdom\"",
        JSON.stringify(new URL("packages/drizzle/migrations/kingdom", root).href),
    );
    const result = await Bun.build({
        entrypoints: [testPath],
        outdir: directory,
        target: "bun",
        external: ["bun:test"],
        plugins: [
            {
                name: "mail-rewards-mutation",
                setup(build)
                {
                    build.onLoad({ filter: /integration\/mail-rewards\.test\.ts$/ }, () => ({
                        contents: test,
                        loader: "ts",
                    }));
                    if (path)
                    {
                        build.onLoad(
                            { filter: new RegExp(path.replaceAll(".", "\\.") + "$") },
                            () => ({
                                contents: source!,
                                loader: "ts",
                            }),
                        );
                    }
                },
            },
        ],
    });
    if (!result.success)
    {
        throw new Error("Mail reward mutation bundle failed");
    }
    const child = Bun.spawn([process.execPath, "--no-env-file", "test", "mail-rewards.test.js"], {
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
try
{
    if (await run())
    {
        throw new Error("Mail reward mutation baseline failed");
    }
    for (const [name, path, from, to] of mutations)
    {
        const source = await readFile(new URL(path, root), "utf8");
        if (source.split(from).length !== 2)
        {
            throw new Error(`Mutation target changed: ${name}`);
        }
        if ((await run(path, source.replace(from, to))) === 0)
        {
            throw new Error(`Critical mutation survived: ${name}`);
        }
        console.log(`Killed: ${name}`);
    }
}
finally
{
    await rm(directory, { recursive: true, force: true });
}
