export function viewport(x: number, y: number, size: number): number[]
{
    const ids = new Set<number>();

    for (let column = x - 13; column < x + 13; column++)
    {
        const offset = column - x + 13;
        const first = offset < 10 ? y - 4 - offset : y - 23 + offset;
        const count = offset < 10 ? (offset + 1) * 2 : offset < 16 ? 20 : (26 - offset) * 2;

        for (let row = first; row < first + count; row++)
        {
            if (column >= 0 && row >= 0 && column < size && row < size)
            {
                ids.add(1 + column + row * size);
            }
        }
    }

    ids.add(1 + x + y * size);

    return [...ids];
}
