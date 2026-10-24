import type { WorldResourceOwnerSnapshot } from "@opencok/contracts/world-point-detail";
import type { Row } from "@opencok/contracts/rows";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { new_general } from "@opencok/drizzle/schema/opencok_kingdom/new_general";
import { new_general_status } from "@opencok/drizzle/schema/opencok_kingdom/new_general_status";
import { user_equip } from "@opencok/drizzle/schema/opencok_kingdom/user_equip";
import { hero_office } from "@opencok/drizzle/schema/opencok_kingdom/hero_office";
import { and, asc, eq, gt } from "drizzle-orm";
import type { Database } from "./game.ts";
import { readPlayerEffects } from "./power.ts";

type Reader = Pick<Database["kingdom"]["db"], "select">;
const profileColumns = {
  uid: userprofile.uid,
  level: userprofile.level,
  serverId: userprofile.serverId,
  crossFightSrcServerId: userprofile.crossFightSrcServerId,
  banTime: userprofile.banTime,
  appVersion: userprofile.appVersion,
  allianceId: userprofile.allianceId,
  pf: userprofile.pf,
  civilizationType: userprofile.civilizationType,
  decomposeSuitEffect: userprofile.decomposesuiteffect,
};
const buildingColumns = {
  uid: user_building.uid,
  uuid: user_building.uuid,
  itemId: user_building.itemId,
  level: user_building.level,
  star: user_building.star,
};
const generalColumns = {
  uid: new_general.uid,
  id: new_general.id,
  state: new_general.state,
  buildingUuid: new_general.buildingUuid,
  star: new_general.star,
  baseSkill: new_general.baseSkill,
  talent: new_general.talent,
  opTime: new_general.optime,
  refinement: new_general.refineproperty,
};
const statusColumns = {
  uid: new_general_status.uid,
  newGeneralId: new_general_status.newGeneralId,
  stateId: new_general_status.stateId,
  startTime: new_general_status.startTime,
  endTime: new_general_status.endTime,
};
const equipmentColumns = {
  uid: user_equip.uid,
  uuid: user_equip.uuid,
  generalId: user_equip.generalid,
  itemId: user_equip.itemId,
  extraProperty: user_equip.extraProperty,
};
const officeColumns = {
  uid: hero_office.uid,
  id: hero_office.id,
  officeId: hero_office.officeId,
  position: hero_office.position,
  startTime: hero_office.startTime,
};

function text(value: unknown, limit: number): value is string {
  return (
    typeof value === "string" &&
    value.length <= limit &&
    value.isWellFormed() &&
    !value.includes("\0")
  );
}
function integer(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= -2147483648 &&
    value <= 2147483647
  );
}
function long(value: unknown): boolean {
  return typeof value === "bigint" && BigInt.asIntN(64, value) === value;
}
function rows(
  values: readonly Row[],
  uid: string,
  key: (row: Row) => string,
  valid: (row: Row) => boolean,
) {
  if (
    values.length > 4096 ||
    values.some((row) => row.uid !== uid || !valid(row)) ||
    new Set(values.map(key)).size !== values.length
  )
    throw new Error("Invalid resource owner records");
}
function nullableText(value: unknown, limit: number): boolean {
  return value === null || text(value, limit);
}
function nullableInteger(value: unknown): boolean {
  return value === null || integer(value);
}

export async function readWorldResourceOwner(
  db: Reader,
  uid: string,
): Promise<WorldResourceOwnerSnapshot | undefined> {
  if (!text(uid, 255) || !uid) throw new Error("Invalid resource owner");
  const profiles = await db
    .select(profileColumns)
    .from(userprofile)
    .where(eq(userprofile.uid, uid))
    .limit(2);
  if (profiles.length > 1) throw new Error("Duplicate resource owner");
  const profile = profiles[0];
  if (!profile) return undefined;
  if (
    profile.uid !== uid ||
    !integer(profile.level) ||
    !nullableInteger(profile.serverId) ||
    !integer(profile.crossFightSrcServerId) ||
    (profile.banTime !== null && !long(profile.banTime)) ||
    !nullableText(profile.appVersion, 40) ||
    !nullableText(profile.allianceId, 40) ||
    !nullableText(profile.pf, 40) ||
    !nullableInteger(profile.civilizationType) ||
    !nullableText(profile.decomposeSuitEffect, 100)
  )
    throw new Error("Invalid resource owner profile");
  const effects = await readPlayerEffects(db, profile, true);
  const buildings = await db
    .select(buildingColumns)
    .from(user_building)
    .where(eq(user_building.uid, uid))
    .orderBy(asc(user_building.uuid))
    .limit(4097);
  rows(
    buildings,
    uid,
    (row) => row.uuid as string,
    (row) =>
      text(row.uuid, 40) &&
      row.uuid !== "" &&
      integer(row.itemId) &&
      integer(row.level) &&
      nullableInteger(row.star),
  );
  const newGenerals = await readResourceNewGenerals(
    db,
    uid,
    profile.banTime === 9223372036854775807n,
  );
  return { effects, buildings, newGenerals };
}

export async function readResourceNewGenerals(
  db: Reader,
  uid: string,
  moved: boolean,
): Promise<WorldResourceOwnerSnapshot["newGenerals"]> {
  if (!text(uid, 255) || !uid) throw new Error("Invalid general owner");
  const generals = await db
    .select(generalColumns)
    .from(new_general)
    .where(eq(new_general.uid, uid))
    .orderBy(asc(new_general.id))
    .limit(4097);
  rows(
    generals,
    uid,
    (row) => String(row.id),
    (row) =>
      integer(row.id) &&
      nullableInteger(row.state) &&
      (row.state === null || ((row.state as number) >= -32768 && (row.state as number) <= 32767)) &&
      nullableInteger(row.star) &&
      nullableText(row.buildingUuid, 96) &&
      nullableText(row.baseSkill, 256) &&
      nullableText(row.talent, 5000) &&
      nullableText(row.opTime, 200) &&
      nullableText(row.refinement, 300),
  );
  const statuses = moved
    ? []
    : await db
        .select(statusColumns)
        .from(new_general_status)
        .where(eq(new_general_status.uid, uid))
        .orderBy(asc(new_general_status.newGeneralId), asc(new_general_status.stateId))
        .limit(4097);
  rows(
    statuses,
    uid,
    (row) => `${row.newGeneralId}:${row.stateId}`,
    (row) =>
      integer(row.newGeneralId) &&
      integer(row.stateId) &&
      (row.startTime === null || long(row.startTime)) &&
      (row.endTime === null || long(row.endTime)),
  );
  const equipment = moved
    ? []
    : await db
        .select(equipmentColumns)
        .from(user_equip)
        .where(and(eq(user_equip.uid, uid), gt(user_equip.generalid, 0)))
        .orderBy(asc(user_equip.uuid))
        .limit(4097);
  rows(
    equipment,
    uid,
    (row) => row.uuid as string,
    (row) =>
      text(row.uuid, 255) &&
      row.uuid !== "" &&
      integer(row.generalId) &&
      row.generalId > 0 &&
      integer(row.itemId) &&
      nullableText(row.extraProperty, 255),
  );
  const offices = await db
    .select(officeColumns)
    .from(hero_office)
    .where(eq(hero_office.uid, uid))
    .orderBy(asc(hero_office.id))
    .limit(4097);
  rows(
    offices,
    uid,
    (row) => String(row.id),
    (row) =>
      integer(row.id) &&
      nullableText(row.officeId, 40) &&
      nullableInteger(row.position) &&
      (row.startTime === null || long(row.startTime)),
  );
  return { moved, generals, statuses, equipment, offices };
}

export async function checkWorldResourceOwnerStore(db: Reader): Promise<void> {
  await db.select(profileColumns).from(userprofile).limit(0);
  await db.select(buildingColumns).from(user_building).limit(0);
  await db.select(generalColumns).from(new_general).limit(0);
  await db.select(statusColumns).from(new_general_status).limit(0);
  await db.select(equipmentColumns).from(user_equip).limit(0);
  await db.select(officeColumns).from(hero_office).limit(0);
}
