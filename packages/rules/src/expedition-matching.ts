import { createHash } from "node:crypto";
import type {
    ExpeditionMatchStats,
    ExpeditionMatchConfiguration,
    ExpeditionMatchRealm,
} from "@opencok/contracts/expedition-matching";
import type { Rules } from "./game";
import { cityInteger, cityAmount } from "./city-progression";
import { javaFloat } from "./java-float";

export function expeditionMatchingConfiguration(rules: Rules): ExpeditionMatchConfiguration
{
    const config = rules.items.get("wk_match"),
        weights = rules.items.get("wk_match_weight");
    const real = (raw: unknown) => {
        const value = Number(raw);

        if (typeof raw !== "string" || !raw.trim() || !Number.isFinite(value))
        {
            throw new Error("Invalid expedition matching weight");
        }

        return value;
    };

    return {
        powerClose: real(config?.k3),
        powerFar: real(config?.k10),
        over30: cityInteger(config?.k4),
        over26: cityInteger(config?.k5),
        over10M: cityInteger(config?.k6),
        distance: cityInteger(config?.k7),
        window: cityInteger(config?.k8),
        choices: cityInteger(config?.k9, 1, 128),
        victories: cityInteger(config?.k11),
        failures: cityInteger(config?.k12),
        weights: ["k3", "k8", "k4", "k5", "k6", "k7", "k9", "k10"].map((key) => {
            const n = javaFloat(weights?.[key]);

            if (!Number.isFinite(n))
            {
                throw new Error("Invalid expedition matching weight");
            }

            return n;
        }),
    };
}

export function expeditionMatchStats(raw: unknown): ExpeditionMatchStats
{
    if (!raw || typeof raw !== "object" || Array.isArray(raw))
    {
        throw new Error("Invalid expedition matching statistics");
    }

    const x = raw as Record<string, unknown>,
        power = cityAmount(x.topUserPower);

    if (
        typeof x.topAlliancePower !== "number"
        || !Number.isFinite(x.topAlliancePower)
        || x.topAlliancePower < 0
    )
    {
        throw new Error("Invalid expedition guild power");
    }

    return {
        topAlliancePower: x.topAlliancePower,
        topUserPower: String(
            Number(power) >= 9223372036854775808
                ? 9223372036854775807n
                : BigInt(Math.trunc(Number(power))),
        ),
        over30: cityInteger(x.over30),
        over26: cityInteger(x.over26),
        over10M: cityInteger(x.over10M),
        r5: cityInteger(x.r5),
        victories: cityInteger(x.victories),
        failures: cityInteger(x.failures),
    };
}

export function decodeExpeditionMatchStats(raw: string)
{
    if (Buffer.byteLength(raw) > 8192)
    {
        throw new Error("Oversized expedition match statistics");
    }

    return expeditionMatchStats(JSON.parse(raw));
}

export function expeditionMatchWeight(
    a: ExpeditionMatchRealm,
    b: ExpeditionMatchRealm,
    config: ExpeditionMatchConfiguration,
)
{
    const left = BigInt(a.stats.topUserPower),
        right = BigInt(b.stats.topUserPower),
        ratio = Math.abs(
            Math.fround(
                javaFloat(String(BigInt.asIntN(64, left - right)))
                    / javaFloat(String(left > right ? left : right)),
            ),
        );
    const tests = [
        ratio <= config.powerClose,
        ratio > config.powerFar,
        Math.abs(a.stats.over30 - b.stats.over26) <= config.over30,
        Math.abs(a.stats.over26 - b.stats.over26) <= config.over26,
        Math.abs(a.stats.over10M - b.stats.over10M) <= config.over10M,
        Math.abs(a.kingdomId - b.kingdomId) <= config.distance,
        Math.abs(a.stats.victories - b.stats.victories) <= config.victories,
        Math.abs(a.stats.failures - b.stats.failures) <= config.failures,
    ];

    return tests.reduce(
        (sum, match, index) => (match ? Math.fround(sum + config.weights[index]!) : sum),
        0,
    );
}

export function validateExpeditionMatchingConfiguration(config: ExpeditionMatchConfiguration)
{
    if (
        !config
        || typeof config !== "object"
        || !Array.isArray(config.weights)
        || config.weights.length !== 8
        || config.weights.some((x) => typeof x !== "number" || !Number.isFinite(x))
        || !Number.isFinite(config.powerClose)
        || !Number.isFinite(config.powerFar)
    )
    {
        throw new Error("Invalid persisted expedition matching configuration");
    }

    for (
        const key of [
            "over30",
            "over26",
            "over10M",
            "distance",
            "window",
            "victories",
            "failures",
        ] as const
    )
    {
        cityInteger(config[key]);
    }

    cityInteger(config.choices, 1, 128);

    return config;
}

export function expeditionMatchPairs(
    realms: readonly ExpeditionMatchRealm[],
    config: ExpeditionMatchConfiguration,
    seed: string,
)
{
    validateExpeditionMatchingConfiguration(config);

    if (
        !/^[a-f0-9]{32}$/.test(seed)
        || realms.length > 128
        || new Set(realms.map((x) => x.kingdomId)).size !== realms.length
        || config.weights.length !== 8
        || config.weights.some((x) => !Number.isFinite(x))
    )
    {
        throw new Error("Invalid expedition matching cohort");
    }

    const ordered = realms
            .map((x) => ({
                ...x,
                kingdomId: cityInteger(x.kingdomId, 1),
                stats: expeditionMatchStats(x.stats),
                previousMatch: cityInteger(x.previousMatch),
            }))
            .sort(
                (a, b) =>
                    b.stats.topAlliancePower - a.stats.topAlliancePower
                    || a.kingdomId - b.kingdomId,
            ),
        index = new Map(ordered.map((x, i) => [x.kingdomId, i])),
        result = new Map<number, number>();

    for (const realm of ordered)
    {
        if (result.has(realm.kingdomId))
        {
            continue;
        }

        const ranked = ordered
                .filter(
                    (x) =>
                        x.kingdomId !== realm.kingdomId
                        && !result.has(x.kingdomId)
                        && Math.abs(index.get(x.kingdomId)! - index.get(realm.kingdomId)!)
                            <= config.window,
                )
                .map((x) => ({ realm: x, weight: expeditionMatchWeight(realm, x, config) }))
                .sort((a, b) => b.weight - a.weight || a.realm.kingdomId - b.realm.kingdomId)
                .slice(0, config.choices),
            candidates = ranked.filter((x) => x.realm.kingdomId !== realm.previousMatch);

        if (!ranked.length)
        {
            result.set(realm.kingdomId, 0);
            continue;
        }

        if (!candidates.length)
        {
            continue;
        }

        const bound = 2 ** 32 - (2 ** 32 % candidates.length);
        let draw = bound,
            counter = 0;

        while (draw >= bound)
        {
            draw = createHash("sha256")
                .update(JSON.stringify([seed, realm.kingdomId, counter++]))
                .digest()
                .readUInt32BE();
        }

        const opponent = candidates[draw % candidates.length]!.realm.kingdomId;
        result.set(realm.kingdomId, opponent);
        result.set(opponent, realm.kingdomId);
    }

    return ordered.map((x) => ({ kingdomId: x.kingdomId, opponent: result.get(x.kingdomId) ?? 0 }));
}
