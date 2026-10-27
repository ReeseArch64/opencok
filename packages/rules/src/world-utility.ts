import { num, text, type Row } from "@opencok/contracts/rows";

export function nearestWorldFootprint(points: readonly Row[], target: number, size: number) {
  if (target <= 0) return 0;
  const free = new Set(
    points
      .filter(
        (row) =>
          num(row, "pointType") === 0 &&
          num(row, "gridType") === 2 &&
          num(row, "grid2Type") === 0 &&
          !text(row, "ownerId") &&
          !text(row, "ownerMarchUUid") &&
          num(row, "resInitValue") === 0,
      )
      .map((row) => num(row, "id")),
  );
  const targetX = (target - 1) % size,
    targetY = Math.floor((target - 1) / size);
  for (let ring = 1; ring < 8; ring++)
    for (let x = targetX - ring; x <= targetX + ring; x++)
      for (let y = targetY - ring; y <= targetY + ring; y++) {
        if (x > targetX - ring && x < targetX + ring && y > targetY - ring && y < targetY + ring)
          continue;
        if (x <= 0 || y <= 0 || x >= size || y >= size) continue;
        const point = 1 + x + y * size;
        if ([point, point - 1, point - size, point - size - 1].every((id) => free.has(id)))
          return point;
      }
  return 0;
}
