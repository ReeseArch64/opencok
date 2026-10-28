export class DependencyGraph
{
    public constructor(private readonly edges: ReadonlyMap<string, readonly string[]>)
    {}

    public cyclicEdges(): string[]
    {
        const indices = new Map<string, number>();
        const low = new Map<string, number>();
        const active = new Set<string>();
        const stack: string[] = [];
        const components: Set<string>[] = [];
        const visit = (node: string): void => {
            indices.set(node, indices.size);
            low.set(node, indices.get(node)!);
            active.add(node);
            stack.push(node);

            for (const next of this.edges.get(node) ?? [])
            {
                if (!indices.has(next))
                {
                    visit(next);
                    low.set(node, Math.min(low.get(node)!, low.get(next)!));
                }
                else if (active.has(next))
                {
                    low.set(node, Math.min(low.get(node)!, indices.get(next)!));
                }
            }

            if (indices.get(node) === low.get(node))
            {
                const component = new Set<string>();
                let current: string;

                do
                {
                    current = stack.pop()!;
                    active.delete(current);
                    component.add(current);
                }
                while (current !== node);

                components.push(component);
            }
        };

        for (const node of this.edges.keys())
        {
            if (!indices.has(node))
            {
                visit(node);
            }
        }

        return components.flatMap((component) =>
            [...component].flatMap((from) =>
                (this.edges.get(from) ?? []).filter((to) => component.has(to)).map((to) =>
                    `${from} -> ${to}`
                )
            )
        ).sort();
    }

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
