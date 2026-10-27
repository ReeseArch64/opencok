import { randomUUID } from "node:crypto";
import type { MailRewardExecutor } from "@opencok/contracts/mail-rewards";
import type { InventoryPlan, InventoryState } from "@opencok/contracts/inventory";
import type { InventoryCommandResponse } from "@opencok/contracts/responses/inventory";
import { long, text, type Row } from "@opencok/contracts/rows";
import { sfs, str, encode, Type, type Fields } from "@opencok/messages/sfs";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { Rules } from "@opencok/rules/game";
import { mailRewardEntries, mailRewardSelection } from "@opencok/rules/mail-rewards";
import { inventoryItem } from "@opencok/mappings/bootstrap";
import { resource } from "@opencok/mappings/city";
import { inventoryResponse, inventoryReplay } from "@opencok/mappings/inventory";
import { combineMailRewards, mailRewardEvent } from "@opencok/mappings/mail-rewards";
import { planInventoryGrants } from "./inventory.ts";

const resources = new Map([
  ["wood", "wood"],
  ["stone", "stone"],
  ["iron", "iron"],
  ["food", "food"],
  ["money", "silver"],
  ["chip", "chip"],
  ["diamond", "diamond"],
  ["sandstone", "sandstone"],
  ["diamondstone", "diamondstone"],
  ["marble", "marble"],
  ["granite", "granite"],
  ["limestone", "limestone"],
]);

export class MailRewardService {
  constructor(
    readonly execute: MailRewardExecutor,
    readonly rules: Rules,
  ) {}

  async command(owner: string, command: string, params: Fields): Promise<InventoryCommandResponse> {
    if (command !== "mail.reward" && command !== "mail.reward.batch")
      throw new GameError(errors.unsupported);

    const batch = command === "mail.reward.batch";
    const selection = mailRewardSelection(
      batch ? undefined : str(params, "uid"),
      batch ? str(params, "uids", "") : "",
      batch ? str(params, "types", "") : "",
      batch,
    );
    const operation = params.operationId;

    if (
      operation &&
      (operation.type !== Type.String ||
        typeof operation.value !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          operation.value,
        ))
    )
      throw new GameError(errors.invalid);

    const requestId = operation ? (operation.value as string).toLowerCase() : randomUUID();
    const request = encode({
      ids: sfs.array(selection.ids.map(sfs.string)),
      labels: sfs.array(selection.labels.map(sfs.int)),
      batch: sfs.bool(batch),
    });

    return inventoryReplay(
      await this.execute(
        { owner, command, requestId, request },
        selection,
        async (state, entry, now) => this.plan(state, entry, now),
        combineMailRewards,
      ),
      requestId,
    );
  }

  plan(state: InventoryState, entry: Row, now: number): InventoryPlan {
    const rewards = mailRewardEntries(text(entry, "rewardId"));

    for (const reward of rewards)
      if (
        reward.category !== "goods" &&
        reward.category !== "gold" &&
        reward.category !== "crystal" &&
        !resources.has(reward.category)
      )
        throw new GameError(errors.unsupported);

    const plan = planInventoryGrants(
      state,
      this.rules,
      rewards
        .filter((reward) => reward.category === "goods")
        .map((reward) => ({ itemId: reward.itemId, count: reward.count })),
      now,
    );
    const postings = [...plan.postings],
      profile: Record<string, bigint> = {},
      changedResources: Record<string, bigint> = {},
      body: Fields = {};
    const credit = (
      kind: "profile" | "resource",
      key: string,
      amount: number,
      maximum = 9223372036854775807n,
    ) => {
      const changes = kind === "profile" ? profile : changedResources;
      const before = changes[key] ?? long(kind === "profile" ? state.profile : state.resource, key),
        after = before + BigInt(amount);

      if (before < 0n || after > maximum) throw new GameError(errors.invalid);

      changes[key] = after;
      postings.push({
        account: text(state.profile, "uid"),
        asset: `${kind}.${key}`,
        before,
        after,
        reason: "mail.reward",
      });

      return after;
    };

    for (const reward of rewards) {
      if (reward.category === "goods") continue;

      if (reward.category === "gold") {
        const dmm = text(state.profile, "pf") === "dmm";
        const value = credit("profile", dmm ? "dmmGold" : "gold", reward.count);
        const total =
          value +
          long(state.profile, dmm ? "dmmPaidGold" : "paidGold") +
          long(state.profile, dmm ? "dmmPaidSpecialGold" : "paidSpecialGold");

        if (total < 0n || total > 9223372036854775807n) throw new GameError(errors.invalid);

        body.gold = sfs.long(total);
      } else if (reward.category === "crystal")
        body.crystal = sfs.long(credit("profile", "crystal", reward.count));
      else {
        const key = resources.get(reward.category)!;
        const regular = ["wood", "stone", "iron", "food"].includes(key);
        const value = credit(
          "resource",
          key,
          reward.count,
          regular ? 9223372036854775807n : 2147483647n,
        );
        const wire =
          key === "silver"
            ? "money"
            : key === "sandstone"
              ? "sand_stone"
              : key === "diamondstone"
                ? "diamond_stone"
                : key;
        body[wire] = sfs.long(value);

        if (regular) body[`${key}_bind`] = sfs.long(long(state.resource, `${key}bind`));
      }
    }

    if (plan.items.length)
      body.goods = sfs.array(
        plan.items.map((item) => sfs.object(inventoryItem({ ...item }, this.rules))),
      );

    const pushes: InventoryCommandResponse["pushes"] = [];

    if (plan.items.length)
      pushes.push({
        command: "push.useritem",
        body: {
          useritemlist: sfs.array(
            plan.items.map((item) => sfs.object(inventoryItem({ ...item }, this.rules))),
          ),
        },
      });

    if (Object.keys(changedResources).length)
      pushes.push({
        command: "push.city.refresh",
        body: resource({ ...state.resource, ...changedResources }),
      });

    return {
      ...plan,
      profile,
      resource: changedResources,
      postings,
      response: inventoryResponse(body, pushes),
      events: [
        ...(plan.events ?? []),
        {
          id: "mail-reward",
          type: "mail.reward.claimed",
          payload: mailRewardEvent(entry),
        },
      ],
    };
  }
}
