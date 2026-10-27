import { HeroCatalogValueShape } from "@opencok/enums/hero-catalog-value-shape";
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
    const skillAt = (star: number, shape: HeroCatalogValueShape) => {
      const skills = stars.upgrades.find((entry) => entry.stars === star)?.skills ?? [];

      return this.references(
        skills.map((skill) => this.bindings.skills[skill]),
        shape,
      );
    };

    if (
      refinement.slots.some(
        (slot) => slot.unlockCost && slot.unlockCost.item !== refinement.unlockItem,
      )
    ) {
      throw new Error(`Catalog requires one refinement unlock item: ${hero.name}`);
    }

    return {
      id: binding.generalId,
      newAccMaxLv: progression.automatedGrantLevelLimit,
      isUnlock: Number(recruitment.available),
      name: binding.nameTextId,
      ...(binding.fragmentSaleId === undefined ? {} : { saleId: binding.fragmentSaleId }),
      type: binding.experienceColumnSet,
      gender: this.bindings.genders[hero.gender],
      baseLevel: progression.initialLevel,
      baseQuality: recruitment.initialQuality,
      baseSkill: this.references(
        stars.initialSkills.map((skill) => this.bindings.skills[skill]),
        binding.shape.baseSkill,
      ) as GeneralBaseDefinition["baseSkill"],
      baseStar: stars.initial,
      ...(binding.shape.baseSkill2 === HeroCatalogValueShape.Omitted &&
      !stars.upgrades.find((step) => step.stars === 2)?.skills.length
        ? {}
        : { baseSkill2: skillAt(2, binding.shape.baseSkill2) as number }),
      baseSkill3: skillAt(3, binding.shape.baseSkill3) as number | string,
      baseSkill4: skillAt(4, binding.shape.baseSkill4) as number | string,
      baseSkill5: skillAt(5, binding.shape.baseSkill5) as number | string,
      breachGoods: progression.breakthroughs.map((step) => this.itemCost(step.cost)),
      starMaxLevel: stars.maximum,
      starGoods: stars.upgrades.map((step) => this.itemCost(step.cost)),
      needPieces: this.itemCost(recruitment.cost),
      piecesId: this.bindings.items[refinement.valueRollCostPerAttribute.item],
      levelMax: progression.maximumLevel,
      talent: binding.talentGroupId,
      ...(binding.publishTalentPointDivisor || progression.talentPointDivisor !== 1
        ? { talentPointDivisor: progression.talentPointDivisor }
        : {}),
      generalAb: this.references(
        hero.talentTrees.map((tree) => this.bindings.talentTrees[tree]),
        binding.shape.generalAb,
      ) as GeneralBaseDefinition["generalAb"],
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
      unlockLevel: this.table(
        refinement.slots.flatMap((slot) =>
          slot.requiredLevel === undefined ? [] : [[slot.position, slot.requiredLevel]],
        ),
        binding.shape.unlockLevel,
      ) as GeneralBaseDefinition["unlockLevel"],
      unlockStar: this.table(
        refinement.slots.flatMap((slot) =>
          slot.requiredStars === undefined ? [] : [[slot.position, slot.requiredStars]],
        ),
        binding.shape.unlockStar,
      ),
      unlockGoodsNum: this.table(
        refinement.slots.flatMap((slot) =>
          slot.unlockCost === undefined ? [] : [[slot.position, slot.unlockCost.quantity]],
        ),
        binding.shape.unlockGoodsNum,
      ) as GeneralBaseDefinition["unlockGoodsNum"],
      goodsId: this.bindings.items[refinement.unlockItem],
    };
  }

  private references(
    values: readonly number[],
    shape: HeroCatalogValueShape,
  ): number | readonly number[] | string {
    if (shape === HeroCatalogValueShape.List) return values;

    if (values.length > 1) throw new Error("Catalog scalar cannot represent multiple references");

    if (values.length) return values[0]!;

    return shape === HeroCatalogValueShape.EmptyText ? "" : 0;
  }

  private table(
    values: readonly (readonly number[])[],
    shape: HeroCatalogValueShape,
  ): number | string | readonly (readonly number[])[] {
    if (values.length || shape === HeroCatalogValueShape.List) return values;

    return shape === HeroCatalogValueShape.EmptyText ? "" : 0;
  }

  private itemCost(cost: HeroItemCost): readonly number[] {
    return [this.bindings.items[cost.item], cost.quantity];
  }
}
