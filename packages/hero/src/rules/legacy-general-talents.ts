import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

import type { Rules } from "@opencok/rules/game";
import { cityInteger } from "@opencok/rules/city-progression";

function invalid(): never {
  throw new GameError(errors.locked, "city_progression");
}

export type TalentTree = Record<string, string | number | null>;

export function validateTalentTrees(trees: readonly TalentTree[], rules: Rules, maximum: number) {
  let used = 0;

  if (trees.length > 8 || new Set(trees.map((tree) => tree.id)).size !== trees.length) invalid();

  for (const tree of trees) {
    if (tree.ids !== undefined) continue;

    const root = rules.progression.abilities?.get(String(tree.id));

    if (!root) invalid();

    const allowed = new Set(root!.skill?.split("|") ?? []);

    for (const [id, raw] of Object.entries(tree)) {
      if (id === "id") continue;

      if (!allowed.has(id)) invalid();

      const rule = rules.power.generalSkills?.get(id);
      const points = cityInteger(raw, 0, cityInteger(rule?.max_lv));

      if (!points) continue;

      if (
        rule?.condition_skill &&
        !rule.condition_skill.split("|").some((pair) => {
          const [key, count] = pair.split(";");

          return typeof tree[key!] === "number" && Number(tree[key!]) >= cityInteger(count);
        })
      )
        invalid();

      used += points;
    }
  }

  if (used > maximum) invalid();

  return cityInteger(maximum - used);
}
