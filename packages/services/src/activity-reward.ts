import { applyMilitaryRankAward } from "./military-rank-awards";
import type { ActivityRewardWrite } from "@opencok/contracts/activity-reward";
import { rewardLegacyGenerals } from "./legacy-generals";
import { cityInteger } from "@opencok/rules/city-progression";
import type { ActivityRewardAmounts } from "@opencok/contracts/responses/activity-reward";
import { activityRewardView } from "@opencok/mappings/activity-reward";
import { encode, sfs, str, type Fields } from "@opencok/messages/sfs";
import { long, num, text } from "@opencok/contracts/rows";
import { activityRewardEntries, activityRewardVersion } from "@opencok/rules/activity-reward";
import { mailBlank } from "@opencok/rules/mail";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { equipmentItem, equipment } from "@opencok/mappings/equipment";
import { grantPinnedProgressionReward } from "./progression-rewards";
import type { CityDomain } from "./city-progression";

const resourceAssets = {
  wood: "wood",
  stone: "stone",
  iron: "iron",
  food: "food",
  money: "silver",
  chip: "chip",
  diamond: "diamond",
  sandstone: "sandstone",
  diamondstone: "diamondstone",
  marble: "marble",
  granite: "granite",
  limestone: "limestone",
} as const;

export const activityRewardDomain: CityDomain = {
  commands: ["activity.accept.reward"],
  types: [],
  async prepare(context, _command, params) {
    if (
      num(context.state.profile, "serverId") !== context.rules.kingdomId ||
      num(context.state.profile, "banFlag") !== 0 ||
      long(context.state.profile, "banTime") > context.now
    )
      throw new GameError(errors.invalid, "city_progression");

    const actId = str(params, "actId"),
      saved = await context.state.activityReward?.owned(actId);

    if (!saved?.announcement || num(saved.entitlement, "status") !== 0)
      throw new GameError(errors.invalid, "city_progression");

    const version = text(saved.announcement, "updateVersion");

    if (
      !mailBlank(version) &&
      activityRewardVersion(text(context.state.profile, "appVersion")) <
        activityRewardVersion(version)
    )
      throw new GameError(errors.unsupported, "city_progression");

    const rewards = activityRewardEntries(saved.announcement.reward);

    if (
      rewards
        .filter((reward) => reward.category === "equip")
        .reduce((total, reward) => total + reward.count, 0) > 256
    )
      throw new GameError(errors.unsupported, "city_progression");

    const write: ActivityRewardWrite = { actId, kingdomId: context.rules.kingdomId },
      group = rewards.some(
        (reward) => reward.category === "honor" || reward.category === "alliance_point",
      )
        ? await context.state.activityReward!.alliance(text(context.state.profile, "allianceId"))
        : {};
    const body: ActivityRewardAmounts = {},
      goods: Fields[] = [],
      equips: Fields[] = [],
      generals: Fields[] = [];

    for (const reward of rewards) {
      const category = reward.category;

      if (category === "gold") {
        context.economy.gold(BigInt(reward.count));
        body.gold = context.balance("gold");
      } else if (category === "crystal") {
        if (!context.economy.crystal) throw new GameError(errors.unsupported, "city_progression");

        context.economy.crystal(BigInt(reward.count));
        body.crystal = context.balance("crystal");
      } else if (category === "exp") {
        context.experience(reward.count);
        body.exp = context.write.profile!.exp;
        body.expDelta = reward.count;
      } else if (category === "goods") {
        context.economy.item(reward.itemId, reward.count);
        goods.push(
          equipmentItem(
            reward.itemId,
            context.economy.quantity?.(reward.itemId) ?? 0,
            context.economy.itemState?.(reward.itemId),
            context.rules,
          ),
        );
      } else if (category === "honor") {
        body.honor = 0;

        if (group.member) {
          const previous = write.member ?? {
            allianceId: text(group.member, "allianceId"),
            point: num(group.member, "point"),
            accPoint: num(group.member, "accPoint"),
          };
          const next = {
            ...previous,
            point: cityInteger(previous.point + reward.count),
            accPoint: cityInteger(previous.accPoint + reward.count),
          };
          write.member = next;
          body.honor = next.accPoint;
        }
      } else if (category === "alliance_point") {
        if (group.alliance && group.member) {
          const previous = write.alliance?.points ?? long(group.alliance, "alliancepoint"),
            next = previous + BigInt(reward.count);

          if (previous < 0n || next > 9223372036854775807n)
            throw new GameError(errors.unsupported, "city_progression");

          const id = text(group.alliance, "uid");
          write.alliance = { id, points: next };
          body.alliancepoint = next;
        }
      } else if (category === "military" || category === "milhonor") {
        const granted = await applyMilitaryRankAward(context, {
          kind: category,
          amount: reward.count,
          entitlementId: actId,
        });

        if (granted) body[category] = granted.requested;
      } else if (category === "general") {
        generals.push(...rewardLegacyGenerals(context, reward.itemId, reward.count));
      } else if (category === "power") {
        const previous =
          context.write.statistics?.questPower ?? num(context.state.statistics, "questPower");
        context.power(BigInt(reward.count));
        context.write.statistics!.questPower = cityInteger(previous + reward.count);
        body.power = context.write.statistics!.questPower;
      } else if (category === "equip") {
        const before = context.write.equipment?.length ?? 0;
        grantPinnedProgressionReward(context, `equip,${reward.itemId},${reward.count}`);
        equips.push(...(context.write.equipment ?? []).slice(before).map(equipment));
      } else if (Object.hasOwn(resourceAssets, category)) {
        const asset = resourceAssets[category as keyof typeof resourceAssets];
        context.economy.resource(asset, BigInt(reward.count));
        const wire =
          asset === "silver"
            ? "money"
            : asset === "sandstone"
              ? "sand_stone"
              : asset === "diamondstone"
                ? "diamond_stone"
                : asset;
        body[
          wire as Exclude<
            keyof ActivityRewardAmounts,
            "exp" | "expDelta" | "power" | "honor" | "military" | "milhonor"
          >
        ] = context.balance(asset);

        if (["wood", "stone", "iron", "food"].includes(asset))
          body[`${wire}_bind` as "wood_bind" | "stone_bind" | "iron_bind" | "food_bind"] =
            context.balance(`${asset}bind`);
      } else throw new GameError(errors.unsupported, "city_progression");
    }

    context.write.activityRewardClaim = write;

    if (write.alliance) {
      if (!context.economy.event) throw new GameError(errors.unsupported, "city_progression");

      context.economy.event({
        id: "activity-alliance",
        type: "alliance.changed",
        payload: encode({
          allianceId: sfs.string(write.alliance.id),
          command: sfs.string("activity.accept.reward"),
          actor: sfs.string(context.owner),
        }),
      });
    }

    return { response: encode(activityRewardView(body, goods, equips, generals)), event: null };
  },
  async apply() {
    return {};
  },
};
