import { expect, spyOn, test } from "bun:test";
import { EventEmitter } from "node:events";
import type { Socket } from "node:net";
import { createHash } from "node:crypto";
import { createSessionHandler, type ConnectionState } from "@opencok/connection/session";
import type { ServerDependencies } from "@opencok/connection/dependencies";
import { initializeLogging } from "@opencok/core/logging";
import { frame } from "@opencok/messages/frame";
import { envelope, extension, sfs } from "@opencok/messages/sfs";

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
  const socket = new TestSocket();
  const state: ConnectionState = {
    sockets: new Set(),
    inFlight: new Set(),
    metrics: { userId: 0, rejected: 0, commands: 0 },
    ready: () => true,
  };
  const dependencies: ServerDependencies = {
    db: {
      playerSummaries: async () => [],
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
      power: async () => {
        throw new Error("unused");
      },
      configuration: async () => {
        throw new Error("unused");
      },
      start: async () => {},
      health: async () => {},
      close: async () => {},
      profile: async () => ({
        uid: "private-player",
        deviceUuid: "private-device",
        pf: "Google",
        banTime: 0n,
        banFlag: 0,
      }),
      accounts: async () => [{ active: 0, server: "2", uuid: "private-device" }],
      city: async () => {
        throw new Error("unused");
      },
      world: async () => ({ world: undefined, points: [], hasMarches: false }),
    },
    cache: {
      command: async () => "PONG",
      claim: async () => true,
      refresh: async () => true,
      release: async () => {},
    },
    coordination: { ready: true, start: async () => {}, close: () => {} },
    game: {
      initial: async () => ({}),
      execute: async (_uid, command) => {
        if (command !== "cmd.ping") throw new Error("private-database-password");
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
      extension("private-unknown-command", { password: sfs.string("private-payload") }),
      extension("private-unknown-command", {}),
    ];
    socket.emit("data", Buffer.concat(packets.map(frame)));
    while (state.inFlight.size) await Promise.all(state.inFlight);
    const completed = records.filter((record) => record.event === "command_completed");
    expect(completed.map((record) => record.outcome)).toEqual(["success", "failure", "failure"]);
    expect(records.filter((record) => record.event === "command_rejected")).toHaveLength(2);
    expect(records.find((record) => record.event === "login_accepted")).toMatchObject({
      outcome: "success",
      level: "info",
    });
    expect(new Set(records.map((record) => record.connectionId)).size).toBe(1);
    expect(new Set(completed.map((record) => record.operationId)).size).toBe(3);
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
    while (state.inFlight.size) await Promise.all(state.inFlight);
    spies.forEach((spy) => spy.mockRestore());
  }
});
