import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import type { Workspace } from "./contracts.ts";
import { ArchitectureAudit } from "./architecture-audit.ts";

export class RepositoryInventory
{
    public constructor(private readonly root: string)
    {}

    public read()
    {
        const tracked = execFileSync("git", [
            "ls-files",
            "-z",
            "--cached",
            "--others",
            "--exclude-standard",
            "--",
            "apps",
            "packages",
        ], { cwd: this.root, encoding: "utf8" });
        const paths = [...new Set(tracked.split("\0").filter(Boolean))].sort().filter((path) =>
            existsSync(resolve(this.root, path))
        );
        const workspaces: Workspace[] = paths.filter((path) =>
            /^(apps|packages)\/[^/]+\/package.json$/.test(path)
        ).map((path) => {
            const manifest = JSON.parse(readFileSync(resolve(this.root, path), "utf8"));

            return {
                path: path.slice(0, -"/package.json".length),
                name: manifest.name as string,
                exports: manifest.exports as unknown,
                dependencies: new Set<string>(
                    ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]
                        .flatMap((field) => Object.keys(manifest[field] ?? {})),
                ),
            };
        });
        const files = new Map(
            paths.map((
                path,
            ) => [
                path,
                /\.[cm]?[jt]sx?$/.test(path) ? readFileSync(resolve(this.root, path), "utf8") : "",
            ]),
        );
        const report = new ArchitectureAudit().inspect(files, workspaces);
        const dependents = new Map<string, string[]>();

        for (const module of report.modules)
        {
            for (const dependency of module.dependencies)
            {
                const entries = dependents.get(dependency) ?? [];
                entries.push(module.path);
                dependents.set(dependency, entries);
            }
        }

        return {
            workspaces: workspaces.map((workspace) => ({
                ...workspace,
                dependencies: [...workspace.dependencies].sort(),
            })),
            files: paths.map((path) => ({
                path,
                currentOwner: workspaces.find((workspace) => path.startsWith(`${workspace.path}/`))
                    ?.path,
                directDependents: (dependents.get(path) ?? []).sort(),
                proposedOwner: null,
                migrationStatus: "unreviewed",
            })),
            ...report,
        };
    }
}
