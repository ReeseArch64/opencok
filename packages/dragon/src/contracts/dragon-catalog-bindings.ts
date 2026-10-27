import type { DragonIdentity } from "@opencok/enums/dragon-identity";
import type { DragonSkill } from "@opencok/enums/dragon-skill";
import type { DragonItem } from "@opencok/enums/dragon-item";
import type { DragonBattleProfile } from "@opencok/enums/dragon-battle-profile";
import type { DragonCivilization } from "@opencok/enums/dragon-civilization";

export interface DragonCatalogBindings {
  readonly dragons: Readonly<Record<DragonIdentity, number>>;
  readonly skills: Readonly<Record<DragonSkill, number>>;
  readonly items: Readonly<Record<DragonItem, number>>;
  readonly battleProfiles: Readonly<Record<DragonBattleProfile, readonly number[]>>;
  readonly civilizations: Readonly<Record<DragonCivilization, number>>;
}
