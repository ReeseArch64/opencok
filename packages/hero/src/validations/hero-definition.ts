import type { HeroDefinition, HeroItemCost } from "../contracts/hero-definition.ts";

export function validateHeroDefinition(hero: HeroDefinition): void {
  const invalid = () => {
    throw new Error(`Invalid hero definition: ${hero.name}`);
  };
  const integer = (value: number, minimum = 0, maximum = Number.MAX_SAFE_INTEGER) => {
    if (!Number.isSafeInteger(value) || value < minimum || value > maximum) invalid();
  };
  const cost = (value: HeroItemCost) => integer(value.quantity);
  const sequence = (values: readonly number[], first: number) => {
    if (values.some((value, index) => value !== first + index)) invalid();
  };
  const { recruitment, progression, stars, refinement } = hero;
  integer(recruitment.initialQuality, 1);
  cost(recruitment.cost);
  integer(progression.initialLevel, 1);
  integer(progression.maximumLevel, progression.initialLevel);
  integer(progression.automatedGrantLevelLimit, 1);
  integer(progression.talentPointDivisor, 1);
  integer(stars.initial, 1, 5);
  integer(stars.maximum, stars.initial, 5);
  sequence(
    stars.upgrades.map((step) => step.stars),
    stars.initial + 1,
  );

  if (stars.upgrades.length !== stars.maximum - stars.initial) invalid();

  for (const step of stars.upgrades) cost(step.cost);

  sequence(
    progression.breakthroughs.map((step) => step.stage),
    1,
  );

  for (const step of progression.breakthroughs) cost(step.cost);

  if (!hero.talentTrees.length || new Set(hero.talentTrees).size !== hero.talentTrees.length)
    invalid();

  integer(hero.assignments.minimumLootLevel, 1, progression.maximumLevel);
  cost(refinement.valueRollCostPerAttribute);

  if (!refinement.slots.length || refinement.slots.length > 5) invalid();

  sequence(
    refinement.slots.map((slot) => slot.position),
    1,
  );

  for (const slot of refinement.slots) {
    integer(slot.requiredLevel, 1, progression.maximumLevel);
    integer(slot.requiredStars, 1, stars.maximum);
    cost(slot.unlockCost);
    integer(slot.refinementItemQuantity);
  }

  sequence(
    refinement.typeRollPrices.map((price) => price.attributes),
    1,
  );
  sequence(
    refinement.lockedAttributePrices.map((price) => price.lockedAttributes),
    1,
  );

  if (
    refinement.typeRollPrices.length !== refinement.slots.length ||
    refinement.lockedAttributePrices.length !== refinement.slots.length - 1
  )
    invalid();

  for (const price of [...refinement.typeRollPrices, ...refinement.lockedAttributePrices])
    integer(price.gold);
}
