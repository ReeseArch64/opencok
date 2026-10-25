import { sfs, type Fields } from "@opencok/messages/sfs";
import { num, text, long, type Row } from "@opencok/contracts/rows";
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
    startTime: sfs.long(long(row, "startTime")),
    actTime: sfs.long(long(row, "actTime")),
    endTime: sfs.long(long(row, "endTime")),
    stat: sfs.int(num(row, "stat")),
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
    refinepropertylist: sfs.array([]),
    growvalue: sfs.int(num(row, "refinegold")),
    ...(office && num(office, "position") > 0
      ? { heroOffice: sfs.object(generalOffice(office)) }
      : {}),
  };
}
