import { createHash } from "node:crypto";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { decode, str, type Value } from "@opencok/messages/sfs";
import { chat_operation, chat_event } from "@opencok/drizzle/schema/opencok_chat/chat_social";
import { sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { and, asc, eq, gt, inArray, isNull } from "drizzle-orm";
import { chat_owner_command } from "@opencok/drizzle/schema/opencok_chat/chat_social";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { user_mine } from "@opencok/drizzle/schema/opencok_kingdom/user_mine";
import type { ChatRepository } from "@opencok/contracts/chat";
import { ChatCommandError } from "@opencok/errors/chat";
import type { Database } from "./game.ts";
export function createChatMineCommands(
  databases: Database["databases"],
  repository: ChatRepository,
  clock: () => Date,
) {
  const db = databases.global.db;
  return async (
    owner: string,
    realm: number,
    command: string,
    params: Record<string, unknown>,
    operationId: string,
  ): Promise<Record<string, unknown>> => {
    if (!databases.kingdoms.has(realm)) throw new ChatCommandError("invalid_realm");
    const now = BigInt(clock().getTime());
    if (command === "mine.inbox.poll") {
      if (owner !== `realm-${realm}`) throw new ChatCommandError("unauthorized");
      const rows = await db
        .select()
        .from(chat_owner_command)
        .where(
          and(
            eq(chat_owner_command.realm, realm),
            isNull(chat_owner_command.processedAt),
            gt(chat_owner_command.expiresAt, now),
          ),
        )
        .orderBy(asc(chat_owner_command.createdAt), asc(chat_owner_command.id))
        .limit(32);
      return {
        commands: rows.map((row) => ({
          id: row.id,
          owner: row.owner,
          actor: row.actor,
          ...(row.payload as Record<string, unknown>),
        })),
      };
    }
    const actor = await repository.getPlayerStateById(owner);
    if (!actor || actor.banned || actor.serverId !== realm || (actor.banUntil ?? 0) > Number(now))
      throw new ChatCommandError("unauthorized");
    if (command === "mine.inbox.ack") {
      if (typeof params.id !== "string") throw new ChatCommandError("invalid_request");
      await db
        .update(chat_owner_command)
        .set({ processedAt: now })
        .where(
          and(
            eq(chat_owner_command.id, params.id),
            eq(chat_owner_command.owner, owner),
            eq(chat_owner_command.realm, realm),
          ),
        );
      return {};
    }
    if (!actor.facebookId) throw new ChatCommandError("facebook_binding_required");
    if (command === "mine.call.publish") {
      const kingdom = databases.kingdoms.get(realm)!;
      const [source] = await kingdom.db
        .select()
        .from(mutation_outbox)
        .where(
          and(
            eq(mutation_outbox.kingdomId, realm),
            eq(mutation_outbox.ownerUid, owner),
            eq(mutation_outbox.requestId, operationId),
            eq(mutation_outbox.eventId, "mine-call"),
            eq(mutation_outbox.eventType, "social.mine.call"),
          ),
        )
        .limit(1);
      if (!source) throw new ChatCommandError("invalid_request");
      if (source.createdAt + 86_400_000n <= now || !source.payload.length) return { expired: true };
      const data = decode(source.payload);
      if (str(data, "binding") !== actor.facebookId) return { superseded: true };
      const values = data.recipients?.value;
      if (!Array.isArray(values) || values.length > 100)
        throw new ChatCommandError("invalid_request");
      const ids = (values as Value[]).map((value) => str({ uid: value }, "uid"));
      if (ids.some((uid) => !/^[a-zA-Z0-9_-]{1,40}$/.test(uid)))
        throw new ChatCommandError("invalid_request");
      const recipients: string[] = [];
      for (const uid of ids)
        if (
          uid !== owner &&
          (await repository.getPlayerStateById(uid)) &&
          (await repository.access?.canReceive(uid, owner))
        )
          recipients.push(uid);
      const rawKey = `mine-call-${operationId}`,
        key = rawKey.length <= 128 ? rawKey : createHash("sha256").update(rawKey).digest("hex"),
        hash = createHash("sha256").update(source.payload).digest("hex");
      return db.transaction(async (tx) => {
        await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended('chat:append',0))`);
        const [old] = await tx
          .select()
          .from(chat_operation)
          .where(and(eq(chat_operation.owner, owner), eq(chat_operation.operationId, key)));
        if (old) {
          if (old.hash !== hash) throw new ChatCommandError("conflicting_request");
          return { unchanged: true };
        }
        for (const uid of recipients)
          await tx.insert(chat_event).values({
            id: randomUUID(),
            kind: "social",
            owner,
            target: uid,
            data: {
              cmd: "mine.call.push",
              data: { fId: actor.facebookId, fbName: str(data, "name"), gUid: owner },
            },
            createdAt: source.createdAt,
            expiresAt: source.createdAt + 86_400_000n,
          });
        await tx.insert(chat_operation).values({
          owner,
          operationId: key,
          command,
          hash,
          response: Buffer.from("{}"),
          createdAt: now,
        });
        return {};
      });
    }
    if (command === "mine.friend") {
      if (
        !Array.isArray(params.ids) ||
        params.ids.length > 100 ||
        params.ids.some((id) => typeof id !== "string" || !/^[a-zA-Z0-9_-]{1,40}$/.test(id))
      )
        throw new ChatCommandError("invalid_request");
      if (!params.ids.length) return { friendList: [], friends: [] };
      const accounts = await db
        .select({
          uid: account_new.gameUid,
          facebook: account_new.facebookAccount,
          realm: account_new.server,
        })
        .from(account_new)
        .where(inArray(account_new.facebookAccount, params.ids as string[]))
        .limit(100);
      const friends = [];
      for (const account of accounts) {
        if (
          account.uid === owner ||
          !account.facebook ||
          !(await repository.access?.canReceive(owner, account.uid))
        )
          continue;
        const kingdom = databases.kingdoms.get(Number(account.realm));
        if (!kingdom) continue;
        const [mine] = await kingdom.db
          .select()
          .from(user_mine)
          .where(and(eq(user_mine.uid, account.uid), eq(user_mine.fId, account.facebook)))
          .limit(1);
        if (mine) {
          const helpers: unknown = mine.helpInfo?.length
            ? JSON.parse(mine.helpInfo.toString("utf8"))
            : [];
          if (
            !Array.isArray(helpers) ||
            helpers.length > 50 ||
            helpers.some(
              (value) =>
                !value || typeof value.gUid !== "string" || !Number.isSafeInteger(value.time),
            )
          )
            throw new ChatCommandError("invalid_mine");
          friends.push({
            helped: helpers.some(
              (value) => value.gUid === owner && BigInt(value.time) >= (mine.mineTime ?? 0n),
            ),
            gUid: account.uid,
            fId: account.facebook,
            server: Number(account.realm),
            itemId: mine.itemId,
            level: mine.level,
            exp: mine.exp,
            miner: mine.miner,
            mineTime: Number(mine.mineTime ?? 0),
            call: mine.call,
          });
        }
      }
      return { friendList: friends, friends };
    }
    if (
      command !== "mine.help" ||
      typeof params.gUid !== "string" ||
      params.gUid === owner ||
      !/^[a-zA-Z0-9_-]{1,40}$/.test(params.gUid)
    )
      throw new ChatCommandError("invalid_request");
    const target = await repository.getPlayerStateById(params.gUid);
    if (
      !target?.facebookId ||
      params.server !== target.serverId ||
      !(await repository.access?.canReceive(owner, params.gUid))
    )
      throw new ChatCommandError("invalid_target");
    const kingdom = databases.kingdoms.get(target.serverId)!;
    const [mine] = await kingdom.db
      .select()
      .from(user_mine)
      .where(and(eq(user_mine.uid, params.gUid), eq(user_mine.fId, target.facebookId)))
      .limit(1);
    if (!mine || !mine.call || (mine.mineTime ?? 0n) > now) return { result: 0 };
    const [inserted] = await db
      .insert(chat_owner_command)
      .values({
        id: randomUUID(),
        actor: owner,
        operation: operationId,
        owner: params.gUid,
        realm: target.serverId,
        kind: "mine.help",
        payload: { generation: String(mine.mineTime ?? 0), name: actor.name ?? owner },
        createdAt: now,
        expiresAt: now + 86_400_000n,
      })
      .onConflictDoNothing()
      .returning();
    const saved =
      inserted ??
      (
        await db
          .select()
          .from(chat_owner_command)
          .where(
            and(eq(chat_owner_command.actor, owner), eq(chat_owner_command.operation, operationId)),
          )
          .limit(1)
      )[0];
    if (!saved || saved.owner !== params.gUid || saved.realm !== target.serverId)
      throw new ChatCommandError("conflicting_request");
    return { result: 1, pending: saved.processedAt === null, id: saved.id };
  };
}
