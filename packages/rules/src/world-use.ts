import { num, text, type Row } from "@opencok/contracts/rows";
import type { Rules, Rule } from "./game";
import { cityInteger } from "./city-progression";
import { chooseWeight } from "./equipment";
import { worldMutationFailure } from "./world-march-runtime";
import { worldResourceDuration } from "./world-resource-refresh";

export function worldItemTarget(rule: Rule, random: (maximum: number) => number) {
  const ids = rule.para1?.split(";") ?? [],
    weights = rule.para2?.split(";") ?? [];

  if (!ids.length || ids.length > 256 || !ids.every((id) => /^\d{1,12}$/.test(id)))
    {worldMutationFailure();}

  if (weights.length <= 1) {return ids[0]!;}

  if (ids.length !== weights.length) {worldMutationFailure();}

  return ids[
    chooseWeight(
      weights.map((weight) => cityInteger(weight)),
      random,
    )
  ]!;
}

export function worldItemFree(point: Row) {
  return (
    num(point, "worldId") === 0 &&
    num(point, "pointType") === 0 &&
    num(point, "grid2Type") === 0 &&
    !text(point, "ownerId")
  );
}

export function worldItemResource(rules: Rules, id: string) {
  const resource = rules.world.resources?.get("resources")?.find((row) => row.id === id);

  if (!resource) {worldMutationFailure();}

  const type = cityInteger(resource.res_type, 0, 5),
    level = cityInteger(resource.res_level, 1, 10),
    key = ["world_wood", "world_stone", "world_iron", "world_food", "world_fineiron", "world_gold"][
      type
    ]!;

  return {
    type,
    level,
    amount: cityInteger(rules.items.get(key)?.[`k${level}`], 1),
    duration: worldResourceDuration(rules, level),
  };
}
