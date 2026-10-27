import { CityCommandDomain } from "./city-command-domain.ts";
import { avatarMailPush } from "@opencok/mappings/avatar-mail";
import type { AvatarSystemMail } from "@opencok/contracts/files";
import { createHash, randomInt } from "node:crypto";
import { sfs, encode, int, str, Type, type Fields, type Value } from "@opencok/messages/sfs";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import type { GoldEggsRanks, GoldEggsPeriod } from "@opencok/contracts/gold-eggs";
import {
  goldEggsCalendar,
  goldEggsEnabled,
  goldEggsPeriod,
  goldEggsCells,
  goldEggsCellText,
  goldEggsDisk,
  goldEggsMultiplier,
  goldEggsClaims,
  goldEggsScoreRewards,
  goldEggsFlushCost,
  goldEggsRecord,
  goldEggsPeriodId,
  goldEggsFailure,
} from "@opencok/rules/gold-eggs";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { goldEggsCellsView, goldEggsRankingView } from "@opencok/mappings/gold-eggs";
import { pinProgressionReward, grantNativeProgressionReward } from "./progression-rewards";
import { pinGoldEggRewards } from "./gold-eggs-rewards";
import type { CityDomain } from "./city-domain.ts";
import type { CityProgressionContext } from "./city-progression-context.ts";

const nextDay = (now: bigint) => (now / 86400000n + 1n) * 86400000n;

function position(params: Fields, maximum: number) {
  if (params.pos?.type !== Type.Int) goldEggsFailure();

  return cityInteger(int(params, "pos"), 0, maximum - 1);
}

function cost(context: CityProgressionContext, amount: number) {
  if (context.balance("gold") < BigInt(amount))
    throw new GameError(errors.gold, "city_progression");

  context.economy.gold(-BigInt(amount));
}

function grant(
  context: CityProgressionContext,
  ids: readonly string[],
  multiple: number,
  random: (maximum: number) => number,
) {
  const raw = pinGoldEggRewards(context, ids, multiple, random);

  return raw ? grantNativeProgressionReward(context, raw) : [];
}

function steps(
  context: CityProgressionContext,
  length: number,
  random: (maximum: number) => number,
) {
  const rows = [...(context.rules.advanced.goldenEggSteps?.values() ?? [])];

  if (!rows.length || rows.length > 256) goldEggsFailure();

  const pick = random(rows.length);

  if (!Number.isInteger(pick) || pick < 0 || pick >= rows.length) goldEggsFailure();

  const step = rows[pick]!.step ?? "",
    order = step.split(";").map((raw) => cityInteger(raw, 0, length - 1));

  if (order.length !== length || new Set(order).size !== length) goldEggsFailure();

  return { step, order };
}

export function goldEggsAwardOperation(owner: string, period: GoldEggsPeriod, global: boolean) {
  return `gold-eggs-award:${createHash("sha256")
    .update(`${owner}:${goldEggsPeriodId(period)}:${global}`)
    .digest("hex")}`;
}

export function goldEggsAwardParameters(
  owner: string,
  period: GoldEggsPeriod,
  global: boolean,
): Fields {
  return {
    start: sfs.long(period.start),
    end: sfs.long(period.end),
    global: sfs.bool(global),
    operationId: sfs.string(goldEggsAwardOperation(owner, period, global)),
  };
}

export class GoldEggsDomain extends CityCommandDomain {
  public readonly commands: CityDomain["commands"];
  public readonly types: CityDomain["types"];
  public readonly prepare: CityDomain["prepare"];
  public readonly apply: CityDomain["apply"];

  public constructor(random: (maximum: number) => number = randomInt, globalRanks?: GoldEggsRanks) {
    super();

    this.commands = [
      "goldeggs.info",
      "goldeggs.smashing",
      "goldeggs.smashingall",
      "goldeggs.flush",
      "goldeggs.scorereward",
      "goldeggs.rank",
      "goldeggs.rankAll",
      "goldeggs.award.deliver",
    ];

    this.types = [];

    this.prepare = async (context, command, params) => {
      const reader = context.state.goldEggs,
        period = goldEggsPeriod(context.rules);

      if (
        !goldEggsEnabled(context.rules, context.now) ||
        num(context.state.profile, "crossFightSrcServerId") > 0
      )
        throw new GameError(errors.unsupported, "city_progression");

      if (!reader || !period) goldEggsFailure();

      if (command === "goldeggs.award.deliver") {
        if (
          params.start?.type !== Type.Long ||
          params.end?.type !== Type.Long ||
          params.global?.type !== Type.Bool
        )
          goldEggsFailure();

        const value = { start: cityAmount(params.start.value), end: cityAmount(params.end.value) },
          global = params.global.value === true;

        if (str(params, "operationId") !== goldEggsAwardOperation(context.owner, value, global))
          goldEggsFailure();

        const award = await reader.award(value, global);

        if (!award) goldEggsFailure();

        const template = context.rules.mail.get(award.template),
          contents = javaMailBytes(
            template?.message ? `${template.message}|${award.rank}` : undefined,
          );

        if (!template || !contents) goldEggsFailure();

        const quests = (context.write.quests ??= {});
        quests.mail = [
          ...(quests.mail ?? []),
          {
            uid:
              createHash("sha256")
                .update(goldEggsAwardOperation(context.owner, value, global))
                .digest("hex")
                .slice(0, 32) + "00",
            owner: context.owner,
            fromName: template.sender ?? "",
            title: template.title ?? "",
            type: 2,
            contents,
            extra: null,
            rewardId: pinProgressionReward(context, award.reward),
            rewardStatus: 0,
            reply: 0,
            createTime: context.now,
          },
        ];
        const message: AvatarSystemMail = quests.mail.at(-1)!;

        if (!context.economy.event) goldEggsFailure();

        context.economy.event({
          id: "gold-eggs-mail",
          type: "gold.eggs.mail",
          payload: encode({
            owner: sfs.string(context.owner),
            mail: sfs.object(
              avatarMailPush(
                message,
                context.rules.items.get("chat_switch")?.k3?.split("|").includes("1") ?? false,
              ),
            ),
          }),
        });
        context.write.goldEggs = { award: { period: value, global } };

        return { response: encode({}), event: null };
      }

      if (command === "goldeggs.rank" || command === "goldeggs.rankAll") {
        const global = command === "goldeggs.rankAll",
          rows = global
            ? goldEggsEnabled(context.rules, context.now, true)
              ? ((await globalRanks?.live(period)) ?? [])
              : []
            : await reader.ranking(period);

        return {
          response: encode(
            goldEggsRankingView(
              rows.slice(
                0,
                cityInteger(
                  context.rules.items.get("ranking")?.[global ? "k6" : "k2"] ?? 150,
                  1,
                  150,
                ),
              ),
              context.owner,
              context.rules.kingdomId,
              global,
            ),
          ),
          event: null,
        };
      }

      const calendar = goldEggsCalendar(context.rules, context.now),
        config = context.rules.items.get("golden_egg");

      if (!calendar?.admitted || !config) goldEggsFailure();

      const saved = await reader.prepare(calendar);

      if (!saved && command !== "goldeggs.info") goldEggsFailure();

      const row: Row = saved
        ? { ...saved }
        : {
            uid: context.owner,
            flushfreetimes: cityInteger(config.k4),
            flushtime: 0n,
            flushcount: 0,
            statelist: "",
            freetimes: cityInteger(config.k1),
            everydaytime: context.now,
            multiple: 1,
            score: 0n,
            score_reward: "",
            ranking: 0,
            createtime: context.now,
          };
      goldEggsRecord(row, context.owner, context.now);
      let cells = goldEggsCells(row.statelist, context.rules);

      if (!cells.length && command === "goldeggs.info") cells = goldEggsDisk(context.rules, random);

      if (!cells.length && ["goldeggs.smashing", "goldeggs.smashingall"].includes(command))
        goldEggsFailure();

      let body: Fields;

      if (command === "goldeggs.info") {
        row.everydaytime = context.now;
        body = {
          list: goldEggsCellsView(cells),
          freetimes: sfs.int(num(row, "freetimes")),
          freeflush: sfs.int(num(row, "flushfreetimes")),
          goldflush: sfs.int(goldEggsFlushCost(row, context.rules)),
          costGold: sfs.int(cityInteger(config.k3, 1)),
          score: sfs.long(long(row, "score")),
          scoreReward: sfs.string(text(row, "score_reward")),
          reward: sfs.string(config.k7 ?? ""),
          curDaytime: sfs.long(nextDay(context.now)),
        };
      } else if (command === "goldeggs.scorereward") {
        const rewards = goldEggsScoreRewards(context.rules),
          pos = position(params, rewards.length),
          claimed = goldEggsClaims(row.score_reward, context.rules),
          reward = rewards[pos]!;

        if (claimed.includes(pos) || long(row, "score") < reward.score) goldEggsFailure();

        row.score_reward = [...claimed, pos].join(";");
        body = { reward: sfs.array(grant(context, [reward.reward], 1, random)), pos: sfs.int(pos) };
      } else if (command === "goldeggs.flush") {
        const amount = goldEggsFlushCost(row, context.rules);

        if (amount) {
          cost(context, amount);
          row.flushcount = cityInteger(num(row, "flushcount") + 1);
        } else row.flushfreetimes = cityInteger(num(row, "flushfreetimes") - 1);

        cells = goldEggsDisk(context.rules, random);
        row.flushtime = context.now;
        body = {
          list: goldEggsCellsView(cells),
          gold: sfs.long(context.balance("gold")),
          goldflush: sfs.int(goldEggsFlushCost(row, context.rules)),
          curDaytime: sfs.long(nextDay(context.now)),
        };
      } else if (command === "goldeggs.smashing") {
        const pos = position(params, cells.length),
          cell = cells[pos]!;

        if (cell.smashed) goldEggsFailure();

        if (num(row, "freetimes") > 0) row.freetimes = cityInteger(num(row, "freetimes") - 1);
        else cost(context, cityInteger(config.k3, 1));

        const egg = context.rules.advanced.goldenEggs!.get(cell.id)!;
        body = {};

        if (egg.reward) {
          body.reward = sfs.array(
            grant(context, [egg.reward], cityInteger(row.multiple, 1, 10000), random),
          );
          row.multiple = 1;
        }

        if (egg.status) {
          row.multiple = goldEggsMultiplier(egg, num(row, "multiple"), random);
          body.multiple = sfs.int(num(row, "multiple"));
        }

        row.score = cityAmount(long(row, "score") + BigInt(cityInteger(egg.score)));
        cell.smashed = true;

        if (cells.every((cell) => cell.smashed)) {
          cells = goldEggsDisk(context.rules, random);
          body.list = goldEggsCellsView(cells);
        }

        Object.assign(body, {
          freetimes: sfs.int(num(row, "freetimes")),
          pos: sfs.int(pos),
          state: sfs.bool(true),
          gold: sfs.long(context.balance("gold")),
          allscore: sfs.long(long(row, "score")),
        });
      } else {
        if (cells.some((cell) => cell.smashed)) throw new GameError("175408", "city_progression");

        cost(context, cityInteger(config.k10, 1));
        const { step, order } = steps(context, cells.length, random),
          ids: string[] = [],
          results: Value[] = [];

        for (const pos of order) {
          const egg = context.rules.advanced.goldenEggs!.get(cells[pos]!.id)!;
          const result: Fields = { state: sfs.bool(true) };

          if (egg.reward) {
            const multiple = cityInteger(row.multiple, 1, 10000);

            if (ids.length + multiple > 4096) goldEggsFailure();

            for (let i = 0; i < multiple; i++) ids.push(egg.reward);

            row.multiple = 1;
          }

          if (egg.status) {
            row.multiple = goldEggsMultiplier(egg, num(row, "multiple"), random);
            result.multiple = sfs.int(num(row, "multiple"));
          }

          results.push(sfs.object(result));
          row.score = cityAmount(long(row, "score") + BigInt(cityInteger(egg.score)));
        }

        const rewards = grant(context, ids, cityInteger(row.multiple, 1, 10000), random);
        cells = goldEggsDisk(context.rules, random);
        row.flushtime = context.now;
        body = {
          reward: sfs.array(rewards),
          list: sfs.array(results),
          freetimes: sfs.int(num(row, "freetimes")),
          gold: sfs.long(context.balance("gold")),
          allscore: sfs.long(long(row, "score")),
          step: sfs.string(step),
          flushlist: goldEggsCellsView(cells),
        };
      }

      row.statelist = goldEggsCellText(cells);
      context.write.goldEggs = { record: row, period };

      return { response: encode(body), event: null };
    };

    this.apply = async () => {
      goldEggsFailure();
    };
  }
}

export function createGoldEggsDomain(
  random: (maximum: number) => number = randomInt,
  globalRanks?: GoldEggsRanks,
): CityDomain {
  return new GoldEggsDomain(random, globalRanks);
}
