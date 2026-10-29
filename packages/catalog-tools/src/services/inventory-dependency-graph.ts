export class DependencyGraph
{
    public constructor(private readonly edges: ReadonlyMap<string, readonly string[]>)
    {}

    public reachable(from: string): Set<string>
    {
        const reached = new Set<string>();
        const pending = [...(this.edges.get(from) ?? [])];

        while (pending.length)
        {
            const next = pending.pop()!;

            if (!reached.has(next))
            {
                reached.add(next);
                pending.push(...(this.edges.get(next) ?? []));
            }
        }

        return reached;
    }
}
