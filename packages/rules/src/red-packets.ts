import { cityInteger } from "./city-progression";
import { campaignFailure } from "./local-campaign";
import { long, num, type Row } from "@opencok/contracts/rows";

export function packetStatus(packet: Row | undefined, claimed: boolean, now: bigint)
{
    if (claimed)
    {
        return 0;
    }

    if (!packet)
    {
        return 3;
    }

    if (num(packet, "remain") <= 0 || num(packet, "curPeople") >= num(packet, "totalPeople"))
    {
        return 2;
    }

    return num(packet, "state") === 0 && now < long(packet, "endTime") ? 1 : 3;
}

export function packetDistribution(packet: Row, parameters: string, random: () => number): number
{
    const total = cityInteger(num(packet, "total"), 1),
        remain = cityInteger(num(packet, "remain"), 1, total),
        count = cityInteger(num(packet, "totalPeople"), 1, Math.min(total, 4096)),
        received = cityInteger(num(packet, "curPeople"), 0, count - 1),
        remainingPeople = count - received;

    if (remain < remainingPeople)
    {
        campaignFailure();
    }

    if (remainingPeople === 1)
    {
        return remain;
    }

    if (num(packet, "type") === 1)
    {
        return Math.min(remain, Math.ceil(Math.fround(total / count)));
    }

    if (num(packet, "type") !== 0)
    {
        campaignFailure();
    }

    const values = parameters.split(";").map(Number);

    if (
        values.length !== 5
        || values.some((value) => !Number.isFinite(value))
        || values.slice(0, 4).some((value) => value <= 0)
    )
    {
        campaignFailure();
    }

    const [k, maxK, minK, adsK, randK] = values as [number, number, number, number, number],
        first = random(),
        second = random();

    if (first < 0 || first >= 1 || second < 0 || second >= 1)
    {
        campaignFailure();
    }

    const f = Math.fround,
        maximum = f(f(maxK) * Math.trunc(total / count)),
        minimum = Math.ceil(f(total / f(f(minK) * count))),
        adjustment = Math.trunc(f(f(f(f(first) - f(randK)) * total) / f(count * f(adsK)))),
        band = Math.min(f(remain - minimum * remainingPeople), maximum),
        factor = f(f(f(f(k) * f(f(k) + 1)) / f(f(f(k) + 1) - f(second))) - f(k)),
        base = f(minimum + Math.floor(f(band * factor))),
        value = Math.trunc(base + adjustment > 1 ? base + adjustment : base);

    return Math.max(1, Math.min(remain - Math.min(remain - 1, remainingPeople - 1), value));
}
