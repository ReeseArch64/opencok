import type { RuleContext } from "./availability.ts";
import { realmEnabled, ruleTime } from "./availability.ts";
import type { Rules } from "./game.ts";

export function serverFeature(rules: Rules, key: string, context: RuleContext): boolean {
  const rule = rules.features.get(key);
  if (
    !rule?.version?.trim() ||
    !Number.isSafeInteger(context.now) ||
    !realmEnabled(context.testServer ? rule.test : rule.online, context.kingdomId)
  )
    return false;
  const start =
    rule.start === undefined ? -Infinity : ruleTime(rule.start, context.utcOffsetMinutes);
  const end = rule.end === undefined ? Infinity : ruleTime(rule.end, context.utcOffsetMinutes);
  return (
    start !== undefined &&
    end !== undefined &&
    start <= end &&
    context.now >= start &&
    context.now <= end
  );
}

export function powerFeatureContext(rules: Rules, context: RuleContext) {
  const enabled = serverFeature(rules, "dragon_new", context);
  return {
    dragonLevelUp: enabled && serverFeature(rules, "dragon_levelup", context),
    dragonScience: enabled && serverFeature(rules, "dragon_science", context),
  };
}
