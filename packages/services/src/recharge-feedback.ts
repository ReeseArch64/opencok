import { createHash, randomUUID, randomInt } from "node:crypto";
import { sfs, encode, str } from "@opencok/messages/sfs";
import { feedbackWindow, feedbackPrice, feedbackFailure } from "@opencok/rules/recharge-feedback";
import { javaHashMapOrder } from "@opencok/rules/java-hash-map-order";
import { cityInteger } from "@opencok/rules/city-progression";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { previewRewards } from "@opencok/rules/rewards";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import { rechargeFeedbackView } from "@opencok/mappings/recharge-feedback";
import { pinProgressionReward } from "./progression-rewards";
import type { RechargeFeedbackGateway } from "@opencok/contracts/recharge-feedback";
import type { CityDomain } from "./city-progression";
export function rechargeFeedbackOperationId(owner: string, eventId: string): string {
  if (!/^[A-Za-z0-9:._-]{1,128}$/.test(eventId)) feedbackFailure();
  return `feedback:${createHash("sha256").update(`${owner}\0${eventId}`).digest("hex")}`;
}
export function createRechargeFeedbackDomain(gateway?: RechargeFeedbackGateway): CityDomain {
  return {
    commands: ["pay.recharge.ui.state", "feedback.paid"],
    types: [],
    async prepare(context, command, params) {
      const reader = context.state.rechargeFeedback;
      if (!reader) feedbackFailure();
      const ruleContext = {
          kingdomId: context.rules.kingdomId,
          version: "12.06.0",
          now: Number(context.now),
        },
        window = feedbackWindow(context.rules, ruleContext);
      const empty = () => ({ response: encode({}), event: null });
      const rules = [...(context.rules.advanced.rechargeFeedback?.values() ?? [])];
      if (rules.length > 1024) feedbackFailure();
      if (command === "pay.recharge.ui.state") {
        if (!window?.active) return empty();
        const prices = rules.map((rule) => feedbackPrice(context.rules, rule.product_id ?? "")),
          counts = await reader.counts(
            window.start,
            window.end,
            prices.filter((price) => price !== undefined),
          );
        const tables = rules.map((rule) =>
          Object.fromEntries(
            javaHashMapOrder(Object.keys(rule)).map((key) => [
              key,
              key === "reward"
                ? rewardPreviewArray(
                    previewRewards(rule[key], context.rules, ruleContext, randomInt),
                  )
                : sfs.string(rule[key]!),
            ]),
          ),
        );
        const flags = rules.map(
          (rule, i) =>
            prices[i] !== undefined &&
            (counts.get(prices[i]!) ?? 0n) >= BigInt(cityInteger(rule.number, 1)),
        );
        return { response: encode(rechargeFeedbackView(tables, flags)), event: null };
      }
      const eventId = str(params, "eventId");
      if (
        !gateway ||
        str(params, "operationId") !== rechargeFeedbackOperationId(context.owner, eventId)
      )
        feedbackFailure();
      const proof = await gateway.accepted({ owner: context.owner, eventId });
      if (!proof) feedbackFailure();
      const payment = await reader.payment(proof.orderId, proof.platform),
        price = feedbackPrice(context.rules, proof.productId);
      if (
        !payment ||
        payment.productId !== proof.productId ||
        payment.time === null ||
        payment.time < 0n ||
        payment.time > context.now ||
        !Number.isSafeInteger(Number(payment.time)) ||
        price === undefined ||
        Math.round(payment.spend * 100) !== price
      )
        feedbackFailure();
      const paidWindow = feedbackWindow(context.rules, {
        ...ruleContext,
        now: Number(payment.time),
      });
      if (!paidWindow?.active) feedbackFailure();
      const counts = await reader.counts(paidWindow.start, paidWindow.end, [price]),
        claimed = new Set(
          (await reader.claims(paidWindow.start, paidWindow.end)).map((row) => row.id),
        );
      const eligible = rules.filter(
        (rule) =>
          rule.product_id === proof.productId &&
          !claimed.has(rule.id!) &&
          (counts.get(price) ?? 0n) >= BigInt(cityInteger(rule.number, 1)),
      );
      for (const rule of eligible) {
        const template = context.rules.mail.get("11809"),
          contents = javaMailBytes(template?.message);
        if (!template || !contents) feedbackFailure();
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
            rewardId: pinProgressionReward(context, rule.reward!),
            rewardStatus: 0,
            reply: 0,
            createTime: context.now,
          },
        ];
      }
      if (eligible.length)
        context.write.rechargeFeedback = eligible.map((rule) => ({
          id: rule.id!,
          startTime: paidWindow.start,
          endTime: paidWindow.end,
        }));
      return empty();
    },
    async apply() {
      feedbackFailure();
    },
  };
}
