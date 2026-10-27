import { num, text, type Row } from "@opencok/contracts/rows";
import type { Rules } from "./game";
import { cityInteger } from "./city-progression";
import { worldMutationFailure } from "./world-march-runtime";

export function treasureMapItem(colour: number) {
  return String(200041 + cityInteger(colour, 1, 5));
}

export function treasureMapRules(rules: Rules, level: number, colour: number) {
  const rows = [...(rules.world.heritage?.values() ?? [])].filter(
    (row) =>
      Number(row.colour) === colour &&
      Number(row.lvlmin) <= level &&
      Number(row.lvlmax) >= level &&
      row.roll !== undefined,
  );

  if (!rows.length) worldMutationFailure();

  return rows;
}

export function treasureMapCandidates(
  origin: number,
  size: number,
  minimum: number,
  maximum: number,
) {
  cityInteger(minimum, 0, 150);
  cityInteger(maximum, minimum, 150);
  const x = (origin - 1) % size,
    y = Math.floor((origin - 1) / size),
    points = new Set<number>();
  const clamp = (value: number) => Math.max(0, Math.min(size - 1, value));
  const black = (value: number) => value >= 574 && value <= 626;

  for (const [fromX, toX] of [
    [clamp(x - maximum), clamp(x - minimum)],
    [clamp(x + minimum), clamp(x + maximum)],
  ])
    for (let currentX = fromX!; currentX <= toX!; currentX++) {
      if (black(currentX)) continue;

      for (const [fromY, toY] of [
        [clamp(y - maximum), clamp(y - minimum)],
        [clamp(y + minimum), clamp(y + maximum)],
      ])
        for (let currentY = fromY!; currentY <= toY!; currentY++)
          if (!black(currentY)) points.add(1 + currentX + currentY * size);
    }

  return [...points];
}

export function treasureMapFallback(point: number, size: number, range: number) {
  cityInteger(range, 0, 32);
  const x = (point - 1) % size,
    y = Math.floor((point - 1) / size),
    points: number[] = [];

  for (
    let currentX = Math.max(0, x - range);
    currentX <= Math.min(size - 1, x + range);
    currentX++
  ) {
    if (currentX >= 574 && currentX <= 626) continue;

    for (
      let currentY = Math.max(0, y - range);
      currentY <= Math.min(size - 1, y + range);
      currentY++
    ) {
      const id = 1 + currentX + currentY * size;

      if ((currentY >= 574 && currentY <= 626) || id === point) continue;

      points.push(id);
    }
  }

  return points;
}

export function treasureMapFree(point: Row | undefined) {
  return (
    point !== undefined &&
    num(point, "worldId") === 0 &&
    num(point, "pointType") === 0 &&
    num(point, "gridType") === 2 &&
    num(point, "grid2Type") === 0 &&
    !text(point, "ownerId") &&
    !text(point, "ownerMarchUUid") &&
    num(point, "resInitValue") === 0 &&
    !text(point, "trap") &&
    num(point, "reserve") === 0 &&
    !text(point, "territoryAlliance")
  );
}
