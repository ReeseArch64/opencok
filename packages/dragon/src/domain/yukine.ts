import { DragonIdentity } from "@opencok/enums/dragon-identity";
import { DragonSkill } from "@opencok/enums/dragon-skill";
import { DragonItem } from "@opencok/enums/dragon-item";
import { DragonBattleProfile } from "@opencok/enums/dragon-battle-profile";
import { DragonInteraction } from "@opencok/enums/dragon-interaction";
import { DragonCivilization } from "@opencok/enums/dragon-civilization";
import type { DragonDefinition } from "../contracts/dragon-definition.ts";
import { Dragon } from "./dragon.ts";

export class Yukine extends Dragon {
  public readonly identity = DragonIdentity.Yukine;
  public readonly name = "White Dragon: Yukine";
  public readonly server: DragonDefinition["server"] = {
    initialPower: 40000,
    initialLevel: 1,
    battleProfile: DragonBattleProfile.Yukine,
  };
  public readonly hatchingSeconds = 3600;
  public readonly renameGoldCost = 200;
  public readonly skillSlots: DragonDefinition["skillSlots"] = [
    { skill: DragonSkill.UnbrokenSpirit, unlockLevel: 5, maximumQualityRank: 3 },
    { skill: DragonSkill.DragonSEye, unlockLevel: 15, maximumQualityRank: 3 },
    { skill: DragonSkill.Invincible, unlockLevel: 20, maximumQualityRank: 3 },
    { skill: DragonSkill.Merciful, unlockLevel: 25, maximumQualityRank: 3 },
    { skill: DragonSkill.PerseveringSoul, unlockLevel: 30, maximumQualityRank: 3 },
    { skill: DragonSkill.GuardianFortification, unlockLevel: 35, maximumQualityRank: 3 },
    { skill: DragonSkill.FrozenProtection, unlockLevel: 40, maximumQualityRank: 5 },
    { skill: DragonSkill.DragonFlameBreathInfantry, unlockLevel: 0, maximumQualityRank: 5 },
  ];
  public readonly interactions = [
    { action: DragonInteraction.Greet, cooldownSeconds: 5400, minimumFriendship: 0 },
    { action: DragonInteraction.Chat, cooldownSeconds: 10800, minimumFriendship: 0 },
    { action: DragonInteraction.Praise, cooldownSeconds: 21600, minimumFriendship: 0 },
    { action: DragonInteraction.Pet, cooldownSeconds: 43200, minimumFriendship: 0 },
  ];
  public readonly sustainedFeeding = { bonusMultiplier: 2, bonusEveryFeedings: 10 };
  public readonly gifts = [
    DragonItem.StainedGlass,
    DragonItem.CopperNecklace,
    DragonItem.SilverRing,
    DragonItem.GoldenBracelet,
    DragonItem.Silver,
  ];
  public readonly initialTalent = DragonSkill.Destroyer;
  public readonly reputation: DragonDefinition["reputation"] = {
    civilization: DragonCivilization.Yamato,
    minimumLevel: 3,
  };
}
