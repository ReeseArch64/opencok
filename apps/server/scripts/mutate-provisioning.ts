import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = new URL("../../../", import.meta.url);
const directory = await mkdtemp(join(tmpdir(), "opencok-provisioning-mutations-"));
const mutations = [
    [
        "durable creation receipt",
        "packages/repositories/src/character-provisioning.ts",
        "if (receipt) {",
        "if (false && receipt) {",
    ],
    [
        "reservation hash binding",
        "packages/repositories/src/character-provisioning.ts",
        "receipt.request.toString() !== requestHash",
        "false",
    ],
    [
        "realm epoch fence",
        "packages/repositories/src/character-provisioning.ts",
        "await fenceRealmTransaction(tx, authority);",
        "void authority;",
    ],
    ["starter gold", "packages/rules/src/character-seed.ts", "gold: 1000n,", "gold: 999n,"],
] as const;
async function run(path?: string, source?: string)
{
    const testPath = new URL("apps/server/integration/provisioning.test.ts", root).pathname;
    const test = (await readFile(testPath, "utf8"))
        .replaceAll(
            "\"../../../packages/drizzle/migrations/kingdom\"",
            JSON.stringify(new URL("packages/drizzle/migrations/kingdom", root).href),
        )
        .replaceAll(
            "\"../../../packages/drizzle/migrations/global\"",
            JSON.stringify(new URL("packages/drizzle/migrations/global", root).href),
        );
    const result = await Bun.build({
        entrypoints: [testPath],
        outdir: directory,
        target: "bun",
        external: ["bun:test"],
        plugins: [
            {
                name: "provisioning-mutation",
                setup(build)
                {
                    build.onLoad({ filter: /integration\/provisioning\.test\.ts$/ }, () => ({
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
        throw new Error("Provisioning mutation bundle failed");
    }
    const child = Bun.spawn([process.execPath, "--no-env-file", "test", "provisioning.test.js"], {
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
        throw new Error("Provisioning mutation baseline failed");
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
