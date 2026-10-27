import { expect, spyOn, test } from "bun:test";
import { EventEmitter } from "node:events";
import type { Socket } from "node:net";
import { createHash } from "node:crypto";
import { createSessionHandler, type ConnectionState } from "@opencok/connection/session";
import type { ServerDependencies } from "@opencok/connection/dependencies";
import { initializeLogging } from "@opencok/core/logging";
import { frame } from "@opencok/messages/frame";
import { envelope, extension, sfs, str } from "@opencok/messages/sfs";

class TestSocket extends EventEmitter {
  destroyed = false;
  writableLength = 0;
  setTimeout() {}
  setNoDelay() {}
  pause() {}
  resume() {}
  write() {
    return true;
  }
  destroy() {
    if (!this.destroyed) {
      this.destroyed = true;
      this.emit("close");
    }
    return this;
  }
}

test("sessions correlate successful commands and every repeated failure without logging private inputs", async () => {
  initializeLogging("server-test");
  const records: Record<string, unknown>[] = [];
  const spies = ["log", "info", "warn", "error"].map((method) =>
    spyOn(console, method as "log").mockImplementation((value) =>
      records.push(JSON.parse(String(value))),
    ),
  );
  const hotOperations: string[] = [];
  const socket = new TestSocket();
  const state: ConnectionState = {
    sockets: new Set(),
    inFlight: new Set(),
    metrics: { userId: 0, rejected: 0, commands: 0 },
    ready: () => true,
  };
  const dependencies: ServerDependencies = {
    db: {
      getPlayerSummariesByIds: async () => [],
      mailGroups: async () => {
        throw new Error("Unexpected mail groups");
      },
      mailBatch: async () => {
        throw new Error("Unexpected batch mail lookup");
      },
      mailCategory: async () => {
        throw new Error("Unexpected category lookup");
      },
      mailContents: async () => {
        throw new Error("Unexpected mail contents");
      },
      mailConversationSave: async () => {
        throw new Error("Unexpected conversation save");
      },
      mailDelete: async () => {
        throw new Error("Unexpected mailbox deletion");
      },
      mailRead: async () => {
        throw new Error("Unexpected mailbox read");
      },
      mailSave: async () => {
        throw new Error("Unexpected mailbox save");
      },
      mailStatus: async () => {
        throw new Error("Unexpected dependency call");
      },
      allianceRanking: async () => {
        throw new Error("Unexpected dependency call");
      },
      playerRanking: async () => {
        throw new Error("Unexpected ranking query");
      },
      publicProfile: async () => undefined,
      getPowerByPlayerId: async () => {
        throw new Error("unused");
      },
      getConfigurationByPlayerId: async () => {
        throw new Error("unused");
      },
      start: async () => {},
      health: async () => {},
      close: async () => {},
      getProfileById: async () => ({
        uid: "private-player",
        deviceUuid: "private-device",
        pf: "Google",
        banTime: 0n,
        banFlag: 0,
      }),
      getAccountsByPlayerId: async () => [{ active: 0, server: "2", uuid: "private-device" }],
      getCityByPlayerId: async () => {
        throw new Error("unused");
      },
      getWorldByPointIds: async () => ({ world: undefined, points: [], hasMarches: false }),
    },
    cache: {
      command: async () => "PONG",
      claim: async () => true,
      refresh: async () => true,
      release: async () => {},
    },
    coordination: { ready: true, start: async () => {}, close: () => {} },
    game: {
      initialize: async () => ({ body: {}, pushes: [] }),
      execute: async (_uid, command, params) => {
        if (command.startsWith("hot.item.")) {
          hotOperations.push(str(params, "operationId"));
          return { body: {}, pushes: [] };
        }
        if (command !== "cmd.ping") {throw new Error("private-database-password");}
        return { body: {}, pushes: [] };
      },
    },
    world: { get: async () => ({}) },
  };
  try {
    createSessionHandler(
      { host: "127.0.0.1", port: 0, healthPort: 0, kingdomId: 2, loginSecret: "private-secret" },
      dependencies,
      state,
    )(socket as unknown as Socket);
    const signature = createHash("md5").update("42private-secretprivate-player").digest("hex");
    const packets = [
      envelope(0, 0, { api: sfs.string("1.0") }),
      envelope(0, 1, {
        zn: sfs.string("COK2"),
        un: sfs.string("private-player"),
        p: sfs.object({
          gameUid: sfs.string("private-player"),
          uuid: sfs.string("private-device"),
          pf: sfs.string("Google"),
          appVersion: sfs.string("12.06.0"),
          cmdBaseTime: sfs.string("42"),
          SecurityCode: sfs.string(signature),
        }),
      }),
      extension("cmd.ping", {}),
      extension("hot.item.v2.buy", { _cok_: sfs.string("hot-repeat") }),
      extension("hot.item.v2.buy", { _cok_: sfs.string("hot-repeat") }),
      extension("hot.item.v3.buy", { _cok_: sfs.string("hot-repeat") }),
      extension("hot.item.refresh", { _cok_: sfs.int(7) }),
      extension("hot.item.refresh", { _cok_: sfs.int(7) }),
      extension("hot.item.refreshV3", { _cok_: sfs.int(7) }),
      extension("private-unknown-command", { password: sfs.string("private-payload") }),
      extension("private-unknown-command", {}),
    ];
    socket.emit("data", Buffer.concat(packets.map(frame)));
    while (state.inFlight.size) {await Promise.all(state.inFlight);}
    const completed = records.filter((record) => record.event === "command_completed");
    expect(completed.map((record) => record.outcome)).toEqual([
      ...Array(7).fill("success"),
      "failure",
      "failure",
    ]);
    expect(hotOperations).toHaveLength(6);
    expect(hotOperations[0]).toBe(hotOperations[1]);
    expect(hotOperations[2]).not.toBe(hotOperations[0]);
    expect(hotOperations[3]).toBe(hotOperations[4]);
    expect(hotOperations[5]).not.toBe(hotOperations[3]);
    expect(records.filter((record) => record.event === "command_rejected")).toHaveLength(2);
    expect(records.find((record) => record.event === "login_accepted")).toMatchObject({
      outcome: "success",
      level: "info",
    });
    expect(new Set(records.map((record) => record.connectionId)).size).toBe(1);
    expect(new Set(completed.map((record) => record.operationId)).size).toBe(9);
    expect(completed.every((record) => typeof record.durationMs === "number")).toBe(true);
    socket.emit("data", Buffer.from([0, 0, 0]));
    expect(records.find((record) => record.event === "frame_rejected")).toMatchObject({
      level: "warn",
      reason: "invalid_frame",
    });
    expect(JSON.stringify(records)).not.toContain("private-");
    expect(JSON.stringify(records)).not.toContain(signature);
  } finally {
    socket.destroy();
    while (state.inFlight.size) {await Promise.all(state.inFlight);}
    spies.forEach((spy) => spy.mockRestore());
  }
});
