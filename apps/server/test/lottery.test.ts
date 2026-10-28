import { test, expect } from "bun:test";
import { lotteryCondition, lotteryResourceAmount, lotterySlots } from "@opencok/rules/lottery";
import { GameService } from "@opencok/services/game";
import { Rules } from "@opencok/rules/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs } from "@opencok/messages/sfs";

test("lottery eligibility and reward amounts preserve server counters, unlocks and float arithmetic", () => {
    const rule = { id: "fixture", condition: "2;10|4;5|5;20|6;2|7;1|8;30|9;5" };
    expect(lotteryCondition(rule, 10, 5, 20, 2, 1, 172800000n)).toBe(true);
    expect(lotteryCondition(rule, 9, 5, 20, 2, 1, 172800000n)).toBe(false);
    expect(lotteryCondition(rule, 10, 5, 20, 2, 2, 172800000n)).toBe(false);
    expect(lotteryResourceAmount(6000, 1, 2, 5, 0)).toBe(5814);
    expect(lotteryResourceAmount(6000, 30, 2, 5, 10)).toBe(10080);
    expect(() => lotteryResourceAmount(6000, 30, 2, 5, 11)).toThrow();
    expect(lotterySlots("0:0|3:0|2:0|1:0|200:1|201:1|202:1|203:1|204:1")).toHaveLength(9);
    expect(() => lotterySlots("0:0")).toThrow();
});

test("all native lottery commands preserve dispatch and replay correlation", async () => {
    const calls: string[] = [];
    const game = new GameService(
        {} as GameStore,
        new Rules(new Map(), new Map(), new Map()),
        { kingdomId: 1 },
        () => 1000,
        {
            cityProgression: async (_owner, command) => {
                calls.push(command);
                return { body: { ok: sfs.bool(true) }, pushes: [] };
            },
        },
    );
    for (
        const command of [
            "lottery.start",
            "lottery.buy",
            "lottery.batch",
            "lottery.b.use",
            "lottery.cancel",
        ]
    )
    {
        const result = await game.execute("owner", command, { _cok_: sfs.long(12n) });
        expect(result.body._cok_?.value).toBe(12n);
    }
    expect(calls).toHaveLength(5);
    await expect(game.execute("owner", "lottery.init", {})).rejects.toThrow();
});

test("login omits an unconfigured lottery while public draws still reject", async () => {
    const { lotteryDomain } = await import("@opencok/services/lottery");
    const { decode } = await import("@opencok/messages/sfs");
    const context = {
        rules: new Rules(new Map(), new Map(), new Map()),
        economy: {},
        state: {},
        write: {},
    } as import("@opencok/services/city-progression").CityProgressionContext;
    const initialized = await lotteryDomain.prepare(context, "lottery.init", {});
    expect(decode(Buffer.from(initialized.response))).toEqual({});
    expect(context.write).toEqual({});
    await expect(lotteryDomain.prepare(context, "lottery.start", {})).rejects.toThrow();
});
