import { test, expect } from "bun:test";
import { cycleClaims, cycleOffers, cycleDrawChoice } from "@opencok/rules/seven-day-cycle";
import { sevenDayPurchaseOperationId } from "@opencok/services/seven-day-cycle";
import { Rules } from "@opencok/rules/game";
import { createRealmGameService } from "../src/composition/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs } from "@opencok/messages/sfs";
test("cycle catalogs use exact claim tokens, level bands and unbiased weighted choices", () => {
    expect(cycleClaims("123;1234;")).toEqual(["123", "1234"]);
    expect(() => cycleClaims("123;;456")).toThrow();
    const rules = new Rules(new Map(), new Map(), new Map());
    rules.advanced.exchangeCycles = new Map([
        ["1", { id: "1", page: "0", level: "5;10", stage: "1" }],
        ["2", { id: "2", page: "0", level: "11;20", stage: "1" }],
    ]);
    expect(cycleOffers(rules, 0, 1).map((row) => row.id)).toEqual(["1"]);
    expect(cycleOffers(rules, 0, 30).map((row) => row.id)).toEqual(["2"]);
    rules.advanced.cycleDraws = new Map([
        ["1", { id: "1", type: "0", rate: "1" }],
        ["2", { id: "2", type: "0", rate: "3" }],
    ]);
    expect(cycleDrawChoice(rules, 0, () => 0).id).toBe("1");
    expect(cycleDrawChoice(rules, 0, () => 1).id).toBe("2");
    expect(cycleDrawChoice(rules, 0, () => 3).id).toBe("2");
    expect(() => cycleDrawChoice(rules, 0, () => 4)).toThrow();
    expect(sevenDayPurchaseOperationId("owner", "event")).toBe(
        sevenDayPurchaseOperationId("owner", "event"),
    );
    expect(sevenDayPurchaseOperationId("owner", "event")).not.toBe(
        sevenDayPurchaseOperationId("other", "event"),
    );
});
test("native cycle commands preserve long correlation while paid producers remain internal", async () => {
    const game = createRealmGameService(
        {} as GameStore,
        new Rules(new Map(), new Map(), new Map()),
        { kingdomId: 1 },
        () => 1000,
        { cityProgression: async () => ({ body: {}, pushes: [] }) },
    );
    for (
        const command of [
            "sevenday.info",
            "sevenday.look.reward",
            "sevenday.reward",
            "sevenday.lucky.draw",
        ]
    )
    {
        expect(
            (await game.execute("owner", command, { _cok_: sfs.long(9007199254740993n) })).body
                ._cok_,
        ).toEqual(sfs.long(9007199254740993n));
    }
    await expect(game.execute("owner", "sevenday.purchase", {})).rejects.toThrow();
    await expect(game.execute("owner", "sevenday.init", {})).rejects.toThrow();
});
