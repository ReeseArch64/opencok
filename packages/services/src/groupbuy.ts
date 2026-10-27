import { groupBuyInfo } from "@opencok/mappings/groupbuy";
import { createHash, randomInt, randomUUID } from "node:crypto";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import { encode, sfs, str, int } from "@opencok/messages/sfs";
import { groupBuyPeriod, groupBuyProducts, groupBuyTiers } from "@opencok/rules/groupbuy";
import { cityInteger } from "@opencok/rules/city-progression";
import { serverFeature } from "@opencok/rules/power-context";
import { previewRewards } from "@opencok/rules/rewards";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { pinProgressionReward } from "./progression-rewards";
import type { GroupBuyGateway } from "@opencok/contracts/groupbuy";
import type { CityDomain, CityProgressionContext } from "./city-progression";

function invalid(): never {
  throw new GameError(errors.invalid, "city_progression");
}

export function groupBuyOperation(
  kind: "reserve" | "cancel" | "paid" | "close" | "settle",
  identity: string,
) {
  if (!identity || identity.length > 256) invalid();

  return `group:${kind}:${createHash("sha256").update(identity).digest("hex")}`;
}

function mail(context: CityProgressionContext, id: string) {
  const template = context.rules.mail.get(id),
    contents = javaMailBytes(template?.message);

  if (!template || !contents) invalid();

  const quests = (context.write.quests ??= {});
  quests.mail = [
    ...(quests.mail ?? []),
    {
      uid: randomUUID().replaceAll("-", "") + "00",
      owner: context.owner,
      fromName: template.sender ?? "",
      title: template.title ?? "",
      type: 2,
      contents,
      extra: null,
      rewardId:
        template.reward && template.reward !== "0"
          ? pinProgressionReward(context, template.reward)
          : null,
      rewardStatus: template.reward && template.reward !== "0" ? 0 : 1,
      reply: 0,
      createTime: context.now,
    },
  ];
}

export function createGroupBuyDomain(gateway?: GroupBuyGateway): CityDomain {
  return {
    commands: [
      "groupbuys.info",
      "groupbuys.reserve",
      "groupbuys.cancel",
      "groupbuys.paid",
      "groupbuys.close",
      "groupbuys.settle",
    ],
    types: [],
    async prepare(context, command, params) {
      const state = context.state.groupBuy,
        config = context.rules.items.get("alliance_groupbuys"),
        empty = () => ({ response: encode({}), event: null });

      if (!state || !config) invalid();

      const ruleContext = {
          kingdomId: context.rules.kingdomId,
          version: "12.06.0",
          now: Number(context.now),
        },
        cross = num(context.state.profile, "crossFightSrcServerId") > 0,
        castle = num(
          context.state.buildings.find((row) => num(row, "itemId") === 400000) ?? {},
          "level",
        ),
        open =
          serverFeature(context.rules, "alliance_groupbuys", ruleContext) &&
          !cross &&
          state.openedAt > 0n &&
          context.now - state.openedAt >= BigInt(cityInteger(config.k1)) * 86400000n;

      if (command === "groupbuys.settle") {
        const id = str(params, "activityId"),
          round = int(params, "round");

        if (
          str(params, "operationId") !==
          groupBuyOperation("settle", `${context.owner}:${id}:${round}`)
        )
          invalid();

        const loaded = await state.load({ id }, round),
          closed = loaded.rounds[round - 1]!,
          record = loaded.record;

        if (closed.flag !== 1 || BigInt(closed.cTime) > context.now) invalid();

        if (!record || num(record, "reward") >= num(record, "point")) return empty();

        if (!closed.mail) {
          if (loaded.pending) invalid();

          const tier = (closed.tiers ?? groupBuyTiers(context.rules, round))
            .toSorted((a, b) => a.level - b.level)
            .findLast((tier) => tier.level <= loaded.total);

          if (!tier) invalid();

          closed.mail = tier.mail;
          closed.total = loaded.total;
          loaded.activity.roundInfo = JSON.stringify(loaded.rounds);
        }

        const count = cityInteger(record.point, 1, 128) - cityInteger(record.reward, 0, 128);

        for (let i = 0; i < count; i++) mail(context, closed.mail);

        context.write.groupBuy = {
          activity: loaded.activity,
          record: { ...record, reward: num(record, "point") },
        };

        return empty();
      }

      if (command === "groupbuys.cancel") {
        const eventId = str(params, "eventId"),
          id = str(params, "activityId"),
          round = int(params, "round"),
          marker = createHash("sha256").update(eventId).digest("hex");

        if (
          !gateway ||
          str(params, "operationId") !== groupBuyOperation("cancel", eventId) ||
          !(await gateway.cancelled({
            owner: context.owner,
            kingdomId: context.rules.kingdomId,
            eventId,
          }))
        )
          invalid();

        const loaded = await state.load({ id }, round),
          record = loaded.record;

        if (!record) invalid();

        const entries = text(record, "info").split("|"),
          entry = entries.find((entry) => entry.startsWith(`${marker}:`));

        if (!entry || !entry.endsWith(":0")) invalid();

        context.write.groupBuy = {
          activity: loaded.activity,
          record: { ...record, info: entries.filter((value) => value !== entry).join("|") },
        };

        return empty();
      }

      if (command === "groupbuys.paid") {
        const eventId = str(params, "eventId");

        if (!gateway || str(params, "operationId") !== groupBuyOperation("paid", eventId))
          invalid();

        const proof = await gateway.accepted({
          owner: context.owner,
          kingdomId: context.rules.kingdomId,
          eventId,
        });

        if (
          !proof ||
          typeof proof.occurredAt !== "bigint" ||
          proof.occurredAt <= 0n ||
          proof.occurredAt > context.now ||
          !open ||
          castle < cityInteger(config.k3)
        )
          invalid();

        const loaded = await state.load({ id: proof.activityId }, proof.round),
          round = loaded.rounds[proof.round - 1]!,
          product = groupBuyProducts(context.rules).find(
            (product) => product.id === proof.exchangeId,
          );

        if (
          !product ||
          proof.occurredAt < BigInt(round.sTime) ||
          proof.occurredAt > BigInt(round.cTime)
        )
          invalid();

        const previous = loaded.record,
          marker = createHash("sha256").update(eventId).digest("hex"),
          info = text(previous ?? {}, "info");
        const entries = info.split("|"),
          entry = entries.find((entry) => entry.startsWith(`${marker}:`)),
          parts = entry?.split(":");

        if (!parts || parts[1] !== proof.exchangeId || BigInt(parts[2]!) > proof.occurredAt)
          invalid();

        if (parts[4] === "1") return empty();

        if (parts[4] !== "0") invalid();

        if (round.flag === 1) invalid();

        const point = num(previous ?? {}, "point") + cityInteger(parts[3], 1, 10);

        if (point > cityInteger(config.k4, 1, 10)) invalid();

        const record: Row = {
          id: text(loaded.activity, "id"),
          uid: context.owner,
          round: proof.round,
          name: text(previous ?? context.state.profile, "name"),
          allianceId:
            previous?.allianceId ?? text(context.state.quests?.alliance ?? {}, "allianceId"),
          point,
          buyTime:
            proof.occurredAt > long(previous ?? {}, "buyTime")
              ? proof.occurredAt
              : long(previous ?? {}, "buyTime"),
          info: entries
            .map((value) => (value === entry ? `${parts.slice(0, 4).join(":")}:1` : value))
            .join("|"),
          reward: num(previous ?? {}, "reward"),
        };
        context.write.groupBuy = { activity: loaded.activity, record };
        mail(context, "11931");

        return empty();
      }

      if (command === "groupbuys.close") {
        const id = str(params, "activityId"),
          roundIndex = cityInteger(int(params, "round"), 1, 31),
          loaded = await state.load({ id }, roundIndex),
          round = loaded.rounds[roundIndex - 1]!,
          tiers = round.tiers ?? groupBuyTiers(context.rules, roundIndex);

        if (
          !gateway ||
          context.now <= BigInt(round.cTime) ||
          str(params, "operationId") !==
            groupBuyOperation("close", `${loaded.activity.id}:${roundIndex}`)
        )
          invalid();

        if (round.flag === 1) return empty();

        const proof = await gateway.reconciled({
          kingdomId: context.rules.kingdomId,
          start: long(loaded.activity, "startTime"),
          end: long(loaded.activity, "endTime"),
          round: roundIndex,
          cutoff: BigInt(round.cTime),
        });

        if (!proof || loaded.pending || cityInteger(proof.totalPoints) !== loaded.total) invalid();

        const tier = tiers
          .toSorted((a, b) => a.level - b.level)
          .findLast((tier) => tier.level <= loaded.total);

        if (loaded.total > 0 && !tier) invalid();

        round.flag = 1;
        round.total = loaded.total;

        if (tier) round.mail = tier.mail;

        context.write.groupBuy = {
          activity: {
            ...loaded.activity,
            curRound: Math.max(num(loaded.activity, "curRound"), roundIndex),
            roundInfo: JSON.stringify(loaded.rounds),
          },
        };

        return empty();
      }

      const period = groupBuyPeriod(context.rules);

      if (!open || !period || context.now < period.start || context.now > period.end) {
        if (command === "groupbuys.reserve") invalid();

        return empty();
      }

      const roundIndex =
        period.rounds.findIndex(
          (round) => context.now >= BigInt(round.sTime) && context.now < BigInt(round.eTime),
        ) + 1;

      if (roundIndex < 1) {
        if (command === "groupbuys.reserve") invalid();

        return empty();
      }

      const loaded = await state.load(period, roundIndex),
        round = loaded.rounds[roundIndex - 1]!,
        tiers = round.tiers ?? groupBuyTiers(context.rules, roundIndex);

      if (command === "groupbuys.reserve") {
        const eventId = str(params, "eventId"),
          exchangeId = str(params, "exchangeId"),
          marker = createHash("sha256").update(eventId).digest("hex"),
          product = groupBuyProducts(context.rules).find((product) => product.id === exchangeId),
          record = loaded.record,
          entries = text(record ?? {}, "info")
            .split("|")
            .filter(Boolean);

        if (
          str(params, "operationId") !== groupBuyOperation("reserve", eventId) ||
          !product ||
          castle < cityInteger(config.k3) ||
          context.now > BigInt(round.cTime) ||
          round.flag === 1
        )
          invalid();

        const saved = entries.find((entry) => entry.startsWith(`${marker}:`));

        if (saved) {
          if (saved.split(":")[1] !== exchangeId) invalid();

          return empty();
        }

        const reserved = entries
          .filter((entry) => /^[a-f0-9]{64}:\d+:\d+:\d+:0$/.test(entry))
          .reduce((sum, entry) => sum + cityInteger(entry.split(":")[3], 1, 10), 0);

        if (num(record ?? {}, "point") + reserved + product.point > cityInteger(config.k4, 1, 10))
          invalid();

        entries.push(`${marker}:${exchangeId}:${context.now}:${product.point}:0`);
        context.write.groupBuy = {
          activity: loaded.activity,
          record: {
            id: text(loaded.activity, "id"),
            uid: context.owner,
            round: roundIndex,
            name: text(context.state.profile, "name"),
            allianceId: text(context.state.quests?.alliance ?? {}, "allianceId"),
            point: 0,
            buyTime: 0n,
            reward: 0,
            ...record,
            info: entries.join("|"),
          },
        };

        return {
          response: encode({
            activityId: sfs.string(text(loaded.activity, "id")),
            round: sfs.int(roundIndex),
          }),
          event: null,
        };
      }

      const userPoint = num(loaded.record ?? {}, "point"),
        buyMax = cityInteger(config.k4, 1, 10),
        code = castle < cityInteger(config.k3) ? "151969" : userPoint >= buyMax ? "151970" : "";

      return {
        response: encode(
          groupBuyInfo({
            rewardArr: tiers.map((tier) => ({
              level: tier.level,
              reward: rewardPreviewArray(
                previewRewards(tier.reward, context.rules, ruleContext, randomInt),
              ),
              rewardId: tier.reward,
            })),
            buyMax,
            exchangeArr: groupBuyProducts(context.rules).map((product) => ({
              exchangeId: product.id,
              product_id: product.rule.product_id ?? product.rule.productId ?? "",
              dollar: product.rule.dollar ?? "",
              exchangePoint: product.point,
            })),
            totalBuy: loaded.total,
            buyArr: loaded.recent.map((row) => ({
              name: text(row, "name"),
              uid: text(row, "uid"),
              point: num(row, "point"),
              time: long(row, "buyTime"),
            })),
            userPoint,
            canBuy: !code,
            ...(code ? { buyCode: code } : {}),
            sTime: BigInt(round.sTime),
            eTime: BigInt(round.eTime),
            cTime: BigInt(round.cTime),
          }),
        ),
        event: null,
      };
    },
    async apply() {
      invalid();
    },
  };
}
