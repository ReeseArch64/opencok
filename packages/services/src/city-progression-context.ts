import { planPlayerExperience } from "@opencok/rules/player-experience";
import type { ExpeditionScoreAction } from "@opencok/contracts/new-expedition";
import type { HeroScoreAction } from "@opencok/hero/contracts/hero-score";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { unitPower } from "@opencok/rules/military";
import type { ActivityEconomy } from "@opencok/economy/contracts/activity-economy";
import type { TimedActivity } from "@opencok/contracts/timed-activity";
import type {
    CityProgressionState,
    CityProgressionWrite,
    ProgressionActivityData,
} from "@opencok/contracts/city-progression";
import { text, num, long, type Row } from "@opencok/contracts/rows";
import { resource } from "@opencok/economy/mappings/resources";
import type { Rules } from "@opencok/rules/game";
import {
    cityAssets,
    cityAmount,
    cityInteger,
    cityResourceGold,
    citySpeedGold,
    type CityAsset,
} from "@opencok/rules/city-progression";

export class CityProgressionContext
{
    readonly write: CityProgressionWrite = {};
    readonly heroActions: HeroScoreAction[] = [];
    readonly expeditionActions: ExpeditionScoreAction[] = [];

    get scoreAt()
    {
        const due = this.completing?.dueAt;

        return due !== undefined && due < this.now ? due : this.now;
    }

    recordHero(type: number, parameter: string, count: number | bigint = 1, at = this.scoreAt)
    {
        const value = BigInt(count);

        if (value === 0n)
        {
            return;
        }

        if (at > this.now || at < 0n || parameter.length > 40 || this.heroActions.length >= 128)
        {
            throw new Error("Invalid confirmed hero action");
        }

        this.heroActions.push({ type, parameter, count: value, at });
    }

    completing?: Pick<TimedActivity, "type" | "itemId"> & Partial<Pick<TimedActivity, "dueAt">>;
    readonly costs: Record<string, string> = {};
    readonly items: Record<string, number> = {};

    constructor(
        readonly state: CityProgressionState,
        readonly rules: Rules,
        readonly now: bigint,
        readonly economy: ActivityEconomy,
        readonly effect: (id: number) => number,
        readonly generalEffect: (id: number, buildingId?: number, uuid?: string) => number = () =>
            0,
        readonly treasurePoints?: (ids: readonly number[]) => Promise<readonly Row[]>,
        readonly birthPoint?: (
            rules: import("@opencok/contracts/world-birth").WorldBirthRules,
            mode?: import("@opencok/contracts/world-birth").WorldBirthMode,
        ) => Promise<import("@opencok/contracts/world-birth").WorldBirthPlacement>,
        readonly foreignEffect?: (
            snapshot: import("@opencok/contracts/world-point-detail").WorldResourceOwnerSnapshot,
            id: number,
            at?: bigint,
        ) => number,
    )
    {}

    get owner()
    {
        return text(this.state.profile, "uid");
    }

    balance(asset: string)
    {
        return cityAmount(
            this.economy.balance?.(asset)
                ?? (asset === "gold"
                    ? long(this.state.profile, "gold")
                    : long(this.state.resource, asset)),
        );
    }

    spend(costs: Readonly<Partial<Record<CityAsset, bigint>>>, purchase: boolean)
    {
        for (const asset of cityAssets)
        {
            let cost = cityAmount(costs[asset] ?? 0n);

            if (asset !== "silver")
            {
                const bound = `${asset}bind` as "woodbind" | "stonebind" | "ironbind" | "foodbind";
                const available = this.balance(bound),
                    take = available < cost ? available : cost;

                if (take)
                {
                    this.economy.resource(bound, -take);
                    this.costs[bound] = String(BigInt(this.costs[bound] ?? 0) + take);
                    cost -= take;
                }
            }

            const available = this.balance(asset),
                take = available < cost ? available : cost;

            if (take)
            {
                this.economy.resource(asset, -take);
                this.costs[asset] = String(BigInt(this.costs[asset] ?? 0) + take);
                cost -= take;
            }

            if (cost)
            {
                if (!purchase)
                {
                    throw new GameError(errors.insufficientResource, "city_progression");
                }

                this.economy.gold(-cityResourceGold(this.rules, asset, cost));
            }
        }
    }

    spendItem(itemId: string, requested: number, purchase = false)
    {
        let count = cityInteger(requested);

        if (!count)
        {
            return;
        }

        if (purchase)
        {
            const owned = this.economy.quantity?.(itemId) ?? 0;

            if (count > owned)
            {
                const price = cityInteger(this.rules.goods.get(itemId)?.price, 1);
                this.economy.gold(-BigInt(price) * BigInt(count - owned));
                count = owned;
            }
        }

        if (count)
        {
            this.economy.item(itemId, -count);
            this.items[itemId] = (this.items[itemId] ?? 0) + count;
        }
    }

    accelerate(duration: bigint, troops = false)
    {
        this.economy.gold(-citySpeedGold(this.rules, duration, troops));
    }

    data(
        kind: ProgressionActivityData["kind"],
        extra: Partial<ProgressionActivityData> = {},
    ): ProgressionActivityData
    {
        return { schema: 1, kind, costs: this.costs, items: this.items, ...extra };
    }

    refund(data: ProgressionActivityData | undefined)
    {
        for (const [asset, value] of Object.entries(data?.costs ?? {}))
        {
            const amount = cityAmount(value) / 2n;

            if (amount)
            {
                this.economy.resource(asset as Parameters<ActivityEconomy["resource"]>[0], amount);
            }
        }
    }

    resource()
    {
        const row = { ...this.state.resource };

        for (const asset of [...cityAssets, "woodbind", "stonebind", "ironbind", "foodbind"])
        {
            row[asset] = this.balance(asset);
        }

        return resource(row);
    }

    ownBuilding(id: string)
    {
        const row = this.state.buildings.find((building) => building.uuid === id);

        if (!row)
        {
            throw new GameError(errors.missing, "city_progression");
        }

        return row;
    }

    idleBuilding(row: Row)
    {
        if (
            num(row, "opType") !== 0
            || this.state.queues.some((q) => num(q, "type") === 0 && q.itemId === row.uuid)
        )
        {
            throw new GameError(errors.occupied, "city_progression");
        }
    }

    checkPower(additional: bigint)
    {
        const limit = this.rules.configuration.serverConfig?.get("power_limit");

        if (
            limit?.enabled !== "1"
            || (limit.gmBypass === "1" && num(this.state.profile, "gmFlag") > 0)
        )
        {
            return;
        }

        let reserved = 0n;

        for (const row of this.state.armies)
        {
            if (
                num(row, "train") > 0
                && !(
                    [1, 8, 9, 10, 17].includes(this.completing?.type ?? -1)
                    && this.completing?.itemId === row.armyId
                )
            )
            {
                const rule = this.rules.arms.get(text(row, "armyId"));

                if (!rule)
                {
                    throw new GameError(errors.unsupported, "city_progression");
                }

                reserved += unitPower(rule, num(row, "train"));
            }
        }

        for (const row of this.state.forts)
        {
            if (
                num(row, "build") > 0
                && !(this.completing?.type === 2 && this.completing.itemId === row.armyId)
            )
            {
                const rule = this.rules.arms.get(text(row, "armyId"));

                if (!rule)
                {
                    throw new GameError(errors.unsupported, "city_progression");
                }

                reserved += unitPower(rule, num(row, "build"));
            }
        }

        if (this.completing?.type !== 3)
        {
            for (const row of this.state.hospital)
            {
                if (num(row, "heal") > 0)
                {
                    const rule = this.rules.arms.get(text(row, "armyId"));

                    if (!rule)
                    {
                        throw new GameError(errors.unsupported, "city_progression");
                    }

                    reserved += unitPower(rule, num(row, "heal"));
                }
            }
        }

        for (const row of this.state.buildings)
        {
            if (
                num(row, "opType") === 1
                && !(this.completing?.type === 0 && this.completing.itemId === row.uuid)
            )
            {
                const current = this.rules.building(
                    text(row, "itemId"),
                    num(row, "level"),
                    num(row, "star"),
                    num(row, "progress"),
                );
                const next = this.rules.nextBuilding(
                    text(row, "itemId"),
                    num(row, "level"),
                    num(row, "star"),
                    num(row, "progress"),
                    Number(this.now),
                );
                reserved += BigInt(Math.max(0, (next.power ?? 0) - (current.power ?? 0)));
            }
        }

        for (const row of this.state.sciences)
        {
            if (
                this.state.queues.some(
                    (queue) => num(queue, "type") === 6 && queue.itemId === row.itemId,
                )
                && !(this.completing?.type === 6 && this.completing.itemId === row.itemId)
            )
            {
                const current = this.rules.power.sciences?.get(
                        String(num(row, "itemId") + num(row, "level")),
                    ),
                    next = this.rules.power.sciences?.get(
                        String(num(row, "itemId") + num(row, "level") + 1),
                    );

                if (!current || !next)
                {
                    throw new GameError(errors.unsupported, "city_progression");
                }

                reserved += cityAmount(next.power ?? 0) - cityAmount(current.power ?? 0);
            }
        }

        const power = this.write.statistics?.power ?? long(this.state.statistics, "power");

        if (power + reserved + additional > cityAmount(limit.max_power))
        {
            throw new GameError(errors.powerLimit, "city_progression");
        }
    }

    power(delta: bigint, building = 0n, cured = 0)
    {
        const previous = this.write.statistics ?? {
            power: long(this.state.statistics, "power"),
            buildingPower: long(this.state.statistics, "buildingPower"),
            armyCure: num(this.state.statistics, "armyCure"),
        };

        if (delta > 0n)
        {
            this.checkPower(delta);
        }

        this.recordHero(6, "0", delta);
        this.recordHero(6, "1", building);
        this.write.statistics = {
            ...previous,
            power: cityAmount(previous.power + delta),
            buildingPower: cityAmount(previous.buildingPower + building),
            armyCure: cityInteger(previous.armyCure + cured),
        };
    }

    experience(amount: number)
    {
        const oldLevel = this.write.profile?.level ?? num(this.state.profile, "level"),
            oldPower = cityInteger(this.rules.role(oldLevel).power ?? 0),
            { level, exp } = planPlayerExperience(this.rules, {
                level: oldLevel,
                exp: this.write.profile?.exp ?? num(this.state.profile, "exp"),
                amount: cityInteger(amount),
                effect: this.effect(80),
            });
        this.write.profile = { level, exp };
        const delta = cityInteger(this.rules.role(level).power ?? 0) - oldPower;
        let total = BigInt(delta);

        if (level !== oldLevel)
        {
            const pending = this.write.generalRoster?.legacy ?? [],
                deleted = new Set(this.write.generalRoster?.deletedLegacy ?? []),
                generals = new Map(
                    [...this.state.effects.generals, ...pending]
                        .filter((general) => !deleted.has(text(general, "uuid")))
                        .map((general) => [text(general, "uuid"), general]),
                );
            const existing = new Set(
                    this.state.effects.generals.map((general) => text(general, "uuid")),
                ),
                earlierLevel = this.write.legacyGeneralLevel;

            for (const general of generals.values())
            {
                const previousLevel =
                    earlierLevel !== undefined && existing.has(text(general, "uuid"))
                        ? earlierLevel
                        : num(general, "level");
                total += cityAmount(
                    this.rules.power.generals?.get(text(general, "generalId"))?.power ?? 0,
                )
                    * BigInt(level - previousLevel);
            }

            this.write.legacyGeneralLevel = level;

            if (this.write.generalRoster?.legacy)
            {
                this.write.generalRoster.legacy = pending.map((general) => ({ ...general, level }));
            }
        }

        if (total)
        {
            this.power(total);
        }
    }
}
