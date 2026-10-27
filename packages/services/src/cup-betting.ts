import { createHash, randomUUID } from "node:crypto";
import { encode, sfs, str } from "@opencok/messages/sfs";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import {
  cupCalendar,
  cupMatches,
  cupLimits,
  cupPayout,
  reconcileCupMatches,
} from "@opencok/rules/cup-betting";
import { cityInteger } from "@opencok/rules/city-progression";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { cupMatchView, cupBetView } from "@opencok/mappings/cup-betting";
import { grantNativeProgressionReward, pinProgressionReward } from "./progression-rewards";
import type { CityDomain } from "./city-progression";
import type { CupScheduleStore } from "@opencok/contracts/cup-betting";
import type { Rules } from "@opencok/rules/game";

const assets = ["wood", "stone", "iron", "food"] as const;

function invalid(): never {
  throw new GameError(errors.invalid, "city_progression");
}

export class CupScheduleService {
  constructor(
    readonly store: CupScheduleStore,
    readonly rules: Rules,
    readonly now = Date.now,
  ) {}

  refresh() {
    return this.store.reconcile(cupMatches(this.rules), BigInt(this.now()));
  }
}

export function cupSettlementOperation(owner: string, ids: readonly string[]) {
  if (!ids.length || ids.length > 4096 || new Set(ids).size !== ids.length) invalid();

  return `cup:settle:${createHash("sha256")
    .update(JSON.stringify([owner, [...ids].sort()]))
    .digest("hex")}`;
}

export const cupBettingDomain: CityDomain = {
  commands: [
    "euro.cup.info",
    "euro.cup.bet.info",
    "euro.cup.record",
    "euro.cup.bet",
    "euro.cup.reward",
    "euro.cup.settle",
  ],
  types: [],
  async prepare(context, command, params) {
    const state = context.state.cupBetting;

    if (!state) invalid();

    const empty = () => ({ response: encode({}), event: null }),
      calendar = cupCalendar(context.rules),
      mail = command === "euro.cup.settle";

    if (!mail && (!calendar || context.now < calendar.start || context.now > calendar.end))
      return empty();

    if (mail && (!calendar || context.now <= calendar.end)) invalid();

    const matches = reconcileCupMatches(state.matches, cupMatches(context.rules), context.now),
      byId = new Map(matches.map((row) => [text(row, "id"), row])),
      bets = state.bets.map((row) => {
        const match = byId.get(text(row, "matchId"));

        return match && num(match, "ended") === 1
          ? { ...row, ended: 1, winner: text(match, "winner") }
          : row;
      });
    context.write.cupBetting = {
      matches,
      bets: bets.filter((row, index) => row !== state.bets[index]),
    };

    if (command === "euro.cup.info")
      return {
        response: encode({
          matchList: sfs.array(
            matches
              .filter((row) => num(row, "ended") !== 1)
              .map((row) =>
                sfs.object(cupMatchView(row, bets.filter((bet) => bet.matchId === row.id).length)),
              ),
          ),
        }),
        event: null,
      };

    if (command === "euro.cup.bet.info" || command === "euro.cup.record") {
      const matchId = command === "euro.cup.bet.info" ? str(params, "matchId") : undefined;

      return {
        response: encode({
          betList: sfs.array(
            bets
              .filter((row) => matchId === undefined || row.matchId === matchId)
              .map((row) =>
                sfs.object(
                  cupBetView(
                    row,
                    command === "euro.cup.record" ? byId.get(text(row, "matchId")) : undefined,
                    command === "euro.cup.record",
                  ),
                ),
              ),
          ),
        }),
        event: null,
      };
    }

    if (command === "euro.cup.bet") {
      const matchId = str(params, "matchId"),
        amount = cityInteger(str(params, "betNum"), 1),
        type = cityInteger(str(params, "resType"), 0, 3),
        side = str(params, "side"),
        match = byId.get(matchId),
        limits = cupLimits(context.rules, type),
        owned = bets.filter((row) => row.matchId === matchId);

      if (
        !match ||
        num(match, "ended") === 1 ||
        context.now <= long(match, "startBetTime") ||
        context.now >= long(match, "startTime") ||
        owned.length >= limits.count ||
        (owned.length > 0 && num(owned[0]!, "resourceType") !== type) ||
        owned.reduce((sum, row) => sum + BigInt(num(row, "betNum")), 0n) + BigInt(amount) >
          limits.cap
      )
        invalid();

      const sides = text(match, "vs").split("|"),
        index = sides.findIndex((value) => value.toLowerCase() === side.toLowerCase());

      if (index < 0) invalid();

      const odds = Math.fround(num(match, index === 0 ? "oddsA" : "oddsB"));

      if (!Number.isFinite(odds) || odds <= 0) invalid();

      context.spend({ [assets[type]!]: BigInt(amount) }, false);
      const bet: Row = {
        uuid: randomUUID().replaceAll("-", ""),
        uid: context.owner,
        matchId,
        vs: text(match, "vs"),
        resourceType: type,
        betNum: amount,
        betSide: sides[index]!,
        winner: "",
        ended: 0,
        rewarded: 0,
        odds,
      };
      match[index === 0 ? "betNumA" : "betNumB"] =
        long(match, index === 0 ? "betNumA" : "betNumB") + BigInt(amount);
      const a = long(match, "betNumA"),
        b = long(match, "betNumB");

      if ((a >= limits.threshold || b >= limits.threshold) && a > 0n && b > 0n) {
        match.oddsA = Math.fround(Math.fround(Number(a + b)) / Math.fround(Number(a)));
        match.oddsB = Math.fround(Math.fround(Number(a + b)) / Math.fround(Number(b)));
      }

      context.write.cupBetting.bets = [...(context.write.cupBetting.bets ?? []), bet];
      const reward = grantNativeProgressionReward(
        context,
        pinProgressionReward(context, limits.reward),
      );

      return { response: encode({ ...cupBetView(bet), reward: sfs.array(reward) }), event: null };
    }

    const pending = bets
        .filter((row) => num(row, "ended") === 1 && num(row, "rewarded") === 0)
        .slice(0, mail ? 64 : 4096),
      totals = new Map<number, bigint>();

    if (
      mail &&
      str(params, "operationId") !==
        cupSettlementOperation(
          context.owner,
          pending.map((row) => text(row, "uuid")),
        )
    )
      invalid();

    for (const bet of pending) {
      if (text(bet, "winner") === text(bet, "betSide")) {
        const type = cityInteger(bet.resourceType, 0, 3),
          value = cupPayout(cityInteger(bet.betNum, 1), num(bet, "odds"));
        totals.set(type, (totals.get(type) ?? 0n) + value);
      }

      bet.rewarded = 1;
    }

    context.write.cupBetting.bets = bets.filter(
      (row) => pending.includes(row) || !state.bets.includes(row),
    );

    if (mail) {
      for (const bet of pending) {
        if (text(bet, "winner") !== text(bet, "betSide")) continue;

        const type = cityInteger(bet.resourceType, 0, 3),
          value = cupPayout(cityInteger(bet.betNum, 1), num(bet, "odds")),
          template = context.rules.mail.get("11763"),
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
            rewardId: `${assets[type]!},0,${value}`,
            rewardStatus: 0,
            reply: 0,
            createTime: context.now,
          },
        ];
      }

      return empty();
    }

    for (const [type, value] of totals) context.economy.resource(`${assets[type]!}bind`, value);

    const rewards = [];

    for (const [type, amount] of [...totals].toSorted((a, b) => a[0] - b[0])) {
      let remaining = amount;

      while (remaining > 0n) {
        const value = remaining > 2147483647n ? 2147483647n : remaining;
        rewards.push(sfs.object({ type: sfs.int(type), value: sfs.int(Number(value)) }));
        remaining -= value;
      }
    }

    return { response: encode({ reward: sfs.array(rewards) }), event: null };
  },
  async apply() {
    invalid();
  },
};
