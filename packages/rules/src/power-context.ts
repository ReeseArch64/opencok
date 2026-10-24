import type { RuleContext } from "./availability.ts";
import { featureRealmEnabled, ruleTimeWindow } from "./availability.ts";
import { mailBlank } from "./mail.ts";
import type { Rules } from "./game.ts";

export function serverFeature(rules: Rules, key: string, context: RuleContext): boolean {
  const rule = rules.features.get(key);
  if (
    !rule ||
    mailBlank(rule.version) ||
    mailBlank(context.testServer ? rule.test : rule.online) ||
    !Number.isSafeInteger(context.now) ||
    !featureRealmEnabled(context.testServer ? rule.test : rule.online, context.kingdomId)
  )
    return false;
  return ruleTimeWindow(rule, context);
}

export function powerFeatureContext(rules: Rules, context: RuleContext) {
  const enabled = serverFeature(rules, "dragon_new", context);
  return {
    dragonLevelUp: enabled && serverFeature(rules, "dragon_levelup", context),
    dragonScience: enabled && serverFeature(rules, "dragon_science", context),
  };
}
