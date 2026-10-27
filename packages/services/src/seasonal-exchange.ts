import { CityCommandDomain } from "./city-command-domain.ts";
import { randomInt } from "node:crypto";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import { sfs, encode, int, type Fields } from "@opencok/messages/sfs";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import {
  seasonalExchangeFailure,
  seasonalExchangeRewards,
  selectSeasonalRewards,
} from "@opencok/rules/seasonal-exchange";
import { previewRewards } from "@opencok/rules/rewards";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import { seasonalExchangeView } from "@opencok/mappings/seasonal-exchange";
import { pinProgressionReward, grantNativeProgressionReward } from "./progression-rewards";
import type { CityDomain } from "./city-domain.ts";

export class SeasonalExchangeDomain extends CityCommandDomain {
  public readonly commands: CityDomain["commands"];
  public readonly types: CityDomain["types"];
  public readonly prepare: CityDomain["prepare"];
  public readonly apply: CityDomain["apply"];

  public constructor(random: (maximum: number) => number = randomInt) {
    super();

    this.commands = ["activity.exchange.info", "activity.exchange.reward"];

    this.types = [];

    this.prepare = async (context, command, params) => {
      if (int(params, "type") !== 5) {seasonalExchangeFailure();}

      const config = context.rules.items.get("chrisms"),
        state = context.state.seasonalExchange,
        period = state?.period;

      if (
        !config ||
        config.k12 === "0" ||
        !state ||
        !period ||
        long(period, "openTime") <= 0n ||
        context.now < long(period, "openTime") ||
        long(period, "startTime") <= 0n ||
        context.now < long(period, "startTime") ||
        context.now >= long(period, "endTime")
      )
        {seasonalExchangeFailure();}

      cityInteger(config.k12, 1);
      const interval = cityAmount(config.k1) * 1000n;
      let row: Row | undefined = state.record ? { ...state.record } : undefined;
      const refresh = () => {
        row = {
          ...(row ?? {
            uid: context.owner,
            actId: 5,
            reserve_1: 0,
            reserve_2: "",
            flushTimes: 0,
            flushDate: 0n,
            receiveLevels: "",
          }),
          level: 0,
          rewards: selectSeasonalRewards(config, random),
          updateTime: context.now,
        };
        context.write.seasonalExchange = row;
      };

      if (
        command === "activity.exchange.info" &&
        (!row || (config.k12 === "1" && context.now - long(row, "updateTime") >= interval))
      )
        {refresh();}

      if (!row) {seasonalExchangeFailure();}

      const view = () =>
        seasonalExchangeView(
          cityInteger(row!.level, 0, 4),
          long(row!, "updateTime") + interval,
          long(row!, "updateTime") / 86400000n === context.now / 86400000n
            ? num(row!, "flushTimes")
            : 0,
          seasonalExchangeRewards(text(row!, "rewards")).map((reward, index) => ({
            rewardId: sfs.string(reward.id),
            level: sfs.int(index + 1),
            needNum: sfs.int(reward.count),
            color: sfs.int(reward.color),
            reward: rewardPreviewArray(
              previewRewards(
                reward.id,
                context.rules,
                {
                  kingdomId: context.rules.kingdomId,
                  version: "12.06.0",
                  now: Number(context.now),
                },
                random,
              ),
            ),
          })),
          text(row!, "receiveLevels"),
        );

      if (command === "activity.exchange.info")
        {return { response: encode({ activity: sfs.object(view()) }), event: null };}

      const level = cityInteger(int(params, "level"), 1, 5);

      if (level !== num(row, "level") + 1 || !context.economy.quantity) {seasonalExchangeFailure();}

      const reward = seasonalExchangeRewards(text(row, "rewards"))[level - 1]!;
      context.economy.item("209174", -reward.count);
      const body: Fields = {};

      if (level === 5) {
        refresh();
        body.activity = sfs.object(view());
      } else {
        row.level = level;
        context.write.seasonalExchange = row;
        body.level = sfs.int(level);
      }

      body.num = sfs.int(context.economy.quantity("209174"));
      body.reward = sfs.array(
        grantNativeProgressionReward(context, pinProgressionReward(context, reward.id)),
      );

      return { response: encode(body), event: null };
    };

    this.apply = async () => {
      seasonalExchangeFailure();
    };
  }
}

export function createSeasonalExchangeDomain(
  random: (maximum: number) => number = randomInt,
): CityDomain {
  return new SeasonalExchangeDomain(random);
}
