import { cityInteger, cityAmount } from "./city-progression";
import { campaignFailure } from "./local-campaign";
import type { Rule } from "./game";
import type {
    MonsterExchangeConfig,
    MonsterExchangeHeader,
    MonsterExchangeOffer,
} from "@opencok/contracts/monster-exchange";

export function monsterExchangeConfig(row: Rule): MonsterExchangeConfig
{
    const id = String(cityInteger(row.id, 1)),
        token = row.exchange_id ?? "",
        levels = cityInteger(row.num, 1, 16),
        interval = cityAmount(Math.trunc(Math.fround(Math.fround(Number(row.refresh)) * 1000))),
        costs = (row.refresh_cost ?? "").split(";").map((value) => cityInteger(value));

    if (!/^\d{1,12}$/.test(token) || interval <= 10000n || costs.length > 64)
    {
        campaignFailure();
    }

    const gears = Array.from({ length: levels }, (_, index) => {
        const choices = (row[`gear${index + 1}`] ?? "").split("|").map((entry) => {
            const parts = entry.split(";");

            if (parts.length < 3 || parts.length > 4 || !/^\d{1,12}$/.test(parts[0] ?? ""))
            {
                campaignFailure();
            }

            return {
                reward: parts[0]!,
                count: cityInteger(parts[1], 1),
                weight: cityInteger(parts[2]),
                color: parts.length === 4 ? cityInteger(parts[3]) : 0,
            };
        });
        cityInteger(
            choices.reduce((total, offer) => total + offer.weight, 0),
            1,
        );

        if (choices.length > 128)
        {
            campaignFailure();
        }

        return choices;
    });

    return { id, token, interval, free: cityInteger(row.free_num), costs, gears };
}

export function selectMonsterExchangeOffers(
    config: MonsterExchangeConfig,
    random: (maximum: number) => number,
): readonly MonsterExchangeOffer[]
{
    return config.gears.map((gear) => {
        const total = cityInteger(
                gear.reduce((sum, choice) => sum + choice.weight, 0),
                1,
            ),
            draw = cityInteger(random(total), 0, total - 1);
        let boundary = 0;
        const choice = gear.find((choice) => draw < (boundary += choice.weight));

        if (!choice)
        {
            campaignFailure();
        }

        return { reward: choice.reward, count: choice.count, color: choice.color };
    });
}

export function readMonsterExchangeOffers(raw: string): readonly MonsterExchangeOffer[]
{
    if (!raw || raw.length > 1000)
    {
        campaignFailure();
    }

    const rows = raw.split("|");

    if (rows.length > 16)
    {
        campaignFailure();
    }

    return rows.map((row) => {
        const parts = row.split(";");

        if (parts.length < 2 || parts.length > 3 || !/^\d{1,12}$/.test(parts[0] ?? ""))
        {
            campaignFailure();
        }

        return {
            reward: parts[0]!,
            count: cityInteger(parts[1], 1),
            color: parts.length === 3 ? cityInteger(parts[2]) : 0,
        };
    });
}

export function monsterExchangeOffersText(offers: readonly MonsterExchangeOffer[])
{
    const raw = offers.map((offer) => `${offer.reward};${offer.count};${offer.color}`).join("|");
    readMonsterExchangeOffers(raw);

    return raw;
}

export function monsterExchangeClaims(raw: string, length: number): readonly number[]
{
    if (raw.length > 40 || (raw && !/^\d+(?:,\d+)*$/.test(raw)))
    {
        campaignFailure();
    }

    const values = raw ? raw.split(",").map((value) => cityInteger(value, 1, length)) : [];

    if (new Set(values).size !== values.length)
    {
        campaignFailure();
    }

    return values;
}

export function monsterExchangeHeader(config: MonsterExchangeHeader)
{
    if (!/^\d{1,12}$/.test(config.token) || config.interval <= 10000n)
    {
        campaignFailure();
    }

    cityAmount(config.interval);

    return `monster-exchange:v1:${config.token}:${config.interval}`;
}

export function readMonsterExchangeHeader(raw: string): MonsterExchangeHeader
{
    const match = /^monster-exchange:v1:(\d{1,12}):(\d{1,19})$/.exec(raw);

    if (!match)
    {
        campaignFailure();
    }

    const value = { token: match[1]!, interval: cityAmount(match[2]) };
    monsterExchangeHeader(value);

    return value;
}

export function monsterExchangeBoundary(
    checkpoint: bigint,
    interval: bigint,
    now: bigint,
    grace = 0n,
)
{
    cityAmount(checkpoint);
    cityAmount(now);

    if (interval <= grace || interval <= 10000n || now < checkpoint + interval - grace)
    {
        campaignFailure();
    }

    const first = checkpoint + interval - grace;

    return cityAmount(first + ((now - first) / interval) * interval);
}

export function monsterExchangeLegacyMatches(
    offers: readonly MonsterExchangeOffer[],
    config: MonsterExchangeConfig,
)
{
    return (
        offers.length === config.gears.length
        && offers.every((offer, index) =>
            config.gears[index]!.some(
                (choice) =>
                    choice.weight > 0
                    && choice.reward === offer.reward
                    && choice.count === offer.count
                    && choice.color === offer.color,
            )
        )
    );
}
