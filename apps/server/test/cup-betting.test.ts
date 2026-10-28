import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
    cupMatches,
    cupOddsString,
    cupPayout,
    reconcileCupMatches,
} from "@opencok/rules/cup-betting";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs } from "@opencok/messages/sfs";
test("cup catalog schedules retain country identities and Java float odds without accepting a premature result", async () => {
    const rules = await loadRules(),
        matches = cupMatches(rules);
    expect(matches).toHaveLength(15);
    expect(matches[0]!.id).toBe(`RS_CH|BL_PL-${Date.UTC(2023, 5, 25, 13) / 1000}`);
    expect(cupOddsString(Math.fround(2.88))).toBe("2.88");
    expect(cupOddsString(3)).toBe("3.0");
    expect(cupOddsString(Math.fround(7.3333333))).toBe("7.3333335");
    expect(cupPayout(50, Math.fround(2.88))).toBe(144n);
    expect(cupPayout(1, Infinity)).toBe(2147483647n);
    expect(cupOddsString(Infinity)).toBe("Infinity");
    expect(reconcileCupMatches([], matches, 0n).every((row) => row.ended === 0)).toBe(true);
});
test("cup native queries retain LONG correlation and reject the internal settlement producer", async () => {
    const rules = await loadRules(),
        game = new GameService({} as GameStore, rules, { kingdomId: 1 }, () => 1000, {
            cityProgression: async () => ({ body: {}, pushes: [] }),
        });
    for (
        const command of [
            "euro.cup.info",
            "euro.cup.bet.info",
            "euro.cup.record",
            "euro.cup.reward",
        ]
    )
    {
        expect(
            (await game.execute("owner", command, { _cok_: sfs.long(9007199254740993n) })).body
                ._cok_,
        ).toEqual(sfs.long(9007199254740993n));
    }
    await expect(game.execute("owner", "euro.cup.settle", {})).rejects.toThrow();
});
