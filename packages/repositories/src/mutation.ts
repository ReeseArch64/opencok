import { lte, and, asc, eq, inArray } from "drizzle-orm";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { economy_posting } from "@opencok/drizzle/schema/opencok_kingdom/economy_posting";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import type { MutationCommand, MutationResult } from "@opencok/contracts/mutation";
import { validatePosting } from "@opencok/ledger/posting";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority.ts";
import type { Database } from "./game.ts";

type Realm = Database["kingdom"]["db"];
export type MutationTransaction = Parameters<Parameters<Realm["transaction"]>[0]>[0];

function identifier(value: string, limit: number) {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.length > limit ||
    !value.isWellFormed() ||
    value.includes("\0")
  )
    throw new Error("Invalid mutation identity");
}
function bytes(value: Uint8Array, maximum: number) {
  if (!(value instanceof Uint8Array) || value.byteLength > maximum)
    throw new Error("Invalid mutation payload");
  return Buffer.from(value);
}

export async function checkMutationStore(db: Realm) {
  for (const table of [command_receipt, economy_posting, mutation_outbox])
    await db.select().from(table).limit(0);
}

export function createMutationExecutor(
  db: Realm,
  authority: RealmAuthority,
  now = Date.now,
  additionalAccounts: ReadonlySet<string> = new Set(),
) {
  const accounts = new Set(additionalAccounts);
  for (const account of accounts) identifier(account, 40);
  return async (
    input: MutationCommand,
    apply: (tx: MutationTransaction) => Promise<MutationResult>,
  ): Promise<Buffer> => {
    identifier(input.owner, 40);
    identifier(input.requestId, 128);
    identifier(input.command, 128);
    const owner = input.owner,
      requestId = input.requestId,
      command = input.command;
    const request = bytes(input.request, 65536);
    return db.transaction(
      async (tx) => {
        await fenceRealmTransaction(tx, authority);
        const captured = now();
        if (!Number.isSafeInteger(captured) || captured < 0)
          throw new Error("Invalid mutation clock");
        const createdAt = BigInt(captured);
        const participants = input.participants === undefined ? undefined : [...input.participants];
        if (participants) {
          if (
            !participants.includes(owner) ||
            participants.length > 2048 ||
            new Set(participants).size !== participants.length
          )
            throw new Error("Invalid mutation participants");
          for (const id of participants) identifier(id, 40);
          const locked = await tx
            .select({ uid: userprofile.uid, realm: userprofile.serverId })
            .from(userprofile)
            .where(inArray(userprofile.uid, participants))
            .orderBy(asc(userprofile.uid))
            .for("update");
          if (
            locked.length !== participants.length ||
            locked.some((row) => row.realm !== authority.kingdomId)
          )
            throw new Error("Foreign mutation participant");
        }
        const [profile] = await tx
          .select({
            realm: userprofile.serverId,
            banFlag: userprofile.banFlag,
            banTime: userprofile.banTime,
          })
          .from(userprofile)
          .where(eq(userprofile.uid, owner))
          .for("update");
        if (
          profile?.realm !== authority.kingdomId ||
          (profile.banFlag ?? 0) !== 0 ||
          (profile.banTime ?? 0n) > createdAt
        )
          throw new Error("Invalid mutation owner");
        const key = { kingdomId: authority.kingdomId, ownerUid: owner, requestId };
        const [receipt] = await tx
          .select()
          .from(command_receipt)
          .where(
            and(
              eq(command_receipt.kingdomId, key.kingdomId),
              eq(command_receipt.ownerUid, owner),
              eq(command_receipt.requestId, requestId),
            ),
          );
        if (receipt) {
          if (
            receipt.request.length === 0 ||
            (receipt.expiresAt !== null && receipt.expiresAt <= createdAt)
          )
            throw new Error("Mutation receipt expired");
          if (receipt.command !== command || !receipt.request.equals(request))
            throw new Error("Mutation receipt conflict");
          authority.assertReady();
          return Buffer.from(receipt.response);
        }
        const result = await apply(tx);
        const response = await appendMutationRecords(
          tx,
          authority,
          { owner, requestId, command, request, expiresAt: input.expiresAt },
          result,
          createdAt,
          accounts,
        );
        authority.assertReady();
        return response;
      },
      { isolationLevel: "read committed", accessMode: "read write" },
    );
  };
}

export async function appendMutationRecords(
  tx: MutationTransaction,
  authority: RealmAuthority,
  input: MutationCommand,
  result: MutationResult,
  createdAt: bigint,
  additionalAccounts: ReadonlySet<string> = new Set(),
): Promise<Buffer> {
  const { owner, requestId, command } = input;
  identifier(owner, 40);
  identifier(requestId, 128);
  identifier(command, 128);
  const request = bytes(input.request, 65536);
  const key = { kingdomId: authority.kingdomId, ownerUid: owner, requestId };
  if (createdAt < 0n || createdAt > 9223372036854775807n) throw new Error("Invalid mutation clock");
  if (
    input.expiresAt !== undefined &&
    (input.expiresAt <= createdAt || input.expiresAt > 9223372036854775807n)
  )
    throw new Error("Invalid mutation expiry");
  await fenceRealmTransaction(tx, authority);
  const response = bytes(result.response, 1048576);
  const postings = result.postings ?? [],
    events = result.events ?? [];
  if (postings.length > 256 || events.length > 256)
    throw new Error("Mutation effect limit exceeded");
  const seen = new Set<string>();
  for (const event of events) {
    if (
      event.expiresAt !== undefined &&
      (event.expiresAt <= createdAt || event.expiresAt > 9223372036854775807n)
    )
      throw new Error("Invalid mutation event expiry");
    identifier(event.id, 40);
    identifier(event.type, 128);
    if (seen.has(event.id)) throw new Error("Duplicate mutation event");
    seen.add(event.id);
  }
  await tx.insert(command_receipt).values({
    ...key,
    command,
    request,
    response,
    ownerEpoch: authority.epoch,
    createdAt,
    expiresAt: input.expiresAt,
  });
  for (const [entry, posting] of postings.entries()) {
    const delta = validatePosting(posting);
    if (posting.account !== owner && !additionalAccounts.has(posting.account))
      throw new Error("Mutation posting owner mismatch");
    await tx.insert(economy_posting).values({
      ...key,
      entry,
      accountUid: posting.account,
      asset: posting.asset,
      before: posting.before,
      after: posting.after,
      delta,
      reason: posting.reason,
    });
  }
  for (const event of events)
    await tx.insert(mutation_outbox).values({
      ...key,
      eventId: event.id,
      eventType: event.type,
      payload: bytes(event.payload, 65536),
      createdAt,
      publishedAt: 0n,
      expiresAt: event.expiresAt ?? input.expiresAt,
    });
  authority.assertReady();
  return response;
}

export async function relayMutationEvent(
  db: Realm,
  authority: RealmAuthority,
  publish: (event: {
    kingdomId: number;
    owner: string;
    requestId: string;
    id: string;
    type: string;
    payload: Buffer;
  }) => Promise<void>,
  now = Date.now,
  eventType?: string,
  retryDelayMs = 0,
): Promise<boolean> {
  const [event] = await db
    .select()
    .from(mutation_outbox)
    .where(
      and(
        eq(mutation_outbox.kingdomId, authority.kingdomId),
        eq(mutation_outbox.publishedAt, 0n),
        eventType ? eq(mutation_outbox.eventType, eventType) : undefined,
        lte(mutation_outbox.nextAttemptAt, BigInt(now())),
      ),
    )
    .orderBy(
      asc(mutation_outbox.createdAt),
      asc(mutation_outbox.ownerUid),
      asc(mutation_outbox.requestId),
      asc(mutation_outbox.eventId),
    )
    .limit(1);
  if (!event) return false;
  await db.transaction((tx) => fenceRealmTransaction(tx, authority));
  if (event.kingdomId !== authority.kingdomId) throw new Error("Invalid mutation event realm");
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      publish({
        kingdomId: event.kingdomId,
        owner: event.ownerUid,
        requestId: event.requestId,
        id: event.eventId,
        type: event.eventType,
        payload: Buffer.from(event.payload),
      }),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("Mutation publication timeout")), 3000);
      }),
    ]);
  } catch (error) {
    if (retryDelayMs > 0)
      await db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        await tx
          .update(mutation_outbox)
          .set({ nextAttemptAt: BigInt(now() + retryDelayMs) })
          .where(
            and(
              eq(mutation_outbox.kingdomId, event.kingdomId),
              eq(mutation_outbox.ownerUid, event.ownerUid),
              eq(mutation_outbox.requestId, event.requestId),
              eq(mutation_outbox.eventId, event.eventId),
              eq(mutation_outbox.publishedAt, 0n),
            ),
          );
      });
    throw error;
  } finally {
    clearTimeout(timer);
  }
  await db.transaction(async (tx) => {
    await fenceRealmTransaction(tx, authority);
    const time = now();
    if (!Number.isSafeInteger(time) || time <= 0) throw new Error("Invalid mutation clock");
    await tx
      .update(mutation_outbox)
      .set({ publishedAt: BigInt(time) })
      .where(
        and(
          eq(mutation_outbox.kingdomId, event.kingdomId),
          eq(mutation_outbox.ownerUid, event.ownerUid),
          eq(mutation_outbox.requestId, event.requestId),
          eq(mutation_outbox.eventId, event.eventId),
          eq(mutation_outbox.publishedAt, 0n),
        ),
      );
    authority.assertReady();
  });
  return true;
}
