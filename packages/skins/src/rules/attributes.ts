import type { CosmeticRule } from "../contracts/records";

const cosmeticStatusTypes = new Set([
    "100",
    "101",
    "102",
    "103",
    "104",
    "105",
    "106",
    "108",
    "109",
    "115",
    "116",
    "117",
    "121",
    "123",
    "200",
    "202",
]);

export function isCosmeticStatus(rule: CosmeticRule | undefined): boolean
{
    return rule !== undefined
        && (cosmeticStatusTypes.has(rule.type2 ?? "")
            || (rule.type2 === "110" && Boolean(rule.subgroup)));
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
