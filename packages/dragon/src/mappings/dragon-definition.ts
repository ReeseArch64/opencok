import type { Dragon } from "../domain/dragon.ts";
import type { DragonCatalogBindings } from "../contracts/dragon-catalog-bindings.ts";
import type { DragonBaseCatalogRecord } from "../contracts/dragon-base-catalog.ts";

export class DragonDefinitionMapper {
  public constructor(private readonly bindings: DragonCatalogBindings) {}

  public toDefinition(dragon: Dragon): DragonBaseCatalogRecord {
    dragon.validate();

    if (!dragon.server) throw new Error(`Dragon has no server configuration: ${dragon.name}`);

    return {
      id: this.bindings.dragons[dragon.identity],
      initFight: dragon.server.initialPower,
      initlevel: dragon.server.initialLevel,
      skill: dragon.skillSlots.map((slot) => this.bindings.skills[slot.skill]),
      battleSkill: [...this.bindings.battleProfiles[dragon.server.battleProfile]],
      skillUnlockLv: dragon.skillSlots.map((slot) => slot.unlockLevel),
      hatchTime: dragon.hatchingSeconds,
      nicknameCost: dragon.renameGoldCost,
      communicateTime: dragon.interactions.map((interaction) => interaction.cooldownSeconds),
      communicateCond: dragon.interactions.map((interaction) => interaction.minimumFriendship),
      holdCrit: [
        dragon.sustainedFeeding.bonusMultiplier,
        dragon.sustainedFeeding.bonusEveryFeedings,
      ],
      skillSlotQuality: dragon.skillSlots.map((slot) => slot.maximumQualityRank!),
      gift: dragon.gifts.map((gift) => this.bindings.items[gift]),
      talentskillInit: this.bindings.skills[dragon.initialTalent],
      ...(dragon.reputation
        ? {
            reputationCondition: [
              this.bindings.civilizations[dragon.reputation.civilization],
              dragon.reputation.minimumLevel,
            ],
          }
        : {}),
    };
  }
}
