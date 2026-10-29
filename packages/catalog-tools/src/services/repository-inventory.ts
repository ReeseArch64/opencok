import { execFileSync } from "node:child_process";
import { lstatSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ModuleRecord, Workspace } from "../contracts/source-ownership";
import { FileClassification } from "./file-classification";
import { InventoryRelations } from "./inventory-relations";
import { ModuleImports } from "./module-imports";
import { ModuleResolver } from "./module-resolver";
import { SourceFacts } from "./source-facts";

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
            ".",
            ":(exclude)data/**",
            ":(exclude,glob)**/.env*",
            ":(exclude).env*",
        ], { cwd: this.root, encoding: "utf8" });
        const paths = [...new Set(tracked.split("\0").filter(Boolean))].sort().filter((path) =>
            this.isMaintainedFile(path)
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
        const sources = new Map(
            paths.filter((path) => /\.[cm]?[jt]sx?$/.test(path)).map((
                path,
            ) => [path, readFileSync(resolve(this.root, path), "utf8")]),
        );
        const resolver = new ModuleResolver(new Set(paths), workspaces);
        const parser = new ModuleImports();
        const facts = new SourceFacts();
        const modules: ModuleRecord[] = [...sources].map(([path, source]) => {
            const imports = parser.read(source, path);

            return {
                path,
                owner: resolver.owner(path)?.path ?? "repository",
                imports,
                dependencies: [
                    ...new Set(imports.flatMap((entry) =>
                        entry.specifier === undefined
                            ? []
                            : resolver.inspect(path, entry.specifier).targets
                    )),
                ].sort(),
            };
        });
        const relations = new InventoryRelations(modules);
        const classification = new FileClassification();

        return {
            schemaVersion: 1,
            revision: execFileSync("git", ["rev-parse", "HEAD"], {
                cwd: this.root,
                encoding: "utf8",
            }).trim(),
            workspaces: workspaces.map((workspace) => ({
                ...workspace,
                dependencies: [...workspace.dependencies].sort(),
            })),
            files: paths.map((path) => {
                const source = sources.get(path);

                return {
                    path,
                    currentOwner: resolver.owner(path)?.path ?? "repository",
                    role: classification.role(path),
                    sourceLines: source === undefined ? null : source.split("\n").length
                        - (source.endsWith("\n") ? 1 : 0) - (source === "" ? 1 : 0),
                    ...relations.consumers(path),
                    sourceEvidence: source === undefined ? [] : facts.read(source, path),
                    proposedOwner: null,
                    migrationStatus: "unreviewed",
                };
            }),
            modules,
            unresolvedImports: modules.flatMap((module) =>
                module.imports.filter((entry) =>
                    entry.specifier === undefined || ((entry.specifier.startsWith(".")
                        || entry.specifier.startsWith("@opencok/"))
                        && (resolver.inspect(module.path, entry.specifier).targets.length === 0
                            || resolver.inspect(module.path, entry.specifier).missing.length > 0))
                ).map((entry) => ({ path: module.path, ...entry }))
            ),
        };
    }

    private isMaintainedFile(path: string): boolean
    {
        const segments = path.split("/");

        for (let index = 0; index < segments.length; index++)
        {
            const entry = lstatSync(resolve(this.root, ...segments.slice(0, index + 1)), {
                throwIfNoEntry: false,
            });

            if (!entry || entry.isSymbolicLink())
            {
                return false;
            }

            if (index === segments.length - 1)
            {
                return entry.isFile();
            }

            if (!entry.isDirectory())
            {
                return false;
            }
        }

        return false;
    }
}
