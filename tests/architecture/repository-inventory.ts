import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import type { Workspace } from "./contracts.ts";
import { ArchitectureAudit } from "./architecture-audit.ts";
import { FileClassification } from "./file-classification.ts";
import { InventoryRelations } from "./inventory-relations.ts";
import { SourceFacts } from "./source-facts.ts";

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
        const relations = new InventoryRelations(report.modules);
        const classification = new FileClassification();
        const facts = new SourceFacts();

        return {
            revision: execFileSync("git", ["rev-parse", "HEAD"], {
                cwd: this.root,
                encoding: "utf8",
            }).trim(),
            workspaces: workspaces.map((workspace) => ({
                ...workspace,
                dependencies: [...workspace.dependencies].sort(),
            })),
            files: paths.map((path) => ({
                path,
                currentOwner: workspaces.find((workspace) => path.startsWith(`${workspace.path}/`))
                    ?.path ?? "repository",
                role: classification.role(path),
                sourceLines: /\.[cm]?[jt]sx?$/.test(path)
                    ? (files.get(path) ? files.get(path)!.split("\n").length : 0)
                        - (files.get(path)!.endsWith("\n") ? 1 : 0)
                    : null,
                ...relations.consumers(path),
                sourceEvidence: /\.[cm]?[jt]sx?$/.test(path)
                    ? facts.read(files.get(path)!, path)
                    : [],
                proposedOwner: null,
                migrationStatus: "unreviewed",
            })),
            ...report,
        };
    }
}
