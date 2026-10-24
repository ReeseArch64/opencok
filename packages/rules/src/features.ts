import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { Rules, Rule } from "./game.ts";
import {
  switchRealmEnabled,
  featureRealmEnabled,
  ruleAvailable,
  versionAtLeast,
  type RuleContext,
} from "./availability.ts";
import { mailBlank } from "./mail.ts";

export interface FeatureContext extends RuleContext {
  uid: string;
  platform: string;
  services?: Readonly<
    Partial<
      Record<
        | "worldboss"
        | "worldboss_elite"
        | "worldboss_special"
        | "worldboss_npc"
        | "payelex"
        | "role_on"
        | "subscribe",
        boolean
      >
    >
  >;
}

function listed(selector: string | undefined, value: string): boolean {
  return (
    !!value &&
    !!selector &&
    selector !== "0" &&
    (selector === "all" || selector.split(";").includes(value))
  );
}

export function featureAnnouncementEnabled(
  rule: Rule,
  rules: Rules,
  context: FeatureContext,
): boolean {
  const key = rule.id;
  if (key === "payelex") {
    const binding = rules.items.get("cn_bind");
    return (
      context.services?.payelex === true &&
      ruleAvailable(rules.features.get("cn_bind"), context) &&
      listed(binding?.k1, context.platform) &&
      listed(binding?.k2, context.uid)
    );
  }
  if (
    mailBlank(rule.version) ||
    mailBlank(context.testServer ? rule.test : rule.online) ||
    !featureRealmEnabled(context.testServer ? rule.test : rule.online, context.kingdomId)
  )
    return false;
  switch (key) {
    case "worldboss":
    case "worldboss_elite":
    case "worldboss_special":
    case "worldboss_npc":
      return context.services?.[key] === true && ruleAvailable(rule, context);
    case "role_on": {
      const roles = rules.items.get("role_info");
      return (
        context.services?.role_on === true &&
        ruleAvailable(rule, context) &&
        listed(roles?.k4, context.platform) &&
        listed(roles?.k5, context.uid)
      );
    }
    case "subscribe":
      return (
        context.services?.subscribe === true &&
        ["AppStore", "market_global", "market_global2"].includes(context.platform)
      );
    default:
      return true;
  }
}

export function accountVerificationEnabled(rules: Rules, context: RuleContext): boolean {
  const rule = rules.items.get("function_on7");
  return (
    !mailBlank(rule?.k5) &&
    !mailBlank(rule?.k6) &&
    versionAtLeast(context.version, rule?.k5 ?? "") &&
    switchRealmEnabled(rule?.k6, context.kingdomId)
  );
}

export function accountVerificationRequired(
  rules: Rules,
  context: RuleContext,
  count: bigint | null,
): boolean {
  if (!accountVerificationEnabled(rules, context) || count === null) return false;
  const limit = rules.items.get("function_on7")?.k7;
  if (limit === undefined) return false;
  if (!/^\d+$/.test(limit) || BigInt(limit) > 2147483647n || count < 0n)
    throw new GameError(errors.unsupported, "account_rule");
  return count >= BigInt(limit);
}
