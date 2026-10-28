interface Entry<T>
{
    key: T;
    hash: number;
}

interface Bucket<T>
{
    items: Entry<T>[];
    added: Entry<T>[];
    tree: boolean;
}

function hashCode(value: string): number
{
    let hash = 0;

    for (let index = 0; index < value.length; index++)
    {
        hash = (Math.imul(hash, 31) + value.charCodeAt(index)) | 0;
    }

    return (hash ^ (hash >>> 16)) & 0x7fffffff;
}

function entries<T>(bucket: Bucket<T>): Entry<T>[]
{
    return bucket.added.length ? bucket.added.slice().reverse().concat(bucket.items) : bucket.items;
}

function concurrentOrder<T>(keys: readonly T[], spread: (key: T) => number): T[]
{
    let buckets: (Bucket<T> | undefined)[] = Array(16);
    let count = 0;
    const seen = new Set<T>();
    function resize()
    {
        const capacity = buckets.length;
        const grown: (Bucket<T> | undefined)[] = Array(capacity * 2);

        for (let index = 0; index < capacity; index++)
        {
            const bucket = buckets[index];

            if (!bucket)
            {
                continue;
            }

            const nodes = entries(bucket);
            let suffix = nodes.length;

            if (!bucket.tree)
            {
                suffix = 0;

                for (let position = 1; position < nodes.length; position++)
                {
                    if (
                        (nodes[position]!.hash & capacity)
                            !== (nodes[position - 1]!.hash & capacity)
                    )
                    {
                        suffix = position;
                    }
                }
            }

            for (const side of [0, capacity])
            {
                const prefix = nodes.slice(0, suffix).filter((entry) =>
                    (entry.hash & capacity) === side
                );

                if (!bucket.tree)
                {
                    prefix.reverse();
                }

                const items = prefix.concat(
                    nodes.slice(suffix).filter((entry) => (entry.hash & capacity) === side),
                );

                if (items.length)
                {
                    grown[index + side] = {
                        items,
                        added: [],
                        tree: bucket.tree && items.length > 6,
                    };
                }
            }
        }

        buckets = grown;
    }

    for (const key of keys)
    {
        const duplicate = seen.has(key);
        const hash = spread(key);
        const index = hash & (buckets.length - 1);
        let bucket = buckets[index];
        const entry = { key, hash };

        if (!bucket)
        {
            buckets[index] = bucket = { items: [entry], added: [], tree: false };
        }
        else if (bucket.tree)
        {
            if (!duplicate)
            {
                bucket.added.push(entry);
            }
        }
        else
        {
            const traversed = duplicate
                ? bucket.items.findIndex((item) => item.key === key) + 1
                : bucket.items.length;

            if (!duplicate)
            {
                bucket.items.push(entry);
            }

            if (traversed >= 8)
            {
                if (buckets.length < 64)
                {
                    const target = buckets.length * 4;

                    while (buckets.length * 0.75 < target)
                    {
                        resize();
                    }
                }
                else
                {
                    bucket.tree = true;
                }
            }
        }

        if (duplicate)
        {
            continue;
        }

        seen.add(key);
        count++;

        while (count >= buckets.length * 0.75)
        {
            resize();
        }
    }

    return buckets.flatMap((bucket) => (bucket ? entries(bucket).map((entry) => entry.key) : []));
}

export function legacyObjectOrder(keys: readonly string[]): string[]
{
    return concurrentOrder(keys, hashCode);
}

export function legacyIntegerOrder(keys: readonly number[]): number[]
{
    if (
        keys.length > 4096
        || keys.some((key) => !Number.isInteger(key) || key < -2147483648 || key > 2147483647)
    )
    {
        throw new Error("Invalid legacy integer map keys");
    }

    return concurrentOrder(keys, (key) => (key ^ (key >>> 16)) & 0x7fffffff);
}
