import type { ReconnectProgressState } from "@opencok/contracts/reconnect";
import type { WorldPowerEffect } from "@opencok/contracts/power";
import type { Rules } from "./game.ts";
import { ruleTime, type RuleContext } from "./availability.ts";
import { javaDecimal } from "./java-integer.ts";

const long = (value: unknown) => javaDecimal(String(value ?? 0), 64);
export function reconnectSettlementTimes(
  state: ReconnectProgressState,
  world: readonly WorldPowerEffect[],
  rules: Rules,
  context: RuleContext,
): readonly bigint[] {
  const from = long(state.resource.lastUpdateTime),
    until = BigInt(context.now);
  if (until <= from) return [from];
  const instants = new Set<bigint>([from, until]);
  const add = (time: bigint) => {
    if (time > from && time < until) instants.add(time);
  };
  for (const research of state.allianceResearch ?? [])
    add(long(research.startTime) + long(research.needTime));
  for (const talent of state.effects.dragonTalents ?? []) {
    add(long(talent.startTime));
    add(long(talent.actTime) + 1n);
  }
  for (const status of state.effects.states) {
    add(long(status.startTime));
    add(long(status.endTime));
  }
  for (const status of state.newGenerals.statuses) {
    add(long(status.startTime));
    add(long(status.endTime) + 1n);
  }
  if (state.effects.vip) add(long(state.effects.vip.vipEndTime));
  if (state.effects.luckyDay) add(long(state.effects.luckyDay.time));
  for (const record of world) if (record.endTime !== undefined) add(record.endTime);
  for (const fight of state.effects.kingdomFights) {
    add(long(fight.openTime));
    add(long(fight.startTime));
    add(long(fight.endTime) - 5000n);
  }
  const window = (start: string | undefined, end: string | undefined) => {
    if (start !== undefined) add(ruleTime(start, context.utcOffsetMinutes));
    if (end !== undefined) add(ruleTime(end, context.utcOffsetMinutes) + 1n);
  };
  for (const rule of rules.features.values()) window(rule.start, rule.end);
  const hero = rules.power.activityEvents?.get("9005005");
  if (hero) window(hero.k1, hero.k2);
  const lucky = rules.power.activityPanels?.get("57091");
  if (lucky) window(lucky.start, lucky.end);
  const merged = long(state.effects.powerServer?.lastMergeMillis);
  if (merged > 0n)
    for (const rule of rules.power.mergeActivities?.values() ?? []) {
      if (rule.activityId !== "57091") continue;
      add(merged + long(rule.merge_start) * 60000n);
      add(merged + long(rule.merge_end) * 60000n);
    }
  if (instants.size > 16384) throw new Error("Oversized reconnect effect timeline");
  return [...instants].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}
