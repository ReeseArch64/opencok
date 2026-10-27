import type { WorldBirthRules, WorldBirthState } from "@opencok/contracts/world-birth";
import type { Rules } from "./game";
import { cityInteger } from "./city-progression";
import { worldMutationFailure } from "./world-march-runtime";

export function worldBirthRules(rules: Rules): WorldBirthRules {
  const priorities = Array.from({ length: 98 }, (_, index) => {
      const id = 43000 + index,
        raw = rules.world.residential?.get(String(id))?.area_id;

      if (!raw) {worldMutationFailure();}

      const areas = raw.split("|").map((value) => cityInteger(value, 1));

      if (areas.length > 16 || new Set(areas).size !== areas.length) {worldMutationFailure();}

      return { id, areas };
    }),
    limits: number[] = [],
    row = rules.items.get("worldmap_num");

  if (!row) {worldMutationFailure();}

  for (let index = 1; index <= 1024 && row[`k${index}`] !== undefined; index++)
    {limits.push(cityInteger(row[`k${index}`], 1));}

  if (!limits.length || limits.length >= 1024) {worldMutationFailure();}

  return { priorities, limits, side: cityInteger(rules.items.get("worldmap_city")?.k1, 1, 256) };
}

export function initialWorldBirth(rules: WorldBirthRules, epoch: bigint): WorldBirthState {
  return {
    schema: 1,
    version: 1,
    priority: 43000,
    round: 1,
    phase: 0,
    epoch: String(epoch),
    limit: rules.limits[0]!,
    counts: {},
  };
}

export function parseWorldBirth(raw: string): WorldBirthState {
  if (typeof raw !== "string" || Buffer.byteLength(raw) > 262144) {worldMutationFailure();}

  const state = JSON.parse(raw) as WorldBirthState;

  if (
    !state ||
    state.schema !== 1 ||
    ![0, 1, 2].includes(state.phase) ||
    typeof state.epoch !== "string" ||
    !/^([1-9][0-9]{0,18})$/.test(state.epoch) ||
    BigInt(state.epoch) > 9223372036854775807n ||
    !state.counts ||
    typeof state.counts !== "object" ||
    Array.isArray(state.counts) ||
    Object.keys(state.counts).length > 16384
  )
    {worldMutationFailure();}

  if (![state.version, state.priority, state.round, state.limit].every(Number.isInteger))
    {worldMutationFailure();}

  cityInteger(state.version, 1, 2147483646);
  cityInteger(state.priority, 43000, 43097);
  cityInteger(state.round, 1, 2147483646);
  cityInteger(state.limit, 1);

  for (const [area, count] of Object.entries(state.counts)) {
    if (!/^(0|[1-9][0-9]{0,9})$/.test(area)) {worldMutationFailure();}

    cityInteger(area);

    if (!Number.isInteger(count)) {worldMutationFailure();}

    cityInteger(count);
  }

  return {
    schema: 1,
    version: state.version,
    priority: state.priority,
    round: state.round,
    phase: state.phase,
    epoch: state.epoch,
    limit: state.limit,
    counts: { ...state.counts },
  };
}

export function advanceWorldBirth(state: WorldBirthState, rules: WorldBirthRules) {
  state.priority++;

  if (state.priority > 43097) {
    state.priority = 43000;
    state.round = cityInteger(state.round + 1, 1);
    const limit = rules.limits[state.round - 1];

    if (limit === undefined && state.phase === 0) {
      state.phase = 1;
      state.limit = 2147483647;
    } else if (limit !== undefined) {state.limit = limit;}
  }
}

export function recordWorldBirth(state: WorldBirthState, area: number) {
  cityInteger(area);
  state.counts[area] = cityInteger((state.counts[area] ?? 0) + 1);
}

export function countWorldBirth(state: WorldBirthState, rules: WorldBirthRules, area: number) {
  recordWorldBirth(state, area);

  if (
    state.phase !== 1 &&
    rules.priorities
      .find((row) => row.id === state.priority)!
      .areas.every((id) => state.counts[id] === undefined || state.counts[id]! >= state.limit)
  )
    {advanceWorldBirth(state, rules);}
}

export function worldBirthArea(point: number, size: number, side: number) {
  cityInteger(point, 1, size * size);

  return (
    Math.floor(((point - 1) % size) / side) * Math.ceil(size / side) +
    Math.floor(Math.floor((point - 1) / size) / side) +
    1
  );
}

export function worldBirthCandidates(areas: readonly number[], size: number, side: number) {
  const columns = Math.ceil(size / side),
    admitted = new Set(areas),
    points: number[] = [];

  for (const area of areas) {
    const fromX = Math.floor((area - 1) / columns) * side,
      fromY = ((area - 1) % columns) * side;

    for (let y = Math.max(1, fromY); y < Math.min(size, fromY + side); y++)
      {for (let x = Math.max(1, fromX); x < Math.min(size, fromX + side); x++) {
        const point = 1 + x + y * size;

        if (
          [point - 1, point - size, point - size - 1].every((id) =>
            admitted.has(worldBirthArea(id, size, side)),
          )
        )
          {points.push(point);}
      }}
  }

  if (points.length > 1048576) {worldMutationFailure();}

  return points;
}
