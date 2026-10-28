import { test, expect } from "bun:test";
import {
    boxWords,
    boxWord,
    setBoxWord,
    boxCounter,
    setBoxCounter,
    boxSelection,
} from "@opencok/rules/ordinary-box";
import { createRealmGameService } from "../src/composition/game";
import type { GameStore } from "@opencok/contracts/game";
import { Rules } from "@opencok/rules/game";
import { sfs } from "@opencok/messages/sfs";
test("ordinary box bit fields preserve every unrelated signed word and adjacent counter", () => {
    const words = boxWords("-1,-2147483648,2147483647,");
    expect(words).toHaveLength(128);
    setBoxWord(words, 1, 1, 31, 990100);
    expect(words[1]! < 0).toBe(true);
    expect(boxWord(words, 1, 1, 31)).toBe(990100);
    expect(words[0]).toBe(-1);
    expect(words[2]).toBe(2147483647);
    for (let slot = 1; slot <= 12; slot++)
    {
        setBoxCounter(words, slot, slot * 10);
    }
    for (let slot = 1; slot <= 12; slot++)
    {
        expect(boxCounter(words, slot)).toBe(slot * 10);
    }
    expect(() => setBoxCounter(words, 1, 128)).toThrow();
    expect(() => boxWords("2147483648,")).toThrow();
    expect(() => boxWords("unrecognized input")).toThrow();
    expect(boxWords("{}").every((word) => word === 0)).toBe(true);
});
test("ordinary box choices use both catalog weights and lucky-day alternatives", () => {
    const rules = new Rules(new Map(), new Map(), new Map());
    rules.advanced.ordinaryBoxes = new Map([
        [
            "1",
            {
                type: "1",
                cond_rate: "1",
                rate: "1|0",
                rate_luckyday: "0|1",
                pay_reward: "1|2",
                special_reward: "0|1",
            },
        ],
    ]);
    rules.advanced.payRewards = new Map([
        ["1", {}],
        ["2", {}],
    ]);
    expect(
        boxSelection(
            rules,
            1,
            () => true,
            false,
            () => 0,
        ),
    ).toEqual({ id: 1, special: 0 });
    expect(
        boxSelection(
            rules,
            1,
            () => true,
            true,
            () => 0,
        ),
    ).toEqual({ id: 2, special: 1 });
    expect(() =>
        boxSelection(
            rules,
            1,
            () => false,
            false,
            () => 0,
        )
    ).toThrow();
});
test("native table queries preserve correlation while direct box mutation is internal", async () => {
    const game = createRealmGameService(
        {} as GameStore,
        new Rules(new Map(), new Map(), new Map()),
        { kingdomId: 1 },
        () => 1000,
        { cityProgression: async () => ({ body: {}, pushes: [] }) },
    );
    expect(
        (
            await game.execute("owner", "get.table.value", {
                type: sfs.int(1),
                params: sfs.string("210920"),
                _cok_: sfs.long(9007199254740993n),
            })
        ).body._cok_,
    ).toEqual(sfs.long(9007199254740993n));
    await expect(game.execute("owner", "ordinary.box.open", {})).rejects.toThrow();
    await expect(game.execute("owner", "ordinary.box.init", {})).rejects.toThrow();
});
