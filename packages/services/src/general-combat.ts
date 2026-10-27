import { num, text, type Row } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import {
  generalBase,
  generalBaseSkills,
  generalPairs,
  generalFailure,
} from "@opencok/rules/general-progression";
import { generalEffects, ownedGeneral, writeGeneral } from "./generals";
import { defenseGeneral } from "./general-assignments";
import type { CityProgressionContext } from "./city-progression-context.ts";

export function generalCombatSnapshot(
  context: CityProgressionContext,
  id: number,
  defending: boolean,
  factions: ReadonlySet<number> = new Set(),
) {
  const row = ownedGeneral(context, id),
    base = generalBase(context.rules, id);

  if (
    base.battle !== "1" ||
    (defending ? defenseGeneral(context)?.id !== id : num(row, "state") !== 3)
  )
    generalFailure();

  const effects = new Map<number, number>();
  const add = (id: number, value: number) =>
    effects.set(id, Math.fround((effects.get(id) ?? 0) + Math.fround(value)));

  for (const entry of generalEffects(context, row))
    add(Number(entry.effectid!.value), Number(entry.effectvalue!.value));

  if (base.faction !== undefined && factions.has(cityInteger(base.faction))) {
    const levels = generalPairs(text(row, "baseSkill"));

    for (const id of generalBaseSkills(context.rules, row)) {
      const skill = context.rules.power.newGeneralSkills?.get(String(id));

      if (skill?.condition_type !== "1" || skill.type !== "0") continue;

      const ids = (skill.para1 ?? "").split(";"),
        bases = (skill.base ?? "").split(";"),
        additions = (skill.add ?? "").split(";");

      for (const [index, effect] of ids.entries()) {
        const value = Math.fround(
          Number(bases[index] ?? 0) +
            Math.fround(Number(additions[index] ?? 0) * ((levels.get(id) ?? 1) - 1)),
        );

        if (!Number.isFinite(value)) generalFailure();

        add(cityInteger(effect, 1), value);
      }
    }
  }

  for (const id of [56, 882]) {
    const value = context.generalEffect(id, 427000);

    if (value > 0) add(id, value);
  }

  return Object.freeze({
    owner: context.owner,
    id,
    level: num(row, "level"),
    at: context.now,
    effects: Object.freeze([...effects].map(([id, value]) => Object.freeze({ id, value }))),
  });
}

export function captureGeneral(
  context: CityProgressionContext,
  id: number,
  captor: string,
  killSeconds: number,
) {
  const row = ownedGeneral(context, id),
    base = generalBase(context.rules, id);

  if (
    !captor ||
    captor === context.owner ||
    captor.length > 40 ||
    ![1, 2, 3, 6].includes(num(row, "state")) ||
    base.loot !== "1" ||
    num(row, "level") < cityInteger(base.loot_level, 1)
  )
    generalFailure();

  writeGeneral(context, {
    ...row,
    state: 4,
    serverid: context.rules.kingdomId,
    predatoruid: captor,
    buildingUuid: "",
    relivetime: 0n,
    gethomttime: 0n,
    robtime: context.now,
    killtime: context.now + BigInt(cityInteger(killSeconds, 1)) * 1000n,
    optime: "",
  });
  const office = context.state.generalRoster?.offices.find((office) => office.id === id);

  if (office)
    (context.write.generalRoster ??= {}).offices = [
      { ...office, officeId: "", position: 0, startTime: 0n, lastRefreshExpTime: 0n },
    ];

  const equipment: Row[] = context.state.equipment
    .filter((item) => item.generalid === id)
    .map((item) => ({ ...item, generalid: 0, on: 0 }));

  if (equipment.length)
    context.write.equipment = [...(context.write.equipment ?? []), ...equipment];
}
