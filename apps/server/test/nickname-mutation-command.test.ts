import { expect, test } from "bun:test";
import type { GameServices, GameStore } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import { GameService } from "@opencok/services/game";
import { Rules } from "@opencok/rules/game";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { containsReservedNickname } from "@opencok/resources/nickname-reserved";
import oracle from "./fixtures/nickname-reserved-vectors.json";
import { reservedNicknameText, reservedNicknamePattern } from "@opencok/rules/nickname-reserved";

const operationId = "9e2e3153-a297-4cb0-9024-4323d647c937";
function fixture() {
  const calls: string[] = [];
  let profile: Row | undefined = { uid: "self", serverId: 1, banTime: 0n, banFlag: 0 };
  let forbidden = false;
  const services: GameServices = {
    nicknameForbidden: async (name) => {
      calls.push(`reserved:${name}`);
      return forbidden;
    },
    nicknameBadWords: async (name) => {
      calls.push(`words:${name}`);
      return false;
    },
    nicknameChange: async (owner, id, name, now) => {
      calls.push(`change:${owner}:${id}:${name}:${now}`);
      return {
        operationId: id,
        ownerUid: owner,
        newName: name,
        previousName: "Old",
        state: "committed",
        payment: "",
        responseGold: 9007199254740993n,
        failureCode: null,
        pendingEffects: 0,
        notificationStage: 1,
        createdAt: 1000n,
        updatedAt: 1000n,
      };
    },
  };
  const db = { getProfileById: async () => profile } as unknown as GameStore;
  const game = new GameService(
    db,
    new Rules(new Map(), new Map(), new Map()),
    { kingdomId: 1 },
    () => 1000,
    services,
  );
  return {
    calls,
    services,
    setProfile: (row: Row | undefined) => (profile = row),
    block: () => (forbidden = true),
    run: (params: Fields) => game.execute("self", "user.modify.nickName", params),
  };
}
test("authenticated rename validates in source order and preserves exact reply and correlation", async () => {
  const f = fixture();
  const result = await f.run({
    nickName: sfs.string("  New\\nName  "),
    operationId: sfs.string(operationId),
    _cok_: sfs.long(7n),
  });
  expect(f.calls).toEqual([
    "reserved:New Name",
    "words:  New Name  ",
    `change:self:${operationId}:New Name:1000`,
  ]);
  expect(result.body).toEqual({
    gold: sfs.long(9007199254740993n),
    status: sfs.bool(true),
    _cok_: sfs.long(7n),
  });
});
test("missing, banned and foreign principals cannot invoke filters or payment", async () => {
  for (const profile of [
    undefined,
    { uid: "foreign", serverId: 1 },
    { uid: "self", serverId: 2 },
    { uid: "self", serverId: 1, banFlag: 1 },
    { uid: "self", serverId: 1, banTime: 1001n },
  ]) {
    const f = fixture();
    f.setProfile(profile as Row | undefined);
    await expect(f.run({ nickName: sfs.string("New Name") })).rejects.toThrow();
    expect(f.calls).toEqual([]);
  }
});
test("malformed operation IDs, incomplete runtime and reserved names fail before charging", async () => {
  const f = fixture();
  await expect(
    f.run({ nickName: sfs.string("New Name"), operationId: sfs.string("bad") }),
  ).rejects.toThrow();
  expect(f.calls).toEqual([]);
  f.block();
  await expect(f.run({ nickName: sfs.string("New Name") })).rejects.toThrow("105251");
  expect(f.calls).toEqual(["reserved:New Name"]);
  delete f.services.nicknameChange;
  await expect(f.run({ nickName: sfs.string("New Name") })).rejects.toThrow("102192");
});
test("reserved-name normalization precedes bounded matching with Java quoting and whitespace", async () => {
  expect(reservedNicknameText("  ＡＤＭＩＮ　 User  ")).toBe("admin  user");
  expect(await containsReservedNickname(" ＧＭ Team ", ["^gm\\s+team$"])).toBe(true);
  await expect(
    containsReservedNickname("Literal.+", ["\\QLiteral.+\\E".toLowerCase()]),
  ).rejects.toThrow();
  expect(await containsReservedNickname("Literal.+", ["\\Qliteral.+\\E"])).toBe(true);
  expect(await containsReservedNickname("Nobody", ["admin|moderator"])).toBe(false);
  await expect(containsReservedNickname("Anything", ["["])).rejects.toThrow();
  await expect(containsReservedNickname("Anything", ["a++"])).rejects.toThrow();
});
test("pathological reserved patterns cannot block the realm event loop", async () => {
  const started = Date.now();
  let ticked = false;
  const tick = setTimeout(() => {
    ticked = true;
  }, 10);
  try {
    expect(await containsReservedNickname("a".repeat(20000) + "!", ["^(a+)+$"])).toBe(false);
  } catch (error) {
    expect(String(error)).toContain("deadline");
  } finally {
    clearTimeout(tick);
  }
  expect(ticked).toBe(true);
  expect(Date.now() - started).toBeLessThan(4000);
}, 5000);

test("reserved regex translation agrees with independent Java 8 pattern vectors", () => {
  for (const row of oracle) {
    const compiled = reservedNicknamePattern(row.pattern);
    expect({
      pattern: row.pattern,
      text: row.text,
      matched: new RegExp(compiled.pattern, compiled.flags).test(row.text),
    }).toEqual({ pattern: row.pattern, text: row.text, matched: row.expected });
  }
});
