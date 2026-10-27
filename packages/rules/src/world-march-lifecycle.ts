import type {
  MarchLifecycle,
  MarchTroops,
  MarchTroopBalance,
  MarchTransition,
  MarchCargo,
} from "@opencok/contracts/world-march-lifecycle";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

const limit = 2147483647;
function invalid(): never {
  throw new GameError(errors.invalid, "world_state");
}
function integer(value: number, minimum = 0) {
  if (!Number.isInteger(value) || value < minimum || value > limit) invalid();
  return value;
}
function instant(value: bigint) {
  if (typeof value !== "bigint" || value < 0n || value > 9223372036854775807n) invalid();
  return value;
}
function duration(value: bigint) {
  instant(value);
  if (value < 1n || value > BigInt(limit)) invalid();
  return value;
}
function troops(values: readonly MarchTroops[], empty = false) {
  if (
    (!values.length && !empty) ||
    values.length > 256 ||
    new Set(values.map((row) => row.armyId)).size !== values.length
  )
    invalid();
  for (const row of values) {
    if (!/^\d{1,12}$/.test(row.armyId)) invalid();
    integer(row.quantity, 1);
  }
}
function cargo(value: MarchCargo | null) {
  if (value === null) return;
  if (!["wood", "stone", "iron", "food", "silver", "gold"].includes(value.resource)) invalid();
  instant(value.amount);
}
function validate(state: MarchLifecycle, owner: string, version: number, now: bigint) {
  if (!state.id || state.id.length > 40 || !owner || state.owner !== owner) invalid();
  integer(state.version, 1);
  if (version !== state.version || state.version === limit) invalid();
  integer(state.worldId);
  integer(state.origin, 1);
  integer(state.target, 1);
  instant(state.startedAt);
  instant(state.dueAt);
  instant(now);
  if (state.dueAt < state.startedAt || now < state.startedAt) invalid();
  duration(state.returnDuration);
  if (state.phase === "outbound" || state.phase === "returning") {
    const elapsed = state.dueAt - state.startedAt;
    if (elapsed > BigInt(limit)) invalid();
  }
  if (
    state.purpose !== undefined &&
    state.purpose !== "trouble" &&
    state.purpose !== "treasure" &&
    state.purpose !== "scout"
  )
    invalid();
  if (
    (state.purpose === "trouble" || state.purpose === "scout") &&
    (state.phase === "gathering" || state.cargo !== null)
  )
    invalid();
  if (state.purpose === "treasure" && state.cargo !== null) invalid();
  troops(state.troops, state.purpose === "trouble" || state.purpose === "scout");
  cargo(state.cargo);
  if (!["outbound", "gathering", "returning", "completed"].includes(state.phase)) invalid();
}
function balance(
  values: readonly MarchTroopBalance[],
  units: readonly MarchTroops[],
  returning: boolean,
) {
  if (values.length > 256 || new Set(values.map((row) => row.armyId)).size !== values.length)
    invalid();
  const result = values.map((row) => ({
    ...row,
    free: integer(row.free),
    march: integer(row.march),
  }));
  for (const unit of units) {
    const row = result.find((row) => row.armyId === unit.armyId);
    if (!row) invalid();
    const from = returning ? "march" : "free",
      to = returning ? "free" : "march";
    row[from] = integer(row[from] - unit.quantity);
    row[to] = integer(row[to] + unit.quantity);
  }
  return result;
}
function transition(
  state: MarchLifecycle,
  changes: Partial<MarchLifecycle>,
  balances: readonly MarchTroopBalance[] = [],
  credit: MarchCargo | null = null,
): MarchTransition {
  return {
    expectedVersion: state.version,
    march: {
      ...state,
      ...changes,
      version: state.version + 1,
      troops: state.troops.map((row) => ({ ...row })),
      cargo:
        changes.cargo === null
          ? null
          : changes.cargo
            ? { ...changes.cargo }
            : state.cargo
              ? { ...state.cargo }
              : null,
    },
    troops: balances,
    credit: credit ? { ...credit } : null,
  };
}

export function reserveMarch(
  input: Omit<MarchLifecycle, "version" | "phase" | "cargo">,
  balances: readonly MarchTroopBalance[],
): MarchTransition {
  const state: MarchLifecycle = { ...input, version: 1, phase: "outbound", cargo: null };
  validate(state, input.owner, 1, input.startedAt);
  duration(input.dueAt - input.startedAt);
  if (input.origin === input.target) invalid();
  return {
    expectedVersion: 0,
    march: { ...state, troops: input.troops.map((row) => ({ ...row })) },
    troops: balance(balances, input.troops, false),
    credit: null,
  };
}

export function arriveForGathering(
  state: MarchLifecycle,
  owner: string,
  version: number,
  now: bigint,
  gatheringDuration: bigint,
): MarchTransition {
  validate(state, owner, version, now);
  duration(gatheringDuration);
  if (
    state.purpose === "trouble" ||
    state.purpose === "scout" ||
    state.phase !== "outbound" ||
    now < state.dueAt ||
    state.cargo !== null
  )
    invalid();
  return transition(state, {
    phase: "gathering",
    startedAt: state.dueAt,
    dueAt: instant(state.dueAt + gatheringDuration),
  });
}

export function returnFromGathering(
  state: MarchLifecycle,
  owner: string,
  version: number,
  now: bigint,
  gathered: MarchCargo,
): MarchTransition {
  validate(state, owner, version, now);
  cargo(gathered);
  if (
    state.purpose === "treasure" ||
    state.phase !== "gathering" ||
    now < state.dueAt ||
    state.cargo !== null
  )
    invalid();
  return transition(state, {
    phase: "returning",
    startedAt: state.dueAt,
    dueAt: instant(state.dueAt + state.returnDuration),
    cargo: gathered,
  });
}

export function recallOutbound(
  state: MarchLifecycle,
  owner: string,
  version: number,
  now: bigint,
  reverseDuration: bigint,
): MarchTransition {
  validate(state, owner, version, now);
  duration(reverseDuration);
  if (state.phase !== "outbound" || now >= state.dueAt || state.cargo !== null) invalid();
  return transition(state, {
    phase: "returning",
    startedAt: now,
    dueAt: instant(now + reverseDuration),
  });
}

export function accelerateMarch(
  state: MarchLifecycle,
  owner: string,
  version: number,
  now: bigint,
  percent: number,
): MarchTransition {
  validate(state, owner, version, now);
  integer(percent, 1);
  if (percent > 100 || !["outbound", "returning"].includes(state.phase) || now >= state.dueAt)
    invalid();
  const fraction = Math.fround(1 - Math.fround(percent / 100));
  const remaining = BigInt(
    Math.trunc(Math.fround(Math.fround(Number(state.dueAt - now)) * fraction)),
  );
  if (state.phase === "outbound" && remaining < 1500n) invalid();
  return transition(state, { dueAt: instant(now + remaining) });
}

export function completeMarchReturn(
  state: MarchLifecycle,
  owner: string,
  version: number,
  now: bigint,
  balances: readonly MarchTroopBalance[],
): MarchTransition {
  validate(state, owner, version, now);
  if (state.phase !== "returning" || now < state.dueAt) invalid();
  return transition(
    state,
    { phase: "completed", cargo: null },
    balance(balances, state.troops, true),
    state.cargo,
  );
}
