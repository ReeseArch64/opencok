import { num, text, type Row } from "@opencok/contracts/rows";

export function worldCityCandidates(point: number, size: number)
{
    if (!Number.isInteger(point) || point < 1 || point > size * size)
    {
        return [];
    }

    const x = (point - 1) % size,
        y = Math.floor((point - 1) / size);

    return [
        ...new Set([
            point,
            ...(x > 0 && y > 0 ? [point - 1, point - size, point - size - 1] : []),
            ...(x + 1 < size && y + 1 < size ? [point + 1, point + size, point + size + 1] : []),
        ]),
    ];
}

export function resolveWorldCityGeometry(
    point: number,
    size: number,
    owner: string,
    rows: readonly Row[],
    main = 1,
    ranges: readonly number[] = [8, 2],
)
{
    const x = (point - 1) % size,
        y = Math.floor((point - 1) / size),
        owned = rows.filter(
            (row) =>
                num(row, "worldId") === 0
                && text(row, "ownerId") === owner
                && [main, ...ranges].includes(num(row, "pointType")),
        );

    if (
        owned.filter((row) => num(row, "pointType") === main).length !== 1
        || !owned.some((row) => num(row, "id") === point && num(row, "pointType") === main)
    )
    {
        return undefined;
    }

    const matches = (ids: readonly number[], native: boolean) =>
        ids.every((id) =>
            rows.some(
                (row) =>
                    num(row, "id") === id
                    && num(row, "worldId") === 0
                    && num(row, "x") === (id - 1) % size
                    && num(row, "y") === Math.floor((id - 1) / size)
                    && (id === point
                        ? num(row, "pointType") === main && text(row, "ownerId") === owner
                        : ranges.includes(num(row, "pointType"))
                            && (text(row, "ownerId") === owner
                                || (native && !text(row, "ownerId") && num(row, "pointType") === 8))
                            && (native
                                || num(row, "pointType") === 2
                                || !text(row, "pointItem")
                                || text(row, "pointItem") === String(point))),
            )
        );
    const native = x > 0 && y > 0 ? [point - 1, point - size, point - size - 1, point] : [],
        legacy = x + 1 < size && y + 1 < size
            ? [point, point + 1, point + size, point + size + 1]
            : [];
    const nativeMatch = native.length > 0 && matches(native, true),
        legacyMatch = legacy.length > 0 && matches(legacy, false);

    if (nativeMatch && legacyMatch)
    {
        return undefined;
    }

    if (nativeMatch)
    {
        return { orientation: "native" as const, anchor: point, points: native };
    }

    if (owned.length === 4 && legacyMatch)
    {
        return { orientation: "legacy" as const, anchor: point + size + 1, points: legacy };
    }

    return undefined;
}
