import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { and, asc, eq, inArray, ne, or, isNull, sql } from "drizzle-orm";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { civilization_castle } from "@opencok/drizzle/schema/opencok_kingdom/civilization_castle";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { world_march_checkpoint } from "@opencok/drizzle/schema/opencok_kingdom/world_march_checkpoint";
import { worldCityCandidates, resolveWorldCityGeometry } from "@opencok/rules/world-city-geometry";
import { decodeWorldMarchArmy } from "@opencok/messages/world-resource-army";
import { encode, decode, fields, int, str, sfs, Type } from "@opencok/messages/sfs";
import { num, text, long, type Row } from "@opencok/contracts/rows";
import type { MutationTransaction } from "./mutation";

const metadata = [
  "pointItem",
  "ownerName",
  "allianceId",
  "resLevel",
  "cityDefValue",
  "startOccupyTime",
  "ownerMarchUUid",
  "flushTime",
  "fireTime",
  "shieldTime",
  "startTime",
  "resourceShieldTime",
  "monsterInfo",
  "flushFlag",
  "monsterCastleState",
  "monsterCurrHP",
  "sendHeartDurationTime",
  "heartType",
  "cannonFireTime",
  "trap",
  "reserve",
] as const;

export async function normalizeWorldCityGeometry(
  tx: MutationTransaction,
  owner: string,
  size: number,
  world: Row,
  marches: readonly Row[],
  checkpoints: readonly Row[],
  castle?: Row,
  apply = true,
) {
  const [profile] = await tx
    .select({ point: userprofile.worldPoint, visiting: userprofile.crossFightSrcServerId })
    .from(userprofile)
    .where(eq(userprofile.uid, owner))
    .for("update");
  const owned = await tx
    .select()
    .from(worldpoint)
    .where(
      and(
        eq(worldpoint.worldId, 0),
        eq(worldpoint.ownerId, owner),
        inArray(worldpoint.pointType, [1, 2, 8, 68, 69]),
      ),
    )
    .orderBy(asc(worldpoint.id))
    .limit(17)
    .for("update");
  const neighbourhood = await tx
    .select()
    .from(worldpoint)
    .where(
      and(
        eq(worldpoint.worldId, 0),
        inArray(worldpoint.id, [
          ...new Set([
            ...worldCityCandidates(num(world, "pointId"), size),
            ...worldCityCandidates(num(castle ?? {}, "pointId"), size),
          ]),
        ]),
      ),
    )
    .orderBy(asc(worldpoint.id))
    .for("update");
  const evidence = [...new Map([...owned, ...neighbourhood].map((row) => [row.id, row])).values()];
  const normalize = async (
    anchor: number,
    main: number,
    ranges: readonly number[],
    residence: boolean,
  ) => {
    const rows = owned.filter((row) => [main, ...ranges].includes(row.pointType)),
      geometry = resolveWorldCityGeometry(anchor, size, owner, evidence, main, ranges);

    if (!geometry || !apply || geometry.orientation === "native") return geometry;

    if (
      !profile ||
      (profile.visiting ?? 0) > 0 ||
      num(world, "srcServerPointId") > 0 ||
      (residence && profile.point !== null && profile.point !== 0 && profile.point !== anchor) ||
      rows.some((row) => row.ownerMarchUUid || row.resInitValue !== 0 || row.resCostValue !== 0)
    )
      return geometry;

    const references = await tx
      .select({ uid: world_march.uuid })
      .from(world_march)
      .where(
        and(
          eq(world_march.worldId, 0),
          or(
            inArray(world_march.targetId, geometry.points),
            inArray(world_march.ownerId, geometry.points),
          ),
          residence ? or(isNull(world_march.ownerUid), ne(world_march.ownerUid, owner)) : undefined,
        ),
      )
      .limit(1)
      .for("update");

    if (references.length) return geometry;

    const pending = await tx
      .select({ payload: mutation_outbox.payload })
      .from(mutation_outbox)
      .where(
        and(
          eq(mutation_outbox.publishedAt, 0n),
          ne(mutation_outbox.ownerUid, owner),
          sql`${mutation_outbox.eventType} like 'world.%'`,
        ),
      )
      .limit(257);

    if (pending.length > 256) return geometry;

    for (const event of pending) {
      try {
        const data = decode(event.payload),
          arrivals = data.troubles;

        if (!arrivals) continue;

        if (arrivals.type !== Type.Array || !Array.isArray(arrivals.value)) return geometry;

        if (
          arrivals.value.some((value) => {
            const row = fields(value);

            return str(row, "target") === owner && geometry.points.includes(int(row, "point"));
          })
        )
          return geometry;
      } catch {
        return geometry;
      }
    }

    const changes: { id: string; data: ReturnType<typeof decode> }[] = [];

    if (residence) {
      if (
        checkpoints.some(
          (record) => !marches.some((march) => text(march, "uuid") === text(record, "id")),
        )
      )
        return geometry;

      for (const march of marches) {
        const record = checkpoints.find((row) => text(row, "id") === text(march, "uuid"));

        if (
          !record ||
          num(march, "ownerId") !== anchor ||
          !march.armyInfo ||
          !(
            (num(march, "type") === 0 && [3, 37].includes(num(march, "targetType"))) ||
            (num(march, "type") === 13 && num(march, "targetType") === 1) ||
            (num(march, "type") === 0 && num(march, "targetType") === 2)
          )
        )
          return geometry;

        try {
          const data = decode(Buffer.from(record.payload as Buffer)),
            army = decodeWorldMarchArmy(march.armyInfo as Buffer);

          if (
            !army ||
            army.owner !== owner ||
            str(data, "owner") !== owner ||
            str(data, "id") !== text(march, "uuid") ||
            int(data, "worldId") !== 0 ||
            int(data, "origin") !== anchor ||
            int(data, "target") !== num(march, "targetId") ||
            int(data, "version") !== num(record, "version") ||
            data.dueAt?.type !== Type.Long ||
            data.dueAt.value !== long(record, "dueAt") ||
            !["outbound", "gathering", "returning"].includes(str(data, "phase")) ||
            data.troops?.type !== Type.Array ||
            (str(data, "purpose", "") !== "" &&
              str(data, "purpose") !== "trouble" &&
              str(data, "purpose") !== "treasure")
          )
            return geometry;

          if (num(march, "targetType") === 2 && str(data, "purpose", "") !== "treasure")
            return geometry;

          const expectedPurpose =
            num(march, "type") === 13
              ? "trouble"
              : num(march, "targetType") === 2
                ? "treasure"
                : "";

          if (
            str(data, "purpose", "") !== expectedPurpose ||
            num(march, "state") !==
              ["outbound", "gathering", "returning"].indexOf(str(data, "phase"))
          )
            return geometry;

          changes.push({ id: text(march, "uuid"), data });
        } catch {
          return geometry;
        }
      }
    }

    const old = rows.find((row) => row.id === anchor)!,
      next = rows.find((row) => row.id === geometry.anchor)!;
    const values = (row: typeof old) => Object.fromEntries(metadata.map((key) => [key, row[key]]));
    await tx
      .update(worldpoint)
      .set({
        ...values(next),
        pointType: ranges[0],
        ...(residence ? { pointItem: String(geometry.anchor) } : {}),
      })
      .where(and(eq(worldpoint.worldId, 0), eq(worldpoint.id, anchor)));
    await tx
      .update(worldpoint)
      .set({ ...values(old), pointType: main })
      .where(and(eq(worldpoint.worldId, 0), eq(worldpoint.id, geometry.anchor)));

    for (const row of rows.filter((row) => row.id !== geometry.anchor))
      await tx
        .update(worldpoint)
        .set({ pointType: ranges[0], ...(residence ? { pointItem: String(geometry.anchor) } : {}) })
        .where(and(eq(worldpoint.worldId, 0), eq(worldpoint.id, row.id)));

    if (residence) {
      await tx
        .update(user_world)
        .set({ pointId: geometry.anchor })
        .where(eq(user_world.uid, owner));
      await tx
        .update(userprofile)
        .set({ worldPoint: geometry.anchor })
        .where(eq(userprofile.uid, owner));
      world.pointId = geometry.anchor;

      for (const change of changes) {
        change.data.origin = sfs.int(geometry.anchor);
        const payload = encode(change.data);
        await tx
          .update(world_march)
          .set({ ownerId: geometry.anchor })
          .where(eq(world_march.uuid, change.id));
        await tx
          .update(world_march_checkpoint)
          .set({ payload })
          .where(eq(world_march_checkpoint.id, change.id));
        const march = marches.find((row) => row.uuid === change.id)!,
          record = checkpoints.find((row) => row.id === change.id)!;
        march.ownerId = geometry.anchor;
        record.payload = Buffer.from(payload);
      }
    } else {
      await tx
        .update(civilization_castle)
        .set({ pointId: geometry.anchor })
        .where(eq(civilization_castle.uid, owner));

      if (castle) castle.pointId = geometry.anchor;
    }

    return {
      ...geometry,
      orientation: "native" as const,
      points: [
        geometry.anchor - 1,
        geometry.anchor - size,
        geometry.anchor - size - 1,
        geometry.anchor,
      ],
    };
  };
  const city = await normalize(num(world, "pointId"), 1, [8, 2], true),
    fortress =
      castle && num(castle, "pointId") > 0
        ? await normalize(num(castle, "pointId"), 68, [69], false)
        : undefined;

  return { cityFootprint: city?.points, civilizationFootprint: fortress?.points };
}
