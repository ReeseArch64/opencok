import type { DragonIdentity } from "@opencok/enums/dragon-identity";
import type { DragonSkill } from "@opencok/enums/dragon-skill";
import type { DragonItem } from "@opencok/enums/dragon-item";
import type { DragonBattleProfile } from "@opencok/enums/dragon-battle-profile";
import type { DragonInteraction } from "@opencok/enums/dragon-interaction";
import type { DragonCivilization } from "@opencok/enums/dragon-civilization";

export interface DragonDefinition {
  readonly identity: DragonIdentity;
  readonly name: string;
  readonly server:
    | {
        readonly initialPower: number;
        readonly initialLevel: number;
        readonly battleProfile: DragonBattleProfile;
      }
    | undefined;
  readonly hatchingSeconds: number;
  readonly renameGoldCost: number;
  readonly skillSlots: readonly {
    readonly skill: DragonSkill;
    readonly unlockLevel: number;
    readonly maximumQualityRank?: number;
  }[];
  readonly interactions: readonly {
    readonly action: DragonInteraction;
    readonly cooldownSeconds: number;
    readonly minimumFriendship: number;
  }[];
  readonly sustainedFeeding: {
    readonly bonusMultiplier: number;
    readonly bonusEveryFeedings: number;
  };
  readonly gifts: readonly DragonItem[];
  readonly initialTalent: DragonSkill;
  readonly reputation:
    | {
        readonly civilization: DragonCivilization;
        readonly minimumLevel: number;
      }
    | undefined;
}
