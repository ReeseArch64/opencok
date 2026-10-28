import { createHash } from "node:crypto";
import { resolve } from "node:path";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

export interface BaselineMailIntegration
{
    revision: string;
    sources: Awaited<ReturnType<typeof mailBenchmarkSources>>;
    resolutions: { specifier: string; path: string; }[];
    runnerSha256: string;
    start(
        kingdom: DatabaseClient<"kingdom">,
        global: DatabaseClient<"global">,
        kingdomId: number,
        chatConfig: { url: string; signingSecret: string; },
    ): Promise<{ close(): Promise<void>; }>;
}

export async function mailBenchmarkSources(root: string)
{
    const files: { path: string; sha256: string; }[] = [];
    for (
        const pattern of [
            "bun.lock",
            "package.json",
            "apps/*/package.json",
            "packages/*/package.json",
            "apps/*/src/**/*.ts",
            "packages/*/src/**/*.ts",
            "apps/workers/scripts/**/*.ts",
            "apps/workers/integration/support/**/*.ts",
            "apps/server/scripts/benchmark-database.ts",
            "apps/server/scripts/benchmark-distribution.ts",
        ]
    )
    {
        for await (const path of new Bun.Glob(pattern).scan({ cwd: root, onlyFiles: true }))
        {
            files.push({
                path,
                sha256: createHash("sha256").update(
                    new Uint8Array(await Bun.file(resolve(root, path)).arrayBuffer()),
                ).digest("hex"),
            });
        }
    }
    files.sort((a, b) => a.path.localeCompare(b.path));

    return { sha256: createHash("sha256").update(JSON.stringify(files)).digest("hex"), files };
}
