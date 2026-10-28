import { expect, test } from "bun:test";
import type { GameServices, GameStore } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import { GameController } from "@opencok/controllers/game";
import { encode, sfs, type Fields } from "@opencok/messages/sfs";
import { Rules } from "@opencok/rules/game";
import { createRealmGameService } from "../src/composition/game";

function fixture()
{
    const now = 1792756800123;
    const profile: Row = { uid: "1001", serverId: 1, picVer: 1000004 };
    const calls: unknown[][] = [];
    const intent = {
        ownerUid: "1001",
        operationId: "a".repeat(32),
        picVer: 5,
        nextUpdateTime: 1792756860123n as bigint | null,
        committedAt: BigInt(now),
        effects: "{}",
        pendingEffects: 0,
    };
    const finish = { profile, picVer: 5, superseded: false };
    const services: GameServices = {
        avatarVersion: {
            update: async (owner, time) => {
                calls.push(["update", owner, time]);
                return { profile, intent };
            },
            deliver: async (owner, operation) => {
                calls.push(["version-deliver", owner, operation]);
                throw new Error("Synthetic delivery failure");
            },
        },
        avatarFinish: {
            finish: async (owner, receipt, time) => {
                calls.push(["finish", owner, receipt, time]);
                return finish;
            },
            deliver: async (owner, sequence) => {
                calls.push(["finish-deliver", owner, sequence]);
                throw new Error("Synthetic delivery failure");
            },
        },
        avatar: {
            read: async (owner, time, inspect) => {
                calls.push(["read", owner, time]);
                return {
                    profile,
                    grant: await inspect(profile, {
                        castleLevel: async () => 10,
                        uploadRecord: async () => undefined,
                    }),
                };
            },
            find: async () => ({ owner: "1001", sequence: "5", hash: "b".repeat(64) }),
            issue: async (owner, sequence) => {
                calls.push(["issue", owner, sequence]);
                return "synthetic-grant";
            },
            image: async (owner, sequence) => {
                calls.push(["image", owner, sequence]);
                return "https://synthetic.invalid/avatar.jpg";
            },
        },
    };
    const rules = new Rules(new Map(), new Map(), new Map());
    rules.items.set("function_on5", { k2: "0" });
    const game = createRealmGameService(
        { getProfileById: async () => profile } as unknown as GameStore,
        rules,
        { kingdomId: 1 },
        () => now,
        services,
    );

    return { controller: new GameController(game), profile, calls, intent, finish, services };
}

test.each(
    [
        ["user.update.picVer", {}, {
            uid: sfs.string("1001"),
            picVer: sfs.int(5),
            nextUpdateTime: sfs.long(1792756860123n),
        }],
        ["user.avatar.finish", { receipt: sfs.string(`5:${"b".repeat(64)}`) }, {
            uid: sfs.string("1001"),
            picVer: sfs.int(5),
            superseded: sfs.bool(false),
        }],
        ["user.avatar.grant", {}, {
            owner: sfs.string("1001"),
            sequence: sfs.int(5),
            grant: sfs.string("synthetic-grant"),
            uploadPath: sfs.string("/gameservice/www/gateway/json.php?grant=synthetic-grant"),
            pendingHash: sfs.string("b".repeat(64)),
        }],
        ["user.avatar.url", {}, {
            owner: sfs.string("1001"),
            path: sfs.string("https://synthetic.invalid/avatar.jpg"),
        }],
    ] satisfies [string, Fields, Fields][],
)(
    "%s_syntheticOwner_preservesExactSfsAndSavedProfile",
    async (command, params, body) => {
        const f = fixture();
        const before = structuredClone(f.profile);
        const result = await f.controller.execute("1001", command, {
            ...params,
            _cok_: sfs.int(19),
            cmdBaseTime: sfs.string("synthetic-time"),
        });

        expect(encode(result.body)).toEqual(encode({
            ...body,
            _cok_: sfs.int(19),
            cmdBaseTime: sfs.string("synthetic-time"),
        }));
        expect(result.pushes.map((push) => [push.command, encode(push.body)])).toEqual(
            command === "user.avatar.finish" ? [["push.picVer.update", encode(body)]] : [],
        );
        expect(f.profile).toEqual(before);
    },
);

test("avatarVersion_nullDeadline_omitsFieldAndPreservesDeliveryRetry", async () => {
    const f = fixture();
    f.intent.nextUpdateTime = null;
    const result = await f.controller.execute("1001", "user.update.picVer", {});

    expect(encode(result.body)).toEqual(encode({ uid: sfs.string("1001"), picVer: sfs.int(5) }));
    expect(f.calls).toEqual([
        ["update", "1001", 1792756800123],
        ["version-deliver", "1001", "a".repeat(32)],
    ]);
});

test.each([
    { ownerUid: "1002" },
    { operationId: "invalid" },
    { picVer: 0 },
    { picVer: 2147483648 },
    { nextUpdateTime: 9223372036854775808n },
])("avatarVersion_invalidIntent_rejectsBeforeDelivery %#", async (patch) => {
    const f = fixture();
    Object.assign(f.intent, patch);

    await expect(f.controller.execute("1001", "user.update.picVer", {})).rejects.toMatchObject({
        code: "E000000",
    });
    expect(f.calls).toEqual([["update", "1001", 1792756800123]]);
});

test("avatarFinish_supersededReceipt_preservesPushBytesAcrossRetries", async () => {
    const f = fixture();
    f.finish.picVer = 3000006;
    f.finish.superseded = true;
    const params = { receipt: sfs.string(`5:${"b".repeat(64)}`) };
    const expected = encode({
        uid: sfs.string("1001"),
        picVer: sfs.int(3000006),
        superseded: sfs.bool(true),
    });
    const first = await f.controller.execute("1001", "user.avatar.finish", params);
    const retry = await f.controller.execute("1001", "user.avatar.finish", params);

    expect(encode(first.body)).toEqual(expected);
    expect(encode(retry.body)).toEqual(expected);
    expect(encode(retry.pushes[0]!.body)).toEqual(expected);
    expect(f.calls).toEqual([
        ["finish", "1001", params.receipt.value, 1792756800123],
        ["finish-deliver", "1001", 5],
        ["finish", "1001", params.receipt.value, 1792756800123],
        ["finish-deliver", "1001", 5],
    ]);
});
