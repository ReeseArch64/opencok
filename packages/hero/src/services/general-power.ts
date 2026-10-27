import type { GeneralSkill } from "@opencok/hero/contracts/generals";
import type { Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { decodeStoredJson } from "@opencok/messages/stored-json";

export function generalSkillPoints(generals: readonly Row[]): readonly (readonly GeneralSkill[])[] {
  try {
    return generals.map((general) => {
      if (general.ability === null || general.ability === undefined) {return [];}

      if (!Buffer.isBuffer(general.ability)) {throw new Error();}

      const trees = decodeStoredJson(general.ability);

      if (!Array.isArray(trees)) {throw new Error();}

      const result: GeneralSkill[] = [];

      for (const tree of trees) {
        if (tree === null || typeof tree !== "object" || Array.isArray(tree)) {throw new Error();}

        if (Object.hasOwn(tree, "ids")) {continue;}

        for (const [id, points] of Object.entries(tree)) {
          if (id === "id") {continue;}

          if (
            !/^\d+$/.test(id) ||
            BigInt(id) > 2147483647n ||
            typeof points !== "bigint" ||
            BigInt.asIntN(32, points) !== points
          )
            {throw new Error();}

          result.push({ id, points: Number(points) });
        }
      }

      return result;
    });
  } catch {
    throw new GameError(errors.unsupported, "power_state");
  }
}
