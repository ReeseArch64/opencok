import { test, expect } from "bun:test";
import {
  castleEventShard,
  castleEventMailWindow,
  castleEventOpen,
} from "@opencok/rules/castle-level-event";
import { Rules } from "@opencok/rules/game";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs } from "@opencok/messages/sfs";
test("castle entitlements preserve numeric sharding and bound automatic mail to the native realm age", () => {
  expect(castleEventShard("12000000")).toBe(0);
  expect(castleEventShard("13000000")).toBe(1);
  expect([0, 1]).toContain(castleEventShard("763aa429-3408-4c85-b728-0208ecee5977"));
  const rule = { activity_Type: "1;90|2;90" },
    opened = 1000n,
    end = opened + 90n * 86400000n;
  expect(castleEventMailWindow(rule, opened, end)).toBe(true);
  expect(castleEventMailWindow(rule, opened, end + 1n)).toBe(false);
  expect(castleEventMailWindow(rule, opened, opened - 1n)).toBe(false);
  const rules = new Rules(new Map(), new Map(), new Map());
  expect(castleEventOpen(rules, { kingdomId: 1, version: "12.06.0", now: 0 })).toBe(false);
});
test("castle actions retain native correlation and recovery commands remain internal", async () => {
  const game = new GameService(
    {} as GameStore,
    new Rules(new Map(), new Map(), new Map()),
    { kingdomId: 1 },
    () => 1000,
    { cityProgression: async () => ({ body: {}, pushes: [] }) },
  );
  for (const command of ["castle.ui.state", "castle.level.reward", "castle.share.reward"])
    {expect(
      (await game.execute("owner", command, { _cok_: sfs.long(9007199254740993n) })).body._cok_,
    ).toEqual(sfs.long(9007199254740993n));}
  await expect(game.execute("owner", "castle.event.init", {})).rejects.toThrow();
});
