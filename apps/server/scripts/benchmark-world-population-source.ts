import { createHash } from "node:crypto";
import { resolve } from "node:path";

export async function populationSource(output: string, snapshotRevision?: string)
{
    const root = new URL("../../../", import.meta.url).pathname;
    const paths = new Set<string>();
    for (
        const pattern of [
            "packages/*/src/**/*.ts",
            "packages/*/src/**/*.json",
            "apps/server/src/**/*.ts",
        ]
    )
    {
        for await (const path of new Bun.Glob(pattern).scan({ cwd: root, onlyFiles: true }))
        {
            paths.add(path);
        }
    }
    const hash = (value: string | Uint8Array) => createHash("sha256").update(value).digest("hex");
    const files = [];
    for (const path of [...paths].sort())
    {
        files.push({
            path,
            sha256: hash(new Uint8Array(await Bun.file(resolve(root, path)).arrayBuffer())),
        });
    }
    const workload = [
        "benchmark-world-population.ts",
        "benchmark-world-population-fixture.ts",
        "benchmark-world-population-scenario.ts",
        "benchmark-world-population-source.ts",
        "benchmark-world-locks.ts",
        "benchmark-scenario.ts",
        "benchmark-database.ts",
        "benchmark-distribution.ts",
    ].map((name) => `apps/server/scripts/${name}`);
    workload.push("apps/server/integration/support/city.ts");
    const workloadFiles = [];
    for (const path of workload)
    {
        workloadFiles.push({
            path,
            sha256: hash(new Uint8Array(await Bun.file(resolve(root, path)).arrayBuffer())),
        });
    }
    const adapter = "apps/server/scripts/benchmark-world-population-domain.ts";
    const adapterSha256 = hash(
        new Uint8Array(await Bun.file(resolve(root, adapter)).arrayBuffer()),
    );
    const revision = Bun.spawnSync(["git", "rev-parse", "HEAD"], { cwd: root });
    const status = Bun.spawnSync(["git", "status", "--porcelain"], { cwd: root });
    const manifest = {
        revision: snapshotRevision
            ?? (revision.exitCode === 0 ? revision.stdout.toString().trim() : null),
        revisionSource: snapshotRevision ? "explicit-snapshot-revision" : "git",
        workingTreeDirty: status.exitCode === 0 ? status.stdout.length > 0 : null,
        runtimeSha256: hash(JSON.stringify(files)),
        workloadSha256: hash(JSON.stringify(workloadFiles)),
        adapterSha256,
        runtimeFiles: files,
        workloadFiles,
    };
    if (!manifest.revision)
    {
        throw new Error("A snapshot without Git metadata requires an explicit source revision");
    }
    const path = `${resolve(output)}.sources.json`;
    await Bun.write(path, `${JSON.stringify(manifest, null, 2)}\n`);
    return {
        revision: manifest.revision,
        revisionSource: manifest.revisionSource,
        workingTreeDirty: manifest.workingTreeDirty,
        runtimeSha256: manifest.runtimeSha256,
        workloadSha256: manifest.workloadSha256,
        adapterSha256,
        manifest: path,
    };
}
