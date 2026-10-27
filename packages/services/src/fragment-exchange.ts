import { CityCommandDomain } from "./city-command-domain.ts";
import { randomInt } from "node:crypto";
import { sfs, encode, int, str } from "@opencok/messages/sfs";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import { campaignFailure } from "@opencok/rules/local-campaign";
import { eventTimestamp } from "@opencok/rules/local-events";
import { previewRewards } from "@opencok/rules/rewards";
import {
  fragmentExchangeRecipes,
  readFragmentExchangeOffers,
  selectFragmentExchangeOffers,
} from "@opencok/rules/fragment-exchange";
import {
  fragmentExchangeOfferView,
  fragmentExchangeView,
} from "@opencok/mappings/fragment-exchange";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import { pinProgressionReward, grantNativeProgressionReward } from "./progression-rewards";
import { CampaignPlanner, refreshCampaignGrants } from "./local-campaign";
import type { FragmentExchangeOffer } from "@opencok/contracts/fragment-exchange";
import type { CityDomain } from "./city-domain.ts";

export class FragmentExchangeDomain extends CityCommandDomain {
  public readonly commands: CityDomain["commands"];
  public readonly types: CityDomain["types"];
  public readonly prepare: CityDomain["prepare"];
  public readonly apply: CityDomain["apply"];

  public constructor(random: (maximum: number) => number = randomInt) {
    super();

    this.commands = ["act.exchange", "act.ex.reward", "act.ex.flush"];

    this.types = [];

    this.prepare = async (context, command, params) => {
      const recipes = context.rules.advanced.fragments?.size
          ? fragmentExchangeRecipes(context.rules.advanced.fragments.values())
          : [],
        states = new Map(
          (context.state.fragmentExchange ?? []).map((row) => [text(row, "actId"), row]),
        );
      const panel = (id: string) => {
        if (!/^\d{1,10}$/.test(id)) campaignFailure();

        const row = context.rules.power.activityPanels?.get(id),
          start = eventTimestamp(row?.start),
          end = eventTimestamp(row?.end);

        if (
          !row ||
          row.exchange !== "2" ||
          row.function_on === "0" ||
          (row.start !== undefined && (start === undefined || context.now < start)) ||
          (row.end !== undefined && (end === undefined || context.now >= end))
        )
          return;

        if (!recipes.length) campaignFailure();

        cityInteger(row.free_num);
        cityInteger(row.refresh_cost);

        return row;
      };
      const write = (row: Row) => {
        states.set(text(row, "actId"), row);
        context.write.fragmentExchange = [
          ...(context.write.fragmentExchange ?? []).filter((before) => before.actId !== row.actId),
          row,
        ];
      };
      const load = (id: string, initialize: boolean) => {
        let row = states.get(id);

        if (!row && !initialize) campaignFailure();

        row = {
          ...(row ?? { uid: context.owner, actId: id, refresh: 0, refreshTime: context.now }),
        };

        if (long(row, "refreshTime") / 86400000n !== context.now / 86400000n) {
          row.refresh = 0;
          row.refreshTime = context.now;
          write(row);
        }

        let offers: readonly FragmentExchangeOffer[];

        if (row.reward === null || row.reward === undefined) {
          offers = selectFragmentExchangeOffers(recipes, random);
          row.reward = Buffer.from(JSON.stringify(offers));
          write(row);
        } else {
          if (!Buffer.isBuffer(row.reward)) campaignFailure();

          offers = readFragmentExchangeOffers(row.reward);
        }

        for (const offer of offers) {
          const recipe = recipes.find(
            (recipe) => recipe.type === offer.type && recipe.same === offer.same,
          );

          if (
            !recipe ||
            !recipe.rewards.includes(offer.reward) ||
            offer.id.some((id) => !recipe.pool.includes(id))
          )
            campaignFailure();
        }

        return { row, offers };
      };
      const preview = (reward: string) =>
        rewardPreviewArray(
          previewRewards(
            reward,
            context.rules,
            { kingdomId: context.rules.kingdomId, version: "12.06.0", now: Number(context.now) },
            random,
          ),
        );
      const view = (
        id: string,
        row: Row,
        offers: readonly FragmentExchangeOffer[],
        config: Row,
        includeIdentity = true,
      ) =>
        fragmentExchangeView(
          id,
          offers.map((offer) =>
            fragmentExchangeOfferView(
              offer,
              preview(offer.reward),
              recipes
                .find((recipe) => recipe.type === offer.type && recipe.same === offer.same)!
                .rewards.map(preview),
            ),
          ),
          recipes[0]!.pool,
          num(row, "refresh"),
          cityInteger(config.free_num),
          cityInteger(config.refresh_cost),
          includeIdentity,
        );

      if (command === "act.exchange") {
        const ids = str(params, "ids").split("|").filter(Boolean);

        if (ids.length > 64) campaignFailure();

        return {
          response: encode({
            exchange: sfs.array(
              [...new Set(ids)].flatMap((id) => {
                const config = panel(id);

                if (!config) return [];

                const { row, offers } = load(id, true);

                return [sfs.object(view(id, row, offers, config))];
              }),
            ),
          }),
          event: null,
        };
      }

      const id = str(params, command === "act.ex.flush" ? "actId" : "id"),
        config = panel(id);

      if (!config) campaignFailure();

      const { row, offers } = load(id, false);

      if (command === "act.ex.flush") {
        if (num(row, "refresh") >= cityInteger(config.free_num))
          context.economy.gold(-BigInt(cityInteger(config.refresh_cost)));

        const next = selectFragmentExchangeOffers(recipes, random);
        row.reward = Buffer.from(JSON.stringify(next));
        row.refresh = cityInteger(num(row, "refresh") + 1);
        row.refreshTime = context.now;
        write(row);
        const dmm = text(context.state.profile, "pf") === "dmm",
          keys = dmm
            ? ["dmmGold", "dmmPaidGold", "dmmPaidSpecialGold"]
            : ["gold", "paidGold", "paidSpecialGold"];

        return {
          response: encode({
            flush: sfs.object(view(id, row, next, config, false)),
            gold: sfs.long(keys.reduce((total, key) => total + context.balance(key), 0n)),
          }),
          event: null,
        };
      }

      const level = cityInteger(int(params, "type"), 1, 64),
        selected = offers.find((offer) => offer.type === level);

      if (!selected) campaignFailure();

      const costs = new Map<string, number>();

      for (const itemId of selected.id) costs.set(itemId, (costs.get(itemId) ?? 0) + 1);

      for (const [itemId, count] of costs) context.economy.item(itemId, -count);

      const pinned = pinProgressionReward(context, selected.reward)
          .split("|")
          .map((entry) => {
            const fields = entry.split(",");
            fields[2] = String(cityInteger(Number(fields[2]) * selected.multiple, 1));

            return fields.join(",");
          })
          .join("|"),
        reward = grantNativeProgressionReward(context, pinned);
      refreshCampaignGrants(context);
      const next = selectFragmentExchangeOffers(recipes, random, selected.type)[0]!;
      row.reward = Buffer.from(
        JSON.stringify(offers.map((offer) => (offer.type === next.type ? next : offer))),
      );
      write(row);
      new CampaignPlanner(context, { key_activityId: id, key_rewardId: selected.reward }).event(
        62,
        `${id};${selected.reward}`,
      );

      return {
        response: encode({
          reward: sfs.array(reward),
          exchange: sfs.object(fragmentExchangeOfferView(next, preview(next.reward))),
          actId: sfs.string(id),
        }),
        event: null,
      };
    };

    this.apply = async () => {
      campaignFailure();
    };
  }
}

export function createFragmentExchangeDomain(
  random: (maximum: number) => number = randomInt,
): CityDomain {
  return new FragmentExchangeDomain(random);
}
