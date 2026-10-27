import { CityCommandDomain } from "./city-command-domain.ts";
import { randomInt } from "node:crypto";
import { sfs, encode, int, str } from "@opencok/messages/sfs";
import { num, long, type Row } from "@opencok/contracts/rows";
import {
  prayerFields,
  prayerConfiguration,
  prayerFailure,
  prayerInteger,
  prayerSteel,
  prayerHit,
  resetPrayer,
} from "@opencok/rules/prayer";
import { cityInteger } from "@opencok/rules/city-progression";
import { prayerView, prayerLogin, prayerResult, prayerItemView } from "@opencok/mappings/prayer";
import { refreshQuests } from "./quests";
import { recordExpeditionScore } from "./new-expedition";
import { CampaignPlanner } from "./local-campaign";
import type { CityDomain } from "./city-domain.ts";
import type { CityProgressionContext } from "./city-progression-context.ts";

export function refreshPrayerBuilding(context: CityProgressionContext, previous: Row, next: Row) {
  if (num(next, "itemId") !== 428000 || num(next, "level") < 1) return;

  const config = prayerConfiguration(context.rules, next),
    existing = context.write.prayer?.record ?? context.state.prayer?.record;
  const record = resetPrayer(
    num(next, "level") === 1 ? undefined : existing,
    context.owner,
    context.now,
    config.base,
  );

  if (
    existing &&
    num(next, "level") > 1 &&
    long(existing, "lastPrayTime") / 86400000n === context.now / 86400000n
  ) {
    const before = prayerConfiguration(context.rules, previous).base;

    for (const key of prayerFields)
      record[key] = before[key]
        ? prayerInteger((config.base[key] * num(existing, key)) / before[key])
        : 0;
  }

  context.write.prayer = { record };
}

export class PrayerDomain extends CityCommandDomain {
  public readonly commands: CityDomain["commands"];
  public readonly types: CityDomain["types"];
  public readonly prepare: CityDomain["prepare"];
  public readonly apply: CityDomain["apply"];

  public constructor(random: (maximum: number) => number = randomInt) {
    super();

    this.commands = ["prayer.init", "user.pray.info", "user.pray", "prayer.item"];

    this.types = [];

    this.prepare = async (context, command, params) => {
      const altar = context.state.buildings.find(
        (row) => num(row, "itemId") === 428000 && num(row, "level") > 0,
      );

      if (!altar) {
        if (command === "prayer.init") return { response: encode({}), event: null };

        prayerFailure("E100174");
      }

      const config = prayerConfiguration(context.rules, altar),
        previous = context.state.prayer?.record,
        record = resetPrayer(previous, context.owner, context.now, config.base);

      if (command === "prayer.init") {
        const current =
          previous && long(previous, "lastPrayTime") / 86400000n === context.now / 86400000n
            ? previous
            : {};

        return { response: encode(prayerLogin(current, config.free, config.maximum)), event: null };
      }

      context.write.prayer = { record };

      if (command === "prayer.item") {
        if (
          str(params, "itemId") !== "200031" ||
          num(record, "prayCount") + num(record, "itemPrayCount") >= config.maximum
        )
          prayerFailure();

        record.freeFromItem = cityInteger(
          num(record, "freeFromItem") + cityInteger(int(params, "count"), 1),
        );

        return {
          response: encode(prayerItemView(record)),
          event: null,
        };
      }

      const steel = prayerSteel(num(record, "steel"), context.effect(205)),
        body = prayerView(
          record,
          config.free,
          config.maximum,
          cityInteger(context.rules.items.get("building_base")?.k10 ?? 0),
          steel,
        );

      if (command === "user.pray.info") return { response: encode(body), event: null };

      const resource = cityInteger(int(params, "resource"), 0, 4),
        requestedGold = cityInteger(int(params, "gold")),
        quantity = cityInteger(int(params, "num"), 1),
        key = ["wood", "silver", "iron", "food", "steel"][resource]!,
        asset = (["wood", "stone", "iron", "food", "silver"] as const)[resource]!,
        goldKey = `gold${key}`;
      const castle = context.state.buildings.find((row) => num(row, "itemId") === 400000),
        level = num(castle ?? {}, "level"),
        unlock = context.rules.items.get("building_base");

      if (
        (resource === 2 && level < cityInteger(unlock?.k3)) ||
        (resource === 1 && level < cityInteger(unlock?.k4))
      )
        prayerFailure("E100154");

      let count = num(record, "prayCount"),
        credits = num(record, "freeFromItem"),
        itemCount = num(record, "itemPrayCount");
      const useItem = credits > 0;

      if (count < config.free || !useItem) count++;

      if (count > config.maximum - itemCount) prayerFailure("102325");

      const cost = count <= config.free || useItem ? 0 : num(record, goldKey),
        expected = key === "steel" ? steel : num(record, key);

      if (requestedGold !== cost || quantity !== expected) prayerFailure("E100167");

      context.economy.gold(-BigInt(cost));
      const first = num(record, count > config.free ? "isFirstPay" : "isFirstFree") === 1,
        hit = prayerHit(first, config.weights, random),
        growth = prayerInteger(num(record, key) * (1 + config.growth));
      record[key] = growth;

      if (count > config.free && !useItem)
        record[goldKey] = Math.min(cost + config.goldStep, config.maximumGold);

      if (credits > 0 && count >= config.free) {
        credits--;
        itemCount++;
      }

      Object.assign(record, {
        prayCount: count,
        itemPrayCount: itemCount,
        freeFromItem: credits,
        lastPrayTime: context.now,
      });

      if (count < config.free) record.isFirstFree = 0;

      if (count === config.free)
        for (const field of prayerFields) record[`gold${field}`] = config.initialGold;
      else if (count > config.free) record.isFirstPay = 0;

      const granted = cityInteger(quantity * hit, 1);
      context.economy.resource(asset, BigInt(granted));
      context.write.prayer.history = {
        cost: num(record, goldKey),
        resource: key,
        amount: growth,
        hit,
        at: context.now,
      };
      body[key] = sfs.int(key === "steel" ? prayerSteel(growth, context.effect(205)) : growth);

      for (const field of prayerFields) body[`gold${field}`] = sfs.int(num(record, `gold${field}`));

      Object.assign(body, {
        resource: sfs.int(resource),
        num: sfs.int(quantity),
        hit: sfs.int(hit),
        prayCount: sfs.int(count),
        freeFromItem: sfs.int(credits),
        prayCountMax: sfs.int(config.maximum - itemCount),
        [asset.toUpperCase()]: sfs.long(context.balance(asset)),
        goldRemain: sfs.long(context.balance("gold")),
      });
      refreshQuests(context, {
        legacy: 10,
        daily: 38,
        key: cost === 0 ? "1" : "2",
        targetCondition: "1",
        count: 1,
      });
      context.recordHero(8, "1");
      recordExpeditionScore(context, 12);
      new CampaignPlanner(context).event(11);

      return { response: encode(prayerResult(body)), event: null };
    };

    this.apply = async () => {
      prayerFailure();
    };
  }
}

export function createPrayerDomain(random: (maximum: number) => number = randomInt): CityDomain {
  return new PrayerDomain(random);
}
