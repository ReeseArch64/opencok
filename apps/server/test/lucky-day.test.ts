import { test, expect } from "bun:test";
import { luckyChoice } from "@opencok/rules/lucky-day";
import { Rules } from "@opencok/rules/game";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs } from "@opencok/messages/sfs";
test("lucky effect selection uses configured weights and rejects malformed or unknown effects", () => {
    const rules = new Rules(new Map(), new Map(), new Map());
    rules.power.luckyEffects = new Map([
        ["1", { id: "1", effect: "50;10" }],
        ["2", { id: "2", effect: "53;20" }],
    ]);
    const row = { effect: "1|2", effect_rate: "1|3" };
    expect(luckyChoice(row, rules, () => 0)).toBe("1");
    expect(luckyChoice(row, rules, () => 1)).toBe("2");
    expect(luckyChoice(row, rules, () => 3)).toBe("2");
    expect(() => luckyChoice(row, rules, () => 4)).toThrow();
    expect(() => luckyChoice({ effect: "1|3", effect_rate: "1|3" }, rules, () => 3)).toThrow();
});
test("native lucky polling retains correlation and login reconciliation is internal", async () => {
    const game = new GameService(
        {} as GameStore,
        new Rules(new Map(), new Map(), new Map()),
        { kingdomId: 1 },
        () => 1000,
        { cityProgression: async () => ({ body: { lucky_id: sfs.string("1") }, pushes: [] }) },
    );
    expect(
        (await game.execute("owner", "luckyday.effect", { _cok_: sfs.long(7n) })).body._cok_,
    ).toEqual(sfs.long(7n));
    await expect(game.execute("owner", "luckyday.init", {})).rejects.toThrow();
});
