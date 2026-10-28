import type { ArchitectureReport, ModuleRecord, Workspace } from "./contracts.ts";
import { ModuleImports } from "./module-imports.ts";
import { ModuleResolver } from "./module-resolver.ts";
import { DependencyGraph } from "./dependency-graph.ts";
import { isBuiltin } from "node:module";

export class ArchitectureAudit
{
    public inspect(
        files: ReadonlyMap<string, string>,
        workspaces: readonly Workspace[],
    ): ArchitectureReport
    {
        const resolver = new ModuleResolver(new Set(files.keys()), workspaces);
        const parser = new ModuleImports();
        const modules: ModuleRecord[] = [];
        const violations = new Set<string>();

        for (const [path, source] of files)
        {
            if (!/\.[cm]?[jt]sx?$/.test(path))
            {
                continue;
            }

            const owner = resolver.owner(path);

            if (!owner)
            {
                continue;
            }

            const imports = parser.read(source, path);
            const dependencies = new Set<string>();

            for (const entry of imports)
            {
                const specifier = entry.specifier;

                if (specifier === undefined)
                {
                    violations.add(`dynamic: ${path} (${entry.syntax})`);
                    continue;
                }

                const resolution = resolver.inspect(path, specifier);
                const target = resolution.targets[0];
                const targetOwner = target ? resolver.owner(target) : resolver.workspace(specifier);

                for (const missing of resolution.missing)
                {
                    violations.add(`missing-target: ${path} -> ${missing}`);
                }

                if (specifier.startsWith(".") || specifier.startsWith("@opencok/"))
                {
                    if (!target)
                    {
                        violations.add(`unresolved: ${path} -> ${specifier}`);
                    }
                }

                for (const target of resolution.targets)
                {
                    dependencies.add(target);

                    if (
                        path.startsWith("packages/") && path.includes("/src/")
                        && target.startsWith("apps/")
                    )
                    {
                        violations.add(`application: ${path} -> ${target}`);
                    }
                }
                if (!target && !specifier.startsWith(".") && !specifier.startsWith("@opencok/"))
                {
                    dependencies.add(`external:${specifier}`);
                }

                const dependency = targetOwner?.name
                    ?? (!specifier.startsWith(".") && !isBuiltin(specifier)
                        ? specifier.split("/").slice(0, specifier.startsWith("@") ? 2 : 1).join("/")
                        : undefined);

                if (dependency && dependency !== owner.name && !owner.dependencies.has(dependency))
                {
                    violations.add(`undeclared: ${path} -> ${dependency}`);
                }
            }

            modules.push({
                path,
                owner: owner.path,
                imports,
                dependencies: [...dependencies].sort(),
            });
        }

        const graph = new DependencyGraph(
            new Map(modules.map((module) => [module.path, module.dependencies])),
        );

        for (const edge of graph.cyclicEdges())
        {
            violations.add(`cycle: ${edge}`);
        }

        const consumers = new Map<string, string[]>();

        for (const module of modules)
        {
            for (const target of module.dependencies)
            {
                const paths = consumers.get(target) ?? [];
                paths.push(module.path);
                consumers.set(target, paths);
            }
        }

        const reverse = new DependencyGraph(consumers);

        for (const module of modules.filter((entry) => entry.owner === "packages/catalog-tools"))
        {
            for (const consumer of reverse.reachable(module.path))
            {
                if (
                    /^(apps|packages)\/[^/]+\/src\//.test(consumer)
                    && !consumer.startsWith("packages/catalog-tools/")
                )
                {
                    violations.add(`offline-tool: ${consumer} -> ${module.path}`);
                }
            }
        }

        const workspaceEdges = new Map<string, string[]>();

        for (const module of modules)
        {
            const dependencies = workspaceEdges.get(module.owner) ?? [];

            for (const target of module.dependencies)
            {
                const owner = resolver.owner(target)?.path;

                if (owner && owner !== module.owner && !dependencies.includes(owner))
                {
                    dependencies.push(owner);
                }
            }

            workspaceEdges.set(module.owner, dependencies);
        }

        for (const edge of new DependencyGraph(workspaceEdges).cyclicEdges())
        {
            violations.add(`workspace-cycle: ${edge}`);
        }

        for (const module of modules)
        {
            if (
                /^packages\/[^/]+\/src\/(domain|rules)\//.test(module.path)
                || module.path.startsWith("packages/rules/src/")
            )
            {
                for (const target of graph.reachable(module.path))
                {
                    if (this.infrastructure(target))
                    {
                        violations.add(`purity: ${module.path} -> ${target}`);
                    }
                }
            }
        }

        return {
            modules: modules.sort((a, b) => a.path.localeCompare(b.path)),
            violations: [...violations].sort(),
        };
    }

    private infrastructure(path: string): boolean
    {
        return path.startsWith("apps/")
            || /^packages\/(drizzle|mongoose|storage|connection|controllers)\//.test(path)
            || /^packages\/[^/]+\/src\/(repositories|storage|controllers)\//.test(path)
            || path === "packages/resources/src/catalogs.ts"
            || path === "packages/resources/src/catalog-definitions.ts"
            || /^external:(drizzle-orm|pg|mongodb|redis|effect|@effect|node:(fs|net|http|https|tls|child_process|worker_threads))($|[/:])/
                .test(path);
    }
}
