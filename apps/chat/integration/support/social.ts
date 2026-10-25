import { ChatNoticeService } from "@opencok/services/chat-notice";
import { createInventoryExecutor } from "@opencok/repositories/inventory";
import { createChatNoticeCostReader } from "@opencok/repositories/chat-notice-cost";
import { relayMutationEvent } from "@opencok/repositories/mutation";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { expect } from "bun:test";
import { randomUUID, createHash } from "node:crypto";
import { WebSocket } from "ws";
import { once } from "node:events";
import { startChatProcess } from "./process";
import { createRealmSocialExecutor } from "@opencok/connection/realm-social";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { createFriendshipMineExecutor } from "@opencok/repositories/friendship-mine";
import { FriendshipMineService } from "@opencok/services/friendship-mine";
import { initialFriendshipMine } from "@opencok/rules/reconnect-mine";
import { loadRules } from "@opencok/resources/rules";
import { user_mine } from "@opencok/drizzle/schema/opencok_kingdom/user_mine";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { eq } from "drizzle-orm";
import { sfs, str, fields, type Value, type Fields } from "@opencok/messages/sfs";
import type { createDatabases } from "@opencok/drizzle";
import type { createChatRepository } from "@opencok/repositories/chat";

export async function verifySocialTransports(
  first: ReturnType<typeof createChatRepository>,
  databaseUrl: string,
  databases: ReturnType<typeof createDatabases>,
) {
  const apps: Awaited<ReturnType<typeof startChatProcess>>[] = [];
  const sockets: WebSocket[] = [];
  try {
    for (let index = 0; index < 2; index++) apps.push(await startChatProcess(index, databaseUrl));
    const urls = apps.map((app) => app.url);
    const clients = [];
    for (const [index, uid] of ["alice", "bob"].entries()) {
      const token = Buffer.alloc(32, index + 19).toString("base64url");
      await first.sessions.create({
        tokenHash: createHash("sha256").update(token).digest(),
        uid,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 86_400_000),
      });
      const socket = new WebSocket(`${urls[index]!.replace("http:", "ws:")}/chat/ws`, {
        headers: { uid, session: token },
      });
      sockets.push(socket);
      socket.on("error", () => {});
      const frames: {
        cmd: string;
        data?: Record<string, unknown>;
        result?: Record<string, unknown>;
        sendTime?: number;
        error?: unknown;
      }[] = [];
      socket.on("message", (raw) => {
        frames.push(JSON.parse(raw.toString()));
      });
      await once(socket, "open");
      let counter = Date.now();
      const wait = async (predicate: () => boolean) => {
        for (let attempt = 0; attempt < 300; attempt++) {
          if (predicate()) return;
          await Bun.sleep(10);
        }
        throw new Error("Chat frame timed out");
      };
      const send = async (cmd: string, params: Record<string, unknown>, sendTime = ++counter) => {
        const start = frames.length;
        socket.send(JSON.stringify({ cmd, params, sendTime }));
        await wait(() =>
          frames.slice(start).some((frame) => frame.cmd === cmd && frame.sendTime === sendTime),
        );
        const reply = frames
          .slice(start)
          .find((frame) => frame.cmd === cmd && frame.sendTime === sendTime)!;
        return { reply, sendTime };
      };
      clients.push({ frames, send, wait });
    }
    const alice = clients[0]!,
      bob = clients[1]!;
    for (const client of clients)
      expect(
        (await client.send("room.joinMulti", { rooms: [{ group: "global", id: "global_public" }] }))
          .reply.error,
      ).toBeUndefined();
    const sent = await alice.send("chat.room", {
      roomId: "global_public",
      msg: "Across two chat instances",
    });
    expect(sent.reply.error).toBeUndefined();
    await apps[1]!.runDistribution();
    await bob.wait(() =>
      bob.frames.some((frame) => frame.data?.msg === "Across two chat instances"),
    );
    const replay = await alice.send(
      "chat.room",
      { roomId: "global_public", msg: "Across two chat instances" },
      sent.sendTime,
    );
    expect(replay.reply.result?.seqId).toBe(sent.reply.result?.seqId);
    await apps[1]!.runDistribution();
    expect(
      bob.frames.filter((frame) => frame.data?.msg === "Across two chat instances"),
    ).toHaveLength(1);
    const authority1 = await acquireRealmAuthority(databases.getKingdom(1).db, 1, () => true);
    const authority = await acquireRealmAuthority(databases.getKingdom(2).db, 2, () => true);
    const realm1 = createRealmSocialExecutor({
      url: `${urls[0]}/external/session`,
      signingSecret: "synthetic-social-secret",
      realm: 1,
      timeoutMs: 3000,
      authority: authority1,
    });
    const realm2 = createRealmSocialExecutor({
      url: `${urls[0]}/external/session`,
      signingSecret: "synthetic-social-secret",
      realm: 2,
      timeoutMs: 3000,
      authority,
    });
    await expect(realm2("alice", "chat.shield.list", {})).rejects.toThrow();
    expect(
      (
        await fetch(`${urls[0]}/_internal/social`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: "{}",
        })
      ).status,
    ).toBe(403);
    await realm2("bob", "chat.lock", { uid: sfs.string("alice") });
    await alice.send("chat.room", { roomId: "global_public", msg: "Blocked delivery" });
    await apps[1]!.runDistribution();
    const history = await bob.send("history.cursor", {
      roomId: "global_public",
      before: 0,
      archive: false,
    });
    expect(history.reply.result?.msgs).toEqual([]);
    expect(bob.frames.some((frame) => frame.data?.msg === "Blocked delivery")).toBe(false);
    await realm2("bob", "chat.unlock", { uuid: sfs.string("alice") });
    const room = (await alice.send("chat.room.mk", { name: "Live friends", members: ["bob"] }))
      .reply.result!;
    const roomId = String(room.roomId);
    for (const client of clients)
      expect(
        (await client.send("room.joinMulti", { rooms: [{ group: "private", id: roomId }] })).reply
          .error,
      ).toBeUndefined();
    await alice.send("chat.room", { roomId, msg: "Private live message" });
    await apps[1]!.runDistribution();
    await bob.wait(() => bob.frames.some((frame) => frame.data?.msg === "Private live message"));
    await alice.send("chat.room.member.kick", { id: roomId, members: ["bob"] });
    await alice.send("chat.room", { roomId, msg: "After membership revocation" });
    await apps[1]!.runDistribution();
    expect(
      (await bob.send("history.cursor", { roomId, before: 0, archive: false })).reply.error,
    ).toBeDefined();
    expect(bob.frames.some((frame) => frame.data?.msg === "After membership revocation")).toBe(
      false,
    );

    const dm = await realm1("alice", "chat.private", {
      uid: sfs.string("bob"),
      msg: sfs.string("Native delivery"),
      operationId: sfs.string(randomUUID()),
    });
    expect(str(dm, "id")).not.toBe("");
    const identity = {
      token: sfs.string(authority.instance),
      epoch: sfs.string(String(authority.epoch)),
    };
    let found = false;
    for (let attempt = 0; attempt < 10; attempt++) {
      const batch = await realm2("realm-2", "realm.events.poll", {
        ...identity,
        owners: sfs.array([sfs.string("bob")]),
      });
      const deliveries = batch.deliveries?.value as Value[];
      found ||= deliveries.some((entry) => {
        const data = fields(entry);
        return fields(data.data).msg?.value === "Native delivery";
      });
      const cursor = str(batch, "cursor");
      if (cursor)
        await realm2("realm-2", "realm.events.ack", { ...identity, cursor: sfs.string(cursor) });
      if (found) break;
    }
    expect(found).toBe(true);
    for (const uid of ["alice", "bob"])
      await databases.global.db
        .update(account_new)
        .set({ facebookAccount: `facebook-${uid}` })
        .where(eq(account_new.gameUid, uid));
    await databases.getKingdom(2).db.insert(user_resource).values({
      uid: "bob",
      wood: 0n,
      food: 0n,
      stone: 0n,
      iron: 0n,
      silver: 0,
      chip: 0,
      diamond: 0,
      dragon_food: 0,
      dragon_gold: 0,
      lastUpdateTime: 0n,
    });
    await databases.getKingdom(2).db.insert(user_mine).values({
      uid: "bob",
      fId: "facebook-bob",
      itemId: 44200,
      level: 1,
      exp: 0,
      miner: 0,
      mineTime: 0n,
      call: 1,
    });
    const helpKey = randomUUID(),
      helpParams = {
        gUid: sfs.string("bob"),
        server: sfs.int(2),
        operationId: sfs.string(helpKey),
        fbName: sfs.string("Forged name"),
      };
    const queued = await realm1("alice", "mine.help", helpParams);
    expect(str(await realm1("alice", "mine.help", helpParams), "id")).toBe(str(queued, "id"));
    const pending = await realm2("realm-2", "mine.inbox.poll", {});
    const commands = pending.commands?.value as Value[];
    expect(commands).toHaveLength(1);
    const data = fields(commands[0]);
    expect(str(data, "name")).toBe("alice");
    const rules = await loadRules();
    const mine = new FriendshipMineService(
      createFriendshipMineExecutor(
        { kingdom: databases.getKingdom(2), databases: { global: databases.global } },
        authority,
        () => initialFriendshipMine(rules),
      ),
      rules,
      { world: async () => new Map(), emperor: async () => null },
    );
    const incoming: Fields = {
      actor: data.actor!,
      generation: data.generation!,
      name: data.name!,
      operationId: data.id!,
    };
    expect(
      (await mine.command("bob", "mine.receive.help", incoming, true)).body.result?.value,
    ).toBe(1);
    await realm2("bob", "mine.inbox.ack", { id: data.id! });
    expect((await realm2("realm-2", "mine.inbox.poll", {})).commands?.value).toEqual([]);
    expect(
      (await databases.getKingdom(2).db.select().from(user_mine).where(eq(user_mine.uid, "bob")))[0]
        ?.miner,
    ).toBe(1);
    const realmDb = databases.getKingdom(1).db;
    await realmDb.insert(user_resource).values({
      uid: "alice",
      wood: 0n,
      food: 0n,
      stone: 0n,
      iron: 0n,
      silver: 0,
      chip: 0,
      diamond: 0,
      dragon_food: 0,
      dragon_gold: 0,
      lastUpdateTime: 0n,
    });
    await realmDb
      .insert(user_item)
      .values({ uuid: "alice-notices", ownerId: "alice", itemId: "200011", count: 2, value: 0 });
    const economyEffects = {
      world: async () => new Map<number, number>(),
      emperor: async () => null,
    };
    const notices = new ChatNoticeService(
      createInventoryExecutor(realmDb, authority1),
      rules,
      economyEffects,
      Date.now,
      async (owner) => {
        await realm1(owner, "chat.notice.authorize", {});
      },
      createChatNoticeCostReader(realmDb, 1),
    );
    const paidKey = randomUUID();
    await notices.command("alice", "chat.notice", {
      operationId: sfs.string(paidKey),
      itemId: sfs.string("200011"),
      msg: sfs.string("Native paid notice"),
      usePoint: sfs.int(0),
    });
    const published = await realm1("alice", "chat.notice.commit", {
      operationId: sfs.string(paidKey),
    });
    expect(
      (await realm1("alice", "chat.notice.commit", { operationId: sfs.string(paidKey) })).seqId,
    ).toEqual(published.seqId);
    const past = () => Date.now() - 2 * 86_400_000;
    const delayed = new ChatNoticeService(
      createInventoryExecutor(realmDb, authority1, past),
      rules,
      economyEffects,
      past,
    );
    const delayedKey = randomUUID();
    await delayed.command("alice", "chat.notice", {
      operationId: sfs.string(delayedKey),
      itemId: sfs.string("200011"),
      msg: sfs.string("Expired pending notice"),
      usePoint: sfs.int(0),
    });
    expect(
      (await realm1("alice", "chat.notice.commit", { operationId: sfs.string(delayedKey) }))
        .delivered?.value,
    ).toBe(false);
    expect(
      await relayMutationEvent(
        realmDb,
        authority1,
        async (event) => {
          const result = await realm1(event.owner, "chat.notice.commit", {
            operationId: sfs.string(event.requestId),
          });
          if (result.expired?.value === true && result.delivered?.value !== true)
            await notices.refund(event.owner, event.requestId);
        },
        Date.now,
        "social.notice",
        5000,
      ),
    ).toBe(true);
    expect(
      (await realmDb.select().from(user_item).where(eq(user_item.uuid, "alice-notices")))[0]?.count,
    ).toBe(1);
    const loggedOut = once(sockets[1]!, "close");
    await realm2("bob", "chat.logout", {});
    await apps[1]!.runDistribution();
    expect((await loggedOut)[0]).toBe(1008);
    await acquireRealmAuthority(databases.getKingdom(2).db, 2, () => true);
    await expect(realm2("bob", "chat.lock", { uid: sfs.string("alice") })).rejects.toThrow();
    await expect(
      realm2("realm-2", "realm.events.poll", {
        ...identity,
        owners: sfs.array([sfs.string("bob")]),
      }),
    ).rejects.toThrow();
    await expect(
      mine.command(
        "bob",
        "mine.receive.help",
        { ...incoming, operationId: sfs.string(randomUUID()) },
        true,
      ),
    ).rejects.toThrow();
    await apps[0]!.close();
    await first.messages.create({
      roomId: "global_public",
      senderUid: "alice",
      idempotencyKey: "after-process-restart",
      body: "Durable across process restart",
      now: new Date(),
    });
    apps[0] = await startChatProcess(0, databaseUrl);
    const recovered = new WebSocket(`${apps[0].url.replace("http:", "ws:")}/chat/ws`, {
      headers: { uid: "alice", session: Buffer.alloc(32, 19).toString("base64url") },
    });
    sockets.push(recovered);
    recovered.on("error", () => {});
    const replies: { cmd: string; result?: Record<string, unknown> }[] = [];
    recovered.on("message", (raw) => {
      replies.push(JSON.parse(raw.toString()));
    });
    await once(recovered, "open");
    const request = async (cmd: string, params: Record<string, unknown>) => {
      recovered.send(JSON.stringify({ cmd, params, sendTime: Date.now() }));
      for (let attempt = 0; attempt < 300; attempt++) {
        const result = replies.find((reply) => reply.cmd === cmd);
        if (result) return result;
        await Bun.sleep(10);
      }
      throw new Error("Restart recovery frame timed out");
    };
    await request("room.joinMulti", { rooms: [{ group: "global", id: "global_public" }] });
    expect(
      (await request("history.cursor", { roomId: "global_public", before: 0, archive: false }))
        .result?.msgs,
    ).toContainEqual(expect.objectContaining({ msg: "Durable across process restart" }));
  } finally {
    for (const socket of sockets) socket.terminate();
    for (const app of apps) await app.close();
  }
}
