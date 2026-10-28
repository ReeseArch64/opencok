import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = new URL("../../../", import.meta.url);
const directory = await mkdtemp(join(tmpdir(), "opencok-inventory-mutations-"));
const mutations = [
    [
        "gold debit",
        "packages/services/src/inventory.ts",
        "const cost = balance < remaining ? balance : remaining;",
        "const cost = 0n;",
    ],
    [
        "material conservation",
        "packages/services/src/inventory.ts",
        "item.count -= count;",
        "item.count -= 0;",
    ],
    [
        "expiration",
        "packages/services/src/inventory.ts",
        "return item.vanishTime === 0n || item.vanishTime >= BigInt(this.now);",
        "return true;",
    ],
    ["durable replay", "packages/repositories/src/mutation.ts", "if (receipt) {", "if (false) {"],
] as const;
async function run(path?: string, source?: string)
{
    const testPath = new URL("apps/server/integration/inventory.test.ts", root).pathname;
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
                name: "inventory-mutation",
                setup(build)
                {
                    build.onLoad({ filter: /integration\/inventory\.test\.ts$/ }, () => ({
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
        throw new Error("Inventory mutation bundle failed");
    }
    const child = Bun.spawn([process.execPath, "--no-env-file", "test", "inventory.test.js"], {
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
        throw new Error("Inventory mutation baseline failed");
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
