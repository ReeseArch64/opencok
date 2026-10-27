import { CityCommandDomain } from "./city-command-domain.ts";
import { serverFeature } from "@opencok/rules/power-context";
import { randomUUID, createHash, randomInt } from "node:crypto";
import { sfs, encode, int } from "@opencok/messages/sfs";
import { long, num, type Row } from "@opencok/contracts/rows";
import { continuedCostPeriod, continuedCostClaims } from "@opencok/rules/continued-cost";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { readContinuedCostSpending, continuedCostInfo } from "@opencok/mappings/continued-cost";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import { previewRewards } from "@opencok/rules/rewards";
import { pinProgressionReward, grantNativeProgressionReward } from "./progression-rewards";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { ContinuedCostPeriod } from "@opencok/contracts/continued-cost";
import type { CityDomain } from "./city-domain.ts";
import type { CityProgressionContext } from "./city-progression-context.ts";

function failure(): never {
  throw new GameError(errors.invalid, "city_progression");
}

async function owned(context: CityProgressionContext, period: ContinuedCostPeriod) {
  const record = await context.state.continuedCost?.load(period.type, period.start);

  if (!record) return;

  if (
    long(record, "periodStart") === period.start ||
    (long(record, "updateTime") > period.start && long(record, "updateTime") < period.end)
  )
    return { ...record, periodStart: period.start };
}

function claimMail(context: CityProgressionContext, reward: string) {
  const template = context.rules.mail.get("12174"),
    contents = javaMailBytes(template?.message);

  if (!template || !contents) failure();

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
      rewardId: pinProgressionReward(context, reward),
      rewardStatus: 0,
      reply: 0,
      createTime: context.now,
    },
  ];
}

export class ContinuedCostDomain extends CityCommandDomain {
  public readonly commands: CityDomain["commands"] = [
    "continuedcost.info",
    "continuedcost.reward",
    "continuedcost.apply",
    "continuedcost.hideking",
    "continuedcost.global.reward",
  ];

  public readonly types: CityDomain["types"] = [];

  public readonly prepare: CityDomain["prepare"] = async (context, command, params) => {
    if (!context.state.continuedCost) failure();

    if (command === "continuedcost.hideking" || command === "continuedcost.global.reward") {
      if (
        !serverFeature(context.rules, "new_rank_cost", {
          kingdomId: context.rules.kingdomId,
          version: "12.06.0",
          now: Number(context.now),
        })
      )
        return { response: encode({}), event: null };

      if (command === "continuedcost.hideking") {
        if (!context.state.quests?.mixed.uid) return { response: encode({}), event: null };

        const current = num(context.state.quests?.mixed ?? {}, "costHide");

        if (![0, 1].includes(current)) failure();

        context.write.continuedCostHide = current === 0 ? 1 : 0;

        return {
          response: encode({ myHide: sfs.int(context.write.continuedCostHide) }),
          event: null,
        };
      }

      const bands = (context.rules.items.get("continued_cost")?.k5 ?? "")
        .split("|")
        .filter(Boolean);

      if (!bands.length) return { response: encode({}), event: null };

      if (bands.length > 128) failure();

      return {
        response: encode({
          rewardArr: sfs.array(
            bands.map((raw) => {
              const [lower, upper, reward, ...extra] = raw.split(";");
              const min = cityInteger(lower, 1),
                max = cityInteger(upper, min);

              if (extra.length || !reward || !context.rules.reconnect.rewards?.has(reward))
                failure();

              return sfs.object({
                min: sfs.int(min),
                max: sfs.int(max),
                rewardId: sfs.string(reward),
                reward: rewardPreviewArray(
                  previewRewards(
                    reward,
                    context.rules,
                    {
                      kingdomId: context.rules.kingdomId,
                      version: "12.06.0",
                      now: Number(context.now),
                    },
                    randomInt,
                  ),
                ),
              });
            }),
          ),
        }),
        event: null,
      };
    }

    const evidence =
        command === "continuedcost.apply" ? readContinuedCostSpending(encode(params)) : undefined,
      period =
        evidence ??
        continuedCostPeriod(
          context.rules,
          context.state.profile,
          context.state.buildings,
          Number(context.now),
        );

    if (!period) return { response: encode({}), event: null };

    if (evidence && (evidence.owner !== context.owner || evidence.at > context.now)) failure();

    let row: Row | undefined = await owned(context, period);

    if (command === "continuedcost.info") {
      const claims = continuedCostClaims(row?.getLv);

      return {
        response: encode(
          continuedCostInfo(
            period.type,
            period.face,
            period.tiers.map((tier) => ({
              point: sfs.int(cityInteger(tier.point)),
              important: sfs.string(tier.important),
              reward: rewardPreviewArray(
                previewRewards(
                  tier.reward,
                  context.rules,
                  {
                    kingdomId: context.rules.kingdomId,
                    version: "12.06.0",
                    now: Number(context.now),
                  },
                  randomInt,
                ),
              ),
            })),
            row ? num(row, "lv") : 0,
            [...claims].join(","),
            row ? long(row, "total") : undefined,
          ),
        ),
        event: null,
      };
    }

    if (!evidence && !row) failure();

    const claimed = continuedCostClaims(row?.getLv),
      logs: number[] = [];
    row = {
      uid: context.owner,
      type: period.type,
      total: 0n,
      para1: 0n,
      para2: 0n,
      lv: 0,
      updateTime: period.start,
      getLv: "",
      ...row,
      periodStart: period.start,
    };

    if (evidence) {
      row.total = cityAmount(long(row, "total") + evidence.amount);
      row.para1 = cityAmount(long(row, "para1") + evidence.paid);
      row.para2 = cityAmount(long(row, "para2") + evidence.free);
      row.updateTime =
        long(row, "updateTime") > evidence.at ? long(row, "updateTime") : evidence.at;
      const level =
        period.tiers.filter((tier) => tier.point <= long(row!, "total")).at(-1)?.level ?? 0;

      for (const tier of period.tiers)
        if (tier.level > num(row, "lv") && tier.level <= level && !claimed.has(tier.level)) {
          claimMail(context, tier.reward);
          claimed.add(tier.level);
          logs.push(tier.level);
        }

      row.lv = Math.max(num(row, "lv"), level);
      row.getLv = [...claimed].map((value) => `,${value}`).join("");
      continuedCostClaims(row.getLv);
      context.write.continuedCost = { row, logs };

      return { response: encode({}), event: null };
    }

    const level = cityInteger(int(params, "getLv"), 1),
      tier = period.tiers.find((tier) => tier.level === level);

    if (!tier || num(row, "lv") < level || claimed.has(level))
      throw new GameError(errors.rewardClaimed, "city_progression");

    const granted = grantNativeProgressionReward(
      context,
      pinProgressionReward(context, tier.reward),
    );
    claimed.add(level);
    row.getLv = [...claimed].map((value) => `,${value}`).join("");
    row.updateTime = context.now;
    context.write.continuedCost = { row, logs: [level] };

    return {
      response: encode({ rewardArray: sfs.array(granted), getLv: sfs.int(level) }),
      event: null,
    };
  };

  public readonly apply: CityDomain["apply"] = async () => {
    failure();
  };
}

export const continuedCostDomain: CityDomain = new ContinuedCostDomain();

export function continuedCostOperation(owner: string, request: string, event: string) {
  return `cost:${createHash("sha256")
    .update(JSON.stringify([owner, request, event]))
    .digest("hex")}`;
}
