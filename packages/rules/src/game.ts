import type {
  BuildingLevelDefinition,
  BuildingResource,
  BuildingState,
} from "@opencok/contracts/building";
import { buildingLevel, nextBuildingLevel } from "./building.ts";
import { GameError } from "@opencok/errors/game";
import { errors, MOBILE_CLIENT_VERSION } from "@opencok/constants/game";
import { ruleAvailable } from "./availability.ts";
import { javaDecimal } from "./java-integer.ts";

export type Rule = Record<string, string>;
export interface RankingCatalogs {
  militaryGroups?: Map<string, Rule>;
  heroEvents?: Map<string, Rule>;
}
export interface WorldCatalogs {
  allianceBuildings?: readonly Rule[];
  fieldMonsters?: Map<string, Rule>;
  armies?: Map<string, Rule>;
  neutralResources?: Map<string, Rule>;
  barbarians?: Map<string, Rule>;
}
export interface ProgressionCatalogs {
  abilities?: Map<string, Rule>;
  legacyDaily?: Map<string, Rule>;
  legacyRewards?: Map<string, Rule>;
  freshSignIn?: Map<string, Rule>;
  story?: Map<string, Rule>;
  daily?: Map<string, Rule>;
  dailyRewards?: Map<string, Rule>;
  questPhases?: Map<string, Rule>;
  signIn?: Map<string, Rule>;
}
export interface ReconnectCatalogs {
  treasures?: Map<string, Rule>;
  rewards?: Map<string, Rule>;
  quests?: readonly Rule[];
  positionUnlock?: readonly Rule[];
}
export interface ProfileCatalogs {
  characters?: Map<string, Rule>;
  achievementCount?: number;
  achievements?: readonly Rule[];
  militaryRanks?: Map<string, Rule>;
  servers?: Map<string, Rule>;
}
export interface ConfigurationCatalogs {
  allianceTeleport?: Map<string, Rule>;
  settingRecords?: readonly Rule[];
  starRecords?: readonly Rule[];
  featureRecords?: readonly Rule[];
  dataConfig?: Map<string | null, Rule>;
  serverConfig?: Map<string, Rule>;
  generalSales?: Map<string, Rule>;
  generalSaleRecords?: readonly Rule[];
  payControl?: Map<string, Rule>;
  kingdomSkills?: Map<string, Rule>;
  kingdomSkillRecords?: readonly Rule[];
  facebookShare?: Map<string, Rule>;
  facebookShareRecords?: readonly Rule[];
}
export interface PowerCatalogs {
  generals?: Map<string, Rule>;
  sciences?: Map<string, Rule>;
  civilizationSciences?: Map<string, Rule>;
  sagaSciences?: Map<string, Rule>;
  sagaScienceBases?: Map<string, Rule>;
  foreignSciences?: Map<string, Rule>;
  foreignScienceBases?: Map<string, Rule>;
  heroes?: Map<string, Rule>;
  equipment?: Map<string, Rule>;
  titles?: Map<string, Rule>;
  dragonBases?: Map<string, Rule>;
  dragonLevels?: Map<string, Rule>;
  statuses?: Map<string, Rule>;
  generalSkills?: Map<string, Rule>;
  newGeneralBases?: Map<string, Rule>;
  newGeneralSkills?: Map<string, Rule>;
  newGeneralOffices?: Map<string, Rule>;
  newGeneralRefinement?: Map<string, Rule>;
  equipmentSets?: Map<string, Rule>;
  vip?: Map<string, Rule>;
  superVip?: Map<string, Rule>;
  allianceSciences?: Map<string, Rule>;
  prestigeLevels?: Map<string, Rule>;
  prestigeLevelRecords?: readonly Rule[];
  civilizationFeatures?: Map<string, Rule>;
  militarySkills?: Map<string, Rule>;
  miracleBuffs?: Map<string, Rule>;
  dragonSkills?: Map<string, Rule>;
  activityEvents?: Map<string, Rule>;
  offices?: Map<string, Rule>;
  treeSkins?: Map<string, Rule>;
  activityPanels?: Map<string, Rule>;
  mergeActivities?: Map<string, Rule>;
  luckyEffects?: Map<string, Rule>;
  monarchTitles?: Map<string, Rule>;
}
export class Rules {
  constructor(
    readonly buildings: Map<number, BuildingLevelDefinition>,
    readonly roles: Map<string, Rule>,
    readonly positions: Map<string, Rule>,
    readonly stars: Map<string, Rule> = new Map(),
    readonly items: Map<string, Rule> = new Map(),
    readonly arms: Map<string, Rule> = new Map(),
    readonly goods: Map<string, Rule> = new Map(),
    readonly features: Map<string, Rule> = new Map(),
    readonly kingdomId = 1,
    readonly settings: Map<string, Rule> = new Map(),
    readonly configuration: ConfigurationCatalogs = {},
    readonly power: PowerCatalogs = {},
    readonly profile: ProfileCatalogs = {},
    readonly reconnect: ReconnectCatalogs = {},
    readonly mail: Map<string, Rule> = new Map(),
    readonly world: WorldCatalogs = {},
    readonly ranking: RankingCatalogs = {},
    readonly materials: Map<string, Rule> = new Map(),
    readonly shops: Map<string, Rule> = new Map(),
    readonly trades: Map<string, Rule> = new Map(),
    readonly progression: ProgressionCatalogs = {},
  ) {}
  building(itemId: string, level: number, star = 0, progress = 0): BuildingState {
    return buildingLevel(this.buildings, itemId, level, star, progress);
  }
  maxStar(itemId: string, now: number): number {
    const prefix = `${javaDecimal(itemId, 32) / 100n}00`;
    let max = 0;

    for (const rule of this.configuration.starRecords ?? this.stars.values()) {
      if (
        rule.build_id === prefix &&
        ruleAvailable(rule, { kingdomId: this.kingdomId, version: MOBILE_CLIENT_VERSION, now })
      )
        max = Math.max(max, Number(javaDecimal(rule.star ?? "", 32)));
    }
    return max;
  }
  nextBuilding(
    itemId: string,
    level: number,
    star: number,
    progress: number,
    now: number,
  ): BuildingState {
    this.building(itemId, level, star, progress);
    return nextBuildingLevel(
      this.buildings,
      itemId,
      level,
      star,
      progress,
      level < 30 ? 0 : this.maxStar(itemId, now),
    );
  }
  role(level: number): Rule {
    const rule = this.roles.get(String(100100 + level));
    if (!rule) throw new GameError(errors.unsupported, "role_rule");
    return rule;
  }
  cost(rule: BuildingState, key: BuildingResource): bigint {
    const value = rule.costs?.[key] ?? 0n;
    if (typeof value !== "bigint" || value < 0n)
      throw new GameError(errors.unsupported, "cost_rule");
    return value;
  }
}
