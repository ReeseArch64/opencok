import { createHash, randomInt } from "node:crypto";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import { encode, sfs, str, int, type Fields } from "@opencok/messages/sfs";
import type { SevenDayPaymentGateway } from "@opencok/contracts/seven-day-cycle";
import type { Rule } from "@opencok/rules/game";
import { cityInteger } from "@opencok/rules/city-progression";
import {
  cycleFailure,
  cycleField,
  cycleClaims,
  cycleBuffs,
  cycleOffers,
  cycleDrawOpen,
  cycleDrawChoice,
} from "@opencok/rules/seven-day-cycle";
import { previewRewards } from "@opencok/rules/rewards";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import { sevenDayCycleView } from "@opencok/mappings/seven-day-cycle";
import { pinProgressionReward, grantNativeProgressionReward } from "./progression-rewards";
import { applyProgressionStatus } from "./player-effects";
import type { CityDomain, CityProgressionContext } from "./city-progression";
export function sevenDayPurchaseOperationId(owner: string, eventId: string): string {
  if (!/^[A-Za-z0-9:._-]{1,128}$/.test(eventId)) cycleFailure();
  return `sevenday:${createHash("sha256").update(`${owner}\0${eventId}`).digest("hex")}`;
}
function decimal(rule: Rule, key: string): number {
  const value = Number(rule[key]);
  if (!rule[key]?.trim() || !Number.isFinite(value)) cycleFailure();
  return value;
}
function fresh(context: CityProgressionContext): Row {
  return {
    uid: context.owner,
    ...Object.fromEntries(
      [0, 1, 2].flatMap((page) => [
        [cycleField("stage", page), 0],
        [cycleField("totalstage", page), 0],
        [cycleField("waittime", page), -1n],
        [cycleField("cdtime", page), -1n],
        [cycleField("receive_reward", page), ""],
      ]),
    ),
  };
}
export function createSevenDayCycleDomain(
  gateway?: SevenDayPaymentGateway,
  random: (maximum: number) => number = randomInt,
): CityDomain {
  return {
    commands: [
      "sevenday.init",
      "sevenday.info",
      "sevenday.look.reward",
      "sevenday.reward",
      "sevenday.lucky.draw",
      "sevenday.purchase",
    ],
    types: [],
    async prepare(context, command, params) {
      const state = context.state.sevenDayCycle;
      if (!state) cycleFailure();
      const empty = () => ({ response: encode({}), event: null });
      const ruleContext = {
        kingdomId: context.rules.kingdomId,
        version: "12.06.0",
        now: Number(context.now),
      };
      if (command === "sevenday.look.reward") {
        const rule = context.rules.advanced.exchangeCycles?.get(str(params, "id"));
        if (!rule) cycleFailure();
        return {
          response: encode({
            reward_arr: rewardPreviewArray(
              previewRewards(rule.reward, context.rules, ruleContext, random),
            ),
          }),
          event: null,
        };
      }
      const row = state.cycle ? { ...state.cycle } : fresh(context),
        write = (context.write.sevenDayCycle ??= {});
      if (!state.cycle) write.cycle = row;
      if (command === "sevenday.init") return empty();
      const page = cityInteger(int(params, "page"), 0, 2),
        stageKey = cycleField("stage", page),
        waitKey = cycleField("waittime", page),
        cdKey = cycleField("cdtime", page),
        claimsKey = cycleField("receive_reward", page);
      let stage = cityInteger(row[stageKey], 0, 6),
        cd = long(row, cdKey);
      if (cd > 0n && context.now >= cd) {
        row[stageKey] = stage = 0;
        row[cdKey] = cd = -1n;
        write.cycle = row;
      }
      const castle = context.state.buildings.find((building) => num(building, "itemId") === 400000),
        offers = cycleOffers(context.rules, page, num(castle ?? {}, "level"));
      const last = long(row, waitKey),
        today = context.now / 86400000n,
        waited = last > 0n && last / 86400000n === today;
      const draw = {
        uid: context.owner,
        type: page,
        count: 0,
        upTime: 0n,
        randTime: 0n,
        reward: "",
        ...state.draws.find((item) => num(item, "type") === page),
      };
      const drawOpen = cycleDrawOpen(context.rules, page, ruleContext);
      if (command === "sevenday.purchase") {
        const eventId = str(params, "eventId"),
          exchangeId = str(params, "exchangeId");
        if (
          !gateway ||
          str(params, "operationId") !== sevenDayPurchaseOperationId(context.owner, eventId) ||
          !(await gateway.accept({ owner: context.owner, eventId, exchangeId }))
        )
          cycleFailure();
        const offer = offers.find(
          (offer) =>
            offer.exchangeid === exchangeId && cityInteger(offer.stage, 1, 7) === stage + 1,
        );
        if (!offer || waited || last > context.now) cycleFailure();
        const next = stage === 6 ? 0 : stage + 1;
        row[stageKey] = next;
        if (next === 0) row[claimsKey] = "";
        row[waitKey] = context.now;
        const totalKey = cycleField("totalstage", page);
        row[totalKey] = cityInteger(num(row, totalKey) + 1);
        const seconds = cityInteger(offer.time ?? 0);
        if (seconds > 0) row[cdKey] = (today + 1n) * 86400000n + BigInt(seconds) * 1000n;
        write.cycle = row;
        if (drawOpen) {
          draw.count = cityInteger(num(draw, "count") + 1);
          draw.upTime = context.now;
          write.draw = draw;
        }
        return empty();
      }
      if (command === "sevenday.info") {
        const can = [...(context.rules.advanced.exchangeCycles?.values() ?? [])]
          .filter((rule) => Number(rule.page) === page && rule.reward && rule.reward !== "0")
          .map((rule) => rule.id + ";")
          .join("");
        const body: Fields = sevenDayCycleView({
          countdown: waited ? cityInteger(((today + 1n) * 86400000n - context.now) / 1000n) : 0,
          curstage: stage,
          receive_reward: text(row, claimsKey),
          can_receive_reward: can,
          resettime: cd <= 0n ? -1 : cityInteger((cd - context.now) / 1000n),
        });
        body.datas = sfs.array(
          offers.map((offer) => {
            const exchange = context.rules.advanced.castleExchanges?.get(offer.exchangeid!);
            if (!exchange) cycleFailure();
            return sfs.object({
              id: sfs.int(cityInteger(offer.id, 1)),
              stage: sfs.int(cityInteger(offer.stage, 1, 7)),
              exchangeid: sfs.string(offer.exchangeid!),
              dollar: sfs.double(decimal(exchange, "dollar")),
              gold_doller: sfs.double(decimal(exchange, "gold_doller")),
              percent: sfs.int(cityInteger(exchange.percent)),
              price: sfs.double(decimal(exchange, "price")),
              item: sfs.string(exchange.item ?? ""),
              product_id: sfs.string(exchange.product_id ?? ""),
              hot: sfs.int(cityInteger(offer.hot ?? 0)),
              slogan: sfs.string(exchange.slogan ?? ""),
              name: sfs.string(exchange.name ?? ""),
            });
          }),
        );
        if (drawOpen) {
          if (!state.draws.some((item) => num(item, "type") === page)) write.draw = draw;
          const buffs = cycleBuffs(text(draw, "reward"));
          body.drawcount = sfs.int(cityInteger(draw.count));
          body.luckdrawcofig = sfs.array(
            [...(context.rules.advanced.cycleDraws?.values() ?? [])]
              .filter((rule) => Number(rule.type) === page)
              .map((rule) =>
                sfs.object({
                  id: sfs.string(rule.id!),
                  rate: sfs.string(rule.rate ?? ""),
                  ...(rule.buff
                    ? {
                        buff: sfs.string(rule.buff),
                        endTime: sfs.long(
                          (buffs.get(rule.buff) ?? 0n) > context.now ? buffs.get(rule.buff)! : 0n,
                        ),
                      }
                    : {}),
                  ...Object.fromEntries(
                    ["reward", "color", "lucky_round"]
                      .filter((key) => rule[key]?.trim())
                      .map((key) => [key, sfs.string(rule[key]!)]),
                  ),
                }),
              ),
          );
          body.drawhistory = sfs.array(
            state.history
              .filter((row) => num(row, "type") === page)
              .map((row) =>
                sfs.object({
                  alliancename: sfs.string(text(row, "allianceName")),
                  rolename: sfs.string(text(row, "roleName")),
                  id: sfs.string(text(row, "itemId")),
                  time: sfs.long(long(row, "time")),
                }),
              ),
          );
        }
        return { response: encode(body), event: null };
      }
      if (command === "sevenday.reward") {
        const id = str(params, "id"),
          rule = context.rules.advanced.exchangeCycles?.get(id),
          claimed = cycleClaims(text(row, claimsKey));
        if (
          !rule ||
          Number(rule.page) !== page ||
          !offers.some((offer) => offer.id === id) ||
          !rule.reward ||
          rule.reward === "0"
        )
          cycleFailure();
        if (claimed.includes(id) || stage < cityInteger(rule.stage, 1, 7)) return empty();
        const next = [...claimed, id].join(";") + ";";
        cycleClaims(next);
        const reward = grantNativeProgressionReward(
          context,
          pinProgressionReward(context, rule.reward),
        );
        row[claimsKey] = next;
        write.cycle = row;
        return { response: encode({ reward: sfs.array(reward) }), event: null };
      }
      if (!drawOpen) return empty();
      if (cityInteger(draw.count) < 1) cycleFailure();
      const choice = cycleDrawChoice(context.rules, page, random),
        body: Fields = { id: sfs.string(choice.id!) };
      if (choice.reward?.trim() && choice.reward !== "0")
        body.reward = sfs.array(
          grantNativeProgressionReward(context, pinProgressionReward(context, choice.reward)),
        );
      if (choice.buff?.trim()) {
        const buff = applyProgressionStatus(context, choice.buff),
          end = buff.endTime;
        if (!end) cycleFailure();
        body.buff = sfs.object(buff);
        context.economy.push?.("status.push", encode(buff));
        const buffs = cycleBuffs(text(draw, "reward"));
        buffs.set(choice.buff, BigInt(String(end.value)));
        const raw = [...buffs].map(([id, at]) => `${id}:${at}`).join("|");
        if (raw.length >= 500) cycleFailure();
        draw.reward = raw;
      }
      draw.count = cityInteger(num(draw, "count") - 1 + cityInteger(choice.lucky_round ?? 0));
      draw.randTime = context.now;
      write.draw = draw;
      if (["3", "4"].includes(choice.color ?? ""))
        write.history = {
          gameUid: context.owner,
          roleName: text(context.state.profile, "name"),
          allianceId: text(context.state.profile, "allianceId"),
          allianceName: text(context.state.quests?.alliance ?? {}, "name"),
          type: page,
          itemId: choice.id!,
          time: context.now,
        };
      body.drawcount = sfs.int(draw.count);
      return { response: encode(body), event: null };
    },
    async apply() {
      cycleFailure();
    },
  };
}
