import { num, long, type Row } from "@opencok/contracts/rows";
import type { Rules } from "./game";
import { cityInteger } from "./city-progression";
import { worldMutationFailure } from "./world-march-runtime";

export function cityFireSpeed(
  point: Row,
  bosses: readonly Row[],
  rules: Rules,
  effect: (id: number) => number,
) {
  const x = num(point, "x"),
    y = num(point, "y");
  let speed = 0;

  for (const boss of bosses)
    if (
      num(boss, "status") === 1 &&
      Math.abs(x - num(boss, "x")) <= Math.trunc(num(boss, "firerange") / 2) &&
      Math.abs(y - num(boss, "y")) <= Math.trunc(num(boss, "firerange") / 2)
    )
      speed = Math.max(speed, num(boss, "firespeed"));

  const distance = Math.max(Math.abs(x - 600), Math.abs(y - 600));
  const reduced = distance > 26 && distance <= 30;

  if (speed === 0)
    speed = cityInteger(
      rules.items.get("world_fire2")?.[num(point, "gridType") === 0 && !reduced ? "k3" : "k1"],
    );

  const base = Math.fround(Math.fround(speed / 60) / 60);
  const bonus = Math.fround(Math.fround(effect(122)) + Math.fround(effect(2189)));
  const result = Math.fround(Math.fround(base * Math.max(Math.fround(100 + bonus), 20)) / 100);

  if (!Number.isFinite(result) || result < 0) worldMutationFailure();

  return result;
}

export function settleCityFire(point: Row, now: bigint, speed: number) {
  const row = { ...point },
    start = long(row, "startOccupyTime"),
    end = long(row, "fireTime");

  if (start <= 0n || end <= 0n) {
    row.startOccupyTime = 0n;
    row.fireTime = 0n;

    return row;
  }

  if (start > now || end < start) worldMutationFailure();

  const until = end < now ? end : now;
  const loss = Math.max(
    0,
    Math.trunc(Math.fround(Math.fround(Number((until - start) / 1000n)) * speed)),
  );
  row.cityDefValue = Math.max(0, num(row, "cityDefValue") - loss);
  row.startOccupyTime = end <= now ? 0n : now;

  if (end <= now) row.fireTime = 0n;

  return row;
}
