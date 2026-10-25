import { createChatMailboxStore } from "./chat-mailbox.ts";
import { chat_mailbox_message } from "@opencok/drizzle/schema/opencok_chat/chat_mailbox_message";
import { chat_mailbox_receipt } from "@opencok/drizzle/schema/opencok_chat/chat_mailbox_receipt";
import { createChatAvatarProfileStore } from "./chat-avatar-profile.ts";
import { createChatNicknameStore } from "./chat-nickname.ts";
import { chat_avatar_profile } from "@opencok/drizzle/schema/opencok_chat/chat_avatar_profile";
import { createDatabases, type DatabaseTopology } from "@opencok/drizzle";
import { chat_message } from "@opencok/drizzle/schema/opencok_chat/chat_message";
import { chat_session } from "@opencok/drizzle/schema/opencok_chat/chat_session";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { nickname_change_receipt } from "@opencok/drizzle/schema/opencok_global/nickname_change_receipt";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { and, asc, desc, eq, gt, inArray, lt, lte, sql } from "drizzle-orm";
import type { ChatMessage, ChatRepository, MessageInput } from "@opencok/contracts/chat";

const utc = (date: Date) => date.toISOString().slice(0, 23).replace("T", " ");
function parseRow(row: typeof chat_message.$inferSelect): ChatMessage {
  const sequenceId = Number(row.sequence_id);
  if (!Number.isSafeInteger(sequenceId)) throw new Error("Chat sequence exceeds wire precision");
  return {
    sequenceId,
    roomId: row.room_key,
    senderUid: row.sender_uid,
    idempotencyKey: row.idempotency_key.toString("utf8"),
    body: row.body,
    createdAt: `${row.created_at.replace(" ", "T")}Z`,
  };
}
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
    !(input.now instanceof Date) ||
    !Number.isFinite(input.now.getTime())
  )
    throw new TypeError("Invalid chat message");
}
function room(roomId: string) {
  if (!roomId || roomId.length > 160) throw new TypeError("Invalid room");
}

export function createChatRepository(config: {
  databaseUrl: string;
  topology?: DatabaseTopology;
  now?: () => Date;
}) {
  const databases = createDatabases(
    {
      connectionString: config.databaseUrl,
      max: 5,
      connectionTimeoutMillis: 1000,
      statement_timeout: 2500,
      query_timeout: 2800,
    },
    config.topology,
  );
  for (const database of [databases.global, ...databases.kingdoms.values()])
    database.pool.on("error", () => {});
  const db = databases.global.db;
  const now = () => utc(config.now?.() ?? new Date());
  const repository: ChatRepository = {
    mailbox: createChatMailboxStore(db),
    profiles: createChatAvatarProfileStore(db),
    nicknames: createChatNicknameStore(db),
    sessions: {
      async create(session) {
        await db.insert(chat_session).values({
          token_hash: session.tokenHash,
          uid: session.uid,
          created_at: utc(session.createdAt),
          expires_at: utc(session.expiresAt),
        });
      },
      async getById(hash) {
        const [session] = await db
          .select({ uid: chat_session.uid })
          .from(chat_session)
          .where(and(eq(chat_session.token_hash, hash), gt(chat_session.expires_at, now())))
          .limit(1);
        return session ?? null;
      },
    },
    messages: {
      async create(input) {
        validate(input);
        const key = Buffer.from(input.idempotencyKey);
        const rows = await db
          .insert(chat_message)
          .values({
            room_key: input.roomId,
            sender_uid: input.senderUid,
            idempotency_key: key,
            body: input.body,
            created_at: utc(input.now),
            expires_at: utc(new Date(input.now.getTime() + 86400000)),
          })
          .onConflictDoNothing({
            target: [chat_message.sender_uid, chat_message.room_key, chat_message.idempotency_key],
          })
          .returning();
        const inserted = !!rows[0];
        const row =
          rows[0] ??
          (
            await db
              .select()
              .from(chat_message)
              .where(
                and(
                  eq(chat_message.room_key, input.roomId),
                  eq(chat_message.sender_uid, input.senderUid),
                  eq(chat_message.idempotency_key, key),
                  gt(chat_message.expires_at, now()),
                ),
              )
              .limit(1)
          )[0];
        if (!row) throw new Error("Chat message unavailable after write");
        if (row.body !== input.body) throw new TypeError("Chat receipt content conflict");
        return { ...parseRow(row), inserted };
      },
      async getAll(roomId, afterMs = 0) {
        room(roomId);
        if (!Number.isSafeInteger(afterMs) || afterMs < 0) throw new TypeError("Invalid time");
        const rows = await db
          .select()
          .from(chat_message)
          .where(
            and(
              eq(chat_message.room_key, roomId),
              gt(chat_message.expires_at, now()),
              afterMs ? gt(chat_message.created_at, utc(new Date(afterMs))) : undefined,
            ),
          )
          .orderBy(desc(chat_message.sequence_id))
          .limit(100);
        return rows.reverse().map(parseRow);
      },
      async getAllByRange(roomId, startMs, endMs) {
        room(roomId);
        if (
          !Number.isSafeInteger(startMs) ||
          startMs < 0 ||
          !Number.isSafeInteger(endMs) ||
          endMs <= startMs
        )
          throw new TypeError("Invalid time");
        const rows = await db
          .select()
          .from(chat_message)
          .where(
            and(
              eq(chat_message.room_key, roomId),
              gt(chat_message.expires_at, now()),
              gt(chat_message.created_at, utc(new Date(startMs))),
              lt(chat_message.created_at, utc(new Date(endMs))),
            ),
          )
          .orderBy(desc(chat_message.sequence_id))
          .limit(100);
        return rows.reverse().map(parseRow);
      },
    },
    async getPlayerStateById(uid) {
      const [account] = await db
        .select({ server: account_new.server })
        .from(account_new)
        .where(eq(account_new.gameUid, uid))
        .limit(1);
      const kingdom = databases.kingdoms.get(Number(account?.server));
      if (!kingdom) return null;
      const [state] = await kingdom.db
        .select({
          serverId: userprofile.serverId,
          originalServerId: userprofile.srcServerId,
          allianceId: userprofile.allianceId,
          membershipAllianceId: alliance_member.allianceId,
          language: userprofile.lang,
        })
        .from(userprofile)
        .leftJoin(alliance_member, eq(alliance_member.uid, userprofile.uid))
        .where(eq(userprofile.uid, uid))
        .limit(1);
      if (!state || state.serverId !== Number(account?.server)) return null;
      return {
        ...state,
        serverId: state.serverId,
        language: state.language ?? "",
        originalServerId: state.originalServerId > 0 ? state.originalServerId : state.serverId,
      };
    },
    async deleteExpired() {
      const expiredMessages = db
        .select({ id: chat_message.sequence_id })
        .from(chat_message)
        .where(lte(chat_message.expires_at, now()))
        .orderBy(asc(chat_message.expires_at))
        .limit(500);
      const messages = await db
        .delete(chat_message)
        .where(inArray(chat_message.sequence_id, expiredMessages))
        .returning({ id: chat_message.sequence_id });
      const expiredSessions = db
        .select({ id: chat_session.token_hash })
        .from(chat_session)
        .where(lte(chat_session.expires_at, now()))
        .orderBy(asc(chat_session.expires_at))
        .limit(500);
      const sessions = await db
        .delete(chat_session)
        .where(inArray(chat_session.token_hash, expiredSessions))
        .returning({ id: chat_session.token_hash });
      return { messages: messages.length, sessions: sessions.length };
    },
    async health() {
      await db.select().from(nickname_change_receipt).limit(0);
      await db.select().from(chat_avatar_profile).limit(0);
      await db.select().from(chat_mailbox_message).limit(0);
      await db.select().from(chat_mailbox_receipt).limit(0);
      await db.select().from(chat_session).limit(0);
      await db.select().from(chat_message).limit(0);
      await db.select({ id: account_new.gameUid }).from(account_new).limit(0);
      await Promise.all(
        [...databases.kingdoms.values()].map(async (kingdom) => {
          await kingdom.db.select({ id: userprofile.uid }).from(userprofile).limit(0);
          await kingdom.db.select({ id: alliance_member.uid }).from(alliance_member).limit(0);
          await kingdom.db.execute(sql`SELECT 1`);
        }),
      );
    },
  };
  return { ...repository, close: () => databases.close() };
}
