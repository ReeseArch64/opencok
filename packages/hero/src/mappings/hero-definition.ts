import type { Hero } from "../domain/hero.ts";
import type { HeroItemCost } from "../contracts/hero-definition.ts";
import type { HeroCatalogBindings } from "../contracts/hero-catalog-bindings.ts";
import type { GeneralBaseDefinition } from "../resources/catalogs/types/general_base.ts";

export class HeroDefinitionMapper {
  public constructor(private readonly bindings: HeroCatalogBindings) {}

  public toDefinition(hero: Hero): GeneralBaseDefinition {
    hero.validate();
    const binding = this.bindings.heroes[hero.identity];
    const { recruitment, progression, stars, assignments, refinement } = hero;
    const skillAt = (star: number) => {
      const upgrade = stars.upgrades.find((entry) => entry.stars === star);

      if (!upgrade) throw new Error(`Missing star skill for ${hero.name}: ${star}`);

      return this.bindings.skills[upgrade.skill];
    };

    if (refinement.valueRollCostPerAttribute.item !== recruitment.cost.item) {
      throw new Error(`Catalog requires refinement to consume recruitment fragments: ${hero.name}`);
    }

    const unlockItem = refinement.slots[0]!.unlockCost.item;

    if (refinement.slots.some((slot) => slot.unlockCost.item !== unlockItem)) {
      throw new Error(`Catalog requires one refinement unlock item: ${hero.name}`);
    }

    return {
      id: binding.generalId,
      newAccMaxLv: progression.automatedGrantLevelLimit,
      isUnlock: Number(recruitment.available),
      name: binding.nameTextId,
      type: binding.experienceColumnSet,
      gender: this.bindings.genders[hero.gender],
      baseLevel: progression.initialLevel,
      baseQuality: recruitment.initialQuality,
      baseSkill: this.bindings.skills[stars.initialSkill],
      baseStar: stars.initial,
      baseSkill2: skillAt(2),
      baseSkill3: skillAt(3),
      baseSkill4: skillAt(4),
      baseSkill5: skillAt(5),
      breachGoods: progression.breakthroughs.map((step) => this.itemCost(step.cost)),
      starMaxLevel: stars.maximum,
      starGoods: stars.upgrades.map((step) => this.itemCost(step.cost)),
      needPieces: this.itemCost(recruitment.cost),
      piecesId: this.bindings.items[recruitment.cost.item],
      levelMax: progression.maximumLevel,
      talent: binding.talentGroupId,
      talentPointDivisor: progression.talentPointDivisor,
      generalAb: hero.talentTrees.map((tree) => this.bindings.talentTrees[tree]),
      loot: Number(assignments.canLoot),
      lootLevel: assignments.minimumLootLevel,
      garrison: Number(assignments.canGarrison),
      battle: Number(assignments.canBattle),
      lordExp: Number(assignments.canUseLordExperience),
      refineCard: refinement.valueRollCostPerAttribute.quantity,
      refineEffect: refinement.typeRollPrices.map((price) => [price.attributes, price.gold]),
      refineEffectLock: refinement.lockedAttributePrices.map((price) => [
        price.lockedAttributes,
        price.gold,
      ]),
      refineNum: refinement.slots.map((slot) => [slot.position, slot.refinementItemQuantity]),
      unlockLevel: refinement.slots.map((slot) => [slot.position, slot.requiredLevel]),
      unlockStar: refinement.slots.map((slot) => [slot.position, slot.requiredStars]),
      unlockGoodsNum: refinement.slots.map((slot) => [slot.position, slot.unlockCost.quantity]),
      goodsId: this.bindings.items[unlockItem],
    };
  }

  private itemCost(cost: HeroItemCost): readonly number[] {
    return [this.bindings.items[cost.item], cost.quantity];
  }
}
