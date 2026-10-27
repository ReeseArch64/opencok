import { CityCommandDomain } from "./city-command-domain.ts";
import { javaHashMapOrder } from "@opencok/rules/java-hash-map-order";
import { createHash, randomInt, randomUUID } from "node:crypto";
import { long, text } from "@opencok/contracts/rows";
import { sfs, encode, str } from "@opencok/messages/sfs";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { rechargeActivityWindow } from "@opencok/rules/recharge-activity";
import { cityAmount } from "@opencok/rules/city-progression";
import { previewRewards } from "@opencok/rules/rewards";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import { rechargeActivityLogin } from "@opencok/mappings/recharge-activity";
import { grantNativeProgressionReward, pinProgressionReward } from "./progression-rewards";
import type { RechargeActivityGateway } from "@opencok/contracts/recharge-activity";
import type { CityDomain } from "./city-domain.ts";

function invalid(): never {
  throw new GameError(errors.invalid, "city_progression");
}

export function rechargeActivityOperationId(owner: string, eventId: string) {
  if (!/^[A-Za-z0-9:._-]{1,128}$/.test(eventId)) {invalid();}

  return `sercum:${createHash("sha256").update(`${owner}\0${eventId}`).digest("hex")}`;
}

export class RechargeActivityDomain extends CityCommandDomain {
  public readonly commands: CityDomain["commands"];
  public readonly types: CityDomain["types"];
  public readonly prepare: CityDomain["prepare"];
  public readonly apply: CityDomain["apply"];

  public constructor(gateway?: RechargeActivityGateway) {
    super();

    this.commands = ["new.sercum.init", "new.sercum.ui", "new.sercum.reward", "new.sercum.paid"];

    this.types = [];

    this.prepare = async (context, command, params) => {
      const state = context.state.rechargeActivity;

      if (!state) {invalid();}

      const empty = () => ({ response: encode({}), event: null });
      const ruleContext = {
        kingdomId: context.rules.kingdomId,
        version: "12.06.0",
        now: Number(context.now),
      };
      const window = rechargeActivityWindow(context.rules, state.openedAt, ruleContext);
      const total = cityAmount(long(context.state.quests?.lord ?? {}, "newSerCumRechargeTotal"));
      const claimed = new Set(state.claims.map((row) => text(row, "id"))),
        rules = [...(context.rules.advanced.rechargeThresholds?.values() ?? [])];

      if (rules.length > 1024) {invalid();}

      if (command === "new.sercum.paid") {
        const eventId = str(params, "eventId");

        if (
          !gateway ||
          str(params, "operationId") !== rechargeActivityOperationId(context.owner, eventId)
        )
          {invalid();}

        const receipt = await gateway.accepted({ owner: context.owner, eventId });

        if (
          !receipt ||
          typeof receipt.occurredAt !== "bigint" ||
          typeof receipt.rechargeGold !== "bigint" ||
          receipt.occurredAt < 0n ||
          receipt.occurredAt > context.now ||
          receipt.rechargeGold < 0n ||
          !Number.isSafeInteger(Number(receipt.occurredAt))
        )
          {invalid();}

        const eventWindow = rechargeActivityWindow(context.rules, state.openedAt, {
          ...ruleContext,
          now: Number(receipt.occurredAt),
        });

        if (!eventWindow?.active || receipt.rechargeGold === 0n) {return empty();}

        context.write.rechargeActivity = { total: cityAmount(total + receipt.rechargeGold) };

        return empty();
      }

      if (command === "new.sercum.ui") {
        if (!window?.active) {return empty();}

        return {
          response: encode({
            new_sercum_recharge: sfs.array(
              rules.map((rule) =>
                sfs.object(
                  Object.fromEntries(
                    javaHashMapOrder(Object.keys(rule)).map((key) => [
                      key,
                      key === "pay_reward"
                        ? rewardPreviewArray(
                            previewRewards(rule[key], context.rules, ruleContext, randomInt),
                          )
                        : sfs.string(rule[key]!),
                    ]),
                  ),
                ),
              ),
            ),
            new_sercum_recharge_reward: sfs.array([...claimed].map((id) => sfs.string(id))),
          }),
          event: null,
        };
      }

      if (command === "new.sercum.init") {
        if (!window) {return empty();}

        if (window.active)
          {return {
            response: encode(
              rechargeActivityLogin({
                ...(window.end > context.now
                  ? { new_sercum_little_time: window.end - context.now }
                  : {}),
                newSerCumRechargeTotal: total,
                newSerCumVersion: window.control.k1!,
                newSerCumServerList: window.control.k2!,
              }),
            ),
            event: null,
          };}

        const pending = rules.filter(
          (rule) => !claimed.has(rule.id!) && total >= cityAmount(rule.pay_node),
        );

        for (const rule of pending) {
          const template = context.rules.mail.get("11790"),
            contents = javaMailBytes(template?.message);

          if (!template || !contents) {invalid();}

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
              rewardId: pinProgressionReward(context, rule.pay_reward!),
              rewardStatus: 0,
              reply: 0,
              createTime: context.now,
            },
          ];
        }

        if (pending.length)
          {context.write.rechargeActivity = { claims: pending.map((rule) => rule.id!) };}

        return empty();
      }

      const id = str(params, "id"),
        rule = context.rules.advanced.rechargeThresholds?.get(id);

      if (!rule || claimed.has(id) || total < cityAmount(rule.pay_node)) {invalid();}

      const reward = grantNativeProgressionReward(
        context,
        pinProgressionReward(context, rule.pay_reward!),
      );
      context.write.rechargeActivity = { claims: [id] };

      return { response: encode({ id: sfs.string(id), reward: sfs.array(reward) }), event: null };
    };

    this.apply = async () => {
      invalid();
    };
  }
}

export function createRechargeActivityDomain(gateway?: RechargeActivityGateway): CityDomain {
  return new RechargeActivityDomain(gateway);
}
