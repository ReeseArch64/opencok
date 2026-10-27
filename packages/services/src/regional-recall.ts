import { CityCommandDomain } from "./city-command-domain.ts";
import { randomInt, randomUUID } from "node:crypto";
import { sfs, encode, type Value } from "@opencok/messages/sfs";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import {
  regionalRecallRule,
  regionalRecallEligible,
  regionalRecallBand,
  regionalRecallRewards,
  regionalRecallFailure,
} from "@opencok/rules/regional-recall";
import {
  regionalRecallView,
  regionalRecallClaim,
  regionalRecallLogin,
} from "@opencok/mappings/regional-recall";
import { serverFeature } from "@opencok/rules/power-context";
import { cityInteger } from "@opencok/rules/city-progression";
import { previewRewards } from "@opencok/rules/rewards";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import { grantNativeProgressionReward, pinProgressionReward } from "./progression-rewards";
import { temporaryEffect } from "@opencok/rules/player-effects";
import type { CityDomain } from "./city-domain.ts";

export class RegionalRecallDomain extends CityCommandDomain {
  public readonly commands: CityDomain["commands"] = [
    "region.recall.init",
    "region.recall.open.ui",
    "region.recall.receive",
  ];

  public readonly types: CityDomain["types"] = [];

  public readonly prepare: CityDomain["prepare"] = async (context, command) => {
    const empty = () => ({ response: encode({}), event: null });
    const state = context.state.regionalRecall;

    if (!state) regionalRecallFailure();

    if (
      !serverFeature(context.rules, "recall", {
        kingdomId: context.rules.kingdomId,
        version: "12.06.0",
        now: Number(context.now),
      })
    )
      return empty();

    const rule = regionalRecallRule(context.rules, state.country);

    if (!rule) return empty();

    let record: Row | undefined = state.record ? { ...state.record } : undefined;

    if (command === "region.recall.init") {
      if (!record) {
        const castle = context.state.buildings.find((row) => num(row, "itemId") === 400000),
          level = num(castle ?? {}, "level"),
          ladder = regionalRecallBand(rule, level);

        if (ladder < 0 || !regionalRecallEligible(rule, context.state.profile, level, context.now))
          return empty();

        record = {
          uid: context.owner,
          level,
          ladder,
          receivedaynum: 0,
          receivetime: 0n,
          begintime: context.now,
          endtime:
            ((context.now + BigInt(cityInteger(rule.k5, 1)) * 86400000n) / 86400000n) * 86400000n,
          country: state.country,
          reward: "",
        };
        regionalRecallRewards(rule, ladder);
        context.write.regionalRecall = { record };
        let statuses: Row[] = [];
        const deleted = new Set<number>();

        for (const id of [rule.k8, rule.k9].filter((id): id is string =>
          Boolean(id && id !== "0"),
        )) {
          const current = [
            ...context.state.effects.states.filter(
              (row) =>
                !deleted.has(num(row, "stateId")) &&
                !statuses.some((saved) => saved.stateId === row.stateId),
            ),
            ...statuses,
          ];
          const plan = temporaryEffect(
            current,
            context.rules,
            context.owner,
            id,
            context.now,
            1,
            randomInt,
          );

          for (const id of plan.deleted) deleted.add(id);

          statuses = [
            ...statuses.filter(
              (row) =>
                !plan.deleted.includes(num(row, "stateId")) &&
                !plan.states.some((saved) => saved.stateId === row.stateId),
            ),
            ...plan.states.map((row) => ({ ...row, endTime: record!.endtime! })),
          ];
        }

        if (statuses.length || deleted.size) {
          context.write.states = statuses;
          context.write.deletedStates = [...deleted];
        }

        if (rule.k12 && rule.k12 !== "0" && state.members.length) {
          const template = context.rules.mail.get(rule.k12),
            contents = javaMailBytes(
              `${template?.message ?? ""}|${text(context.state.profile, "name")}|${text(context.state.profile, "name")}`,
            );

          if (!template || !contents) regionalRecallFailure();

          context.write.regionalRecall.mail = state.members.map((owner) => ({
            uid: randomUUID().replaceAll("-", "") + "00",
            owner,
            fromName: template.sender ?? "",
            title: template.title ?? "",
            type: 2,
            contents,
            extra: null,
            rewardId: null,
            rewardStatus: 1,
            reply: 0,
            createTime: context.now,
          }));
        }
      }

      if (context.now > long(record, "endtime")) return empty();

      return {
        response: encode(
          regionalRecallLogin(
            long(record, "endtime"),
            num(record, "receivedaynum") < 7 ? long(record, "receivetime") : undefined,
          ),
        ),
        event: null,
      };
    }

    if (!record || record.uid !== context.owner) return empty();

    const rewards = regionalRecallRewards(rule, num(record, "ladder")),
      claimed = cityInteger(record.receivedaynum, 0, rewards.length);

    if (command === "region.recall.open.ui")
      return {
        response: encode(
          regionalRecallView(
            rule.id!,
            rewards.map((id) =>
              rewardPreviewArray(
                previewRewards(
                  id,
                  context.rules,
                  {
                    kingdomId: context.rules.kingdomId,
                    version: "12.06.0",
                    now: Number(context.now),
                  },
                  randomInt,
                ),
              ),
            ),
            claimed,
          ),
        ),
        event: null,
      };

    const previous = long(record, "receivetime");

    if (previous / 86400000n === context.now / 86400000n || claimed >= rewards.length)
      return empty();

    const reward: Value = sfs.array(
      grantNativeProgressionReward(context, pinProgressionReward(context, rewards[claimed]!)),
    );
    record.receivetime = context.now;
    record.receivedaynum = claimed + 1;
    record.reward = `${text(record, "reward")};${rewards[claimed]!}`;
    context.write.regionalRecall = { record };

    return { response: encode(regionalRecallClaim(rule.id!, reward, previous)), event: null };
  };

  public readonly apply: CityDomain["apply"] = async () => {
    regionalRecallFailure();
  };
}

export const regionalRecallDomain: CityDomain = new RegionalRecallDomain();
