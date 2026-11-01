import type { CosmeticRule } from "../contracts/records";
import { CosmeticKind } from "../enums/kind";

const cosmeticStatusTypes = new Set([
    CosmeticKind.City,
    CosmeticKind.March,
    CosmeticKind.Ground,
    CosmeticKind.ChatBackground,
    CosmeticKind.Nameplate,
    CosmeticKind.Bubble,
    CosmeticKind.Shield,
    CosmeticKind.CityEffect,
    CosmeticKind.Wings,
    CosmeticKind.CivilizationFortress,
    CosmeticKind.HeadFrame,
    CosmeticKind.Aura,
    CosmeticKind.HeroMarch,
    CosmeticKind.ActivityEffect,
    CosmeticKind.TeleportEffect,
    CosmeticKind.InnerCastle,
    CosmeticKind.InnerDecoration,
    CosmeticKind.Overlap,
].map(String));

export function isCosmeticStatus(rule: CosmeticRule | undefined): boolean
{
    return rule !== undefined
        && (cosmeticStatusTypes.has(rule.type2 ?? "")
            || (rule.type2 === String(CosmeticKind.Civilization) && Boolean(rule.subgroup)));
}

export function cosmeticStatusRule(rule: CosmeticRule): CosmeticRule
{
    if (!isCosmeticStatus(rule))
    {
        return rule;
    }

    const visualEffects = (rule.effect ?? "").split("|")
        .filter((pair) => pair.split(";")[0] === "14");

    return {
        ...rule,
        effect: visualEffects.join("|"),
        effectAdd: "",
        skill: "",
        random: "0",
    };
}
