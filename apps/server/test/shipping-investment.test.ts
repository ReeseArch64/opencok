import { test, expect } from "bun:test";
import { shippingInvestmentAward } from "@opencok/rules/shipping-investment";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { Rules } from "@opencok/rules/game";
import { sfs } from "@opencok/messages/sfs";
test("shipping prize selection honors all weight bands and the exclusive upper range boundary", () => {
  const rule = { Needgold: "100", weight: "1|3", Range: "10;20|30;40" };
  const draw = (weight: number, amount: number) => {
    const values = [weight, amount];
    return shippingInvestmentAward(rule, () => values.shift()!);
  };
  expect(draw(0, 0)).toBe(110);
  expect(draw(0, 9)).toBe(119);
  expect(draw(1, 0)).toBe(130);
  expect(draw(3, 9)).toBe(139);
  expect(() => draw(4, 0)).toThrow();
  expect(() => draw(0, 10)).toThrow();
  expect(() => shippingInvestmentAward({ ...rule, weight: "0|0" }, () => 0)).toThrow();
  expect(() => shippingInvestmentAward({ ...rule, Range: "10;10|30;40" }, () => 0)).toThrow();
});
test("native shipping investment commands retain correlation", async () => {
  const game = new GameService(
    {} as GameStore,
    new Rules(new Map(), new Map(), new Map()),
    { kingdomId: 1 },
    () => 1000,
    { cityProgression: async () => ({ body: {}, pushes: [] }) },
  );
  for (const command of ["shipping.trade.invest.ui", "shipping.trade.invest.reward"])
    {expect(
      (await game.execute("owner", command, { _cok_: sfs.long(9007199254740993n) })).body._cok_,
    ).toEqual(sfs.long(9007199254740993n));}
});
