import type { BuildingLevelDefinition } from "@opencok/contracts/building";
import { building400000 } from "./400000.ts";
import { building401000 } from "./401000.ts";
import { building402000 } from "./402000.ts";
import { building403000 } from "./403000.ts";
import { building404000 } from "./404000.ts";
import { building407000 } from "./407000.ts";
import { building408000 } from "./408000.ts";
import { building409000 } from "./409000.ts";
import { building410000 } from "./410000.ts";
import { building411000 } from "./411000.ts";
import { building412000 } from "./412000.ts";
import { building413000 } from "./413000.ts";
import { building414000 } from "./414000.ts";
import { building415000 } from "./415000.ts";
import { building416000 } from "./416000.ts";
import { building417000 } from "./417000.ts";
import { building418000 } from "./418000.ts";
import { building419000 } from "./419000.ts";
import { building420000 } from "./420000.ts";
import { building422000 } from "./422000.ts";
import { building423000 } from "./423000.ts";
import { building424000 } from "./424000.ts";
import { building425000 } from "./425000.ts";
import { building426000 } from "./426000.ts";
import { building427000 } from "./427000.ts";
import { building428000 } from "./428000.ts";
import { building429000 } from "./429000.ts";
import { building430000 } from "./430000.ts";
import { building431000 } from "./431000.ts";
import { building432000 } from "./432000.ts";
import { building433000 } from "./433000.ts";
import { building434000 } from "./434000.ts";
import { building435000 } from "./435000.ts";
import { building436000 } from "./436000.ts";
import { building437000 } from "./437000.ts";
import { building438000 } from "./438000.ts";
import { building439000 } from "./439000.ts";
import { building440000 } from "./440000.ts";
import { building441000 } from "./441000.ts";
import { building442000 } from "./442000.ts";
import { building443000 } from "./443000.ts";

export const BUILDING_LEVELS: readonly BuildingLevelDefinition[] = [
  ...building400000,
  ...building401000,
  ...building402000,
  ...building403000,
  ...building404000,
  ...building407000,
  ...building408000,
  ...building409000,
  ...building410000,
  ...building411000,
  ...building412000,
  ...building413000,
  ...building414000,
  ...building415000,
  ...building416000,
  ...building417000,
  ...building418000,
  ...building419000,
  ...building420000,
  ...building422000,
  ...building423000,
  ...building424000,
  ...building425000,
  ...building426000,
  ...building427000,
  ...building428000,
  ...building429000,
  ...building430000,
  ...building431000,
  ...building432000,
  ...building433000,
  ...building434000,
  ...building435000,
  ...building436000,
  ...building437000,
  ...building438000,
  ...building439000,
  ...building440000,
  ...building441000,
  ...building442000,
  ...building443000,
];

export function createBuildingCatalog(): Map<number, BuildingLevelDefinition> {
  return new Map(structuredClone(BUILDING_LEVELS).map((level) => [level.id, level]));
}
