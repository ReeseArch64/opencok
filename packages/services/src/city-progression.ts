import { generalDrawPeriod } from "@opencok/rules/general-draws";
import { refreshGeneralUnlocks } from "./general-assignments";
import { refreshQuests } from "./quests";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { unitPower } from "@opencok/rules/military";
import { resourceGeneralBuildingEffect } from "./world-resource-owner-context";
import type {
  ActivityAction,
  ActivityEconomy,
  PreparedActivity,
  TimedActivity,
} from "@opencok/contracts/timed-activity";
import type {
  CityProgressionState,
  CityProgressionStore,
  CityProgressionWrite,
  ProgressionActivityData,
} from "@opencok/contracts/city-progression";
import { text, num, long, type Row } from "@opencok/contracts/rows";
import { encode, decode, type Fields } from "@opencok/messages/sfs";
import { resource } from "@opencok/mappings/city";
import type { Rules } from "@opencok/rules/game";
import {
  cityAssets,
  cityAmount,
  cityInteger,
  cityResourceGold,
  citySpeedGold,
  type CityAsset,
} from "@opencok/rules/city-progression";
import { playerGameEffect } from "@opencok/rules/power-resolver";
import { generalSkillPoints } from "./power";
import type { InventoryEffects } from "./inventory";

export interface CityDomain {
  accelerate?(
    context: CityProgressionContext,
    activity: TimedActivity,
    remaining: bigint,
  ): Promise<void>;
  commands: readonly string[];
  types: readonly number[];
  prepare(
    context: CityProgressionContext,
    command: string,
    params: Fields,
  ): Promise<PreparedActivity>;
  next?(
    context: CityProgressionContext,
    activity: TimedActivity,
  ): Promise<PreparedActivity | undefined>;
  apply(
    context: CityProgressionContext,
    action: ActivityAction,
    activity: TimedActivity,
  ): Promise<Fields>;
}
export function createCityProgressionHandlers<T>(
  store: (tx: T, owner: string, now: bigint) => CityProgressionStore,
  domains: readonly CityDomain[],
  rules: Rules,
  effects: InventoryEffects,
) {
  const context = async (
    tx: T,
    owner: string,
    now: bigint,
    economy: ActivityEconomy,
    command?: string,
    request?: Uint8Array,
  ) => {
    const repository = store(tx, owner, now),
      state = await repository.getState(
        command,
        command === "herodraw"
          ? {
              periodStart: generalDrawPeriod(rules, now).start,
              normal: cityInteger(rules.items.get("golden_opentime")?.k11),
              silver: cityInteger(rules.items.get("golden_opentime")?.k12),
              gold: cityInteger(rules.items.get("golden_opentime")?.k13),
            }
          : undefined,
        request,
      );
    const world = await effects.world(),
      emperor = await effects.emperor();
    const abilities = generalSkillPoints(state.effects.generals),
      cache = new Map<number, number>();
    const resolve = (id: number) => {
      let value = cache.get(id);
      if (value === undefined) {
        value = playerGameEffect(
          state.effects,
          rules,
          { kingdomId: rules.kingdomId, version: "12.06.0", now: Number(now) },
          abilities,
          world,
          emperor,
          id as Parameters<typeof playerGameEffect>[6],
        );
        if (!Number.isFinite(value)) throw new GameError(errors.invalid, "city_progression");
        cache.set(id, value);
      }
      return value;
    };
    return {
      repository,
      plan: new CityProgressionContext(
        state,
        rules,
        now,
        economy,
        resolve,
        (id, buildingId = 400000, uuid) =>
          resourceGeneralBuildingEffect(
            { effects: state.effects, buildings: state.buildings, newGenerals: state.newGenerals },
            rules,
            { kingdomId: rules.kingdomId, now: Number(now) },
            id,
            resolve,
            () => now,
            buildingId,
            uuid,
          ),
      ),
    };
  };
  const registry = new Map<
    number,
    (
      tx: T,
      action: ActivityAction,
      activity: TimedActivity,
      now: bigint,
      economy: ActivityEconomy,
    ) => Promise<Uint8Array>
  >();
  for (const domain of domains)
    for (const type of domain.types) {
      if (registry.has(type)) throw new Error("Duplicate city activity domain");
      registry.set(type, async (tx, action, activity, now, economy) => {
        const { repository, plan } = await context(tx, activity.ownerId, now, economy);
        if (action === "finish") plan.completing = activity;
        const body = await domain.apply(plan, action, activity);
        if (action === "finish" && activity.type === 0) refreshGeneralUnlocks(plan);
        if (action === "finish")
          refreshQuests(plan, {
            legacy: activity.type === 0 ? 3 : activity.type === 6 ? 12 : undefined,
            daily: activity.type === 0 ? 26 : activity.type === 6 ? 27 : undefined,
            main: activity.type === 0 ? 31 : undefined,
            count: 1,
          });
        if (action === "finish" && [1, 8, 9, 10, 17, 2, 3].includes(activity.type)) {
          const rows =
            activity.type === 2
              ? plan.write.forts
              : activity.type === 3
                ? plan.write.hospital
                : plan.write.armies;
          const quantity = (rows ?? []).reduce((sum, row) => {
            if (activity.type === 3)
              return (
                sum +
                Math.max(
                  0,
                  num(
                    plan.state.hospital.find((prior) => prior.armyId === row.armyId) ?? {},
                    "heal",
                  ) - num(row, "heal"),
                )
              );
            const prior = (activity.type === 2 ? plan.state.forts : plan.state.armies).find(
              (prior) => prior.armyId === row.armyId,
            );
            const key = activity.type === 2 ? "num" : "free";
            return sum + Math.max(0, num(row, key) - num(prior ?? {}, key));
          }, 0);
          refreshQuests(plan, {
            main: activity.type === 2 ? 22 : activity.type === 3 ? 44 : 2,
            count: quantity,
            key: activity.itemId,
          });
        }
        await repository.update(plan.write, economy);
        return encode(body);
      });
    }
  return {
    domains: registry,
    async accelerate(
      tx: T,
      activity: TimedActivity,
      remaining: bigint,
      now: bigint,
      economy: ActivityEconomy,
    ) {
      const domain = domains.find((domain) => domain.types.includes(activity.type));
      if (!domain?.accelerate) throw new GameError(errors.unsupported, "city_progression");
      const { repository, plan } = await context(tx, activity.ownerId, now, economy);
      await domain.accelerate(plan, activity, remaining);
      await repository.update(plan.write, economy);
    },
    async next(tx: T, activity: TimedActivity, now: bigint, economy: ActivityEconomy) {
      const domain = domains.find((domain) => domain.types.includes(activity.type));
      if (!domain?.next) return undefined;
      const { repository, plan } = await context(tx, activity.ownerId, now, economy);
      const result = await domain.next(plan, activity);
      await repository.update(plan.write, economy);
      return result;
    },
    async command(
      tx: T,
      owner: string,
      command: string,
      params: Uint8Array,
      now: bigint,
      economy: ActivityEconomy,
    ) {
      const domain = domains.find((candidate) => candidate.commands.includes(command));
      if (!domain) throw new GameError(errors.unsupported, "city_progression");
      const { repository, plan } = await context(tx, owner, now, economy, command, params);
      const result = await domain.prepare(plan, command, decode(Buffer.from(params)));
      if (!domain.commands.includes("task.reward.get")) refreshQuests(plan);
      await repository.update(plan.write, economy);
      return result;
    },
  };
}

export class CityProgressionContext {
  readonly write: CityProgressionWrite = {};
  completing?: Pick<TimedActivity, "type" | "itemId">;
  readonly costs: Record<string, string> = {};
  readonly items: Record<string, number> = {};
  constructor(
    readonly state: CityProgressionState,
    readonly rules: Rules,
    readonly now: bigint,
    readonly economy: ActivityEconomy,
    readonly effect: (id: number) => number,
    readonly generalEffect: (id: number, buildingId?: number, uuid?: string) => number = () => 0,
  ) {}
  get owner() {
    return text(this.state.profile, "uid");
  }
  balance(asset: string) {
    return cityAmount(
      this.economy.balance?.(asset) ??
        (asset === "gold" ? long(this.state.profile, "gold") : long(this.state.resource, asset)),
    );
  }
  spend(costs: Readonly<Partial<Record<CityAsset, bigint>>>, purchase: boolean) {
    for (const asset of cityAssets) {
      let cost = cityAmount(costs[asset] ?? 0n);
      if (asset !== "silver") {
        const bound = `${asset}bind` as "woodbind" | "stonebind" | "ironbind" | "foodbind";
        const available = this.balance(bound),
          take = available < cost ? available : cost;
        if (take) {
          this.economy.resource(bound, -take);
          this.costs[bound] = String(BigInt(this.costs[bound] ?? 0) + take);
          cost -= take;
        }
      }
      const available = this.balance(asset),
        take = available < cost ? available : cost;
      if (take) {
        this.economy.resource(asset, -take);
        this.costs[asset] = String(BigInt(this.costs[asset] ?? 0) + take);
        cost -= take;
      }
      if (cost) {
        if (!purchase) throw new GameError(errors.insufficientResource, "city_progression");
        this.economy.gold(-cityResourceGold(this.rules, asset, cost));
      }
    }
  }
  spendItem(itemId: string, requested: number, purchase = false) {
    let count = cityInteger(requested);
    if (!count) return;
    if (purchase) {
      const owned = this.economy.quantity?.(itemId) ?? 0;
      if (count > owned) {
        const price = cityInteger(this.rules.goods.get(itemId)?.price, 1);
        this.economy.gold(-BigInt(price) * BigInt(count - owned));
        count = owned;
      }
    }
    if (count) {
      this.economy.item(itemId, -count);
      this.items[itemId] = (this.items[itemId] ?? 0) + count;
    }
  }
  accelerate(duration: bigint, troops = false) {
    this.economy.gold(-citySpeedGold(this.rules, duration, troops));
  }
  data(
    kind: ProgressionActivityData["kind"],
    extra: Partial<ProgressionActivityData> = {},
  ): ProgressionActivityData {
    return { schema: 1, kind, costs: this.costs, items: this.items, ...extra };
  }
  refund(data: ProgressionActivityData | undefined) {
    for (const [asset, value] of Object.entries(data?.costs ?? {})) {
      const amount = cityAmount(value) / 2n;
      if (amount)
        this.economy.resource(asset as Parameters<ActivityEconomy["resource"]>[0], amount);
    }
  }
  resource() {
    const row = { ...this.state.resource };
    for (const asset of [...cityAssets, "woodbind", "stonebind", "ironbind", "foodbind"])
      row[asset] = this.balance(asset);
    return resource(row);
  }
  ownBuilding(id: string) {
    const row = this.state.buildings.find((building) => building.uuid === id);
    if (!row) throw new GameError(errors.missing, "city_progression");
    return row;
  }
  idleBuilding(row: Row) {
    if (
      num(row, "opType") !== 0 ||
      this.state.queues.some((q) => num(q, "type") === 0 && q.itemId === row.uuid)
    )
      throw new GameError(errors.occupied, "city_progression");
  }
  checkPower(additional: bigint) {
    const limit = this.rules.configuration.serverConfig?.get("power_limit");
    if (limit?.enabled !== "1" || (limit.gmBypass === "1" && num(this.state.profile, "gmFlag") > 0))
      return;
    let reserved = 0n;
    for (const row of this.state.armies)
      if (
        num(row, "train") > 0 &&
        !(
          [1, 8, 9, 10, 17].includes(this.completing?.type ?? -1) &&
          this.completing?.itemId === row.armyId
        )
      ) {
        const rule = this.rules.arms.get(text(row, "armyId"));
        if (!rule) throw new GameError(errors.unsupported, "city_progression");
        reserved += unitPower(rule, num(row, "train"));
      }
    for (const row of this.state.forts)
      if (
        num(row, "build") > 0 &&
        !(this.completing?.type === 2 && this.completing.itemId === row.armyId)
      ) {
        const rule = this.rules.arms.get(text(row, "armyId"));
        if (!rule) throw new GameError(errors.unsupported, "city_progression");
        reserved += unitPower(rule, num(row, "build"));
      }
    if (this.completing?.type !== 3)
      for (const row of this.state.hospital)
        if (num(row, "heal") > 0) {
          const rule = this.rules.arms.get(text(row, "armyId"));
          if (!rule) throw new GameError(errors.unsupported, "city_progression");
          reserved += unitPower(rule, num(row, "heal"));
        }
    for (const row of this.state.buildings)
      if (
        num(row, "opType") === 1 &&
        !(this.completing?.type === 0 && this.completing.itemId === row.uuid)
      ) {
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
    for (const row of this.state.sciences)
      if (
        this.state.queues.some(
          (queue) => num(queue, "type") === 6 && queue.itemId === row.itemId,
        ) &&
        !(this.completing?.type === 6 && this.completing.itemId === row.itemId)
      ) {
        const current = this.rules.power.sciences?.get(
            String(num(row, "itemId") + num(row, "level")),
          ),
          next = this.rules.power.sciences?.get(String(num(row, "itemId") + num(row, "level") + 1));
        if (!current || !next) throw new GameError(errors.unsupported, "city_progression");
        reserved += cityAmount(next.power ?? 0) - cityAmount(current.power ?? 0);
      }
    const power = this.write.statistics?.power ?? long(this.state.statistics, "power");
    if (power + reserved + additional > cityAmount(limit.max_power))
      throw new GameError(errors.powerLimit, "city_progression");
  }
  power(delta: bigint, building = 0n, cured = 0) {
    const previous = this.write.statistics ?? {
      power: long(this.state.statistics, "power"),
      buildingPower: long(this.state.statistics, "buildingPower"),
      armyCure: num(this.state.statistics, "armyCure"),
    };
    if (delta > 0n) this.checkPower(delta);
    this.write.statistics = {
      power: cityAmount(previous.power + delta),
      buildingPower: cityAmount(previous.buildingPower + building),
      armyCure: cityInteger(previous.armyCure + cured),
    };
  }
  experience(amount: number) {
    let level = this.write.profile?.level ?? num(this.state.profile, "level"),
      exp = (this.write.profile?.exp ?? num(this.state.profile, "exp")) + cityInteger(amount);
    cityInteger(exp);
    const oldLevel = level;
    const oldPower = cityInteger(this.rules.role(level).power ?? 0);
    const maximum = cityInteger(this.rules.items.get("player_max")?.k1 ?? 60, 1);
    while (level < maximum && this.rules.roles.has(String(100100 + level + 1))) {
      const threshold = cityInteger(this.rules.role(level).player_exp, 1);
      if (exp < threshold) break;
      exp -= threshold;
      level++;
    }
    this.write.profile = { level, exp };
    const delta = cityInteger(this.rules.role(level).power ?? 0) - oldPower;
    const generals = this.state.effects.generals.reduce(
      (sum, general) =>
        sum + cityAmount(this.rules.power.generals?.get(text(general, "generalId"))?.power ?? 0),
      0n,
    );
    const total = BigInt(delta) + generals * BigInt(level - oldLevel);
    if (total) this.power(total);
  }
}
