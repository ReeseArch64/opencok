import { DragonIdentity } from "@opencok/enums/dragon-identity";
import { DragonSkill } from "@opencok/enums/dragon-skill";
import { DragonItem } from "@opencok/enums/dragon-item";
import { DragonInteraction } from "@opencok/enums/dragon-interaction";
import type { DragonDefinition } from "../contracts/dragon-definition.ts";
import { Dragon } from "./dragon.ts";

export class Vildrin extends Dragon {
  public readonly identity = DragonIdentity.Vildrin;
  public readonly name = "Vildrin, Sylvan Tutor";
  public readonly server: DragonDefinition["server"] = undefined;
  public readonly hatchingSeconds = 57600;
  public readonly renameGoldCost = 200;
  public readonly skillSlots: DragonDefinition["skillSlots"] = [
    { skill: DragonSkill.ThornyBarricade, unlockLevel: 5, maximumQualityRank: 5 },
    { skill: DragonSkill.SpiritwoodShield, unlockLevel: 10, maximumQualityRank: 4 },
    { skill: DragonSkill.WhisperingVitality, unlockLevel: 15, maximumQualityRank: 4 },
    { skill: DragonSkill.ShadeSProtection, unlockLevel: 20, maximumQualityRank: 4 },
    { skill: DragonSkill.WoodlandSGrace, unlockLevel: 25, maximumQualityRank: 5 },
    { skill: DragonSkill.WoodlandSFury, unlockLevel: 30, maximumQualityRank: 4 },
    { skill: DragonSkill.VerdantStorm, unlockLevel: 35, maximumQualityRank: 4 },
    { skill: DragonSkill.DragonFlameBreathInfantry, unlockLevel: 0, maximumQualityRank: 0 },
    { skill: DragonSkill.HeavenlyRain, unlockLevel: 40, maximumQualityRank: 4 },
    { skill: DragonSkill.SincereHalo, unlockLevel: 0 },
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
  public readonly initialTalent = DragonSkill.VildrinFeralCharge;
  public readonly reputation: DragonDefinition["reputation"] = undefined;
}
