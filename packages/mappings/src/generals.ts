import { sfs, type Fields } from "@opencok/messages/sfs";
import { num, text, long, type Row } from "@opencok/contracts/rows";
import type { Rules } from "@opencok/rules/game";
import { generalProperties, generalPropertyRule } from "@opencok/rules/general-refinement";
import { generalPairs } from "@opencok/rules/general-progression";
export function generalLevels(raw: string) {
  return sfs.array(
    [...generalPairs(raw)].map(([id, level]) =>
      sfs.object({ id: sfs.int(id), level: sfs.int(level) }),
    ),
  );
}
export function generalPurchase(row: Row): Fields {
  return {
    generalId: sfs.int(num(row, "generalId")),
    ...Object.fromEntries(
      [1, 2, 3, 4].map((i) => [`buyCountType${i}`, sfs.int(num(row, `countType${i}`))]),
    ),
  };
}
export function generalSkill(row: Row): Fields {
  return {
    skillId: sfs.string(text(row, "skillId")),
    actTime: sfs.long(long(row, "actTime")),
    endTime: sfs.long(long(row, "endTime")),
    state: sfs.int(num(row, "stat")),
  };
}
export function generalOffice(row: Row): Fields {
  return {
    officeId: sfs.string(text(row, "officeId")),
    position: sfs.string(text(row, "position")),
    startTime: sfs.string(text(row, "startTime")),
  };
}
export function newGeneral(
  row: Row,
  buff: Fields[] = [],
  skills: readonly Row[] = [],
  office?: Row,
): Fields {
  return {
    ...Object.fromEntries(
      ["id", "level", "exp", "quality", "talentpoint", "state"].map((key) => [
        key,
        sfs.int(num(row, key)),
      ]),
    ),
    predatoruid: sfs.string(text(row, "predatoruid")),
    relivetime: sfs.long(long(row, "relivetime")),
    buildinguuid: sfs.string(text(row, "buildingUuid")),
    buff: sfs.array(buff.map(sfs.object)),
    skillInfo: sfs.array(
      skills
        .filter((skill) => skill.newGeneralId === row.id)
        .map((skill) => sfs.object(generalSkill(skill))),
    ),
    talent: generalLevels(text(row, "talent")),
    baseskilllist: generalLevels(text(row, "baseSkill")),
    gethometime: sfs.long(long(row, "gethomttime")),
    killtime: sfs.long(long(row, "killtime")),
    robtime: sfs.long(long(row, "robtime")),
    breach: sfs.string(text(row, "breach")),
    star: sfs.int(num(row, "star")),

    ...(office && num(office, "position") > 0
      ? { heroOffice: sfs.object(generalOffice(office)) }
      : {}),
  };
}

export function generalRefinement(row: Row, rules: Rules): Fields {
  const locked = new Set(text(row, "lockproperty").split(";")),
    current = generalProperties(text(row, "refineproperty")),
    proposed = generalProperties(text(row, "oldrefineproperty"));
  const view = (values: typeof current, showLock: boolean) =>
    sfs.array(
      [...values].map(([index, property]) =>
        sfs.object({
          index: sfs.int(index),
          id: sfs.int(property.id),
          value: sfs.string(String(property.value)),
          maxvalue: sfs.string(generalPropertyRule(rules, property.id).max!),
          ...(showLock && locked.has(String(index)) ? { lock: sfs.int(1) } : {}),
        }),
      ),
    );
  let growth = 0;
  for (const [index, property] of current) {
    const next = proposed.get(index);
    if (next)
      growth += Math.trunc(
        ((next.value - property.value) / Number(generalPropertyRule(rules, property.id).max)) *
          10000,
      );
  }
  return {
    refinepropertylist: view(current, true),
    ...(proposed.size ? { canbackrefinepropertylist: view(proposed, false) } : {}),
    growvalue: sfs.int(growth),
  };
}
