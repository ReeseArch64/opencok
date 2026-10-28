import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
    comebackEnrollment,
    comebackConfigOpen,
    comebackActiveChannels,
    decodeComebackSession,
    encodeComebackSession,
    comebackPayNodes,
} from "@opencok/rules/comeback";
import { comebackDomain } from "@opencok/services/comeback";
import { CityProgressionContext } from "@opencok/services/city-progression";
import { fields, sfs, decode, int, type Value } from "@opencok/messages/sfs";
import { cityFixture } from "./fixtures/city-progression";
import type { ComebackState } from "@opencok/contracts/comeback";
const day = 86400000n,
    now = BigInt(Date.UTC(2030, 0, 1, 23));
const profile = { uid: "owner", level: 10, country: "BR", lang: "pt", platform: "android" };
function state(): ComebackState
{
    return {
        records: [],
        viewedAt: 0n,
        totalCharge: 0,
        session: {
            sessionId: "synthetic",
            openedAt: now,
            observedAt: now,
            previousOnlineAt: now - 8n * day,
            devicePreviousOnlineAt: now - 8n * day,
            closedAt: 0n,
        },
    };
}
test("comeback catalogs preserve Source opening, lost intervals, payment levels, selectors and return cooldowns", async () => {
    const rules = await loadRules(),
        current = rules.advanced.comebacks!.get("9010001")!;
    expect(comebackEnrollment(rules, state(), profile, 10, now)?.type).toBe(1);
    for (const field of ["previousOnlineAt", "devicePreviousOnlineAt"] as const)
    {
        const snapshot = state();
        snapshot.session![field] = now + 1n;
        if (field === "previousOnlineAt")
        {
            snapshot.deviceRecord = { backType: 1, backTime: now - 1n };
        }
        expect(comebackEnrollment(rules, snapshot, profile, 10, now)).toBeUndefined();
    }
    const snapshot = state();
    snapshot.session!.devicePreviousOnlineAt = now - 7n * day;
    expect(comebackEnrollment(rules, snapshot, profile, 10, now + 100n * day)).toBeUndefined();
    expect(
        comebackConfigOpen({ StartTime: "2030-01-01-23-00", LastTime: "2030-01-02-00-00" }, now),
    ).toBe(false);
    expect(comebackConfigOpen({ StartTime: "1", LastTime: "2030-01-01-23-00" }, now)).toBe(true);
    expect(comebackConfigOpen({ StartTime: "1", LastTime: "0" }, now)).toBe(false);
    rules.advanced.comebacks!.set(current.id!, {
        ...current,
        castle_lv: "10;15",
        lord_lv: "10;20",
        lost_date: "8;9",
        pay_lv: "2|3",
        country: "US|BR",
        language: "pt|en",
        platform: "android",
        version: "12.06.0",
        back_Type: "1",
        server: "all",
    });
    const charged = { ...state(), totalCharge: 6 };
    expect(comebackEnrollment(rules, charged, profile, 10, now)?.type).toBe(1);
    for (const totalCharge of [5, 201])
    {
        expect(
            comebackEnrollment(rules, { ...charged, totalCharge }, profile, 10, now),
        ).toBeUndefined();
    }
    expect(
        comebackEnrollment(rules, charged, { ...profile, country: "DE" }, 10, now),
    ).toBeUndefined();
    expect(comebackEnrollment(rules, charged, profile, 9, now)).toBeUndefined();
    const returning = {
        ...state(),
        records: [{ uid: "owner", configId: "old", backTime: now - 100n * day }],
    };
    expect(comebackEnrollment(rules, returning, profile, 10, now)).toBeUndefined();
    rules.advanced.comebacks = new Map([
        ["old", { ...current, id: "old", LastTime: "0" }],
        [current.id!, current],
    ]);
    returning.session!.previousOnlineAt = now - 31n * day;
    expect(comebackEnrollment(rules, returning, profile, 10, now)?.type).toBe(2);
    returning.session!.previousOnlineAt = now - 30n * day;
    expect(comebackEnrollment(rules, returning, profile, 10, now)).toBeUndefined();
    returning.session!.devicePreviousOnlineAt = now - 31n * day;
    expect(comebackEnrollment(rules, returning, { ...profile, backFlag_mc: 1 }, 10, now)?.type)
        .toBe(
            3,
        );
    returning.session!.closedAt = now;
    expect(comebackEnrollment(rules, returning, profile, 10, now)).toBeUndefined();
});
test("private comeback clocks round trip exact longs and reject malformed or unbounded snapshots", () => {
    const saved = { ...state().session!, observedAt: 9007199254740993n };
    expect(decodeComebackSession(encodeComebackSession(saved))).toEqual(saved);
    for (
        const raw of [
            "null",
            "{}",
            " ".repeat(2049),
            JSON.stringify({ version: 1, sessionId: "x" }),
            encodeComebackSession(saved).replace("\"openedAt\":\"", "\"openedAt\":\"-"),
        ]
    )
    {
        expect(() => decodeComebackSession(raw)).toThrow();
    }
    expect(() => encodeComebackSession({ ...saved, observedAt: now - 1n })).toThrow();
    expect(() => comebackPayNodes({ pay_node: "1|1", pay_reward: "1|2" })).toThrow();
    expect(() => comebackPayNodes({ pay_node: "0", pay_reward: "1" })).toThrow();
});
test("native paid nodes use trusted counters, daily locks stay enforced and the Source claim tail remains inclusive", async () => {
    const rules = await loadRules(),
        fixture = cityFixture(rules),
        config = rules.advanced.comebacks!.get("9010001")!;
    rules.advanced.comebacks!.set(config.id!, {
        ...config,
        activity_Type: "1;7|2;7|3;7",
        pay_node: "5|10",
        pay_reward: "9011028|9011029",
    });
    fixture.state.comeback = {
        records: [{
            uid: "owner",
            configId: config.id!,
            backTime: now,
            backType: 1,
            payTotal: 100n,
        }],
        viewedAt: 0n,
        totalCharge: 0,
    };
    fixture.state.profile.payTotal = 104n;
    const context = (at = now) =>
        new CityProgressionContext(
            fixture.state,
            rules,
            at,
            {
                gold()
                {},
                item()
                {},
                resource()
                {},
                quantity: () => 0,
                balance: () => 0n,
            },
            () => 0,
        );
    const command = async (type: number, param: string, at = now) =>
        comebackDomain.prepare(context(at), "comeback.reward", {
            type: sfs.string(String(type)),
            param: sfs.string(param),
            payTotal: sfs.long(1000000),
        });
    await expect(command(3, "5")).rejects.toThrow();
    await expect(command(3, "1")).rejects.toThrow();
    fixture.state.profile.payTotal = 105n;
    const info = decode(
        Buffer.from((await comebackDomain.prepare(context(), "comeback.info", {})).response),
    );
    expect(fields(info.active3).currPay).toEqual(sfs.long(5));
    const payments = (fields(info.active3).payNodes!.value as Value[]).map(fields);
    expect(payments.map((row) => [row.pay, row.state])).toEqual([
        [sfs.string("5"), sfs.int(1)],
        [sfs.string("10"), sfs.int(0)],
    ]);
    const grant = await command(3, "5");
    expect(decode(Buffer.from(grant.response)).type).toEqual(sfs.string("3"));
    await expect(command(2, "2")).rejects.toThrow();
    await command(2, "7", now + 7n * day);
    await expect(command(2, "7", now + 7n * day + 1n)).rejects.toThrow();
    expect(
        comebackActiveChannels(config, fixture.state.comeback.records[0]!, now + 7n * day),
    ).toEqual([]);
    expect(
        int(
            decode(
                Buffer.from(
                    (await comebackDomain.prepare(context(now + 7n * day), "comeback.info", {}))
                        .response,
                ),
            ),
            "count",
        ),
    ).toBe(0);
});
