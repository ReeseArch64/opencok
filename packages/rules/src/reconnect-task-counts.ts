import type { Row } from "@opencok/contracts/rows";
import type { Rule, Rules } from "./game.ts";
import { javaDecimal } from "./java-integer.ts";

const integer = (value: unknown) => Number(javaDecimal(String(value ?? 0), 32));
const parts = (value: string | undefined) => value?.split("|").filter(Boolean) ?? [];
const narrow = (value: unknown) => Number(BigInt.asIntN(32, javaDecimal(String(value ?? 0), 64)));

function matches(building: Row, requirement: string): boolean {
  const id = integer(requirement);
  return building.itemId === `${Math.trunc(id / 100)}00` && integer(building.level) >= id % 100;
}

export function reconnectContainsBuildings(
  buildings: readonly Row[],
  requirements: readonly string[],
) {
  return requirements.every((requirement) =>
    buildings.some((building) => matches(building, requirement)),
  );
}

export interface ReconnectTaskCountState {
  profile: Row;
  buildings: readonly Row[];
  armies: readonly Row[];
  equipment: readonly Row[];
  scienceLevels: ReadonlyMap<string, number>;
  resourceOutput: ReadonlyMap<number, number>;
  playerInfo: Row | undefined;
  prestigeLevel: number;
  civilizationCastle: Row | undefined;
}

export function reconnectTaskInitialCount(
  rule: Rule,
  state: ReconnectTaskCountState,
  rules: Rules,
): number {
  const kind = integer(rule.type2);
  switch (kind) {
    case 0:
      return state.buildings.reduce(
        (maximum, row) =>
          row.itemId === rule.para1 ? Math.max(maximum, integer(row.level)) : maximum,
        0,
      );
    case 1:
      return integer(state.scienceLevels.get(rule.para1 ?? "") ?? 0);
    case 3:
      return integer(state.resourceOutput.get(integer(rule.para1)) ?? 0);
    case 5:
      return integer(state.profile.level);
    case 8: {
      const requirements = parts(rule.para1);
      const limits = parts(rule.para2);
      const counts = requirements.map(() => 0);
      for (const building of state.buildings)
        for (const requirement of requirements)
          if (matches(building, requirement)) {
            const index = requirements.indexOf(requirement);
            counts[index] = (counts[index]! + 1) | 0;
          }
      return counts.reduce((total, count, index) => {
        if (limits[index] === undefined) throw new Error("Missing task building threshold");
        return (total + Math.min(count, integer(limits[index]))) | 0;
      }, 0);
    }
    case 12:
      return state.armies.reduce(
        (total, row) =>
          ["free", "pve", "defence", "march"].reduce(
            (sum, key) => (sum + integer(row[key])) | 0,
            total,
          ),
        0,
      );
    case 15:
      return (
        ((rules.reconnect.positionUnlock ?? []).filter((position) => position.unlock === "1")
          .length +
          new Set(
            String(state.profile.openedPos ?? "")
              .split(",")
              .filter(Boolean),
          ).size) |
        0
      );
    case 30: {
      const key = [
        "power",
        "playerPower",
        "armyPower",
        "buildingPower",
        "sciencePower",
        "fortPower",
      ][integer(rule.para1)];
      return key === undefined ? 0 : narrow(state.playerInfo?.[key]);
    }
    case 33: {
      const count = narrow(state.profile.payTotal);
      return count < 0 ? 2147483647 : count;
    }
    case 34:
      return state.profile.pf === "facebook" ? 0 : integer(rule.para2);
    case 39:
      return state.equipment.filter((row) => {
        if (integer(row.on) !== 1) return false;
        const color = Number(String(integer(row.itemId)).slice(-1));
        if (color < 0 || color > 5) throw new Error("Invalid task equipment color");
        return true;
      }).length;
    case 58:
      return integer(state.prestigeLevel);
    case 65:
      return [1, 2].includes(integer(state.civilizationCastle?.status)) ? 1 : 0;
    default:
      if (kind < 0 || kind > 65) throw new Error("Unknown task trigger");
      return 0;
  }
}
