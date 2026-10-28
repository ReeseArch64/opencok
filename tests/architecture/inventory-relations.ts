import type { ModuleRecord } from "./contracts.ts";
import { DependencyGraph } from "./dependency-graph.ts";

export class InventoryRelations
{
    private readonly direct = new Map<string, string[]>();
    private readonly reverse: DependencyGraph;

    public constructor(modules: readonly ModuleRecord[])
    {
        for (const module of modules)
        {
            for (const dependency of module.dependencies)
            {
                const entries = this.direct.get(dependency) ?? [];
                entries.push(module.path);
                this.direct.set(dependency, entries);
            }
        }

        this.reverse = new DependencyGraph(this.direct);
    }

    public consumers(path: string)
    {
        const reachable = [...this.reverse.reachable(path), path];

        return {
            directDependents: [...(this.direct.get(path) ?? [])].sort(),
            applicationSourceConsumers: [
                ...new Set(
                    reachable.filter((consumer) => /^apps\/[^/]+\/src\//.test(consumer)).map((
                        consumer,
                    ) => consumer.split("/").slice(0, 2).join("/")),
                ),
            ].sort(),
            verificationCandidates: [
                ...new Set(
                    reachable.filter((consumer) => /\.(test|spec)\.[cm]?[jt]sx?$/.test(consumer)),
                ),
            ].sort(),
        };
    }
}
