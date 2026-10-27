import type { Row } from "@opencok/contracts/rows";
import { text } from "@opencok/contracts/rows";
import type { Rules } from "./game.ts";
import {
  effectInteger as integer,
  effectDouble as double,
  invalidEffect as invalid,
} from "./power-values.ts";

import { hashOrder } from "./power-hash-order.ts";

function firstStatusEffect(source: string): [number, number] | undefined {
  const values = new Map<number, number>();

  for (const segment of source.split("|").filter(Boolean)) {
    const parts = segment.split(";").filter(Boolean);

    if (parts.length === 2) values.set(integer(parts[0]), double(parts[1]));
  }

  const first = hashOrder(values.keys())[0];

  return first === undefined ? undefined : [first, values.get(first)!];
}

export function territoryTreeEffects(
  profile: Row,
  trees: readonly Row[],
  rules: Rules,
): ReadonlyMap<number, number> {
  const effects = new Map<number, number>();
  const alliance = text(profile, "allianceId");

  if (!alliance.trim()) return effects;

  const eligible = trees.filter(
    (row) =>
      text(row, "allianceId") === alliance &&
      integer(row.type) === 42 &&
      integer(row.pointId ?? 0) > 0,
  );

  if (eligible.length > 1) return invalid();

  const tree = eligible[0];

  if (!tree || ![1, 3].includes(integer(tree.stat ?? 0))) return effects;

  const defaultSkin = rules.items.get("life_treeavatar")?.k2;

  if (!defaultSkin?.trim()) return invalid();

  const skin = text(tree, "activeSkin").trim() ? text(tree, "activeSkin") : defaultSkin;
  let statuses: Iterable<string>;

  if (skin === defaultSkin) {
    const level = integer(tree.level ?? 0);
    const id = level === 1 ? "69015" : level === 2 ? "69016" : "69014";
    const control = rules.configuration.payControl?.get(id);

    if (!control) return invalid();

    statuses = hashOrder(Object.keys(control)).map((key) => control[key]!);
  } else {
    if (!rules.power.treeSkins?.size) return invalid();

    statuses = rules.power.treeSkins.get(skin)?.buff?.split(";").filter(Boolean) ?? [];
  }

  const ids = hashOrder(statuses);

  if (ids.length && !rules.power.statuses?.size) return invalid();

  for (const id of ids) {
    const source = rules.power.statuses?.get(id)?.effect;

    if (!source?.trim()) continue;

    const first = firstStatusEffect(source);

    if (!first) return invalid();

    const [effect, value] = first;
    effects.set(effect, Math.max(-2147483648, Math.min(2147483647, Math.floor(value))));
  }

  return effects;
}
