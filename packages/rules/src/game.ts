import { GameError } from "@opencok/errors/game";
import { errors, MOBILE_CLIENT_VERSION } from "@opencok/constants/game";
import { ruleAvailable } from "./availability.ts";
import { javaDecimal } from "./java-integer.ts";

export type Rule = Record<string, string>;
export interface WorldCatalogs {
  fieldMonsters?: Map<string, Rule>;
  armies?: Map<string, Rule>;
  neutralResources?: Map<string, Rule>;
  barbarians?: Map<string, Rule>;
}
export interface ReconnectCatalogs {
  treasures?: Map<string, Rule>;
  rewards?: Map<string, Rule>;
}
export interface ProfileCatalogs {
  achievementCount?: number;
  militaryRanks?: Map<string, Rule>;
  servers?: Map<string, Rule>;
}
export interface ConfigurationCatalogs {
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
    readonly buildings: Map<string, Rule>,
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
  ) {}
  building(itemId: string, level: number, star = 0, progress = 0): Rule {
    if (
      !/^\d{6}$/.test(itemId) ||
      ![level, star, progress].every(Number.isInteger) ||
      level < 0 ||
      level > 30 ||
      star < 0 ||
      progress < 0 ||
      progress >= 100 ||
      (level < 30 && star !== 0)
    )
      throw new GameError(errors.unsupported, "building_shape");
    const rule = this.buildings.get(String(Number(itemId) + level + star));
    if (!rule || Number(rule.level) !== level)
      throw new GameError(errors.unsupported, "building_rule");
    const result = { ...rule, s: String(star), p: String(progress) };
    if (level < 30) return result;
    const out: Rule = result;
    for (const key of ["time", "exp", "power", "item", "building", "res"]) {
      const steps = progression(rule[`star_${key}`]);
      const index = stepIndex(steps, progress) + (key === "power" ? 0 : 1);
      const step = steps[index];
      if (!step) continue;
      if (key === "res") {
        for (const [i, resource] of ["wood", "stone", "iron", "food"].entries())
          if (step[i + 1] !== undefined) out[resource] = step[i + 1]!;
      } else if (key === "item") out.item = step.slice(1).join(";").replaceAll(",", "|");
      else if (key === "building") {
        out.star_building =
          step.length > 1
            ? step
                .slice(1)
                .map((v) => v.split(",")[0])
                .join(",")
            : step[0]!;
        out.star_building_new =
          step.length > 1
            ? step.slice(1).join(";")
            : step[0]!
                .split(",")
                .map((v) => `${v},1`)
                .join(";");
      } else if (step[1] !== undefined) out[key] = step[1];
    }
    for (let i = 1; i <= 5; i++) {
      const steps = progression(rule[`para${i}`]);
      const value = steps[stepIndex(steps, progress)]?.[1];
      if (steps.length > 1 && value !== undefined) out[`para${i}`] = value;
    }
    for (const [source, target] of [
      ["unlock_type", "unlock_type"],
      ["unlock_value", "unlock_value"],
      ["unlock_cost_type", "unlock_costType"],
      ["unlock_cost_value", "unlock_costValue"],
    ] as const) {
      const step = progression(rule[source]).find(
        (v) => Number(v[0]) === progress + 10 && v.length === 2,
      );
      if (step) out[target] = step[1]!;
    }
    return out;
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
  nextBuilding(itemId: string, level: number, star: number, progress: number, now: number): Rule {
    const current = this.building(itemId, level, star, progress);
    if (level < 30) return this.building(itemId, level + 1, star, progress);
    if (star >= this.maxStar(itemId, now)) return current;
    const steps = progression(current.star_time);
    const next = Number(steps[stepIndex(steps, progress) + 1]?.[0] ?? progress + 10);
    return this.building(itemId, level, star + (next >= 100 ? 1 : 0), next >= 100 ? 0 : next);
  }
  role(level: number): Rule {
    const rule = this.roles.get(String(100100 + level));
    if (!rule) throw new GameError(errors.unsupported, "role_rule");
    return rule;
  }
  cost(rule: Rule, key: string): bigint {
    const value = rule[key] ?? "0";
    if (!/^\d+$/.test(value)) throw new GameError(errors.unsupported, "cost_rule");
    return BigInt(value);
  }
}

function progression(value?: string): string[][] {
  return (value ?? "")
    .split("|")
    .filter(Boolean)
    .map((v) => v.split(";").filter(Boolean));
}
function stepIndex(steps: string[][], progress: number): number {
  let index = -1;
  while (index + 1 < steps.length && Number(steps[index + 1]![0]) <= progress) index++;
  return index;
}
