import { expect, test } from "bun:test";
import { AllianceHelpService } from "../src/services/help";
import { AllianceHelpPolicy } from "../src/rules/help-generation";
import { AllianceHelpMapper } from "../src/mappings/help";
import type { AllianceHelpContext, AllianceHelpState } from "../src/contracts/help";
import type { AllianceRecord } from "../src/contracts/records";
import { decode, encode, sfs } from "@opencok/messages/sfs";

const fail = (): never => {
    throw new Error("Unavailable alliance help");
};
const readers = {
    text: (row: AllianceRecord, key: string) => String(row[key] ?? ""),
    num: (row: AllianceRecord, key: string) => Number(row[key] ?? 0),
    long: (row: AllianceRecord, key: string) => BigInt(String(row[key] ?? 0)),
};
const runtime = {
    ...readers,
    allianceFailure: fail,
    cityInteger: (value: unknown) => Number(value),
    cityBuildingParameter: (_row: AllianceRecord, _rules: Record<string, never>, index: number) =>
        index === 0 ? 2 : 3,
    randomUUID: () => "new-help",
};
const policy = new AllianceHelpPolicy(runtime);
const mapper = new AllianceHelpMapper(readers);

function fixture(owner = "helper", changes: Partial<AllianceHelpState> = {})
{
    const permissions: string[] = [];
    const context: AllianceHelpContext<Record<string, never>> = {
        owner,
        allianceId: "alliance",
        now: 1000n,
        rules: {},
        write: {},
        ledger: { pushes: [] },
        state: {
            cities: [
                { uuid: "embassy", uid: "owner", itemId: 402000, level: 1 },
                { uuid: "building", uid: "owner", itemId: 400000, level: 7, star: 0, progress: 0 },
            ],
            activities: [{
                id: "activity",
                ownerId: "owner",
                queueId: "queue",
                type: 0,
                itemId: "building",
                startedAt: 100n,
                dueAt: 10000n,
                version: 2,
            }],
            queues: [{ uuid: "queue", ownerId: "owner", updateTime: 10000n, isHelped: 0 }],
            helps: [{
                helpId: "help",
                allianceId: "alliance",
                senderId: "owner",
                content: "queue",
                type: 0,
                itemId: "400000",
                level: 8,
                startTime: 100n,
                isvalid: 1,
                nowcount: 0,
                maxcount: 2,
                reduceSec: 2000,
                helpers: Buffer.from(
                    JSON.stringify({ version: 1, activityId: "activity", helpers: [] }),
                ),
            }],
            ...changes,
        },
        member: (uid = owner) => {
            if (!["owner", "helper", "next"].includes(uid))
            {
                fail();
            }

            return { uid, allianceId: "alliance" };
        },
        profile: (uid = owner) => ({ uid, name: `Player ${uid}`, pic: "1", picVer: 2 }),
        right: (key) => {
            permissions.push(key);
        },
        effect: async () => 0,
    };

    return {
        context,
        permissions,
        service: new AllianceHelpService(context, runtime, policy, mapper),
    };
}

test("help generation rejects malformed persisted identities without accepting duplicate helpers", () => {
    const row = (value: unknown) => ({ helpers: Buffer.from(JSON.stringify(value)) });
    expect(policy.generation(row({ version: 1, activityId: "activity", helpers: ["helper"] })))
        .toEqual({ version: 1, activityId: "activity", helpers: ["helper"] });

    for (
        const value of [
            { version: 2, activityId: "activity", helpers: [] },
            { version: 1, activityId: 1, helpers: [] },
            { version: 1, activityId: "activity", helpers: ["helper", "helper"] },
            { version: 1, activityId: "activity", helpers: [""] },
            { version: 1, activityId: "activity", helpers: ["x".repeat(41)] },
            {
                version: 1,
                activityId: "activity",
                helpers: Array.from({ length: 2049 }, (_, i) => String(i)),
            },
        ]
    )
    {
        expect(() => policy.generation(row(value))).toThrow("Unavailable alliance help");
    }
});

test("one helper updates the generation, queue deadline, version and quest action together", async () => {
    const { context, service, permissions } = fixture();
    const result = await service.command("al.renderhelp", {
        helpId: sfs.string("help"),
        uid: sfs.string("helper"),
    });
    expect(permissions).toEqual(["help"]);
    expect(result.updateTime).toEqual(sfs.long(8000n));
    expect(context.write.activities![0]!.dueAt).toBe(8000n);
    expect(context.write.activities![0]!.version).toBe(3);
    expect(context.write.queues![0]!.updateTime).toBe(8000n);
    expect(policy.generation(context.write.helps![0]!)).toEqual({
        version: 1,
        activityId: "activity",
        helpers: ["helper"],
    });
    expect(context.write.actions).toEqual([{ uid: "helper", kind: "alliance.help", count: 1 }]);
    expect(context.state.activities[0]!.dueAt).toBe(10000n);
    const replay = fixture("helper", {
        helps: context.write.helps!,
        activities: context.write.activities!,
        queues: context.write.queues!,
    });
    await expect(replay.service.command("al.renderhelp", { helpId: sfs.string("help") })).rejects
        .toThrow("Unavailable alliance help");
    expect(replay.context.write).toEqual({});
});

test("legacy helper lists bind to the current interval and migrate when a new helper shortens it", () => {
    const initial = fixture();
    const legacy = {
        ...initial.context.state.helps[0]!,
        startTime: 150n,
        nowcount: 1,
        maxcount: 3,
        helpers: Buffer.from("previous\0 "),
    };
    const { context, service } = fixture("helper", { helps: [legacy] });
    service.help(legacy);
    expect(context.write.helps![0]!.startTime).toBe(100n);
    expect(policy.generation(context.write.helps![0]!)).toEqual({
        version: 1,
        activityId: "activity",
        helpers: ["previous", "helper"],
    });
    const stale = fixture("helper", {
        helps: [legacy],
        activities: [{ ...initial.context.state.activities[0]!, startedAt: 200n }],
    });
    expect(stale.service.available()).toEqual([]);
    expect(() => stale.service.help(legacy)).toThrow("Unavailable alliance help");
    const mismatch = fixture("helper", { helps: [{ ...legacy, nowcount: 2 }] });
    expect(mismatch.service.available()).toEqual([]);
});

test("calling help preserves the native snapshot and publishes the generated identity", async () => {
    const { context, service } = fixture("owner", { helps: [] });
    const response = await service.command("al.callhelp", {
        queueId: sfs.string("queue"),
        qType: sfs.int(0),
        itemId: sfs.string("400000"),
    });
    expect(response.helpId).toEqual(sfs.string("new-help"));
    expect(response.maxCount).toEqual(sfs.int(2));
    expect(response.level).toEqual(sfs.int(8));
    expect(response.startTime).toEqual(sfs.long(100n));
    expect(context.write.helps![0]!.reduceSec).toBe(3000);
    expect(context.write.queues![0]!.isHelped).toBe(1);
    expect(policy.generation(context.write.helps![0]!)).toEqual({
        version: 1,
        activityId: "activity",
        helpers: [],
    });
    expect(context.ledger.pushes).toEqual([{ command: "push.al.help.new", body: response }]);
    expect(decode(encode(response))).toEqual(response);
});

test("help clamps to now and publication keeps duplicate native count keys and exact longs", () => {
    const initial = fixture();
    const help = { ...initial.context.state.helps[0]!, reduceSec: 20000 };
    const { context, service } = fixture("helper", { helps: [help] });
    expect(service.help(help).updateTime).toEqual(sfs.long(1000n));
    expect(context.write.helps![0]!.isvalid).toBe(0);
    const publication = mapper.publication(help, { updateTime: 9007199254740993n });
    expect(Object.keys(publication)).toEqual([
        "helpId",
        "senderId",
        "content",
        "queueId",
        "updateTime",
        "maxcount",
        "nowcount",
        "maxCount",
        "nowCount",
        "qType",
        "itemId",
        "level",
        "isvalid",
    ]);
    expect(decode(encode(publication)).updateTime).toEqual(sfs.long(9007199254740993n));
    expect(publication.maxcount).toEqual(publication.maxCount);
    expect(publication.nowcount).toEqual(publication.nowCount);
});
