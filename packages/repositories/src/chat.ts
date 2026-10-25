import { realm_authority } from "@opencok/drizzle/schema/opencok_kingdom/realm_authority";
import { randomUUID } from "node:crypto";
import { createRealmChatEvents } from "./chat-realm-delivery.ts";
import { createChatMineCommands } from "./chat-mine.ts";
import {
  chat_event,
  chat_owner_command,
  chat_feed,
  chat_report,
  chat_feed_notice,
  chat_mailbox_intent,
} from "@opencok/drizzle/schema/opencok_chat/chat_social";
import { createChatNoticePublisher } from "./chat-notice.ts";
import type { ChatLegacyRelations } from "@opencok/contracts/chat-social";
import { chat_shield } from "@opencok/drizzle/schema/opencok_kingdom/chat_shield";
import type { ChatArchiveStore } from "@opencok/contracts/chat-delivery";
import { createChatMessageStore } from "./chat-messages.ts";
import { createChatSocialStore } from "./chat-social.ts";
import { createChatDeliveryStore } from "./chat-delivery.ts";
import { mod_authorize } from "@opencok/drizzle/schema/opencok_kingdom/mod_authorize";
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
import { and, asc, eq, gt, inArray, lte, sql } from "drizzle-orm";
import type { ChatRepository } from "@opencok/contracts/chat";

const utc = (date: Date) => date.toISOString().slice(0, 23).replace("T", " ");

export function createChatRepository(config: {
  databaseUrl: string;
  topology?: DatabaseTopology;
  now?: () => Date;
  archive?: ChatArchiveStore;
  renderRealmEvents?: (
    realm: number,
    owners: string[],
    events: import("@opencok/contracts/chat-delivery").ChatDeliveryEvent[],
  ) => Promise<unknown>;
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
    async authorizeRealm(realm, token, epoch) {
      const kingdom = databases.kingdoms.get(realm);
      if (!kingdom) return false;
      const [authority] = await kingdom.db
        .select()
        .from(realm_authority)
        .where(eq(realm_authority.kingdomId, realm))
        .limit(1);
      return authority?.instanceId === token && String(authority.ownerEpoch) === epoch;
    },
    mailbox: createChatMailboxStore(db, () => (config.now?.() ?? new Date()).getTime()),
    profiles: createChatAvatarProfileStore(db),
    nicknames: createChatNicknameStore(db),
    sessions: {
      async revoke(uid) {
        await db.transaction(async (tx) => {
          await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended('chat:append',0))`);
          await tx.delete(chat_session).where(eq(chat_session.uid, uid));
          const at = BigInt((config.now?.() ?? new Date()).getTime());
          await tx.insert(chat_event).values({
            id: randomUUID(),
            kind: "revocation",
            owner: uid,
            target: uid,
            data: { cmd: "session.revoked", data: {} },
            createdAt: at,
            expiresAt: at + 86_400_000n,
          });
        });
      },
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
    messages: undefined!,
    async getPlayerStateById(uid) {
      const [account] = await db
        .select({ server: account_new.server, facebookId: account_new.facebookAccount })
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
          name: userprofile.name,
          pic: userprofile.pic,
          picVer: userprofile.picVer,
          picfraId: userprofile.picfraId,
          gmFlag: userprofile.gmFlag,
          moderationAllowed: mod_authorize.authorize,
          banUntil: userprofile.banTime,
          banned: userprofile.banFlag,
          chatBanUntil: userprofile.chatBanTime,
          noticeBanUntil: userprofile.noticeBanTime,
          allianceJoinedAt: alliance_member.jointime,
        })
        .from(userprofile)
        .leftJoin(alliance_member, eq(alliance_member.uid, userprofile.uid))
        .leftJoin(mod_authorize, eq(mod_authorize.uid, userprofile.uid))
        .where(eq(userprofile.uid, uid))
        .limit(1);
      if (!state || state.serverId !== Number(account?.server)) return null;
      return {
        ...state,
        banned: (state.banned ?? 0) !== 0,
        facebookId: account?.facebookId,
        gmFlag: state.gmFlag ?? 0,
        moderationAllowed: state.moderationAllowed !== 0,
        banUntil: Number(state.banUntil ?? 0),
        chatBanUntil: Number(state.chatBanUntil ?? 0),
        noticeBanUntil: Number(state.noticeBanUntil ?? 0),
        allianceJoinedAt: Number(state.allianceJoinedAt ?? 0),
        serverId: state.serverId,
        language: state.language ?? "",
        originalServerId: state.originalServerId > 0 ? state.originalServerId : state.serverId,
      };
    },
    async deleteExpired() {
      const cutoff = BigInt((config.now?.() ?? new Date()).getTime());
      const expiredMessages = await db
        .select({ id: chat_message.sequence_id })
        .from(chat_message)
        .where(and(lte(chat_message.expires_at, now()), sql`${chat_message.body} is not null`))
        .orderBy(asc(chat_message.expires_at))
        .limit(500);
      if (expiredMessages.length)
        await db
          .update(chat_message)
          .set({ body: null, deleted_at: now() })
          .where(
            inArray(
              chat_message.sequence_id,
              expiredMessages.map((row) => row.id),
            ),
          );
      const expiredMail = await db
        .select({
          realm: chat_mailbox_message.kingdom_id,
          owner: chat_mailbox_message.owner_uid,
          id: chat_mailbox_message.message_id,
        })
        .from(chat_mailbox_message)
        .where(lte(chat_mailbox_message.expires_at, cutoff))
        .limit(500);
      for (const row of expiredMail)
        await db
          .delete(chat_mailbox_message)
          .where(
            and(
              eq(chat_mailbox_message.kingdom_id, row.realm),
              eq(chat_mailbox_message.owner_uid, row.owner),
              eq(chat_mailbox_message.message_id, row.id),
            ),
          );
      const events = await db
        .select({ id: chat_event.sequence })
        .from(chat_event)
        .where(lte(chat_event.expiresAt, cutoff))
        .orderBy(asc(chat_event.sequence))
        .limit(1000);
      if (events.length)
        await db.delete(chat_event).where(
          inArray(
            chat_event.sequence,
            events.map((row) => row.id),
          ),
        );
      const feeds = await db
        .select({ id: chat_feed.id })
        .from(chat_feed)
        .where(lte(chat_feed.expiresAt, cutoff))
        .limit(500);
      if (feeds.length) {
        await db.delete(chat_feed_notice).where(
          inArray(
            chat_feed_notice.feed,
            feeds.map((row) => row.id),
          ),
        );
        await db.delete(chat_feed).where(
          inArray(
            chat_feed.id,
            feeds.map((row) => row.id),
          ),
        );
      }
      const ownerCommands = await db
        .select({ id: chat_owner_command.id })
        .from(chat_owner_command)
        .where(lte(chat_owner_command.expiresAt, cutoff))
        .limit(500);
      if (ownerCommands.length)
        await db.delete(chat_owner_command).where(
          inArray(
            chat_owner_command.id,
            ownerCommands.map((row) => row.id),
          ),
        );
      const reports = await db
        .select({ id: chat_report.id })
        .from(chat_report)
        .where(lte(chat_report.expiresAt, cutoff))
        .limit(500);
      if (reports.length)
        await db.delete(chat_report).where(
          inArray(
            chat_report.id,
            reports.map((row) => row.id),
          ),
        );
      const intents = await db
        .select()
        .from(chat_mailbox_intent)
        .where(lte(chat_mailbox_intent.cutoff, cutoff - 90n * 86_400_000n))
        .limit(500);
      for (const intent of intents)
        await db
          .delete(chat_mailbox_intent)
          .where(
            and(
              eq(chat_mailbox_intent.realm, intent.realm),
              eq(chat_mailbox_intent.operation, intent.operation),
              eq(chat_mailbox_intent.effect, intent.effect),
              eq(chat_mailbox_intent.type, intent.type),
            ),
          );

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
      return { messages: expiredMessages.length + expiredMail.length, sessions: sessions.length };
    },
    async health() {
      await db.select().from(chat_event).limit(0);
      await db.select().from(chat_feed).limit(0);
      await db.select().from(chat_mailbox_intent).limit(0);
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
  const clock = config.now ?? (() => new Date());
  const social = createChatSocialStore(
    db,
    repository.getPlayerStateById,
    clock,
    async (uid) => {
      const state = await repository.getPlayerStateById(uid);
      const kingdom = state && databases.kingdoms.get(state.serverId);
      if (!state || !kingdom) throw new Error("Social owner unavailable");
      const contacts: ChatLegacyRelations["contacts"] = [];
      for (let shard = 0; shard < 10; shard++) {
        const rows = await kingdom.db.execute<{
          friendUid: string;
          stat: number;
          description: Buffer | null;
        }>(
          sql`select "friendUid",stat,description from "opencok_kingdom".${sql.identifier(`contact_${shard}`)} where uid=${uid} limit 1001`,
        );
        for (const row of rows.rows)
          if (row.friendUid !== uid && row.friendUid.length <= 40 && row.stat > 0 && row.stat <= 4)
            contacts.push({
              other: row.friendUid,
              state: row.stat,
              description: row.description?.toString("utf8") ?? "",
            });
        if (contacts.length > 1000) throw new Error("Social contacts exceed bound");
      }
      const blocks = await kingdom.db
        .select()
        .from(chat_shield)
        .where(eq(chat_shield.owner, uid))
        .limit(1001);
      if (blocks.length > 1000) throw new Error("Social blocks exceed bound");
      return {
        realm: state.serverId,
        contacts,
        blocks: blocks.map((row) => ({ other: row.other, id: row.uuid })),
      };
    },
    async (ids) => {
      if (!ids.length) return [];
      const rows = await db
        .select({ uid: account_new.gameUid, facebookId: account_new.facebookAccount })
        .from(account_new)
        .where(inArray(account_new.facebookAccount, ids))
        .limit(100);
      return rows.filter((row): row is { uid: string; facebookId: string } => !!row.facebookId);
    },
    async (uid) => {
      const state = await repository.getPlayerStateById(uid);
      const kingdom = state && databases.kingdoms.get(state.serverId);
      if (!kingdom || !state?.allianceId || state.allianceId !== state.membershipAllianceId)
        return [];
      return kingdom.db
        .select({ uid: userprofile.uid, name: userprofile.name })
        .from(alliance_member)
        .innerJoin(userprofile, eq(userprofile.uid, alliance_member.uid))
        .where(
          and(
            eq(alliance_member.allianceId, state.allianceId),
            eq(userprofile.allianceId, state.allianceId),
          ),
        )
        .limit(200);
    },
  );
  Object.assign(
    repository,
    social,
    createChatMessageStore(db, config.archive, clock, social.access.canSend),
  );
  repository.mineCommand = createChatMineCommands(databases, repository, clock);
  repository.publishNotice = createChatNoticePublisher(databases, repository, clock);
  repository.delivery = createChatDeliveryStore(db, clock);
  if (config.renderRealmEvents)
    repository.realmEvents = createRealmChatEvents(databases, repository, config.renderRealmEvents);
  return { ...repository, close: () => databases.close() };
}
