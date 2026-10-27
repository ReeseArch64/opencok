import { test, expect } from "bun:test";
import { rechargeActivityWindow } from "@opencok/rules/recharge-activity";
import { rechargeActivityLogin } from "@opencok/mappings/recharge-activity";
import { Rules } from "@opencok/rules/game";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs, encode, decode } from "@opencok/messages/sfs";
test("recharge periods retain exact inclusive UTC boundaries, realm ages and native long totals", () => {
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.configuration.payControl = new Map([
    ["69023", { k1: "1.0.0", k2: "all", k5: "1", k6: "2" }],
  ]);
  const opened = 1000n,
    end = opened + 2n * 86400000n,
    context = { kingdomId: 1, version: "12.06.0", now: Number(end) };
  expect(rechargeActivityWindow(rules, opened, context)?.active).toBe(true);
  expect(rechargeActivityWindow(rules, opened, { ...context, now: Number(end + 1n) })?.active).toBe(
    false,
  );
  expect(rechargeActivityWindow(rules, opened, { ...context, now: 999 })?.active).toBe(false);
  const control = rules.configuration.payControl.get("69023")!;
  Object.assign(control, { k5: "0", k7: "2026-10-25-00-00", k8: "2026-10-26-00-00" });
  expect(
    rechargeActivityWindow(rules, 0n, { ...context, now: Date.UTC(2026, 9, 26) })?.active,
  ).toBe(true);
  control.k8 = "2026-02-30-00-00";
  expect(rechargeActivityWindow(rules, 0n, context)).toBeUndefined();
  const mapped = rechargeActivityLogin({
    newSerCumRechargeTotal: 9007199254740993n,
    newSerCumVersion: "1.0.0",
    newSerCumServerList: "all",
  });
  expect(decode(encode(mapped)).newSerCumRechargeTotal).toEqual(sfs.long(9007199254740993n));
});
test("native recharge actions preserve correlation and accepted-event producers remain internal", async () => {
  const game = new GameService(
    {} as GameStore,
    new Rules(new Map(), new Map(), new Map()),
    { kingdomId: 1 },
    () => 1000,
    { cityProgression: async () => ({ body: {}, pushes: [] }) },
  );
  for (const command of ["new.sercum.ui", "new.sercum.reward"])
    {expect(
      (await game.execute("owner", command, { _cok_: sfs.long(9007199254740993n) })).body._cok_,
    ).toEqual(sfs.long(9007199254740993n));}
  await expect(game.execute("owner", "new.sercum.paid", {})).rejects.toThrow();
  await expect(game.execute("owner", "new.sercum.init", {})).rejects.toThrow();
});
