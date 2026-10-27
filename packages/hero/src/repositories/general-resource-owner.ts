import type { Database } from "@opencok/repositories/game";
import {
  generalColumns,
  statusColumns,
  equipmentColumns,
  officeColumns,
} from "@opencok/repositories/world-resource-owner-columns";
import { nullableInteger } from "@opencok/repositories/world-resource-owner-values";
import { nullableText } from "@opencok/repositories/world-resource-owner-values";
import { rows } from "@opencok/repositories/world-resource-owner-values";
import { long } from "@opencok/repositories/world-resource-owner-values";
import { integer } from "@opencok/repositories/world-resource-owner-values";
import { text } from "@opencok/repositories/world-resource-owner-values";
import type { WorldResourceOwnerSnapshot } from "@opencok/contracts/world-point-detail";

import { new_general } from "@opencok/drizzle/schema/opencok_kingdom/new_general";
import { new_general_status } from "@opencok/drizzle/schema/opencok_kingdom/new_general_status";
import { user_equip } from "@opencok/drizzle/schema/opencok_kingdom/user_equip";
import { hero_office } from "@opencok/drizzle/schema/opencok_kingdom/hero_office";
import { and, asc, eq, gt } from "drizzle-orm";

type Reader = Pick<Database["kingdom"]["db"], "select">;

export async function readResourceNewGenerals(
  db: Reader,
  uid: string,
  moved: boolean,
): Promise<WorldResourceOwnerSnapshot["newGenerals"]> {
  if (!text(uid, 255) || !uid) {throw new Error("Invalid general owner");}

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
