import { CityCommandDomain } from "@opencok/services/city-command-domain";
import { decodeLegacyJsonObject } from "@opencok/messages/legacy-json";
import { randomInt } from "node:crypto";
import { sfs, encode, str, int, Type, type Fields, type Value } from "@opencok/messages/sfs";
import { num, text, long, type Row } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import { chooseWeight } from "@opencok/rules/equipment";
import {
  generalPairs,
  generalContent,
  generalFailure,
} from "@opencok/hero/rules/general-progression";
import { generalFeatureAvailable } from "@opencok/hero/rules/new-general-content";
import {
  generalDrawPeriod,
  generalDrawState,
  generalDrawScore,
  generalDrawPurchase,
} from "@opencok/hero/rules/general-draws";
import { grantRewards } from "@opencok/services/quests";
import type { CityDomain } from "@opencok/services/city-domain";
import type { CityProgressionContext } from "@opencok/services/city-progression-context";

function view(context: CityProgressionContext, row: Row): Fields {
  const config = context.rules.items.get("golden_opentime");

  return {
    k1: sfs.int(cityInteger(config?.k1, 1)),
    k2: sfs.int(cityInteger(config?.k2, 1)),
    normalTotal: sfs.int(num(row, "normal_total")),
    normalFree: sfs.int(num(row, "normal_free")),
    silverUsable: sfs.int(num(row, "silver_usable")),
    silverUsableFree: sfs.int(num(row, "silver_usable_free")),
    goldUsable: sfs.int(num(row, "gold_usable")),
    rewardFlags: sfs.string(text(row, "rewardFlags")),
    scores: sfs.int(generalDrawScore(context.rules, row)),
    notices: sfs.array([]),
    ...(num(row, "normal_free") === 0
      ? {
          normalTime: sfs.long(
            (long(row, "normal_last_free_millis") + BigInt(cityInteger(config?.k7, 1)) * 60000n) /
              1000n,
          ),
        }
      : {}),
    ...(num(row, "silver_usable_free") === 0
      ? {
          silverTime: sfs.long(
            (long(row, "silver_last_free_millis") + BigInt(cityInteger(config?.k8, 1)) * 60000n) /
              1000n,
          ),
        }
      : {}),
  };
}

export class GeneralDrawDomain extends CityCommandDomain {
  public readonly commands: CityDomain["commands"];
  public readonly types: CityDomain["types"];
  public readonly apply: CityDomain["apply"];
  public readonly prepare: CityDomain["prepare"];

  public constructor(globalRanking: () => Promise<readonly string[]> = async () => []) {
    super();

    this.commands = ["herodraw"];

    this.types = [];

    this.apply = async () => {
      generalFailure();
    };

    this.prepare = async (context, _command, params) => {
      const available = (key: string) =>
        generalFeatureAvailable(context.rules, key, {
          kingdomId: context.rules.kingdomId,
          version: "12.06.0",
          now: Number(context.now),
        });

      if (!available("golden_roulette")) {generalFailure();}

      const period = generalDrawPeriod(context.rules, context.now),
        action = str(params, "M__REQUEST_ID__H"),
        config = context.rules.items.get("golden_opentime");

      if (action !== "rank" && !period.open) {generalFailure();}

      if (num(context.state.profile, "crossFightSrcServerId") > 0 && action !== "rank")
        {generalFailure();}

      let row = generalDrawState(
          context.rules,
          context.state.generalRoster?.wheel,
          context.owner,
          context.now,
        ),
        body: Fields = {},
        event: Uint8Array | null | undefined;

      if (action === "info") {body = view(context, row);}
      else if (action === "'luckdraw" || action === "luckdraw") {
        const id = str(params, "itemId"),
          rule = context.rules.general.draws?.get(id),
          count = cityInteger(int(params, "num"), 1, 1000),
          castle = context.state.buildings.find((building) => building.itemId === 400000);

        if (
          !rule ||
          num(castle ?? {}, "level") < cityInteger(rule.minlevel, 1) ||
          !/^\d+$/.test(id)
        )
          {generalFailure();}

        if (
          ![1, 10].includes(count) &&
          (!available("golden_roulette_5h_open") ||
            !(config?.k17 ?? "").split(";").includes(String(count)))
        )
          {generalFailure();}

        const items = (rule["items "] ?? rule.items ?? "").split(";"),
          weights = (rule.rate ?? "").split(";").map((value) => cityInteger(value)),
          counts = (rule.num ?? "").split(";").map((value) => cityInteger(value, 1));

        if (
          items.length !== weights.length ||
          items.length !== counts.length ||
          items.some((id) => !context.rules.goods.has(id))
        )
          {generalFailure();}

        const plan = generalDrawPurchase(
          context.rules,
          row,
          Number(id) % 10,
          count,
          cityInteger(rule.gold, 1),
          context.now,
        );
        context.economy.gold(-plan.gold);
        row = plan.row;
        const outcomes: Value[] = [],
          quantities = new Map<string, number>();

        for (let roll = 0; roll < count; roll++) {
          const index = chooseWeight(weights, randomInt),
            item = items[index]!,
            quantity = counts[index]!;
          context.economy.item(item, quantity);

          if (count <= 10)
            {outcomes.push(sfs.object({ id: sfs.string(item), count: sfs.int(quantity) }));}

          quantities.set(item, cityInteger((quantities.get(item) ?? 0) + quantity));
        }

        if (count > 10)
          {for (const [id, quantity] of quantities)
            {outcomes.push(sfs.object({ id: sfs.string(id), count: sfs.int(quantity) }));}}

        body = {
          ...view(context, row),
          items: sfs.array(outcomes),
          gold: sfs.long(context.balance("gold")),
          freeTimes: sfs.int(plan.free),
        };
        event = encode({
          score: sfs.int(generalDrawScore(context.rules, row)),
          uid: sfs.string(context.owner),
          period: sfs.long(period.start),
          items: sfs.array(
            [...quantities].map(([id, quantity]) =>
              sfs.object({ id: sfs.string(id), count: sfs.int(quantity) }),
            ),
          ),
        });
      } else if (action === "recieve") {
        if (!available("golden_roulette_Integral_reward")) {generalFailure();}

        const score = cityInteger(int(params, "score"), 1),
          rewards = generalPairs(config?.k16),
          reward = rewards.get(score),
          claims = generalPairs(text(row, "rewardFlags"));

        if (!reward || claims.get(score) === 1 || generalDrawScore(context.rules, row) < score)
          {generalFailure();}

        claims.set(score, 1);
        row.rewardFlags = generalContent(claims);
        body.reward = grantRewards(context, String(reward));
      } else if (action !== "rank" && action !== "update") {generalFailure();}

      if (action === "update") {row.hide_king = num(row, "hide_king") === 1 ? 0 : 1;}

      if (action === "rank" || action === "update") {
        const ranks = context.state.generalRoster?.wheelRanks ?? [],
          local: Value[] = [];
        let mine = -1,
          rank = 0;

        for (const original of ranks) {
          const entry = original.uid === context.owner ? { ...original, ...row } : original,
            score = generalDrawScore(context.rules, entry);

          if (
            score <= 0 ||
            [
              "normal_last_free_millis",
              "silver_last_free_millis",
              "last_normal_wheel_millis",
            ].every((key) => long(entry, key) < period.start)
          )
            {continue;}

          rank++;

          if (entry.uid === context.owner) {mine = rank;}

          if (local.length < 200)
            {local.push(
              sfs.object({
                uid: sfs.string(text(entry, "uid")),
                name: sfs.string(text(entry, "name")),
                kingId: sfs.int(num(entry, "serverId")),
                hideKing: sfs.bool(num(entry, "hide_king") > 0),
                count: sfs.int(score),
                rank: sfs.int(rank),
              }),
            );}
        }

        const global = (await globalRanking()).map((raw, index) => {
          const entry = decodeLegacyJsonObject(raw),
            uid = str(entry, "uid"),
            name = str(entry, "name");

          if (!uid || uid.length > 40 || name.length > 80 || entry.hideKing?.type !== Type.Bool)
            {generalFailure();}

          return {
            uid: sfs.string(uid),
            name: sfs.string(name),
            kingId: sfs.int(cityInteger(int(entry, "kingId"), 1)),
            count: sfs.int(cityInteger(int(entry, "count"))),
            hideKing: sfs.bool(!!entry.hideKing.value),
            rank: sfs.int(cityInteger(int(entry, "rank"), index + 1, index + 1)),
          };
        });

        if (global.length > 1000) {generalFailure();}

        body = {
          hide: sfs.bool(num(row, "hide_king") > 0),
          rankLocal: sfs.array(local),
          rankGlobal: sfs.array(global.slice(0, 200).map(sfs.object)),
          myLrank: sfs.int(mine),
          myGRank: sfs.int(
            Number(global.find((entry) => entry.uid?.value === context.owner)?.rank?.value ?? -1),
          ),
          local_ref: sfs.long((context.now + BigInt(cityInteger(config?.k6, 1)) * 60000n) / 1000n),
          global_ref: sfs.long((context.now + BigInt(cityInteger(config?.k5, 1)) * 60000n) / 1000n),
          end_time: sfs.long(period.end / 1000n),
        };
      }

      if (period.open && action !== "rank") {(context.write.generalRoster ??= {}).wheel = row;}

      return {
        response: encode({ data: sfs.object(body) }),
        responseKind: "nested",
        event: event ?? (action === "rank" || action === "info" ? null : undefined),
      };
    };
  }
}

export function createGeneralDrawDomain(
  globalRanking: () => Promise<readonly string[]> = async () => [],
): CityDomain {
  return new GeneralDrawDomain(globalRanking);
}
