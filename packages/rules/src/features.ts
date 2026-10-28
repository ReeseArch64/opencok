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
import { javaDecimal } from "./java-integer.ts";

export interface FeatureContext extends RuleContext
{
    uid: string;
    platform: string;
    bossRunning?: (
        key: "worldboss" | "worldboss_elite" | "worldboss_special" | "worldboss_npc",
    ) => boolean;
}

function listed(selector: string | undefined, value: string): boolean
{
    return (
        !mailBlank(selector)
        && selector !== "0"
        && (selector === "all" || selector!.split(";").filter(Boolean).includes(value))
    );
}

export function featureAnnouncementEnabled(
    rule: Rule,
    rules: Rules,
    context: FeatureContext,
): boolean
{
    const key = rule.id;

    if (typeof key !== "string")
    {
        throw new GameError(errors.unsupported, "config_string");
    }

    switch (key)
    {
        case "worldboss":
        case "worldboss_elite":
        case "worldboss_special":
        case "worldboss_npc":
            return (
                context.bossRunning?.(key) === true
                && ruleAvailable(
                    rules.features.get(
                        key === "worldboss" ? key : key.replace("worldboss", "world_boss"),
                    ),
                    context,
                )
            );
    }

    const selector = context.testServer ? rule.test : rule.online;
    const open = !mailBlank(rule.version)
        && !mailBlank(selector)
        && featureRealmEnabled(selector, context.kingdomId);

    switch (key)
    {
        case "payelex":
        case "role_on":
        {
            const feature = key === "payelex" ? "cn_bind" : "role_on";

            if (!ruleAvailable(rules.features.get(feature), context))
            {
                return false;
            }

            const binding = rules.items.get(key === "payelex" ? "cn_bind" : "role_info");

            return (
                listed(binding?.[key === "payelex" ? "k1" : "k4"], context.platform)
                && listed(binding?.[key === "payelex" ? "k2" : "k5"], context.uid)
            );
        }
        case "subscribe":
            return open
                && ["AppStore", "market_global", "market_global2"].includes(context.platform);
        default:
            return open;
    }
}

export function accountVerificationEnabled(rules: Rules, context: RuleContext): boolean
{
    const rule = rules.items.get("function_on7");

    return (
        !mailBlank(rule?.k5)
        && !mailBlank(rule?.k6)
        && versionAtLeast(context.version, rule?.k5 ?? "")
        && switchRealmEnabled(rule?.k6, context.kingdomId)
    );
}

export function accountVerificationRequired(
    rules: Rules,
    context: RuleContext,
    count: string | null,
): boolean
{
    if (!accountVerificationEnabled(rules, context) || count === null)
    {
        return false;
    }

    const limit = rules.items.get("function_on7")?.k7;

    if (limit === undefined)
    {
        return false;
    }

    try
    {
        return javaDecimal(count, 32) >= javaDecimal(limit, 32);
    }
    catch
    {
        throw new GameError(errors.unsupported, "account_rule");
    }
}
