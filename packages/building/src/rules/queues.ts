export function buildingQueueType(itemId: number): number | undefined
{
    return (
        {
            403000: 6,
            411000: 3,
            416000: 2,
            423000: 1,
            424000: 8,
            425000: 9,
            426000: 10,
            429000: 11,
            436000: 16,
            439000: 17,
            440000: 18,
        } as Record<number, number>
    )[itemId];
}
