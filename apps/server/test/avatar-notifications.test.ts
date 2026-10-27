import { expect, test } from "bun:test";
import { EventEmitter } from "node:events";
import { createHash } from "node:crypto";
import type { Socket } from "node:net";
import { createSessionHandler } from "@opencok/connection/session";
import { createRealmNotifications } from "@opencok/connection/notifications";
import type { ServerDependencies } from "@opencok/connection/dependencies";
import { frame, FrameReader } from "@opencok/messages/frame";
import { envelope, extension, fields, sfs, type Fields } from "@opencok/messages/sfs";

class MemoryConnection extends EventEmitter {
  destroyed = false;
  writableLength = 0;
  packets: Fields[] = [];
  write(bytes: Buffer) {
    this.packets.push(...new FrameReader().feed(bytes));
    return true;
  }
  destroy() {
    if (!this.destroyed) {
      this.destroyed = true;
      this.emit("close");
    }
    return this;
  }
  setTimeout() {
    return this;
  }
  setNoDelay() {
    return this;
  }
  pause() {
    return this;
  }
  resume() {
    return this;
  }
}
function fixture() {
  const notifications = createRealmNotifications();
  let refresh = true,
    ready = true;
  let gate: Promise<boolean> | undefined;
  const calls: string[] = [];
  const state = {
    sockets: new Set<Socket>(),
    inFlight: new Set<Promise<void>>(),
    metrics: { userId: 0, rejected: 0, commands: 0 },
    ready: () => ready,
  };
  const dependencies = {
    notifications,
    db: {
      getProfileById: async () => ({
        uid: "1001",
        deviceUuid: "synthetic",
        pf: "Google",
        banTime: 0n,
        banFlag: 0,
      }),
      getAccountsByPlayerId: async () => [{ server: 1, active: 0, uuid: "synthetic" }],
    },
    cache: {
      claim: async () => true,
      release: async () => {},
      refresh: async () => {
        calls.push("refresh");
        return gate ?? refresh;
      },
    },
    game: {
      initialize: async () => ({ body: {}, pushes: [] }),
      execute: async () => ({ body: {}, pushes: [] }),
    },
    world: { get: async () => ({}) },
  } as unknown as ServerDependencies;
  const handle = createSessionHandler(
    { host: "unused", port: 0, healthPort: 0, kingdomId: 1, loginSecret: "synthetic-secret" },
    dependencies,
    state,
  );
  const connect = () => {
    const socket = new MemoryConnection();
    handle(socket as unknown as Socket);
    return socket;
  };
  const drain = async () => {
    while (state.inFlight.size) await Promise.allSettled(state.inFlight);
  };
  const login = async (socket: MemoryConnection) => {
    socket.emit("data", frame(envelope(0, 0, { api: sfs.string("1.7.1") })));
    await drain();
    socket.emit(
      "data",
      frame(
        envelope(0, 1, {
          zn: sfs.string("COK1"),
          un: sfs.string("1001"),
          p: sfs.object({
            gameUid: sfs.string("1001"),
            cmdBaseTime: sfs.string("synthetic-time"),
            uuid: sfs.string("synthetic"),
            pf: sfs.string("Google"),
            appVersion: sfs.string("12.06.0"),
            SecurityCode: sfs.string(
              createHash("md5")
                .update("synthetic-time" + "synthetic-secret" + "1001")
                .digest("hex"),
            ),
          }),
        }),
      ),
    );
    await drain();
  };
  return {
    notifications,
    connect,
    login,
    drain,
    state,
    calls,
    setReady(value: boolean) {
      ready = value;
    },
    setRefresh(value: boolean) {
      refresh = value;
    },
    setGate(value?: Promise<boolean>) {
      gate = value;
    },
  };
}

test("native login receives hero bundle metadata before the init extension", async () => {
  const f = fixture();
  const socket = f.connect();
  await f.login(socket);
  expect(socket.packets[1]).toEqual(
    envelope(0, 1, {
      id: sfs.int(1),
      zn: sfs.string("COK1"),
      un: sfs.string("1001"),
      rs: sfs.short(0),
      pi: sfs.short(0),
      rl: sfs.array(),
      p: sfs.object({
        use: sfs.int(0),
        newHeroVersion: sfs.string("1.0.94"),
        newHeroMd5Android: sfs.string("cf7be0a136aebb4dd22b40ae320bcd13"),
      }),
    }),
  );
  expect(socket.packets[2]).toEqual(extension("init", {}));
  socket.destroy();
  await f.drain();
});

test("mail notifications require initialization, current session ownership and readiness without sockets", async () => {
  const f = fixture(),
    socket = f.connect(),
    body = { uid: sfs.string("synthetic-mail") };
  expect(await f.notifications.publish("1001", "push.mail", body)).toBe(false);
  expect(socket.packets).toEqual([]);
  await f.login(socket);
  expect(f.state.metrics.userId).toBe(1);
  expect(await f.notifications.publish("1001", "push.mail", body)).toBe(true);
  expect(socket.packets.at(-1)).toEqual(extension("push.mail", body));
  expect(await f.notifications.publish("other", "push.mail", body)).toBe(false);
  f.setRefresh(false);
  const count = socket.packets.length;
  expect(await f.notifications.publish("1001", "push.mail", body)).toBe(false);
  expect(socket.packets).toHaveLength(count);
  f.setRefresh(true);
  f.setReady(false);
  expect(await f.notifications.publish("1001", "push.mail", body)).toBe(false);
  socket.destroy();
  await f.drain();
  expect(await f.notifications.publish("1001", "push.mail", body)).toBe(false);
});

test("session replacement and disconnect during ownership checks cannot receive a late mail push", async () => {
  const f = fixture(),
    first = f.connect();
  await f.login(first);
  let release!: (value: boolean) => void;
  f.setGate(
    new Promise((resolve) => {
      release = resolve;
    }),
  );
  const pending = f.notifications.publish("1001", "push.mail", { uid: sfs.string("old") });
  const second = f.connect();
  await f.login(second);
  expect(first.destroyed).toBe(true);
  release(true);
  expect(await pending).toBe(false);
  f.setGate();
  expect(await f.notifications.publish("1001", "push.mail", { uid: sfs.string("new") })).toBe(true);
  expect(fields(fields(second.packets.at(-1)!.p).p).uid).toEqual(sfs.string("new"));
  expect(first.packets.some((packet) => fields(packet.p).c?.value === "push.mail")).toBe(false);
  second.destroy();
  await f.drain();
});

test("aborting a notification during the session ownership check prevents a late packet", async () => {
  const f = fixture(),
    socket = f.connect();
  await f.login(socket);
  const before = socket.packets.length;
  const gate = Promise.withResolvers<boolean>();
  f.setGate(gate.promise);
  const controller = new AbortController();
  const pending = f.notifications.publish(
    "1001",
    "push.mobile.gold.change",
    { freeGold: sfs.long(7n) },
    controller.signal,
  );
  controller.abort();
  gate.resolve(true);
  expect(await pending).toBe(false);
  expect(socket.packets).toHaveLength(before);
  expect(
    await f.notifications.publish("1001", "push.mobile.gold.change", {}, controller.signal),
  ).toBe(false);
  expect(socket.packets).toHaveLength(before);
  f.setGate();
  expect(
    await f.notifications.publish("1001", "push.mobile.gold.change", { freeGold: sfs.long(9n) }),
  ).toBe(true);
  expect(socket.packets.at(-1)).toEqual(
    extension("push.mobile.gold.change", { freeGold: sfs.long(9n) }),
  );
  socket.destroy();
  await f.drain();
});
