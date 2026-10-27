import type { ExpeditionManifest, ExpeditionPhase } from "@opencok/contracts/new-expedition";
import { text, long, type Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { cityInteger } from "./city-progression";
import type { Rules } from "./game";
import { serverFeature } from "./power-context";

export function expeditionFailure(): never {
  throw new GameError(errors.invalid, "city_progression");
}

export function expeditionOpen(rules: Rules, now: bigint) {
  const context = { kingdomId: rules.kingdomId, version: "12.06.0", now: Number(now) };

  return serverFeature(rules, "17_wk", context) && !serverFeature(rules, "wk_switch_new", context);
}

export function expeditionSchedule(manifest: ExpeditionManifest): ExpeditionPhase[] {
  if (
    !/^[A-Za-z0-9:._-]{1,40}$/.test(manifest.periodId) ||
    cityInteger(manifest.serverId, 1) === cityInteger(manifest.matchServerId, 1) ||
    manifest.startTime < 0n ||
    manifest.stages.length < 1 ||
    manifest.stages.length > 9
  )
    expeditionFailure();

  let startTime = manifest.startTime;
  const seen = new Set<number>();

  return manifest.stages.map(({ stage, durationMs }) => {
    cityInteger(stage, 0, 8);

    if (seen.has(stage) || durationMs <= 0n || durationMs > 31536000000n) expeditionFailure();

    seen.add(stage);
    const phase = { stage, startTime, endTime: startTime + durationMs };

    if (phase.endTime > 9223372036854775807n) expeditionFailure();

    startTime = phase.endTime;

    return phase;
  });
}

export function expeditionPhase(period: Row | undefined, now: bigint): ExpeditionPhase | undefined {
  if (!period || now < long(period, "startTime") || now >= long(period, "endTime")) return;

  let raw: unknown;

  try {
    raw = JSON.parse(text(period, "schedule"));
  } catch {
    expeditionFailure();
  }

  if (!Array.isArray(raw) || raw.length < 1 || raw.length > 9) expeditionFailure();

  let previous = long(period, "startTime");
  const seen = new Set<number>();
  let result: ExpeditionPhase | undefined;

  for (const item of raw) {
    if (
      !item ||
      typeof item !== "object" ||
      typeof item.startTime !== "string" ||
      typeof item.endTime !== "string" ||
      !/^\d{1,19}$/.test(item.startTime) ||
      !/^\d{1,19}$/.test(item.endTime)
    )
      expeditionFailure();

    const stage = cityInteger(item.stage, 0, 8),
      startTime = BigInt(item.startTime),
      endTime = BigInt(item.endTime);

    if (seen.has(stage) || startTime !== previous || endTime <= startTime) expeditionFailure();

    seen.add(stage);
    previous = endTime;

    if (now >= startTime && now < endTime) result = { stage, startTime, endTime };
  }

  if (previous !== long(period, "endTime")) expeditionFailure();

  return result;
}

export function expeditionScore(
  rules: Rules,
  stage: number,
  action: number,
  param: number,
  count: number,
  effect: (id: number) => number,
): number {
  cityInteger(count);
  const definition = [...(rules.advanced.expeditionStages?.values() ?? [])].find(
    (rule) => Number(rule.stage) === stage,
  );
  let total = 0;

  for (const id of (definition?.score ?? "").split(";").filter(Boolean)) {
    const row = rules.advanced.expeditionScores?.get(id);

    if (!row) expeditionFailure();

    if (Number(row.type) !== action || !(row.value ?? "").split(";").map(Number).includes(param))
      continue;

    let bonus = 0;

    for (const value of (row.effect ?? "").split(";").filter(Boolean))
      bonus = Math.fround(bonus + effect(cityInteger(value, 1)));

    const delta = Number(row.points) * count * Math.fround(1 + Math.fround(bonus / 100));

    if (!Number.isFinite(delta)) expeditionFailure();

    total += delta;
  }

  if (!Number.isFinite(total) || total < 0) expeditionFailure();

  return total;
}
