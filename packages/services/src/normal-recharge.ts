import { createHash, randomInt } from "node:crypto";
import { sfs, encode, str, type Fields } from "@opencok/messages/sfs";
import { long, num } from "@opencok/contracts/rows";
import type { PaidGiftGateway, DeliveredGiftProof } from "@opencok/contracts/paid-gifts";
import { deliveredPayment } from "./delivered-payment";
import {
  normalRechargeFailure,
  normalRechargePeriod,
  normalRechargeMergeStart,
  normalRechargeThresholds,
  normalRechargeNode,
} from "@opencok/rules/normal-recharge";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import { previewRewards } from "@opencok/rules/rewards";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { normalRechargeView } from "@opencok/mappings/normal-recharge";
import { pinProgressionReward } from "./progression-rewards";
import { CampaignPlanner } from "./local-campaign";
import type { CityProgressionContext, CityDomain } from "./city-progression";
export function normalRechargeOperation(owner: string, orderId: string, platform: string) {
  if (
    !owner ||
    !orderId ||
    orderId.length > 200 ||
    !platform ||
    platform.length > 20 ||
    [owner, orderId, platform].some((value) => !value.isWellFormed() || value.includes("\0"))
  )
    normalRechargeFailure();
  return `recharge:${createHash("sha256").update(`${owner}\0${platform}\0${orderId}`).digest("hex")}`;
}
export function normalRechargeParameters(owner: string, orderId: string, platform: string): Fields {
  return {
    orderId: sfs.string(orderId),
    platform: sfs.string(platform),
    operationId: sfs.string(normalRechargeOperation(owner, orderId, platform)),
  };
}
function fingerprint(proof: DeliveredGiftProof) {
  return createHash("sha256")
    .update(
      JSON.stringify([
        proof.owner,
        proof.kingdomId,
        proof.platform,
        proof.orderId,
        proof.exchangeId,
        proof.productId,
        proof.priceCents,
        String(proof.occurredAt),
        String(proof.rechargeGold),
        proof.methodParam ?? null,
      ]),
    )
    .digest("hex");
}
export function createNormalRechargeDomain(gateway?: PaidGiftGateway): CityDomain {
  return {
    commands: ["normal.recharge.init", "normal.recharge.paid"],
    types: [],
    async prepare(context, command, params) {
      const state = context.state.normalRecharge;
      if (!state) normalRechargeFailure();
      const empty = () => ({ response: encode({}), event: null });
      if (num(context.state.profile, "crossFightSrcServerId") > 0)
        return command === "normal.recharge.init" ? empty() : normalRechargeFailure();
      const server = { ...state.server };
      const begin = normalRechargeMergeStart(context.rules, server, context.now);
      if (begin !== undefined && long(server, "mergeTiredRushBeginTime") <= 0n) {
        context.write.normalRecharge = { mergeBegin: begin };
        server.mergeTiredRushBeginTime = begin;
      }
      if (command === "normal.recharge.init") {
        const period = normalRechargePeriod(context.rules, server, context.now, true);
        if (!period) return empty();
        const total = state.totals.find((row) => num(row, "type") === period.type),
          at = long(total ?? {}, "updateTime");
        const points = at >= period.start && at < period.end ? cityAmount(total?.gold ?? 0) : 0n;
        const rows = normalRechargeThresholds(context.rules, period.type).map((row) => ({
          point: cityInteger(row.Node, 1),
          rewards: previewRewards(
            row.Gift,
            context.rules,
            { kingdomId: context.rules.kingdomId, version: "12.06.0", now: Number(context.now) },
            randomInt,
          ),
          ...(row.important_reward === undefined ? {} : { important: row.important_reward }),
        }));
        const face =
          period.type === 1 ? (context.rules.configuration.payControl?.get("69022")?.k9 ?? "") : "";
        return { response: encode(normalRechargeView(period, points, face, rows)), event: null };
      }
      const orderId = str(params, "orderId"),
        platform = str(params, "platform"),
        operation = normalRechargeOperation(context.owner, orderId, platform);
      if (!gateway || str(params, "operationId") !== operation) normalRechargeFailure();
      const { proof, gold, payment } = await deliveredPayment(
        gateway,
        context.owner,
        context.rules,
        orderId,
        platform,
        context.now,
        state.payment,
      );
      const key = `normal.recharge.order.v1.${operation.slice(9)}`,
        digest = fingerprint(proof),
        previous = await state.processed(key);
      if (previous) {
        if (previous !== digest) normalRechargeFailure();
        return empty();
      }
      const period = normalRechargePeriod(context.rules, server, proof.occurredAt, true);
      context.write.normalRecharge = {
        ...context.write.normalRecharge,
        receipt: { key, fingerprint: digest },
      };
      if (!period) return empty();
      let increment = gold;
      if (period.type === 2) {
        if (
          platform !== "mycard" ||
          proof.methodParam === undefined ||
          !Number.isInteger(proof.methodParam) ||
          proof.methodParam < 0 ||
          proof.methodParam > 6 ||
          proof.methodParam === 5
        )
          return empty();
        increment = normalRechargeNode(String(payment.spend), 2);
      }
      if (increment <= 0n) return empty();
      const old = state.totals.find((row) => num(row, "type") === period.type),
        at = long(old ?? {}, "updateTime");
      const same = at >= period.start && at < period.end;
      if (at > proof.occurredAt && !same) return empty();
      const total = cityAmount((same ? cityAmount(old?.gold ?? 0) : 0n) + increment);
      let level = same ? cityInteger(old?.getLv ?? 0, 0, 128) : 0;
      const thresholds = normalRechargeThresholds(context.rules, period.type);
      if (level > thresholds.length) normalRechargeFailure();
      for (const threshold of thresholds) {
        const target = cityInteger(threshold.level, 1);
        if (target <= level || total < normalRechargeNode(threshold.Node, period.type)) continue;
        const template = context.rules.mail.get(
            period.type === 4 ? "12014" : period.type === 2 ? "11522" : "12000",
          ),
          contents = javaMailBytes(template?.message);
        if (!template || !contents) normalRechargeFailure();
        const quests = (context.write.quests ??= {});
        quests.mail = [
          ...(quests.mail ?? []),
          {
            uid:
              createHash("sha256")
                .update(`${operation}:${period.type}:${period.start}:${target}`)
                .digest("hex")
                .slice(0, 32) + "00",
            owner: context.owner,
            fromName: template.sender ?? "",
            title: template.title ?? "",
            type: 2,
            contents,
            extra: null,
            rewardId: pinProgressionReward(context, threshold.Gift!),
            rewardStatus: 0,
            reply: 0,
            createTime: context.now,
          },
        ];
        level = target;
        if (period.type === 1 || period.type === 3)
          new CampaignPlanner(
            Object.assign(Object.create(context) as CityProgressionContext, {
              now: proof.occurredAt,
            }),
            { pay_total_level: level },
          ).event(70, String(level));
      }
      context.write.normalRecharge = {
        ...context.write.normalRecharge,
        total: {
          type: period.type,
          gold: total,
          getLv: level,
          updateTime: at > proof.occurredAt ? at : proof.occurredAt,
        },
        receipt: { key, fingerprint: digest },
      };
      return { response: encode({ repay_add: sfs.long(total) }), event: null };
    },
    async apply() {
      normalRechargeFailure();
    },
  };
}
