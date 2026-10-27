import type { Rules } from "./game";
import { cityInteger } from "./city-progression";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

export function worldMutationFailure(): never {
  throw new GameError(errors.invalid, "world_state");
}
export function worldFootprint(point: number, size: number, four = true): number[] {
  cityInteger(point, 1, size * size);
  const x = (point - 1) % size,
    y = Math.floor((point - 1) / size);
  if (!four) return [point];
  if (x + 1 >= size || y + 1 >= size) worldMutationFailure();
  return [point, point + 1, point + size, point + size + 1];
}
export interface MarchRouteSegment {
  sp: number;
  dp: number;
  mt: number;
}
export function ordinaryMarchRoute(
  rules: Rules,
  size: number,
  source: number,
  target: number,
  speed: number,
  effect: number,
  sourceFour = true,
  targetFour = false,
  blackEffect = 0,
) {
  const rule = rules.items.get("world_marchtime");
  if (
    !rule ||
    !Number.isFinite(speed) ||
    speed <= 0 ||
    !Number.isFinite(effect) ||
    !Number.isFinite(blackEffect)
  )
    worldMutationFailure();
  let distance = Infinity,
    fromPoint = source,
    toPoint = target;
  for (const from of worldFootprint(source, size, sourceFour))
    for (const to of worldFootprint(target, size, targetFour)) {
      const current = Math.hypot(
        ((from - 1) % size) - ((to - 1) % size),
        Math.floor((from - 1) / size) - Math.floor((to - 1) / size),
      );
      if (current > 0 && current < distance) {
        distance = current;
        fromPoint = from;
        toPoint = to;
      }
    }
  const from = [(fromPoint - 1) % size, Math.floor((fromPoint - 1) / size)] as const,
    to = [(toPoint - 1) % size, Math.floor((toPoint - 1) / size)] as const,
    center = Math.floor(size / 2);
  const axis = Math.abs(to[0] - from[0]) >= Math.abs(to[1] - from[1]) ? 0 : 1,
    other = axis === 0 ? 1 : 0,
    delta = to[axis] - from[axis],
    step = Math.sign(delta);
  const hits: [number, number][] = [];
  if (delta !== 0)
    for (let offset = 0; offset !== delta; offset += step) {
      const position: [number, number] = [...from];
      position[axis] += offset;
      position[other] = Math.trunc(
        Math.fround(
          Math.fround(Math.fround((from[other] - to[other]) / (from[axis] - to[axis])) * offset) +
            from[other],
        ),
      );
      if (Math.max(Math.abs(position[0] - center), Math.abs(position[1] - center)) !== 26) continue;
      if (!hits.length) hits.push(position);
      else if (Math.hypot(position[0] - hits[0]![0], position[1] - hits[0]![1]) > 1) {
        hits.push(position);
        break;
      }
    }
  const knots = [from, ...hits, to],
    segments: MarchRouteSegment[] = [];
  for (let index = 1; index < knots.length; index++) {
    const start = knots[index - 1]!,
      end = knots[index]!,
      length = Math.hypot(end[0] - start[0], end[1] - start[1]);
    if (length === 0) continue;
    const black =
      Math.abs((start[0] + end[0]) / 2 - center) <= 26 &&
      Math.abs((start[1] + end[1]) / 2 - center) <= 26;
    const bonus = Math.fround(
      Math.fround(100 + Math.fround(effect)) + (black ? Math.fround(blackEffect) : 0),
    );
    const seconds = Math.trunc(
      ((Math.pow(length, Math.fround(Number(rule.k1))) * cityInteger(rule.k2, 1)) /
        (Math.fround(speed) * Math.max(bonus / 100, 0.001))) *
        (black ? Number(rule.k5) : 1),
    );
    segments.push({
      sp: 1 + start[0] + start[1] * size,
      dp: 1 + end[0] + end[1] * size,
      mt: cityInteger(Math.max(0, seconds), 0, 2147483) * 1000,
    });
  }
  const total = segments.reduce((sum, row) => sum + row.mt, 0);
  return {
    duration: BigInt(cityInteger(Math.max(1, total), 1)),
    segments: hits.length ? segments : [],
  };
}
export function ordinaryMarchDuration(...args: Parameters<typeof ordinaryMarchRoute>): bigint {
  return ordinaryMarchRoute(...args).duration;
}
export function resourceGatherRate(
  rules: Rules,
  resource: number,
  castleLevel: number,
  effect: number,
) {
  const rule = rules.items.get("resources_speed"),
    castle = rules.building("400000", castleLevel);
  const base = Math.fround(Number(rule?.[`k${resource + 1}`]));
  const fixed =
    resource === 5 ? 0 : Number(castle.clientParameters?.[4]?.value.split(";")[resource] ?? 0);
  const value = Math.fround(
    Math.fround(base + Math.fround(fixed / 3600)) *
      Math.fround(Math.max(Math.fround(100 + effect), 20) / 100),
  );
  if (!Number.isFinite(value) || value <= 0) worldMutationFailure();
  return value;
}

export function accelerateMarchSegments(
  segments: readonly MarchRouteSegment[],
  start: bigint,
  now: bigint,
  percent: number,
) {
  cityInteger(percent, 1, 100);
  if (segments.length > 3 || now < 0n) worldMutationFailure();
  const fraction = Math.fround(1 - Math.fround(percent / 100));
  let cursor = start,
    active = false,
    remaining = 0n;
  const result = segments.map((segment) => {
    cityInteger(segment.sp, 1);
    cityInteger(segment.dp, 1);
    cityInteger(segment.mt);
    let time = segment.mt;
    if (now < cursor + BigInt(time)) {
      const left = active ? BigInt(time) : cursor + BigInt(time) - now;
      const spent = BigInt(time) - left;
      const shortened = BigInt(Math.trunc(Math.fround(Math.fround(Number(left)) * fraction)));
      time = cityInteger(spent + shortened);
      remaining += shortened;
      active = true;
    }
    cursor += BigInt(segment.mt);
    return { ...segment, mt: time };
  });
  if (!active) worldMutationFailure();
  return { segments: result, remaining };
}
