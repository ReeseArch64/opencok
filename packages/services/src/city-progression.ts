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
  commands: readonly string[];
  types: readonly number[];
  prepare(
    context: CityProgressionContext,
    command: string,
    params: Fields,
  ): Promise<PreparedActivity>;
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
  const context = async (tx: T, owner: string, now: bigint, economy: ActivityEconomy) => {
    const repository = store(tx, owner, now),
      state = await repository.getState();
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
        if (!Number.isFinite(value)) throw new Error("Invalid city progression effect");
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
        const body = await domain.apply(plan, action, activity);
        await repository.update(plan.write, economy);
        return encode(body);
      });
    }
  return {
    domains: registry,
    async command(
      tx: T,
      owner: string,
      command: string,
      params: Uint8Array,
      now: bigint,
      economy: ActivityEconomy,
    ) {
      const domain = domains.find((candidate) => candidate.commands.includes(command));
      if (!domain) throw new Error("Unsupported city progression command");
      const { repository, plan } = await context(tx, owner, now, economy);
      const result = await domain.prepare(plan, command, decode(Buffer.from(params)));
      await repository.update(plan.write, economy);
      return result;
    },
  };
}

export class CityProgressionContext {
  readonly write: CityProgressionWrite = {};
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
        if (!purchase) throw new Error("Insufficient city resources");
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
    if (!row) throw new Error("Owned building not found");
    return row;
  }
  idleBuilding(row: Row) {
    if (
      num(row, "opType") !== 0 ||
      this.state.queues.some((q) => num(q, "type") === 0 && q.itemId === row.uuid)
    )
      throw new Error("Building is occupied");
  }
  power(delta: bigint, building = 0n, cured = 0) {
    const previous = this.write.statistics ?? {
      power: long(this.state.statistics, "power"),
      buildingPower: long(this.state.statistics, "buildingPower"),
      armyCure: num(this.state.statistics, "armyCure"),
    };
    const limit = this.rules.configuration.serverConfig?.get("power_limit");
    if (
      delta > 0n &&
      limit?.enabled === "1" &&
      !(limit.gmBypass === "1" && num(this.state.profile, "gmFlag") > 0) &&
      previous.power + delta > cityAmount(limit.max_power)
    )
      throw new Error("Player power limit exceeded");
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
    if (delta) this.power(BigInt(delta));
  }
}
