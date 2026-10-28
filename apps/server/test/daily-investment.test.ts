import { test, expect } from "bun:test";
import {
    investmentDays,
    investmentFlags,
    investmentSchedule,
    localActivityConditions,
} from "@opencok/rules/daily-investment";
import { createRealmGameService } from "../src/composition/game";
import type { GameStore } from "@opencok/contracts/game";
import { Rules } from "@opencok/rules/game";
import { sfs } from "@opencok/messages/sfs";
test("investment installments use bounded binary claim flags and completed UTC day boundaries", () => {
    expect(investmentDays(86400000n, 86399999n)).toBe(1);
    expect(() => investmentDays(0n, 1n)).toThrow();
    expect(investmentFlags("1;0;1")).toEqual(["1", "0", "1"]);
    for (const raw of ["", "false;true", "0;2", "0;", Array(65).fill("0").join(";")])
    {
        expect(() => investmentFlags(raw)).toThrow();
    }
    expect(investmentSchedule({ time: "2", interest: "20;30" })).toEqual([20, 30]);
    expect(() => investmentSchedule({ time: "3", interest: "20;30" })).toThrow();
    expect(localActivityConditions("1;10|2;20|3;2|4;4|5;3", 15, 3, 4)).toBe(true);
    expect(localActivityConditions("1;10", 9, 3, 4)).toBe(false);
    expect(localActivityConditions("3;4", 15, 3, 4)).toBe(false);
    expect(localActivityConditions("5;5", 15, 3, 4)).toBe(false);
    expect(localActivityConditions("9;1", 15, 3, 4)).toBe(false);
});
test("native investment commands preserve correlation and login recovery cannot be invoked publicly", async () => {
    const game = createRealmGameService(
        {} as GameStore,
        new Rules(new Map(), new Map(), new Map()),
        { kingdomId: 1 },
        () => 1000,
        { cityProgression: async () => ({ body: {}, pushes: [] }) },
    );
    for (const command of ["invest.add", "invest.open.ui", "invest.receive"])
    {
        expect(
            (await game.execute("owner", command, { _cok_: sfs.long(9007199254740993n) })).body
                ._cok_,
        ).toEqual(sfs.long(9007199254740993n));
    }
    await expect(game.execute("owner", "invest.init", {})).rejects.toThrow();
});
