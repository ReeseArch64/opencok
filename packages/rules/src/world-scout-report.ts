import { num, long, text, type Row } from "@opencok/contracts/rows";
import type { Rules } from "./game";
import { cityInteger } from "./city-progression";
import { worldMutationFailure } from "./world-march-runtime";
import { javaHashMapOrder } from "./java-hash-map-order";

export function scoutApproximate(value: number, random: (maximum: number) => number)
{
    if (!Number.isInteger(value) || value < -2147483648 || value > 2147483647)
    {
        worldMutationFailure();
    }

    if (value <= 0)
    {
        return 0;
    }

    const first = Math.trunc(value * 0.8),
        last = Math.min(2147483647, Math.trunc(value * 1.2)),
        draw = random(last);

    if (!Number.isInteger(draw) || draw < 0 || draw >= last)
    {
        worldMutationFailure();
    }

    const result = (draw % (last - first + 1)) + first;

    return result > 100 ? Math.trunc(result / 100) * 100 : result;
}

export function scoutPairs(raw: string | undefined)
{
    const result = new Map<string, number>();

    if (!raw || raw.length > 16384)
    {
        worldMutationFailure();
    }

    for (const pair of raw.split("|"))
    {
        const [id, count, ...rest] = pair.split(";");

        if (!id || !/^\d+$/.test(id) || rest.length)
        {
            worldMutationFailure();
        }

        result.set(id, cityInteger(count));
    }

    if (result.size > 256)
    {
        worldMutationFailure();
    }

    return result;
}

export function scoutBarbarianArmy(
    actor: Row,
    rules: Rules,
    now: bigint,
    previous: ReadonlyMap<string | null, number | null> | null,
    award = false,
)
{
    const rule = rules.world.barbarians?.get(text(actor, "configId"));

    if (!rule)
    {
        worldMutationFailure();
    }

    const base = award
            ? scoutPairs(rule.arm_reward)
            : scoutPairs(rules.world.armies?.get(rule.army ?? "")?.arm),
        period = Number(rule.para3),
        at = long(actor, "lastBeAttackedTime");

    if (!Number.isFinite(period) || period <= 0 || at < 0n || at > now)
    {
        worldMutationFailure();
    }

    if (!previous || previous.size > 256)
    {
        worldMutationFailure();
    }

    const factor = Math.min(1, Number(now - at) / 1000 / period / 100),
        result = new Map<string, number>();

    for (const id of javaHashMapOrder([...base.keys()]))
    {
        const current = previous.get(id) ?? 0;
        cityInteger(current);
        const amount = Math.min(base.get(id)!, Math.floor(base.get(id)! * factor) + current);

        if (!award || amount > 0)
        {
            result.set(id, amount);
        }
    }

    return result;
}

export function scoutTowerSelectors(rules: Rules, tower: Row)
{
    const raw = rules.building(
        "417000",
        num(tower, "level"),
        num(tower, "star"),
        num(tower, "progress"),
    ).clientParameters?.[1]?.value;

    if (!raw)
    {
        worldMutationFailure();
    }

    const values = raw.split(";").map((value) => cityInteger(value, 1, 19));

    if (values.length > 19 || new Set(values).size !== values.length)
    {
        worldMutationFailure();
    }

    return values;
}
