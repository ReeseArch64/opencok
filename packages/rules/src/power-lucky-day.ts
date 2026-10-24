import type { Row } from "@opencok/contracts/rows";
import { text } from "@opencok/contracts/rows";
import { realmEnabled, ruleTime, versionAtLeast, type RuleContext } from "./availability.ts";
import type { Rules } from "./game.ts";
import { serverFeature } from "./power-context.ts";
import {
  effectInteger as integer,
  effectLong as long,
  invalidEffect as invalid,
} from "./power-values.ts";

function activityOpen(server: Row, rules: Rules, context: RuleContext): boolean {
  const merged = long(server.lastMergeMillis ?? 0);
  if (merged > 0n) {
    if (!rules.power.mergeActivities?.size) return invalid();
    const elapsed = BigInt.asIntN(64, long(context.now) - merged);
    for (const rule of rules.power.mergeActivities.values()) {
      if (rule.activityId !== "57091") continue;
      const start = BigInt.asIntN(64, long(rule.merge_start) * 60000n);
      const end = BigInt.asIntN(64, long(rule.merge_end) * 60000n);
      if (start <= elapsed && elapsed < end) return true;
    }
  }
  const panel = rules.power.activityPanels?.get("57091");
  if (panel?.function_on !== "1") return false;
  const start = ruleTime(panel.start ?? "", context.utcOffsetMinutes);
  const end = ruleTime(panel.end ?? "", context.utcOffsetMinutes);
  return start !== undefined && end !== undefined && start <= context.now && context.now <= end;
}

export function luckyDayEffects(
  profile: Row,
  lucky: Row | undefined,
  server: Row | undefined,
  rules: Rules,
  context: RuleContext,
): ReadonlyMap<number, number> {
  const effects = new Map<number, number>();
  if (!lucky || !serverFeature(rules, "luckyday_server", context)) return effects;
  const control = rules.configuration.payControl?.get("69028");
  if (!control || !versionAtLeast(context.version, control.k1 ?? "")) return effects;
  if (
    context.testServer
      ? control.k72 !== "1" || control.k107 !== "1"
      : !realmEnabled(control.k2, context.kingdomId)
  )
    return effects;
  if (integer(control.k4) === 0) return effects;
  if (control.k3 !== "all" && !control.k3?.split(";").filter(Boolean).includes(text(profile, "pf")))
    return effects;
  if (
    integer(lucky.status ?? 0) !== 1 ||
    long(lucky.time ?? 0) <= long(context.now) ||
    integer(lucky.lucky_id ?? 0) <= 0
  )
    return effects;
  if (!server) return invalid();
  if (!activityOpen(server, rules, context)) return effects;
  const rule = rules.power.luckyEffects?.get(text(lucky, "effectId"));
  if (rule?.effect === undefined) return invalid();
  for (const segment of rule.effect.split("|").filter(Boolean)) {
    const parts = segment.split(";").filter(Boolean);
    effects.set(integer(parts[0]), integer(parts[1]));
  }
  return effects;
}
