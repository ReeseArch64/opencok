import { javaMailTrim } from "./avatar-mail";
import { cityInteger } from "./city-progression";
import { campaignFailure } from "./local-campaign";
import type {
  FragmentExchangeOffer,
  FragmentExchangeRecipe,
} from "@opencok/contracts/fragment-exchange";
import type { Rule } from "./game";
export function fragmentExchangeRecipes(rows: Iterable<Rule>): readonly FragmentExchangeRecipe[] {
  const recipes = [...rows].map((row) => {
    const type = cityInteger(row.type, 1, 64),
      same = cityInteger(row.same_item, 1, type),
      pool = (row.exchange_id ?? "").split(";"),
      rewards = (row.reward ?? "").split(";"),
      weights = (row.reward_rate ?? "").split(";").map((value) => cityInteger(value));
    if (
      !pool.length ||
      pool.length > 64 ||
      new Set(pool).size !== pool.length ||
      pool.some((id) => !/^\d{1,12}$/.test(id)) ||
      pool.length < type - same + 1 ||
      !rewards.length ||
      rewards.length > 128 ||
      rewards.some((id) => !/^\d{1,12}$/.test(id)) ||
      rewards.length !== weights.length
    )
      campaignFailure();
    return {
      type,
      same,
      rate: cityInteger(row.rate),
      pool,
      rewards,
      weights,
      multiple: cityInteger(row.muti, 1, 1024),
    };
  });
  if (
    !recipes.length ||
    recipes.length > 128 ||
    new Set(recipes.map((rule) => `${rule.type}:${rule.same}`)).size !== recipes.length ||
    new Set(recipes.map((rule) => rule.pool.join(";"))).size !== 1
  )
    campaignFailure();
  return recipes;
}
function weighted(weights: readonly number[], random: (maximum: number) => number) {
  const total = cityInteger(
      weights.reduce((sum, value) => sum + value, 0),
      1,
    ),
    draw = cityInteger(random(total), 0, total - 1);
  let bound = 0;
  const index = weights.findIndex((weight) => draw < (bound += weight));
  if (index < 0) campaignFailure();
  return index;
}
export function selectFragmentExchangeOffers(
  recipes: readonly FragmentExchangeRecipe[],
  random: (maximum: number) => number,
  onlyType?: number,
): readonly FragmentExchangeOffer[] {
  const types = [...new Set(recipes.map((rule) => rule.type))]
    .filter((type) => onlyType === undefined || type === onlyType)
    .sort((a, b) => b - a);
  if (!types.length || types.length > 64) campaignFailure();
  return types.map((type) => {
    const choices = recipes.filter((rule) => rule.type === type).sort((a, b) => a.same - b.same),
      recipe =
        choices[
          weighted(
            choices.map((rule) => rule.rate),
            random,
          )
        ]!,
      pool = [...recipe.pool],
      distinct = type - recipe.same + 1;
    for (let index = 0; index < distinct; index++) {
      const selected = index + cityInteger(random(pool.length - index), 0, pool.length - index - 1);
      [pool[index], pool[selected]] = [pool[selected]!, pool[index]!];
    }
    const ids = pool.slice(0, distinct);
    if (recipe.same > 1) {
      const repeated = ids.splice(cityInteger(random(ids.length), 0, ids.length - 1), 1)[0]!;
      ids.push(...Array.from({ length: recipe.same }, () => repeated));
    }
    return {
      id: ids,
      type,
      same: recipe.same,
      reward: recipe.rewards[weighted(recipe.weights, random)]!,
      multiple: recipe.multiple,
    };
  });
}
export function readFragmentExchangeOffers(bytes: Uint8Array): readonly FragmentExchangeOffer[] {
  if (!bytes.length || bytes.length > 65535) campaignFailure();
  const raw: unknown = JSON.parse(
    javaMailTrim(new TextDecoder("utf-8", { fatal: true }).decode(bytes)),
  );
  if (!Array.isArray(raw) || !raw.length || raw.length > 64) campaignFailure();
  const offers: FragmentExchangeOffer[] = raw.map((value) => {
    if (
      !value ||
      typeof value !== "object" ||
      !Array.isArray(value.id) ||
      value.id.length > 64 ||
      value.id.some((id: unknown) => typeof id !== "string" || !/^\d{1,12}$/.test(id)) ||
      typeof value.reward !== "string" ||
      !/^\d{1,12}$/.test(value.reward)
    )
      campaignFailure();
    const type = cityInteger(value.type, 1, 64),
      same = cityInteger(value.same, 1, type),
      counts = new Map<string, number>();
    for (const id of value.id as string[]) counts.set(id, (counts.get(id) ?? 0) + 1);
    const maximum = Math.max(...counts.values());
    if (value.id.length !== type || maximum !== same || counts.size !== type - same + 1)
      campaignFailure();
    return {
      id: value.id,
      type,
      same,
      reward: value.reward,
      multiple: cityInteger(value.multiple, 1, 1024),
    };
  });
  if (new Set(offers.map((offer) => offer.type)).size !== offers.length) campaignFailure();
  return offers;
}
