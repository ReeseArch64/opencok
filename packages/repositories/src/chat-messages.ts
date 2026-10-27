import { createHash, randomUUID } from "node:crypto";
import { and, asc, desc, eq, gt, isNotNull, isNull, lt, lte, or, sql } from "drizzle-orm";
import { chat_message } from "@opencok/drizzle/schema/opencok_chat/chat_message";
import { chat_event } from "@opencok/drizzle/schema/opencok_chat/chat_social";
import type { ChatMessage, MessageInput, MessageStore } from "@opencok/contracts/chat";
import type { ChatArchiveMessage, ChatArchiveStore } from "@opencok/contracts/chat-delivery";
import { chatRetention } from "@opencok/rules/chat-retention";
import type { Database } from "./game.ts";

export const chatUtc = (date: Date) => date.toISOString().slice(0, 23).replace("T", " ");

const milliseconds = (value: string) => Date.parse(`${value.replace(" ", "T")}Z`);

const hash = (body: string) => createHash("sha256").update(body).digest("hex");

type Row = typeof chat_message.$inferSelect;

export function chatMessage(row: Row): ChatMessage {
  const sequenceId = Number(row.sequence_id);

  if (!Number.isSafeInteger(sequenceId)) {throw new Error("Chat sequence exceeds wire precision");}

  return {
    sequenceId,
    roomId: row.room_key,
    post: row.post_type,
    senderUid: row.sender_uid,
    idempotencyKey: row.idempotency_key.toString("utf8"),
    body: row.body ?? "",
    createdAt: `${row.created_at.replace(" ", "T")}Z`,
  };
}

export function createChatMessageStore(
  db: Database["databases"]["global"]["db"],
  archive: ChatArchiveStore | undefined,
  clock: () => Date,
  canSend: (uid: string) => Promise<boolean>,
): { messages: MessageStore; archivePending(): Promise<number> } {
  const current = () => chatUtc(clock());
  function validate(input: MessageInput) {
    if (
      !input.roomId ||
      input.roomId.length > 160 ||
      !input.senderUid ||
      input.senderUid.length > 40 ||
      !input.idempotencyKey ||
      Buffer.byteLength(input.idempotencyKey) > 64 ||
      typeof input.body !== "string" ||
      !input.body.isWellFormed() ||
      input.body.includes("\0") ||
      [...input.body].length < 1 ||
      [...input.body].length > 500 ||
      !Number.isFinite(input.now.getTime())
    )
      {throw new TypeError("Invalid chat message");}
  }
  async function hydrate(rows: Row[]): Promise<ChatMessage[]> {
    for (const row of rows)
      {if (!Number.isSafeInteger(Number(row.sequence_id)))
        {throw new Error("Chat sequence exceeds wire precision");}}

    const output: ChatMessage[] = [];
    const missing = rows
      .filter((row) => row.body === null && !row.deleted_at && row.expires_at > current())
      .map((row) => Number(row.sequence_id));
    const copies = new Map(
      (archive?.getMany && missing.length ? await archive.getMany(missing) : []).map((message) => [
        message.sequenceId,
        message,
      ]),
    );

    for (const row of rows) {
      if (row.deleted_at || row.expires_at <= current()) {continue;}

      if (row.body !== null) {output.push(chatMessage(row));}
      else if (archive) {
        const copy = archive.getMany
          ? copies.get(Number(row.sequence_id))
          : await archive.get(Number(row.sequence_id));

        if (
          copy &&
          copy.version === row.version &&
          copy.hash === row.body_hash &&
          hash(copy.body) === row.body_hash &&
          copy.roomId === row.room_key &&
          copy.senderUid === row.sender_uid &&
          copy.createdAt === chatMessage(row).createdAt &&
          copy.idempotencyKey === row.idempotency_key.toString("utf8") &&
          copy.expiresAt === milliseconds(row.expires_at) &&
          copy.expiresAt > clock().getTime()
        )
          {output.push(copy);}
        else {throw new Error("Chat archive copy unavailable");}
      } else {throw new Error("Chat archive unavailable");}
    }

    if (!output.length) {return output;}

    const valid = await db
      .select({ id: chat_message.sequence_id })
      .from(chat_message)
      .where(
        and(
          sql`${chat_message.sequence_id} in (${sql.join(
            output.map((message) => sql`${message.sequenceId}`),
            sql`,`,
          )})`,
          isNull(chat_message.deleted_at),
          gt(chat_message.expires_at, current()),
        ),
      );
    const ids = new Set(valid.map((row) => Number(row.id)));

    return output.filter((message) => ids.has(message.sequenceId));
  }
  const messages: MessageStore = {
    durableDelivery: true,
    async create(input) {
      validate(input);

      if (!(await canSend(input.senderUid))) {throw new TypeError("Chat sender muted");}

      return db.transaction(async (tx) => {
        await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended('chat:append',0))`);
        const [existing] = await tx
          .select()
          .from(chat_message)
          .where(
            and(
              eq(chat_message.room_key, input.roomId),
              eq(chat_message.sender_uid, input.senderUid),
              eq(chat_message.idempotency_key, Buffer.from(input.idempotencyKey)),
            ),
          )
          .limit(1);
        const digest = hash(input.body);

        if (existing) {
          if (existing.expires_at <= current() || existing.deleted_at)
            {throw new TypeError("Chat message expired");}

          if ((existing.body_hash ?? hash(existing.body ?? "")) !== digest)
            {throw new TypeError("Chat receipt content conflict");}

          return { ...chatMessage(existing), inserted: false };
        }

        const created = input.now;
        const retention = chatRetention(input.roomId, created.getTime());
        const [saved] = await tx
          .insert(chat_message)
          .values({
            room_key: input.roomId,
            sender_uid: input.senderUid,
            idempotency_key: Buffer.from(input.idempotencyKey),
            body: input.body,
            body_hash: digest,
            post_type: input.post ?? 0,
            created_at: chatUtc(created),
            archive_at:
              retention.archiveAt === null ? null : chatUtc(new Date(retention.archiveAt)),
            expires_at: chatUtc(new Date(retention.expiresAt)),
          })
          .returning();

        if (!saved) {throw new Error("Chat insert failed");}

        await tx.insert(chat_event).values({
          id: randomUUID(),
          kind: "message",
          room: input.roomId,
          owner: input.senderUid,
          message: String(saved.sequence_id),
          createdAt: BigInt(created.getTime()),
          expiresAt: BigInt(created.getTime() + 86_400_000),
        });

        return { ...chatMessage(saved), inserted: true };
      });
    },
    async getAll(roomId, afterMs = 0) {
      if (!Number.isSafeInteger(afterMs) || afterMs < 0) {throw new TypeError("Invalid time");}

      return hydrate(
        (
          await db
            .select()
            .from(chat_message)
            .where(
              and(
                eq(chat_message.room_key, roomId),
                gt(chat_message.created_at, chatUtc(new Date(afterMs))),
                gt(chat_message.expires_at, current()),
                isNull(chat_message.deleted_at),
                or(isNull(chat_message.archive_at), gt(chat_message.archive_at, current())),
              ),
            )
            .orderBy(desc(chat_message.sequence_id))
            .limit(100)
        ).reverse(),
      );
    },
    async getAllByRange(roomId, startMs, endMs) {
      if (
        !Number.isSafeInteger(startMs) ||
        startMs < 0 ||
        !Number.isSafeInteger(endMs) ||
        endMs <= startMs
      )
        {throw new TypeError("Invalid time");}

      return hydrate(
        (
          await db
            .select()
            .from(chat_message)
            .where(
              and(
                eq(chat_message.room_key, roomId),
                gt(chat_message.created_at, chatUtc(new Date(startMs))),
                lt(chat_message.created_at, chatUtc(new Date(endMs))),
                gt(chat_message.expires_at, current()),
                isNull(chat_message.deleted_at),
                or(isNull(chat_message.archive_at), gt(chat_message.archive_at, current())),
              ),
            )
            .orderBy(desc(chat_message.sequence_id))
            .limit(100)
        ).reverse(),
      );
    },
    async page(query) {
      if (
        !query.roomId ||
        query.roomId.length > 160 ||
        !Number.isSafeInteger(query.before) ||
        query.before < 0 ||
        !Number.isInteger(query.limit) ||
        query.limit < 1 ||
        query.limit > 100
      )
        {throw new TypeError("Invalid cursor");}

      const rows = await db
        .select()
        .from(chat_message)
        .where(
          and(
            eq(chat_message.room_key, query.roomId),
            query.before ? lt(chat_message.sequence_id, BigInt(query.before)) : undefined,
            gt(chat_message.expires_at, current()),
            isNull(chat_message.deleted_at),
            query.archive
              ? lte(chat_message.archive_at, current())
              : or(isNull(chat_message.archive_at), gt(chat_message.archive_at, current())),
          ),
        )
        .orderBy(desc(chat_message.sequence_id))
        .limit(query.limit + 1);
      const selected = rows.slice(0, query.limit);

      return {
        messages: await hydrate(selected),
        cursor: rows.length > query.limit ? Number(selected.at(-1)!.sequence_id) : null,
      };
    },
    async remove(sequenceId) {
      if (!Number.isSafeInteger(sequenceId) || sequenceId < 0)
        {throw new TypeError("Invalid message");}

      await db.transaction(async (tx) => {
        await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended('chat:append',0))`);
        const [removed] = await tx
          .update(chat_message)
          .set({ body: null, deleted_at: current(), version: sql`${chat_message.version}+1` })
          .where(
            and(eq(chat_message.sequence_id, BigInt(sequenceId)), isNull(chat_message.deleted_at)),
          )
          .returning();

        if (removed)
          {await tx.insert(chat_event).values({
            id: randomUUID(),
            kind: "delete",
            room: removed.room_key,
            owner: removed.sender_uid,
            data: {
              cmd: "push.chat.delete",
              data: { roomId: removed.room_key, seqId: sequenceId },
            },
            createdAt: BigInt(clock().getTime()),
            expiresAt: BigInt(clock().getTime() + 86_400_000),
          });}
      });
      await archive?.remove(sequenceId);
    },
  };

  return {
    messages,
    async archivePending() {
      const now = current();
      const expired = await db
        .select()
        .from(chat_message)
        .where(and(lte(chat_message.expires_at, now), isNotNull(chat_message.body)))
        .orderBy(asc(chat_message.expires_at))
        .limit(500);

      for (const row of expired)
        {await db
          .update(chat_message)
          .set({ body: null, body_hash: row.body_hash ?? hash(row.body!), deleted_at: now })
          .where(
            and(
              eq(chat_message.sequence_id, row.sequence_id),
              eq(chat_message.version, row.version),
            ),
          );}

      if (!archive) {
        const due = await db
          .select({ id: chat_message.sequence_id })
          .from(chat_message)
          .where(
            and(
              lte(chat_message.archive_at, now),
              gt(chat_message.expires_at, now),
              isNull(chat_message.deleted_at),
            ),
          )
          .limit(100);

        if (due.length) {throw new Error("Chat archive unavailable");}

        return 0;
      }

      await archive.purge(clock().getTime());
      const pending = await db
        .select()
        .from(chat_message)
        .where(
          and(
            lte(chat_message.archive_at, now),
            gt(chat_message.expires_at, now),
            isNull(chat_message.deleted_at),
            isNotNull(chat_message.body),
          ),
        )
        .orderBy(asc(chat_message.archive_at))
        .limit(100);

      for (const row of pending) {
        const copy: ChatArchiveMessage = {
          ...chatMessage(row),
          version: row.version,
          hash: row.body_hash ?? hash(row.body!),
          archiveAt: milliseconds(row.archive_at!),
          expiresAt: milliseconds(row.expires_at),
        };
        await archive.put(copy);
        const verified = await archive.get(copy.sequenceId);

        if (
          !verified ||
          verified.version !== copy.version ||
          verified.hash !== copy.hash ||
          hash(verified.body) !== copy.hash ||
          verified.expiresAt !== copy.expiresAt
        )
          {throw new Error("Archive verification failed");}

        await db
          .update(chat_message)
          .set({ body: null, body_hash: copy.hash })
          .where(
            and(
              eq(chat_message.sequence_id, row.sequence_id),
              eq(chat_message.version, row.version),
              isNull(chat_message.deleted_at),
              gt(chat_message.expires_at, current()),
            ),
          );
      }

      const removed = await db
        .select({ id: chat_message.sequence_id, version: chat_message.version })
        .from(chat_message)
        .where(
          and(
            isNotNull(chat_message.deleted_at),
            isNull(chat_message.body),
            isNotNull(chat_message.archive_at),
          ),
        )
        .limit(100);

      for (const row of removed) {
        await archive.remove(Number(row.id));
        await db
          .update(chat_message)
          .set({ archive_at: null })
          .where(
            and(
              eq(chat_message.sequence_id, row.id),
              eq(chat_message.version, row.version),
              isNotNull(chat_message.deleted_at),
            ),
          );
      }

      return pending.length;
    },
  };
}
