import { XMLParser, XMLValidator } from "fast-xml-parser";
import { join } from "node:path";

export class GameError extends Error {
  constructor(
    readonly code: string,
    readonly reason?:
      | "building_shape"
      | "building_rule"
      | "role_rule"
      | "cost_rule"
      | "queue_kind"
      | "world_state",
  ) {
    super(code);
  }
}
export const errors = {
  invalid: "E000000",
  unsupported: "102192",
  missing: "E100169",
  full: "102152",
  occupied: "E100157",
  resource: "102196",
  queue: "E100159",
};
export type Rule = Record<string, string>;
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
  ) {}
  static async load(directory: string, kingdomId = 1) {
    const load = async (name: string, replaceDuplicates = false): Promise<Map<string, Rule>> => {
      const file = Bun.file(join(directory, `${name}.xml`));
      if (file.size > 16 * 1024 * 1024) throw new Error("Oversized gameplay resource");
      const xml = await file.text();
      if (xml.includes("<!DOCTYPE") || XMLValidator.validate(xml) !== true)
        throw new Error("Invalid gameplay resource XML");
      const parsed = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
        parseAttributeValue: false,
        removeNSPrefix: true,
      }).parse(xml);
      const items = parsed.database?.ItemSpec ?? parsed.database?.Group?.ItemSpec;
      if (!Array.isArray(items)) throw new Error("Missing gameplay resource records");
      const map = new Map<string, Rule>();
      for (const item of items as Rule[]) {
        // Legacy goods contains blank-ID placeholders and later overrides.
        if (name === "goods" && !item.id) continue;
        if (!item.id || (!replaceDuplicates && map.has(item.id)))
          throw new Error("Invalid gameplay resource ID");
        map.set(item.id, item);
      }
      return map;
    };
    const [buildings, roles, positions] = await Promise.all([
      load("building"),
      load("role"),
      load("position"),
    ]);
    const stars = (await Bun.file(join(directory, "function_star.xml")).exists())
      ? await load("function_star")
      : new Map<string, Rule>();
    const items = (await Bun.file(join(directory, "item.xml")).exists())
      ? await load("item")
      : new Map<string, Rule>();
    const optional = async (name: string) =>
      (await Bun.file(join(directory, `${name}.xml`)).exists())
        ? load(name, name === "goods" || name === "function_on")
        : new Map<string, Rule>();
    const [arms, goods, features] = await Promise.all([
      optional("arms"),
      optional("goods"),
      optional("function_on"),
    ]);
    return new Rules(buildings, roles, positions, stars, items, arms, goods, features, kingdomId);
  }
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
  maxStar(itemId: string): number {
    const prefix = String(Math.floor(Number(itemId) / 100) * 100);
    let max = 0;
    // This adapter serves mobile 12.06.0. Scheduled gates remain closed.
    for (const rule of this.stars.values()) {
      const server = (rule.online ?? "").split(";").some((v) => {
        if (v === "all") return true;
        const [lo, hi = lo] = v.split("-").map(Number);
        return lo! <= this.kingdomId && hi! >= this.kingdomId;
      });
      const version = (rule.version ?? "").split(".").map(Number);
      const current = [12, 6, 0];
      const diff = current.map((v, i) => v - (version[i] ?? 0)).find((v) => v !== 0) ?? 0;
      if (
        rule.build_id === prefix &&
        server &&
        rule.version &&
        diff >= 0 &&
        !rule.start &&
        !rule.end
      )
        max = Math.max(max, Number(rule.star));
    }
    return max;
  }
  nextBuilding(itemId: string, level: number, star = 0, progress = 0): Rule {
    const current = this.building(itemId, level, star, progress);
    if (level < 30) return this.building(itemId, level + 1, star, progress);
    if (star >= this.maxStar(itemId)) return current;
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
