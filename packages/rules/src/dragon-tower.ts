import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { num, text, type Row } from "@opencok/contracts/rows";
import { cityInteger } from "./city-progression";
import { serverFeature } from "./power-context";
import type { Rules } from "./game";

export function towerFailure(): never
{
    throw new GameError(errors.invalid, "city_progression");
}

export function towerIndex(layer: number)
{
    return Math.max(0, cityInteger(layer) - 84500);
}

export function towerWeekStart(now: bigint)
{
    const monday = (((now / 86400000n + 3n) / 7n) * 7n - 3n) * 86400000n;
    const year = BigInt(Date.UTC(new Date(Number(now)).getUTCFullYear(), 0, 1));

    return monday > year ? monday : year;
}

export function towerOpen(
    rules: Rules,
    profile: Row,
    castle: number,
    serverOpenedAt: bigint,
    now: bigint,
)
{
    return (
        serverFeature(rules, "dragon_tower", {
            kingdomId: rules.kingdomId,
            version: "12.06.0",
            now: Number(now),
        })
        && num(profile, "crossFightSrcServerId") <= 0
        && castle >= cityInteger(rules.items.get("dragon_tower")?.k6, 1)
        && now
            >= serverOpenedAt + BigInt(cityInteger(rules.items.get("dragon_tower")?.k1)) * 86400000n
    );
}

export function towerArmy(raw: unknown): Map<string, number>
{
    if (raw === undefined || raw === null || raw === "")
    {
        return new Map();
    }

    if (typeof raw !== "string" || raw.length > 16384)
    {
        towerFailure();
    }

    let value: unknown;

    try
    {
        value = JSON.parse(raw);
    }
    catch
    {
        towerFailure();
    }

    if (
        !value
        || typeof value !== "object"
        || Array.isArray(value)
        || Object.keys(value).length > 128
    )
    {
        towerFailure();
    }

    const result = new Map<string, number>();

    for (const [id, count] of Object.entries(value))
    {
        if (!/^[1-9]\d{0,8}$/.test(id))
        {
            towerFailure();
        }

        const n = cityInteger(count);

        if (n)
        {
            result.set(id, n);
        }
    }

    return result;
}

export function towerMonsterChoices(
    rules: Rules,
    layer: number,
    random: (maximum: number) => number,
): string
{
    const row = rules.advanced.dragonTower?.get(String(layer));

    if (!row)
    {
        towerFailure();
    }

    return ["easy_monster", "medium_monster", "hard_monster"]
        .map((key) => {
            const ids = (row[key] ?? "").split("|").filter(Boolean);
            let total = 0;
            const options = ids.map((id) => {
                const definition = rules.advanced.dragonTowerMonsters?.get(id);

                if (!definition)
                {
                    towerFailure();
                }

                total += cityInteger(definition.weight);

                return { id, end: total };
            });
            cityInteger(total, 1);
            const draw = cityInteger(random(total), 0, total - 1);

            return options.find((option) => draw < option.end)!.id;
        })
        .join("|");
}

export function towerLayer(
    rules: Rules,
    owner: string,
    layer: number,
    random: (maximum: number) => number,
): Row
{
    return {
        uid: owner,
        layer,
        difficulty: 0,
        monsters: towerMonsterChoices(rules, layer, random),
        currentmonster: 0,
        buff: "",
        buybuff: 0,
        awards: "",
        awardstate: 0,
        layerstate: 1,
        fighttime: 0n,
    };
}

export function towerSelectedArmy(
    rules: Rules,
    rows: readonly Row[],
    values: readonly { id: number; num: number; }[],
    limit: number,
)
{
    if (!values.length || values.length > 128)
    {
        towerFailure();
    }

    const result = new Map<string, number>();
    let total = 0;

    for (const row of values)
    {
        const id = String(cityInteger(row.id, 1)),
            count = cityInteger(row.num, 1),
            owned = rows.find((army) => text(army, "armyId") === id);

        if (result.has(id) || !rules.arms.has(id) || !owned || num(owned, "free") < count)
        {
            towerFailure();
        }

        result.set(id, count);
        total += count;
    }

    if (total > cityInteger(limit, 1))
    {
        towerFailure();
    }

    return result;
}
