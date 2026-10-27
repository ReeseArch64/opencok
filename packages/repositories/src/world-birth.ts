import { randomInt } from "node:crypto";
import { realm_authority } from "@opencok/drizzle/schema/opencok_kingdom/realm_authority";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { appendMutationRecords } from "./mutation";
import type { Database } from "./game";
import type { WorldBirthAdoption } from "@opencok/contracts/world-birth";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { worldFootprint } from "@opencok/rules/world-march-runtime";
import { and, eq, sql, isNotNull, inArray, ne } from "drizzle-orm";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import type { WorldBirthRules, WorldBirthPlacement } from "@opencok/contracts/world-birth";
import {
  initialWorldBirth,
  parseWorldBirth,
  advanceWorldBirth,
  countWorldBirth,
  recordWorldBirth,
  worldBirthArea,
  worldBirthCandidates,
} from "@opencok/rules/world-birth";
import type { MutationTransaction } from "./mutation";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";

export const worldBirthIdentity = Object.freeze({
  type: -1,
  uid: "@world:0",
  key: "opencok.world.birth.v1",
});

export async function initializeWorldBirth(
  tx: MutationTransaction,
  authority: RealmAuthority,
  rules: WorldBirthRules,
  now: bigint,
): Promise<void> {
  if (now < 0n || now > 9223372036854775807n) {throw new Error("Invalid world birth time");}

  await fenceRealmTransaction(tx, authority);
  await assertBirthRealm(tx, authority);
  await tx.execute(sql`select pg_advisory_xact_lock(728214, 0)`);
  const [prior] = await tx
    .select()
    .from(trigger_var)
    .where(
      and(
        eq(trigger_var.type, worldBirthIdentity.type),
        eq(trigger_var.uid, worldBirthIdentity.uid),
        eq(trigger_var.key, worldBirthIdentity.key),
      ),
    )
    .for("update");
  const [profile] = await tx.select({ uid: userprofile.uid }).from(userprofile).limit(1);
  const [city] = await tx
    .select({ id: worldpoint.id })
    .from(worldpoint)
    .where(and(eq(worldpoint.worldId, 0), eq(worldpoint.pointType, 1)))
    .limit(1);

  if (prior || profile || city)
    {throw new Error("World birth initialization requires a fresh resident world");}

  const state = initialWorldBirth(rules, authority.epoch),
    value = JSON.stringify(state);
  parseWorldBirth(value);
  await tx.insert(trigger_var).values({ ...worldBirthIdentity, value, refreshtime: now });
}

async function readBirthCounts(tx: MutationTransaction) {
  const rows = await tx
    .select({ area: worldpoint.bornAreaId, count: sql<number>`count(*)::integer` })
    .from(worldpoint)
    .where(
      and(eq(worldpoint.worldId, 0), eq(worldpoint.pointType, 1), isNotNull(worldpoint.bornAreaId)),
    )
    .groupBy(worldpoint.bornAreaId);

  if (rows.length > 16384) {throw new Error("World birth occupancy exceeds bound");}

  return Object.fromEntries(rows.map((row) => [String(row.area), row.count]));
}

const birthIdentity = () =>
  and(
    eq(trigger_var.type, worldBirthIdentity.type),
    eq(trigger_var.uid, worldBirthIdentity.uid),
    eq(trigger_var.key, worldBirthIdentity.key),
  );

export async function allocateWorldBirth(
  tx: MutationTransaction,
  authority: RealmAuthority,
  size: number,
  rules: WorldBirthRules,
  now: bigint,
  mode: import("@opencok/contracts/world-birth").WorldBirthMode = "birth",
): Promise<WorldBirthPlacement> {
  await fenceRealmTransaction(tx, authority);
  await assertBirthRealm(tx, authority);
  await tx.execute(sql`select pg_advisory_xact_lock(728214, 0)`);
  const [record] = await tx.select().from(trigger_var).where(birthIdentity()).for("update");

  if (!record) {throw new GameError(errors.unsupported, "world_state");}

  const state = parseWorldBirth(record.value);

  if (state.epoch !== String(authority.epoch)) {
    state.counts = await readBirthCounts(tx);
    state.epoch = String(authority.epoch);
    state.limit = rules.limits[state.round - 1] ?? 2147483647;
  }

  const find = async (areas?: readonly number[]) => {
    const candidates = areas ? worldBirthCandidates(areas, size, rules.side) : undefined;

    if (candidates?.length === 0) {return undefined;}

    const admitted = candidates
      ? sql`and p.id=ANY(${sql.param(candidates)}::integer[]) and p."bornAreaId"=ANY(${sql.param(areas)}::integer[]) and e."bornAreaId"=ANY(${sql.param(areas)}::integer[]) and s."bornAreaId"=ANY(${sql.param(areas)}::integer[]) and c."bornAreaId"=ANY(${sql.param(areas)}::integer[])`
      : sql``;
    const result = await tx.execute<{ id: number }>(sql`
      SELECT p.id FROM opencok_kingdom.worldpoint p
      JOIN opencok_kingdom.worldpoint e ON e.id=p.id-1 AND e."worldId"=0 AND e.x=p.x-1 AND e.y=p.y
      JOIN opencok_kingdom.worldpoint s ON s.id=p.id-${size} AND s."worldId"=0 AND s.x=p.x AND s.y=p.y-1
      JOIN opencok_kingdom.worldpoint c ON c.id=p.id-${size + 1} AND c."worldId"=0 AND c.x=p.x-1 AND c.y=p.y-1
      WHERE p."worldId"=0 AND p.x>0 AND p.y>0 AND p.x<${size} AND p.y<${size} AND p.id=1+p.x+p.y*${size}
      AND p."pointType"=0 AND e."pointType"=0 AND s."pointType"=0 AND c."pointType"=0
      AND p."gridType"=2 AND e."gridType"=2 AND s."gridType"=2 AND c."gridType"=2
      AND p."grid2Type"=0 AND e."grid2Type"=0 AND s."grid2Type"=0 AND c."grid2Type"=0
      AND coalesce(p."ownerId",'')='' AND coalesce(e."ownerId",'')='' AND coalesce(s."ownerId",'')='' AND coalesce(c."ownerId",'')=''
      AND coalesce(p."ownerMarchUUid",'')='' AND coalesce(e."ownerMarchUUid",'')='' AND coalesce(s."ownerMarchUUid",'')='' AND coalesce(c."ownerMarchUUid",'')=''
      AND coalesce(p."territoryAlliance",'')='' AND coalesce(e."territoryAlliance",'')='' AND coalesce(s."territoryAlliance",'')='' AND coalesce(c."territoryAlliance",'')=''
      AND coalesce(p.reserve,0)=0 AND coalesce(e.reserve,0)=0 AND coalesce(s.reserve,0)=0 AND coalesce(c.reserve,0)=0
      ${admitted} ORDER BY random() LIMIT 1 FOR UPDATE OF p,e,s,c
    `);

    return result.rows[0]?.id;
  };
  let selected: number | undefined,
    randomSelected = false;
  const configured = [...new Set(rules.priorities.flatMap((row) => [...row.areas]))],
    [free] =
      state.phase !== 2 || mode === "random"
        ? await tx
            .select({ id: worldpoint.id })
            .from(worldpoint)
            .where(
              and(
                eq(worldpoint.worldId, 0),
                eq(worldpoint.pointType, 0),
                eq(worldpoint.gridType, 2),
                eq(worldpoint.grid2Type, 0),
                inArray(worldpoint.bornAreaId, configured),
              ),
            )
            .limit(1)
        : [];

  if (mode === "random" && free) {
    const start = randomInt(98);

    for (let visited = 0; visited < 98; visited++) {
      selected = await find(rules.priorities[(start + visited) % 98]!.areas);

      if (selected !== undefined) {
        randomSelected = true;
        break;
      }
    }
  }

  if (selected === undefined && state.phase !== 2) {
    for (let visited = 0; free && visited < 98; visited++) {
      selected = await find(rules.priorities.find((row) => row.id === state.priority)!.areas);

      if (selected !== undefined) {break;}

      advanceWorldBirth(state, rules);
    }

    if (selected === undefined) {state.phase = 2;}
  }

  if (selected === undefined) {selected = await find();}

  if (selected === undefined) {throw new GameError(errors.unsupported, "world_state");}

  if (randomSelected) {recordWorldBirth(state, worldBirthArea(selected, size, rules.side));}
  else {countWorldBirth(state, rules, worldBirthArea(selected, size, rules.side));}

  state.version++;
  parseWorldBirth(JSON.stringify(state));
  const changed = await tx
    .update(trigger_var)
    .set({ value: JSON.stringify(state), refreshtime: now })
    .where(and(birthIdentity(), eq(trigger_var.value, record.value)))
    .returning({ key: trigger_var.key });

  if (changed.length !== 1) {throw new Error("World birth version changed");}

  const points = await tx
    .select()
    .from(worldpoint)
    .where(and(eq(worldpoint.worldId, 0), inArray(worldpoint.id, worldFootprint(selected, size))))
    .for("update");

  if (points.length !== 4) {throw new Error("World birth footprint changed");}

  return { point: selected, points };
}

export function createWorldBirthAdopter(
  db: Database["kingdom"]["db"],
  authority: RealmAuthority,
  rules: WorldBirthRules,
  clock = Date.now,
) {
  return async (input: WorldBirthAdoption) => {
    const request = Object.freeze({ ...input });

    if (
      !request.operator ||
      request.operator.length > 100 ||
      !request.operator.isWellFormed() ||
      request.operator.includes("\0") ||
      !request.reason ||
      request.reason.length > 2000 ||
      !request.reason.isWellFormed() ||
      request.reason.includes("\0") ||
      !/^[a-zA-Z0-9:_-]{1,128}$/.test(request.operationId) ||
      !Number.isInteger(request.priority) ||
      request.priority < 43000 ||
      request.priority > 43097 ||
      !Number.isInteger(request.round) ||
      request.round < 1 ||
      request.round > 2147483646 ||
      ![0, 1, 2].includes(request.phase) ||
      (request.expectedVersion !== null &&
        (!Number.isInteger(request.expectedVersion) ||
          request.expectedVersion < 1 ||
          request.expectedVersion > 2147483646))
    )
      {throw new Error("Invalid world birth adoption");}

    const payload = Buffer.from(JSON.stringify(request));

    return db.transaction(async (tx) => {
      await fenceRealmTransaction(tx, authority);
      await assertBirthRealm(tx, authority);
      await tx.execute(sql`select pg_advisory_xact_lock(728214, 0)`);
      const captured = clock();

      if (!Number.isSafeInteger(captured) || captured < 0)
        {throw new Error("Invalid world birth adoption clock");}

      const [receipt] = await tx
        .select()
        .from(command_receipt)
        .where(
          and(
            eq(command_receipt.kingdomId, authority.kingdomId),
            eq(command_receipt.ownerUid, worldBirthIdentity.uid),
            eq(command_receipt.requestId, request.operationId),
          ),
        );

      if (receipt) {
        if (receipt.command !== "world.birth.adopt" || !receipt.request.equals(payload))
          {throw new Error("World birth adoption receipt conflict");}

        return JSON.parse(receipt.response.toString()) as {
          operationId: string;
          version: number;
          priority: number;
          round: number;
          phase: number;
        };
      }

      const [prior] = await tx.select().from(trigger_var).where(birthIdentity()).for("update"),
        version = prior ? parseWorldBirth(prior.value).version : null;

      if (version !== request.expectedVersion)
        {throw new Error("World birth adoption version changed");}

      const state: import("@opencok/contracts/world-birth").WorldBirthState = {
          schema: 1,
          version: (version ?? 0) + 1,
          priority: request.priority,
          round: request.round,
          phase: request.phase,
          epoch: String(authority.epoch),
          limit: rules.limits[request.round - 1] ?? 2147483647,
          counts: await readBirthCounts(tx),
        },
        value = JSON.stringify(state);
      parseWorldBirth(value);

      if (prior)
        {await tx
          .update(trigger_var)
          .set({ value, refreshtime: BigInt(captured) })
          .where(birthIdentity());}
      else
        {await tx
          .insert(trigger_var)
          .values({ ...worldBirthIdentity, value, refreshtime: BigInt(captured) });}

      const response = {
        operationId: request.operationId,
        version: state.version,
        priority: state.priority,
        round: state.round,
        phase: state.phase,
      };
      await appendMutationRecords(
        tx,
        authority,
        {
          owner: worldBirthIdentity.uid,
          requestId: request.operationId,
          command: "world.birth.adopt",
          request: payload,
        },
        { response: Buffer.from(JSON.stringify(response)) },
        BigInt(captured),
      );

      return response;
    });
  };
}

async function assertBirthRealm(tx: MutationTransaction, authority: RealmAuthority) {
  const [other] = await tx
    .select({ id: realm_authority.kingdomId })
    .from(realm_authority)
    .where(ne(realm_authority.kingdomId, authority.kingdomId))
    .limit(1);

  if (other) {throw new Error("Foreign resident world birth realm");}
}
