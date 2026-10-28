export function distribution(values: readonly number[])
{
    const sorted = [...values].sort((left, right) => left - right);
    const percentile = (fraction: number) =>
        sorted.length ? sorted[Math.ceil(sorted.length * fraction) - 1]! : null;

    return {
        count: sorted.length,
        total: sorted.reduce((sum, value) => sum + value, 0),
        p50: percentile(0.5),
        p95: percentile(0.95),
        p99: percentile(0.99),
        max: sorted.at(-1) ?? null,
    };
}
