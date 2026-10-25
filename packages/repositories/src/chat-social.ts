import { createHash, randomUUID } from "node:crypto";
import { and, asc, desc, eq, gt, inArray, isNull, or, sql } from "drizzle-orm";
import {
  chat_feed,
  chat_feed_notice,
  chat_mailbox_intent,
  chat_social_import,
  chat_operation,
  chat_relation,
  chat_private_room,
  chat_private_member,
  chat_moderation,
  chat_report,
  chat_event,
} from "@opencok/drizzle/schema/opencok_chat/chat_social";
import { chat_mailbox_message } from "@opencok/drizzle/schema/opencok_chat/chat_mailbox_message";
import { chat_message } from "@opencok/drizzle/schema/opencok_chat/chat_message";
import type {
  ChatLegacyRelations,
  ChatSocialStore,
  ChatSocialTransaction,
} from "@opencok/contracts/chat-social";
import type { ChatAccessStore } from "@opencok/contracts/chat-delivery";
import type { PlayerStateLoader } from "@opencok/contracts/chat";
import { ChatCommandError } from "@opencok/errors/chat";
import { chatMessage, chatUtc } from "./chat-messages.ts";
import type { Database } from "./game.ts";
export function createChatSocialStore(
  db: Database["databases"]["global"]["db"],
  load: PlayerStateLoader,
  clock: () => Date,
  legacy?: (uid: string) => Promise<ChatLegacyRelations>,
  facebook?: (ids: string[]) => Promise<{ uid: string; facebookId: string }[]>,
  alliancePlayers?: (uid: string) => Promise<{ uid: string; name: string }[]>,
) {
  const timestamp = () => BigInt(clock().getTime());
  async function ensureImported(uid: string) {
    if (!legacy) return;
    const [existing] = await db
      .select()
      .from(chat_social_import)
      .where(eq(chat_social_import.owner, uid));
    if (existing || !(await load(uid))) return;
    const data = await legacy(uid);
    await db.transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended('chat:append',0))`);
      const [marker] = await tx
        .insert(chat_social_import)
        .values({ owner: uid, realm: data.realm, createdAt: timestamp() })
        .onConflictDoNothing()
        .returning();
      if (!marker) return;
      for (const row of data.contacts)
        await tx
          .insert(chat_relation)
          .values({
            owner: uid,
            other: row.other,
            kind: "contact",
            state: row.state,
            description: row.description,
            createdAt: timestamp(),
          })
          .onConflictDoNothing();
      for (const row of data.blocks)
        await tx
          .insert(chat_relation)
          .values({
            owner: uid,
            other: row.other,
            id: row.id,
            kind: "block",
            state: 1,
            createdAt: timestamp(),
          })
          .onConflictDoNothing();
    });
  }
  async function ensureManyImported(uids: string[]) {
    const ids = [...new Set(uids)];
    if (!legacy || !ids.length) return;
    const markers = await db
      .select({ uid: chat_social_import.owner })
      .from(chat_social_import)
      .where(inArray(chat_social_import.owner, ids));
    const present = new Set(markers.map((row) => row.uid));
    for (const uid of ids) if (!present.has(uid)) await ensureImported(uid);
  }
  const activeMember = (uid: string, room: string) =>
    and(
      eq(chat_private_member.owner, uid),
      eq(chat_private_member.room, room.replace(/^private_/, "")),
      isNull(chat_private_member.leftAt),
    );
  const access: ChatAccessStore = {
    async roomInfo(uid, roomId) {
      if (!/^private_[a-f0-9-]{36}$/.test(roomId)) return null;
      const id = roomId.slice(8);
      const [member] = await db.select().from(chat_private_member).where(activeMember(uid, id));
      if (!member) return null;
      const [room] = await db
        .select()
        .from(chat_private_room)
        .where(and(eq(chat_private_room.id, id), isNull(chat_private_room.deletedAt)));
      if (!room) return null;
      const members = await db
        .select()
        .from(chat_private_member)
        .where(and(eq(chat_private_member.room, id), isNull(chat_private_member.leftAt)))
        .orderBy(
          desc(chat_private_member.role),
          asc(chat_private_member.joinedAt),
          asc(chat_private_member.owner),
        )
        .limit(50);
      const presentation = await Promise.all(
        members.map(async (value) => {
          const state = await load(value.owner);
          return {
            uid: value.owner,
            name: state?.name ?? value.owner,
            role: value.role === 2 ? 0 : 1,
            jt: Number(value.joinedAt),
            pic: state?.pic,
            picVer: state?.picVer,
            picfraId: state?.picfraId,
          };
        }),
      );
      const [last] = await db
        .select()
        .from(chat_message)
        .where(
          and(
            eq(chat_message.room_key, roomId),
            isNull(chat_message.deleted_at),
            gt(chat_message.expires_at, chatUtc(clock())),
            sql`${chat_message.created_at} >= ${chatUtc(new Date(Number(member.joinedAt)))}`,
          ),
        )
        .orderBy(desc(chat_message.sequence_id))
        .limit(1);
      return {
        id: roomId,
        name:
          room.name ||
          presentation
            .map((member) => member.name)
            .join(", ")
            .slice(0, 100),
        founder: room.owner,
        isNotDefaultName: room.name ? 1 : 0,
        members: presentation,
        ...(last?.body !== null && last && (await access.canRead(uid, chatMessage(last)))
          ? { lastMessage: chatMessage(last) }
          : {}),
      };
    },
    async filter(uid, messages) {
      if (!messages.length) return [];
      const state = await load(uid);
      if (!state || state.banned || (state.banUntil ?? 0) > clock().getTime()) return [];
      const senders = [...new Set(messages.map((message) => message.senderUid))];
      await ensureManyImported([uid, ...senders]);
      const blocks = await db
        .select()
        .from(chat_relation)
        .where(
          and(
            eq(chat_relation.kind, "block"),
            or(
              and(eq(chat_relation.owner, uid), inArray(chat_relation.other, senders)),
              and(eq(chat_relation.other, uid), inArray(chat_relation.owner, senders)),
            ),
          ),
        );
      const blocked = new Set(blocks.map((row) => (row.owner === uid ? row.other : row.owner)));
      const rooms = [
        ...new Set(
          messages
            .filter((message) => message.roomId.startsWith("private_"))
            .map((message) => message.roomId.slice(8)),
        ),
      ];
      const memberships = rooms.length
        ? await db
            .select()
            .from(chat_private_member)
            .where(
              and(
                eq(chat_private_member.owner, uid),
                inArray(chat_private_member.room, rooms),
                isNull(chat_private_member.leftAt),
              ),
            )
        : [];
      const joined = new Map(
        memberships.map((row) => [`private_${row.room}`, Number(row.joinedAt)]),
      );
      return messages.filter((message) => {
        if (
          blocked.has(message.senderUid) &&
          ![100, 101, 102, 103, 105].includes(message.post ?? 0)
        )
          return false;
        if (message.roomId.startsWith("private_"))
          return (
            joined.has(message.roomId) &&
            Date.parse(message.createdAt) >= joined.get(message.roomId)!
          );
        if (message.roomId.startsWith("alliance_"))
          return (
            !!state.allianceId &&
            state.allianceId === state.membershipAllianceId &&
            message.roomId === `alliance_${state.originalServerId}_${state.allianceId}` &&
            Date.parse(message.createdAt) >= (state.allianceJoinedAt ?? 0)
          );
        return true;
      });
    },
    async canSend(uid, notice = false) {
      await ensureImported(uid);
      const state = await load(uid);
      if (!state || state.banned || (state.banUntil ?? 0) > clock().getTime()) return false;
      const [mute] = await db.select().from(chat_moderation).where(eq(chat_moderation.owner, uid));
      return (
        (notice
          ? (mute?.noticeUntil ?? BigInt(state.noticeBanUntil ?? 0))
          : (mute?.muteUntil ?? BigInt(state.chatBanUntil ?? 0))) <= timestamp()
      );
    },
    async canReceive(uid, sender) {
      await ensureImported(uid);
      if (sender !== uid) await ensureImported(sender);
      const [block] = await db
        .select({ owner: chat_relation.owner })
        .from(chat_relation)
        .where(
          and(
            eq(chat_relation.kind, "block"),
            or(
              and(eq(chat_relation.owner, uid), eq(chat_relation.other, sender)),
              and(eq(chat_relation.owner, sender), eq(chat_relation.other, uid)),
            ),
          ),
        )
        .limit(1);
      return !block;
    },
    async privateRoom(uid, roomId) {
      if (!roomId.startsWith("private_")) return false;
      const [member] = await db
        .select({ role: chat_private_member.role })
        .from(chat_private_member)
        .where(activeMember(uid, roomId))
        .limit(1);
      return !!member;
    },
    async canRead(uid, message) {
      if (
        ![100, 101, 102, 103, 105].includes(message.post ?? 0) &&
        !(await access.canReceive(uid, message.senderUid))
      )
        return false;
      if (message.roomId.startsWith("alliance_")) {
        const state = await load(uid);
        if (
          !state ||
          state.banned ||
          !state.allianceId ||
          state.membershipAllianceId !== state.allianceId ||
          message.roomId !== `alliance_${state.originalServerId}_${state.allianceId}`
        )
          return false;
        return Date.parse(message.createdAt) >= (state.allianceJoinedAt ?? 0);
      }
      if (message.roomId.startsWith("private_")) {
        const [member] = await db
          .select()
          .from(chat_private_member)
          .where(activeMember(uid, message.roomId));
        return !!member && BigInt(Date.parse(message.createdAt)) >= member.joinedAt;
      }
      return true;
    },
  };
  const social: ChatSocialStore = {
    async execute(input, plan) {
      const imported: { owner: string; data: ChatLegacyRelations }[] = [];
      if (legacy)
        for (const uid of new Set([input.owner, input.target].filter(Boolean))) {
          const [marker] = await db
            .select()
            .from(chat_social_import)
            .where(eq(chat_social_import.owner, uid));
          if (!marker && (await load(uid))) imported.push({ owner: uid, data: await legacy(uid) });
        }
      const ids = new Set(
        [input.owner, input.target, ...input.members, ...input.notices].filter(Boolean),
      );
      if (["contact.get", "contact.get.server.current"].includes(input.command)) {
        const relations = await db
          .select({ other: chat_relation.other })
          .from(chat_relation)
          .where(
            and(
              eq(chat_relation.owner, input.owner),
              inArray(chat_relation.kind, ["contact", "facebook"]),
            ),
          )
          .limit(1000);
        for (const row of relations) ids.add(row.other);
        for (const item of imported)
          if (item.owner === input.owner) for (const row of item.data.contacts) ids.add(row.other);
      }
      const players = new Map<string, Awaited<ReturnType<PlayerStateLoader>>>();
      const selected = [...ids];
      for (let index = 0; index < selected.length; index += 16)
        await Promise.all(
          selected.slice(index, index + 16).map(async (uid) => {
            players.set(uid, await load(uid));
          }),
        );
      const actor = players.get(input.owner);
      if (!actor) throw new ChatCommandError("unauthorized");
      const target = players.get(input.target) ?? null;
      const facebookPlayers =
        input.command === "fb.friend.get" && facebook ? await facebook(input.ids) : [];
      const invitees =
        input.command === "chat.room.invitee" && alliancePlayers
          ? await alliancePlayers(input.owner)
          : [];
      const canSend = await access.canSend(input.owner);
      const hash = createHash("sha256").update(JSON.stringify(input)).digest("hex");
      return db.transaction(async (tx) => {
        await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended('chat:append',0))`);
        const [receipt] = await tx
          .select()
          .from(chat_operation)
          .where(
            and(
              eq(chat_operation.owner, input.owner),
              eq(chat_operation.operationId, input.operationId),
            ),
          );
        if (receipt) {
          if (receipt.hash !== hash) throw new ChatCommandError("conflicting_request");
          return JSON.parse(receipt.response.toString("utf8")) as Record<string, unknown>;
        }
        const now = timestamp();
        for (const item of imported) {
          const [marker] = await tx
            .insert(chat_social_import)
            .values({ owner: item.owner, realm: item.data.realm, createdAt: now })
            .onConflictDoNothing()
            .returning();
          if (!marker) continue;
          for (const row of item.data.contacts)
            await tx
              .insert(chat_relation)
              .values({
                owner: item.owner,
                other: row.other,
                kind: "contact",
                state: row.state,
                description: row.description,
                createdAt: now,
              })
              .onConflictDoNothing();
          for (const row of item.data.blocks)
            await tx
              .insert(chat_relation)
              .values({
                owner: item.owner,
                other: row.other,
                id: row.id,
                kind: "block",
                state: 1,
                createdAt: now,
              })
              .onConflictDoNothing();
        }
        async function event(
          owner: string,
          command: string,
          data: Record<string, unknown>,
          recipient: string | null = null,
          room = "",
        ) {
          await tx.insert(chat_event).values({
            id: randomUUID(),
            kind: "social",
            owner,
            target: recipient,
            room,
            data: { cmd: command, data },
            createdAt: now,
            expiresAt: now + 86_400_000n,
          });
        }
        const unit: ChatSocialTransaction = {
          now,
          actor,
          target,
          players,
          invitees,
          facebookPlayers,
          canSend,
          async blocked(first, second) {
            const [row] = await tx
              .select({ owner: chat_relation.owner })
              .from(chat_relation)
              .where(
                and(
                  eq(chat_relation.kind, "block"),
                  or(
                    and(eq(chat_relation.owner, first), eq(chat_relation.other, second)),
                    and(eq(chat_relation.owner, second), eq(chat_relation.other, first)),
                  ),
                ),
              )
              .limit(1);
            return !!row;
          },
          relations(owner, kind) {
            return tx
              .select()
              .from(chat_relation)
              .where(and(eq(chat_relation.owner, owner), eq(chat_relation.kind, kind)))
              .orderBy(asc(chat_relation.other))
              .limit(1000);
          },
          pair(owner, other) {
            return tx
              .select()
              .from(chat_relation)
              .where(
                and(
                  eq(chat_relation.kind, "contact"),
                  or(
                    and(eq(chat_relation.owner, owner), eq(chat_relation.other, other)),
                    and(eq(chat_relation.owner, other), eq(chat_relation.other, owner)),
                  ),
                ),
              )
              .limit(2);
          },
          async putRelation(row) {
            await tx
              .insert(chat_relation)
              .values(row)
              .onConflictDoUpdate({
                target: [chat_relation.owner, chat_relation.other, chat_relation.kind],
                set: {
                  state: row.state,
                  description: row.description,
                  facebookId: row.facebookId,
                  facebookName: row.facebookName,
                },
              });
          },
          async removeRelations(owner, kind, others) {
            if (others.length)
              await tx
                .delete(chat_relation)
                .where(
                  and(
                    eq(chat_relation.owner, owner),
                    eq(chat_relation.kind, kind),
                    or(inArray(chat_relation.other, others), inArray(chat_relation.id, others)),
                  ),
                );
          },
          async room(id) {
            const [row] = await tx
              .select()
              .from(chat_private_room)
              .where(and(eq(chat_private_room.id, id), isNull(chat_private_room.deletedAt)));
            return row ?? null;
          },
          myRooms(owner) {
            return tx
              .select({
                id: chat_private_room.id,
                owner: chat_private_room.owner,
                name: chat_private_room.name,
                version: chat_private_room.version,
                createdAt: chat_private_room.createdAt,
                deletedAt: chat_private_room.deletedAt,
                role: chat_private_member.role,
              })
              .from(chat_private_member)
              .innerJoin(chat_private_room, eq(chat_private_room.id, chat_private_member.room))
              .where(
                and(
                  eq(chat_private_member.owner, owner),
                  isNull(chat_private_member.leftAt),
                  isNull(chat_private_room.deletedAt),
                ),
              )
              .limit(51);
          },
          members(id) {
            return tx
              .select()
              .from(chat_private_member)
              .where(and(eq(chat_private_member.room, id), isNull(chat_private_member.leftAt)))
              .orderBy(
                desc(chat_private_member.role),
                asc(chat_private_member.joinedAt),
                asc(chat_private_member.owner),
              )
              .limit(51);
          },
          async putRoom(row) {
            await tx
              .insert(chat_private_room)
              .values(row)
              .onConflictDoUpdate({
                target: chat_private_room.id,
                set: {
                  owner: row.owner,
                  name: row.name,
                  version: row.version,
                  deletedAt: row.deletedAt,
                },
              });
          },
          async putMember(row) {
            await tx
              .insert(chat_private_member)
              .values(row)
              .onConflictDoUpdate({
                target: [chat_private_member.room, chat_private_member.owner],
                set: {
                  role: row.role,
                  joinedAt: row.joinedAt,
                  leftAt: row.leftAt,
                  readSequence: row.readSequence,
                },
              });
          },
          async append(room, owner, key, body, post = 0) {
            const [saved] = await tx
              .insert(chat_message)
              .values({
                room_key: room,
                sender_uid: owner,
                idempotency_key: Buffer.from(createHash("sha256").update(key).digest("hex")),
                body,
                post_type: post,
                body_hash: createHash("sha256").update(body).digest("hex"),
                created_at: chatUtc(new Date(Number(now))),
                expires_at: chatUtc(new Date(Number(now) + 30 * 86_400_000)),
              })
              .returning();
            if (!saved) throw new Error("Room message insert failed");
            await tx.insert(chat_event).values({
              id: randomUUID(),
              kind: "message",
              room,
              owner,
              message: String(saved.sequence_id),
              createdAt: now,
              expiresAt: now + 86_400_000n,
            });
            return chatMessage(saved);
          },
          async history(room, joinedAt, before, limit) {
            const rows = await tx
              .select()
              .from(chat_message)
              .where(
                and(
                  eq(chat_message.room_key, room),
                  isNull(chat_message.deleted_at),
                  gt(chat_message.expires_at, chatUtc(clock())),
                  sql`${chat_message.created_at} >= ${chatUtc(new Date(Number(joinedAt)))}`,
                  before ? sql`${chat_message.sequence_id} < ${BigInt(before)}` : undefined,
                ),
              )
              .orderBy(desc(chat_message.sequence_id))
              .limit(limit);
            return rows.filter((row) => row.body !== null).map(chatMessage);
          },
          async markRead(room, owner, sequence) {
            const [last] = await tx
              .select({ sequence: chat_message.sequence_id })
              .from(chat_message)
              .where(eq(chat_message.room_key, `private_${room}`))
              .orderBy(desc(chat_message.sequence_id))
              .limit(1);
            if (BigInt(sequence) > (last?.sequence ?? 0n))
              throw new ChatCommandError("invalid_cursor");
            await tx
              .update(chat_private_member)
              .set({ readSequence: sql`greatest(${chat_private_member.readSequence},${sequence})` })
              .where(activeMember(owner, room));
          },
          async removeMessage(sequence) {
            const [row] = await tx
              .update(chat_message)
              .set({
                body: null,
                deleted_at: chatUtc(clock()),
                version: sql`${chat_message.version}+1`,
              })
              .where(
                and(
                  eq(chat_message.sequence_id, BigInt(sequence)),
                  isNull(chat_message.deleted_at),
                ),
              )
              .returning();
            if (row)
              await event(
                input.owner,
                "push.chat.delete",
                { seqId: sequence, roomId: row.room_key },
                null,
                row.room_key,
              );
          },
          async moderate(owner, moderator, reason, notice, until) {
            await tx
              .insert(chat_moderation)
              .values({
                owner,
                actor: moderator,
                reason,
                updatedAt: now,
                muteUntil: notice ? BigInt(target?.chatBanUntil ?? 0) : until,
                noticeUntil: notice ? until : BigInt(target?.noticeBanUntil ?? 0),
              })
              .onConflictDoUpdate({
                target: chat_moderation.owner,
                set: {
                  actor: moderator,
                  reason,
                  updatedAt: now,
                  version: sql`${chat_moderation.version}+1`,
                  ...(notice ? { noticeUntil: until } : { muteUntil: until }),
                },
              });
          },
          async report(owner, target, reason) {
            const id = randomUUID();
            await tx.insert(chat_report).values({
              id,
              owner,
              target,
              reason,
              createdAt: now,
              expiresAt: now + 30n * 86_400_000n,
            });
            return id;
          },
          async direct(owner, recipient, body, senderRealm, recipientRealm) {
            const id = randomUUID();
            for (const [uid, peer, realm] of [
              [owner, recipient, senderRealm],
              [recipient, owner, recipientRealm],
            ] as const) {
              const intents = await tx
                .select()
                .from(chat_mailbox_intent)
                .where(
                  and(
                    eq(chat_mailbox_intent.realm, realm),
                    eq(chat_mailbox_intent.owner, uid),
                    eq(chat_mailbox_intent.type, 3),
                    or(eq(chat_mailbox_intent.peer, ""), eq(chat_mailbox_intent.peer, peer)),
                    sql`${chat_mailbox_intent.cutoff} >= ${now}`,
                  ),
                );
              if (intents.some((intent) => intent.action === "delete")) continue;
              await tx.insert(chat_mailbox_message).values({
                kingdom_id: realm,
                owner_uid: uid,
                peer_uid: peer,
                sender_uid: owner,
                message_id: id,
                chat_type: 3,
                body,
                created_at: now,
                expires_at: now + 30n * 86_400_000n,
                read: uid === owner || intents.some((intent) => intent.action === "read"),
              });
            }
            await tx.insert(chat_event).values({
              id: randomUUID(),
              kind: "direct",
              owner,
              target: recipient,
              message: id,
              createdAt: now,
              expiresAt: now + 86_400_000n,
            });
            return id;
          },
          event,
          async feed(id) {
            const [row] = await tx
              .select()
              .from(chat_feed)
              .where(
                and(
                  eq(chat_feed.id, id),
                  isNull(chat_feed.deletedAt),
                  gt(chat_feed.expiresAt, now),
                ),
              );
            return row ?? null;
          },
          feeds(owner, realm, alliance) {
            return tx
              .select()
              .from(chat_feed)
              .where(
                and(
                  gt(chat_feed.expiresAt, now),
                  isNull(chat_feed.deletedAt),
                  or(
                    eq(chat_feed.owner, owner),
                    alliance
                      ? and(eq(chat_feed.realm, realm), eq(chat_feed.alliance, alliance))
                      : undefined,
                  ),
                ),
              )
              .orderBy(desc(chat_feed.createdAt), desc(chat_feed.id))
              .limit(100);
          },
          async putFeed(row) {
            await tx.insert(chat_feed).values(row);
          },
          async removeFeed(id) {
            await tx
              .update(chat_feed)
              .set({ deletedAt: now, body: {} })
              .where(or(eq(chat_feed.id, id), eq(chat_feed.parent, id)));
          },
          async feedNotice(owner, id) {
            await tx
              .insert(chat_feed_notice)
              .values({ owner, feed: id, createdAt: now })
              .onConflictDoNothing();
          },
          async removeFeedNotices(owner, ids) {
            if (ids.length)
              await tx
                .delete(chat_feed_notice)
                .where(and(eq(chat_feed_notice.owner, owner), inArray(chat_feed_notice.feed, ids)));
          },
        };
        const result = await plan(unit);
        const reads = [
          "contact.get",
          "contact.get.server.current",
          "contact.audit",
          "chat.shield.list",
          "chat.room.members",
          "chat.room.user.rooms",
          "chat.room.msg",
          "chat.feed.get",
          "chat.room.invitee",
          "fb.friend.get",
        ];
        if (!reads.includes(input.command))
          await tx.insert(chat_operation).values({
            owner: input.owner,
            operationId: input.operationId,
            command: input.command,
            hash,
            response: Buffer.from(JSON.stringify(result)),
            createdAt: now,
          });
        return result;
      });
    },
  };
  return { social, access };
}
