import { DragonIdentity } from "@opencok/enums/dragon-identity";
import { DragonSkill } from "@opencok/enums/dragon-skill";
import { DragonItem } from "@opencok/enums/dragon-item";
import { DragonBattleProfile } from "@opencok/enums/dragon-battle-profile";
import { DragonInteraction } from "@opencok/enums/dragon-interaction";
import type { DragonDefinition } from "../contracts/dragon-definition.ts";
import { Dragon } from "./dragon.ts";

export class ThunderBeast extends Dragon {
  public readonly identity = DragonIdentity.ThunderBeast;
  public readonly name = "Thunder Beast";
  public readonly server: DragonDefinition["server"] = {
    initialPower: 40000,
    initialLevel: 1,
    battleProfile: DragonBattleProfile.SharedAdvanced,
  };
  public readonly hatchingSeconds = 3600;
  public readonly renameGoldCost = 200;
  public readonly skillSlots: DragonDefinition["skillSlots"] = [
    { skill: DragonSkill.WarStorm, unlockLevel: 5, maximumQualityRank: 3 },
    { skill: DragonSkill.TailWhip, unlockLevel: 15, maximumQualityRank: 3 },
    { skill: DragonSkill.Evolution, unlockLevel: 25, maximumQualityRank: 3 },
    { skill: DragonSkill.SnarlOfWar, unlockLevel: 30, maximumQualityRank: 3 },
    { skill: DragonSkill.HorribleBreath, unlockLevel: 20, maximumQualityRank: 3 },
    { skill: DragonSkill.TheOrderOfCommander, unlockLevel: 35, maximumQualityRank: 3 },
    { skill: DragonSkill.IncandescentLight, unlockLevel: 40, maximumQualityRank: 5 },
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
  public readonly initialTalent = DragonSkill.DragonForce;
  public readonly reputation: DragonDefinition["reputation"] = undefined;
}
