import { randomInt } from "node:crypto";
import { encode, str } from "@opencok/messages/sfs";
import { long, num, text } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import { campaignFailure } from "@opencok/rules/local-campaign";
import { serverFeature } from "@opencok/rules/power-context";
import { temporaryEffect } from "@opencok/rules/player-effects";
import { avatarActivationResponse } from "@opencok/mappings/city-cosmetics";
import { cosmeticInteractionEvent } from "./city-cosmetics";
import { CampaignPlanner } from "./local-campaign";
import type { CityDomain } from "./city-progression";
export const avatarActivationDomain: CityDomain = {
  commands: ["avatar.activate"],
  types: [],
  async prepare(context, _command, params) {
    const id = str(params, "avatarId"),
      rule = context.rules.power.statuses?.get(id),
      target = context.state.cosmeticTarget;
    cityInteger(id, 1);
    if (
      !rule?.subgroup ||
      !["100", "105", "200"].includes(rule.type2 ?? "") ||
      target?.uid !== context.owner ||
      target.realm !== context.rules.kingdomId ||
      !serverFeature(context.rules, "avatar", {
        kingdomId: context.rules.kingdomId,
        version: "12.06.0",
        now: Number(context.now),
      })
    )
      campaignFailure();
    const owned =
      target.avatars.find((row) => row.avatarId === id) ??
      target.avatars.find((row) => {
        const candidate = context.rules.power.statuses?.get(text(row, "avatarId"));
        return candidate?.type2 === rule.type2 && candidate?.subgroup === rule.subgroup;
      });
    if (
      !owned ||
      (long(owned, "expirationTime") !== -1n && long(owned, "expirationTime") <= context.now)
    )
      campaignFailure();
    new CampaignPlanner(context).event(59, id);
    const before = context.write.states ?? context.state.effects.states,
      plan = temporaryEffect(before, context.rules, context.owner, id, context.now, 1, randomInt),
      state = plan.states[0];
    if (!state) return { response: encode({}), event: null };
    if (!["3", "4"].includes(rule.overlap ?? "") && long(owned, "expirationTime") !== -1n)
      state.endTime = long(owned, "expirationTime");
    else if (rule.type === "3") state.endTime = 9223372036854775807n;
    context.write.states = [
      ...before.filter(
        (row) =>
          !plan.deleted.includes(num(row, "stateId")) &&
          !plan.states.some((next) => next.stateId === row.stateId),
      ),
      ...plan.states,
    ];
    context.write.deletedStates = [...(context.write.deletedStates ?? []), ...plan.deleted];
    context.write.cosmeticTarget = {
      uid: context.owner,
      states: plan.states,
      deleted: plan.deleted,
      avatars: [{ ...owned, effectiveSign: 0 }],
    };
    context.write.cosmeticChanges = plan.states.map((row) => ({
      uid: context.owner,
      id: num(row, "stateId"),
      previous: plan.deleted[0],
    }));
    const body = avatarActivationResponse(state, context.rules, plan.deleted[0]);
    return { response: encode(body), event: cosmeticInteractionEvent(context, body) };
  },
  async apply() {
    campaignFailure();
  },
};
