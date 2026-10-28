import { sfs, encode, decode, fields, int, str, Type, type Fields } from "@opencok/messages/sfs";
import type { ContinuedCostSpending } from "@opencok/contracts/continued-cost";
import { cityInteger, cityAmount } from "@opencok/rules/city-progression";

export function continuedCostSpending(value: ContinuedCostSpending)
{
    return encode({
        owner: sfs.string(value.owner),
        at: sfs.long(value.at),
        start: sfs.long(value.start),
        end: sfs.long(value.end),
        type: sfs.int(value.type),
        amount: sfs.long(value.amount),
        paid: sfs.long(value.paid),
        free: sfs.long(value.free),
        tiers: sfs.array(
            value.tiers.map((tier) =>
                sfs.object({
                    level: sfs.int(tier.level),
                    point: sfs.long(tier.point),
                    reward: sfs.string(tier.reward),
                })
            ),
        ),
    });
}

export function readContinuedCostSpending(payload: Uint8Array): ContinuedCostSpending
{
    const body = decode(Buffer.from(payload)),
        entries = body.tiers;
    const amount = (key: string) => {
        if (body[key]?.type !== Type.Long)
        {
            throw new Error("Invalid continued-cost long field");
        }

        return cityAmount(body[key]!.value);
    };

    if (
        entries?.type !== Type.Array
        || !Array.isArray(entries.value)
        || !entries.value.length
        || entries.value.length > 128
    )
    {
        throw new Error("Invalid continued-cost tiers");
    }

    const tiers = entries.value.map((value) => {
        const tier = fields(value);

        if (tier.point?.type !== Type.Long)
        {
            throw new Error("Invalid continued-cost threshold");
        }

        return {
            level: cityInteger(int(tier, "level"), 1),
            point: cityAmount(tier.point.value),
            reward: str(tier, "reward"),
            important: "",
        };
    });

    if (
        tiers.some(
            (tier, index) =>
                tier.level !== index + 1
                || !/^\d{1,12}$/.test(tier.reward)
                || (index > 0 && tier.point < tiers[index - 1]!.point),
        )
    )
    {
        throw new Error("Invalid continued-cost tier order");
    }

    const result = {
        owner: str(body, "owner"),
        at: amount("at"),
        start: amount("start"),
        end: amount("end"),
        type: cityInteger(int(body, "type"), 1, 6),
        amount: amount("amount"),
        paid: amount("paid"),
        free: amount("free"),
        face: "",
        tiers,
    };

    if (
        result.start <= 0n
        || result.start >= result.end
        || result.at < result.start
        || result.at >= result.end
        || result.amount <= 0n
        || (result.type === 1 && result.paid + result.free !== result.amount)
    )
    {
        throw new Error("Invalid continued-cost evidence");
    }

    return result;
}

export function continuedCostInfo(
    type: number,
    face: string,
    rewards: readonly Fields[],
    level: number,
    claims: string,
    total?: bigint,
): Fields
{
    return {
        costType: sfs.int(type),
        faceInfo: sfs.string(face),
        costReward: sfs.array(rewards.map(sfs.object)),
        reachLv: sfs.int(level),
        getLv: sfs.string(claims),
        costPoint: total === undefined ? sfs.int(0) : sfs.long(total),
    };
}
