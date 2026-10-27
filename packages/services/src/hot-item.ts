import { randomInt } from "node:crypto";
import { encode, sfs, str, int, Type, type Fields } from "@opencok/messages/sfs";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import {
  hotBusinessMan,
  hotItemOffer,
  hotItemVersion,
  hotItemFailure,
  hotItemPool,
  chooseHotItems,
  hotOfferRow,
  hotFallback,
  hotRefreshCost,
  hotResourceAssets,
  hotItemType,
  type HotItemFilter,
} from "@opencok/rules/hot-item";
import { hotItemView, hotBestItemView } from "@opencok/mappings/hot-item";
import { equipment, equipmentItem } from "@opencok/mappings/equipment";
import { cityInteger } from "@opencok/rules/city-progression";
import { eventTimestamp } from "@opencok/rules/local-events";
import { newEquipment } from "./equipment";
import { recordExpeditionScore } from "./new-expedition";
import { refreshQuests } from "./quests";
import { CampaignPlanner } from "./local-campaign";
import type { CityDomain, CityProgressionContext } from "./city-progression";
function best(owner: string, pool: readonly Row[]): Row {
  if (!pool.length) hotItemFailure();
  let selected = pool[0]!,
    color = 0;
  for (const row of pool) {
    const rate = text(row, "rate");
    if (
      num(row, "color") > color &&
      (!rate || rate.split(";").some((value) => cityInteger(value) > 0))
    ) {
      selected = row;
      color = num(row, "color");
    }
  }
  return {
    uid: owner,
    goodsId: text(selected, "item"),
    color,
    price_type: cityInteger(selected.price_type),
    price: cityInteger(selected.price, 1),
    price_hot: cityInteger(selected.price_hot ?? 0),
  };
}
function snapshot(
  context: CityProgressionContext,
  count: number,
  purchases: readonly Row[],
): HotItemFilter {
  const state = context.state.hotItem;
  if (!state) hotItemFailure();
  return {
    now: context.now,
    level: num(context.state.profile, "level"),
    castle: context.state.buildings.reduce(
      (maximum, row) =>
        num(row, "itemId") === 400000 ? Math.max(maximum, num(row, "level")) : maximum,
      0,
    ),
    refreshCount: count,
    purchases,
    server: state.server,
    scores: state.scores,
    quantity: (id) => context.economy.quantity?.(id) ?? 0,
    balance: (asset) => context.balance(asset),
  };
}
function generate(
  context: CityProgressionContext,
  version: 2 | 3,
  count: number,
  purchases: readonly Row[],
  manual: boolean,
  random: (maximum: number) => number,
) {
  const pool = hotItemPool(context.rules, snapshot(context, count, purchases), manual);
  const groups =
    version === 2
      ? [[0, cityInteger(context.rules.items.get("store")?.k3, 1, 64)]]
      : (context.rules.items.get("store")?.k9 ?? "").split("|").map((part) => {
          const pair = part.split(";");
          if (pair.length !== 2) hotItemFailure();
          return [cityInteger(pair[0], 1, 127), cityInteger(pair[1], 1, 64)];
        });
  if (groups.length > 16 || new Set(groups.map(([kind]) => kind)).size !== groups.length)
    hotItemFailure();
  const offers: Row[] = [];
  for (const [kind, maximum] of groups) {
    const choices = chooseHotItems(
      pool.filter((row) => version === 2 || cityInteger(row.merchantGoodsType, 1, 127) === kind),
      maximum!,
      purchases,
      random,
      true,
    );
    const seen = new Set<string>();
    const selected: Row[] = [];
    for (const rule of choices) {
      const key = version === 2 ? (rule.item ?? "").split(";")[0]! : (rule.item ?? "");
      if (seen.has(key)) continue;
      seen.add(key);
      selected.push(hotOfferRow(context.owner, rule, context.now, kind));
    }
    if (selected.length < maximum!)
      for (const rule of hotFallback(context.rules, version, kind!, maximum! - selected.length))
        selected.push(hotOfferRow(context.owner, rule, context.now, kind));
    offers.push(...selected);
  }
  if (!offers.length || offers.length > 64) hotItemFailure();
  return { offers, best: best(context.owner, pool) };
}
function resource(context: CityProgressionContext, id: number, delta: bigint) {
  const asset = hotResourceAssets[id];
  if (!asset) hotItemFailure();
  if (asset === "gold") context.economy.gold(delta);
  else if (asset === "crystal") {
    if (!context.economy.crystal) hotItemFailure();
    context.economy.crystal(delta);
  } else if (delta < 0n && ["wood", "stone", "iron", "food", "silver"].includes(asset))
    context.spend({ [asset]: -delta }, false);
  else context.economy.resource(asset, delta);
}
export function createHotItemDomain(random: (maximum: number) => number = randomInt): CityDomain {
  return {
    commands: [
      "hot.item.v2.get",
      "hot.item.refresh",
      "hot.item.refreshV3",
      "hot.item.v2.buy",
      "hot.item.v3.buy",
    ],
    types: [],
    async prepare(context, command, params) {
      const state = context.state.hotItem;
      if (!state) hotItemFailure();
      const version = hotItemVersion(context.rules, context.now);
      const expected = command.includes("v3") || command.endsWith("V3") ? 3 : 2;
      if (command !== "hot.item.v2.get" && expected !== version) hotItemFailure();
      if (version === 2 && context.rules.items.get("store")?.k7 !== "0") hotItemFailure();
      const sameDay =
        !!state.refresh && long(state.refresh, "todayTime") / 86400000n === context.now / 86400000n;
      const count = sameDay ? cityInteger(state.refresh!.count ?? 0) : 0;
      const purchases = sameDay ? state.purchases.map((row) => ({ ...row })) : [];
      const rows = (version === 2 ? state.v2 : state.v3).map((row) => ({ ...row }));
      const valid =
        sameDay &&
        rows.length > 0 &&
        rows.every((row) => {
          const offer = hotItemOffer(row);
          return (
            offer.refreshTime <= context.now &&
            offer.refreshTime / 86400000n === context.now / 86400000n
          );
        });
      const manual = command === "hot.item.refresh" || command === "hot.item.refreshV3";
      const buy = command.endsWith(".buy");
      if (buy && !valid) hotItemFailure();
      let offers = rows,
        featured = version === 2 ? state.bestV2 : state.bestV3;
      let nextCount = count;
      if (manual || !valid || !featured) {
        const cost = manual ? hotRefreshCost(context.rules, count) : 0;
        if (cost) context.economy.gold(-BigInt(cost));
        const generated = generate(context, version, count, purchases, manual, random);
        offers = generated.offers;
        if (!manual || !featured) featured = generated.best;
        if (manual) {
          nextCount = cityInteger(count + 1);
          refreshQuests(context, { daily: 33, count: 1 });
        }
      }
      if (!featured) hotItemFailure();
      const write = {
        version,
        offers,
        best: featured,
        refresh: { count: nextCount, todayTime: context.now },
        purchases,
      };
      context.write.hotItem = write;
      let body: Fields;
      if (buy) {
        const id = str(params, "itemId"),
          pack = cityInteger(int(params, "itemNum"), 1),
          units = cityInteger(int(params, "num"), 1),
          price = cityInteger(int(params, "price"), 1),
          priceType = cityInteger(int(params, "priceType"));
        const row = offers.find(
          (row) => text(row, "goodsId") === `${id};${pack}` && num(row, "price") === price,
        );
        if (!row) hotItemFailure();
        const offer = hotItemOffer(row);
        if (priceType !== offer.priceType || units > offer.num) hotItemFailure();
        if (
          params.refreshTime &&
          (params.refreshTime.type !== Type.Long || params.refreshTime.value !== offer.refreshTime)
        )
          hotItemFailure();
        if (priceType < 19) resource(context, priceType, -BigInt(price));
        else context.spendItem(String(priceType), price);
        body = {};
        const type = hotItemType(id);
        if (type === 0) resource(context, Number(id), BigInt(pack));
        else if (type === 2) {
          const granted: Row[] = [];
          if (pack > 1000) hotItemFailure();
          for (let index = 0; index < pack; index++) {
            context.write.equipment = [
              ...(context.write.equipment ?? []),
              newEquipment(context, id),
            ];
            granted.push(context.write.equipment.at(-1)!);
          }
          body.equip = sfs.array(granted.map((row) => sfs.object(equipment(row))));
        } else {
          if (!context.rules.goods.has(id)) hotItemFailure();
          context.economy.item(id, pack);
          body.item = sfs.object(
            equipmentItem(
              id,
              context.economy.quantity?.(id) ?? pack,
              context.economy.itemState?.(id),
              context.rules,
            ),
          );
        }
        row.num = offer.num - units;
        let updated = row;
        if (num(row, "num") === 0) {
          const pool = hotItemPool(
            context.rules,
            snapshot(context, nextCount, purchases),
            false,
          ).filter(
            (rule) =>
              (version === 2 || cityInteger(rule.merchantGoodsType, 1, 127) === offer.kind) &&
              !offers.some((current) => text(current, "goodsId") === rule.item),
          );
          const replacement = chooseHotItems(pool, 1, purchases, random, false)[0];
          if (replacement) {
            updated = hotOfferRow(context.owner, replacement, offer.refreshTime, offer.kind);
            write.offers = offers.map((current) => (current === row ? updated : current));
          }
        }
        const history = purchases.find((row) => text(row, "goodsId") === offer.goodsId);
        if (history) history.buyCount = cityInteger(num(history, "buyCount") + 1);
        else purchases.push({ uid: context.owner, goodsId: offer.goodsId, buyCount: 1 });
        if (purchases.length > 2048) hotItemFailure();
        Object.assign(body, {
          remainGold: sfs.long(context.balance("gold")),
          remainCrystal: sfs.long(context.balance("crystal")),
          hotItem: sfs.object(hotItemView(updated, version)),
          resource: sfs.object(context.resource()),
        });
        context.recordHero(8, "2");
        recordExpeditionScore(context, 11);
        refreshQuests(context, { main: 37, legacy: 11, daily: 32, count: 1 });
        new CampaignPlanner(context).event(84);
      } else {
        body = {
          refreshTime: sfs.long(context.now),
          hotItem: sfs.array(offers.map((row) => sfs.object(hotItemView(row, version)))),
          goldCost: sfs.int(hotRefreshCost(context.rules, nextCount)),
        };
        if (manual) body.remainGold = sfs.long(context.balance("gold"));
        else {
          body.bestItem = sfs.object(hotBestItemView(featured));
          if (version === 3) {
            const end = eventTimestamp(context.rules.items.get("store")?.k11);
            if (end === undefined) hotItemFailure();
            body.endTime = sfs.long(end);
          }
        }
      }
      return { response: encode(body), event: null };
    },
    async apply() {
      hotItemFailure();
    },
  };
}

export function createHotBusinessMan(rules: import("@opencok/rules/game").Rules, clock = Date.now) {
  let saved: ReturnType<typeof import("@opencok/rules/hot-item").hotBusinessMan> | undefined;
  let deadline = 0n;
  return {
    current() {
      if (!rules.items.has("store")) return;
      const captured = clock();
      if (!Number.isSafeInteger(captured) || captured <= 0) hotItemFailure();
      const now = BigInt(captured);
      if (!saved || now >= deadline) {
        saved = hotBusinessMan(rules, now);
        deadline = now < saved.start ? saved.start : saved.end;
        if (deadline <= now) hotItemFailure();
      }
      const body = {
        startTime: sfs.long(saved.start),
        endTime: sfs.long(saved.end),
        isOpen: sfs.int(saved.isOpen),
        k8: sfs.int(saved.k8),
      };
      return {
        key: `${saved.start}:${saved.end}:${saved.isOpen}:${saved.k8}:${now < saved.start ? 0 : 1}`,
        body,
      };
    },
  };
}
export async function publishHotBusinessMan(
  online: readonly string[],
  audience: import("@opencok/contracts/campaign-notice").CampaignAudience,
  current: () => Fields,
  publish: (owner: string, command: string, body: Fields) => Promise<unknown>,
  clock = Date.now,
) {
  const owners = [...new Set(online)];
  for (let offset = 0; offset < owners.length; offset += 500) {
    const recipients = await audience.select(
      owners.slice(offset, offset + 500),
      undefined,
      BigInt(clock()),
    );
    for (let index = 0; index < recipients.length; index += 32) {
      const body = current();
      await Promise.all(
        recipients
          .slice(index, index + 32)
          .map((owner) => publish(owner, "push.businessman.refresh", body)),
      );
    }
  }
}
