import { test, expect } from "bun:test";
import { allianceHeartRule } from "@opencok/rules/alliance-heart";
import { allianceHeartLogin, allianceHeartNotification } from "@opencok/mappings/alliance-heart";
import { compactPoint } from "@opencok/services/world";
import { loadRules } from "@opencok/resources/rules";
import { sfs, Type } from "@opencok/messages/sfs";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
test("heart catalogs and native seconds, milliseconds and Java integer map fields retain their wire contracts", async () => {
    const rules = await loadRules();
    expect(allianceHeartRule(rules, "209818")).toEqual({ effect: "1", duration: 60 });
    expect(() => allianceHeartRule(rules, "210059")).toThrow();
    expect(allianceHeartLogin(["one", "two"], "1", 2147483648000n).heart_time).toEqual(
        sfs.long(2147483648000n),
    );
    const notification = allianceHeartNotification(4, "1", 2147483648000n, "recipient", "sender");
    expect(Object.keys(notification)).toEqual([
        "point",
        "effecttype",
        "time",
        "name",
        "receiveuid",
    ]);
    expect(notification.time).toEqual(sfs.string("2147483648000"));
    const row = { id: 1, pointType: 1, sendHeartDurationTime: 2147483648n, heartType: "1" };
    expect(JSON.parse(compactPoint(row)).sendHeartDurationTime).toBe(-2147483648);
    expect(JSON.parse(compactPoint({ ...row, pointType: 0 })).heartType).toBeUndefined();
    const game = new GameService({} as GameStore, rules, { kingdomId: 1 }, () => 1000, {
        cityProgression: async () => ({ body: { worldpoint: sfs.string("4") }, pushes: [] }),
    });
    expect(
        (
            await game.execute("owner", "heart.send", {
                uid: sfs.string("recipient"),
                _cok_: sfs.long(9007199254740993n),
            })
        ).body._cok_?.type,
    ).toBe(Type.Long);
    await expect(game.execute("owner", "heart.init", {})).rejects.toThrow();
});
