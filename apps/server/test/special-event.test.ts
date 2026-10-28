import { specialEventInfo } from "@opencok/mappings/special-event";
import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { specialEventWindow } from "@opencok/rules/special-event";
import { specialEventOperation, createSpecialEventDomain } from "@opencok/services/special-event";
import { createRealmGameService } from "../src/composition/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs } from "@opencok/messages/sfs";
test("special event admission preserves inclusive calendar, realm, version and test-realm gates", async () => {
    const rules = await loadRules(),
        context = { kingdomId: 1, version: "12.06.0", now: Date.UTC(2023, 0, 2) };
    rules.configuration.payControl!.set("69026", {
        id: "69026",
        k1: "3.9.0",
        k2: "1",
        k4: "1",
        k5: "2023-01-01-00-00",
        k6: "2023-01-02-00-00",
        k72: "1",
        k107: "1",
    });
    expect(specialEventWindow(rules, context)).toEqual({
        start: BigInt(Date.UTC(2023, 0, 1)),
        end: BigInt(context.now),
    });
    expect(specialEventWindow(rules, { ...context, now: context.now + 1 })).toBeUndefined();
    expect(specialEventWindow(rules, { ...context, kingdomId: 2 })).toBeUndefined();
    expect(specialEventWindow(rules, { ...context, version: "3.8.0" })).toBeUndefined();
    expect(specialEventWindow(rules, { ...context, testServer: true })).toBeDefined();
    rules.configuration.payControl!.get("69026")!.k107 = "2";
    expect(specialEventWindow(rules, { ...context, testServer: true })).toBeUndefined();
});
test("native special-event reads retain long correlation and no client can confirm or reserve purchases", async () => {
    const rules = await loadRules(),
        game = createRealmGameService({} as GameStore, rules, { kingdomId: 1 }, () => 1000, {
            cityProgression: async () => ({ body: {}, pushes: [] }),
        });
    expect(
        (await game.execute("owner", "special.ui.state", { _cok_: sfs.long(9007199254740993n) }))
            .body
            ._cok_,
    ).toEqual(sfs.long(9007199254740993n));
    for (const command of ["special.paid", "special.reserve", "special.confirm"])
    {
        await expect(
            game.execute("owner", command, { eventId: sfs.string("forged") }),
        ).rejects.toThrow();
    }
    expect(specialEventOperation("order")).toBe(specialEventOperation("order"));
    expect(specialEventOperation("order")).not.toBe(specialEventOperation("other"));
    expect(
        createSpecialEventDomain({ counts: async () => new Map(), find: async () => undefined })
            .types,
    ).toEqual([]);
});

test("special-event counters retain the native paired UTF arrays and reject invalid quantities", () => {
    expect(specialEventInfo([0, 2])).toEqual({
        SpecialEvent_id: sfs.array([sfs.string("0"), sfs.string("2")]),
        SpecialEvent_num: sfs.array([sfs.string("0"), sfs.string("2")]),
    });
    expect(() => specialEventInfo([-1])).toThrow();
    expect(() => specialEventInfo(Array.from({ length: 257 }, () => 0))).toThrow();
});
