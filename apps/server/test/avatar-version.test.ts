import { expect, test } from "bun:test";
import { errors } from "@opencok/constants/game";
import type { GameStore } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import type { AvatarVersionIntent } from "@opencok/contracts/avatar-version";
import { createAvatarVersion } from "@opencok/services/avatar-version";
import { GameService as Game } from "@opencok/services/game";
import { Rules } from "@opencok/rules/game";
import { avatarVersionMail } from "@opencok/rules/avatar-version";
import { decode, encode, sfs, type Fields } from "@opencok/messages/sfs";

const now = 1792756800123;
function fixture(mode = "1") {
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.items.set("function_on5", { k2: mode });
  rules.items.set("hero", { k9: "10", k7: "60" });
  rules.mail.set("10111", { title: "Captured title", message: "Captured body", type: "2" });
  const profile: Row = {
    uid: "1001",
    serverId: 1,
    name: "Synthetic",
    pf: "synthetic",
    picVer: 1000004,
  };
  let level = 10;
  let record: Row | undefined;
  let intent: AvatarVersionIntent | undefined;
  let beforeInspect = () => {};
  const operations: string[] = [],
    calls: string[] = [],
    reports: string[] = [];
  let failure = "";
  const service = createAvatarVersion({
    rules,
    kingdomId: 1,
    async commit(owner, operationId, time, inspect) {
      expect(owner).toBe("1001");
      expect(time).toBe(now);
      operations.push(operationId);
      beforeInspect();
      const plan = await inspect(profile, {
        async castleLevel() {
          calls.push("castle");
          return level;
        },
        async uploadRecord() {
          calls.push("record");
          return record;
        },
      });
      calls.push("persist");
      intent = { operationId, ownerUid: owner, committedAt: BigInt(time), ...plan };
      profile.picVer = plan.picVer;
      return { profile: { ...profile }, intent };
    },
    async mail() {
      calls.push("mail");
      if (failure === "mail") throw new Error("Synthetic mail failure");
      return {
        profile,
        ...(intent!.pendingEffects & 1 ? { mail: avatarVersionMail(intent!) } : {}),
      };
    },
    async profile() {
      calls.push("profile");
      if (failure === "profile") throw new Error("Synthetic marker failure");
    },
    async chat() {
      calls.push("chat");
      if (failure === "chat") throw new Error("Synthetic chat failure");
    },
    async notify(owner, command) {
      calls.push("notify");
      expect(owner).toBe("1001");
      expect(command).toBe("push.mail");
      if (failure === "notification") throw new Error("Synthetic disconnect");
    },
    report(effect) {
      reports.push(effect);
    },
  });
  const game = new Game({} as GameStore, rules, { kingdomId: 1 }, () => now, {
    avatarVersion: service,
  });
  return {
    rules,
    profile,
    operations,
    calls,
    reports,
    service,
    intent: () => intent,
    level: (value: number) => {
      level = value;
    },
    record: (value: Row | undefined) => {
      record = value;
    },
    fail: (value: string) => {
      failure = value;
    },
    beforeInspect: (run: () => void) => {
      beforeInspect = run;
    },
    run: (params: Fields = {}) => game.execute("1001", "user.update.picVer", params),
  };
}

test("avatar allocation ignores caller versions, captures configuration and preserves typed correlation", async () => {
  const f = fixture();
  f.beforeInspect(() => f.rules.mail.set("10111", { title: "Changed" }));
  const result = await f.run({
    uid: sfs.string("other"),
    picVer: sfs.int(999999),
    _cok_: sfs.string("request"),
    cmdBaseTime: sfs.long(9007199254740993n),
  });
  expect(decode(encode(result.body))).toEqual({
    uid: sfs.string("1001"),
    picVer: sfs.int(5),
    nextUpdateTime: sfs.long(now + 60000),
    _cok_: sfs.string("request"),
    cmdBaseTime: sfs.long(9007199254740993n),
  });
  expect(result.pushes).toEqual([]);
  expect(f.calls).toEqual(["castle", "record", "persist", "mail", "notify", "profile", "chat"]);
  expect(JSON.parse(f.intent()!.effects).mail.title).toBe("Captured title");
  expect(f.intent()!.pendingEffects).toBe(7);
  expect(f.operations[0]).toMatch(/^[a-f0-9]{32}$/);
  expect(f.intent()).not.toHaveProperty("hash");
  expect(f.intent()).not.toHaveProperty("receipt");
});

test("unmoderated avatar allocations skip unused checks and retain distinct incoming-request increments", async () => {
  const f = fixture("0");
  f.rules.items.delete("hero");
  f.level(0);
  f.record({ uid: "other", banTime: BigInt(now + 1) });
  for (const picVer of [2000005, 2000006]) {
    const result = await f.run();
    expect(result.body).toEqual({ uid: sfs.string("1001"), picVer: sfs.int(picVer) });
    expect(f.intent()!.pendingEffects).toBe(6);
  }
  expect(f.calls).not.toContain("castle");
  expect(f.calls).not.toContain("record");
  expect(new Set(f.operations).size).toBe(2);
});

test("avatar allocation preserves signed-long interval multiplication in its deadline", async () => {
  const f = fixture();
  f.rules.items.set("hero", { k9: "10", k7: "9223372036854775807" });
  expect((await f.run()).body.nextUpdateTime).toEqual(sfs.long(now - 1000));
  expect(f.intent()!.nextUpdateTime).toBe(BigInt(now - 1000));
});

test("avatar allocation remains unavailable without the configured runtime provider", async () => {
  const game = new Game({} as GameStore, new Rules(new Map(), new Map(), new Map()), {
    kingdomId: 1,
  });
  await expect(game.execute("1001", "user.update.picVer", {})).rejects.toMatchObject({
    code: "102192",
  });
});

test("avatar level, interval, cooldown, report and unsupported-version failures precede persistence", async () => {
  const low = fixture();
  low.level(9);
  await expect(low.run()).rejects.toThrow();
  expect(low.calls).toEqual(["castle"]);
  const interval = fixture();
  interval.rules.items.set("hero", { k9: "10", k7: "invalid" });
  await expect(interval.run()).rejects.toThrow();
  expect(interval.calls).toEqual(["castle"]);
  const cooldown = fixture();
  cooldown.record({ uid: "1001", updateTime: BigInt(now - 59999), banTime: BigInt(now + 1) });
  await expect(cooldown.run()).rejects.toThrow(errors.avatarCooldown);
  expect(cooldown.calls).toEqual(["castle", "record"]);
  const reported = fixture();
  reported.record({ uid: "1001", updateTime: BigInt(now - 60000), banTime: BigInt(now + 1) });
  await expect(reported.run()).rejects.toThrow(errors.avatarReported);
  for (const value of [-2147483649, null, 2147483648]) {
    const f = fixture("0");
    f.profile.picVer = value;
    await expect(f.run()).rejects.toThrow();
    expect(f.calls).toEqual([]);
    expect(f.intent()).toBeUndefined();
  }
});

test("allocation delivery failures remain independent and preserve a successful persisted reply", async () => {
  for (const failure of ["mail", "profile", "chat", "notification"]) {
    const f = fixture();
    f.fail(failure);
    expect((await f.run()).body.picVer).toEqual(sfs.int(5));
    expect(f.reports).toEqual([failure]);
    expect(f.calls).toContain("profile");
    expect(f.calls).toContain("chat");
  }
});
