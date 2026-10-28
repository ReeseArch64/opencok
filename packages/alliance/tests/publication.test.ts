import { expect, test } from "bun:test";
import { decode, encode, fields, sfs, type Fields } from "@opencok/messages/sfs";
import { AlliancePublicationService } from "../src/services/publication";
import { AlliancePublicationMapper } from "../src/mappings/publication";
import { AllianceMembershipPolicy } from "../src/rules/membership";
import type { AlliancePublicationSnapshot } from "../src/contracts/publication";
import type { AllianceRecord } from "../src/contracts/records";
import type { AllianceScienceCatalog } from "../src/contracts/science-catalog";

const readers = {
    text: (row: AllianceRecord, key: string) => String(row[key] ?? ""),
    num: (row: AllianceRecord, key: string) => Number(row[key] ?? 0),
    long: (row: AllianceRecord, key: string) => BigInt(String(row[key] ?? 0)),
};

function fixture()
{
    const snapshot: AlliancePublicationSnapshot = {
        record: {
            uid: "guild",
            alliancename: "Guild",
            maxMember: 10,
            alliancepoint: 9007199254740993n,
            targetScience: "[\"100\",\"200\"]",
        },
        members: [{ uid: "owner", rank: 5, name: "Leader", point: 7 }, {
            uid: "other",
            rank: 1,
            name: "Other",
        }],
        profiles: [],
        queues: [],
        helps: [],
        sciences: [],
        research: [],
    };
    const rules: AllianceScienceCatalog = {
        power: {
            allianceSciences: new Map([
                ["100", { id: "100", science_lv: "0" }],
                ["101", { id: "100", science_lv: "1" }],
                ["200", { id: "200", science_lv: "0" }],
            ]),
        },
        items: new Map(),
    };
    const events: string[] = [];
    const deliveries: { uid: string; command: string; body: Fields; }[] = [];
    const scienceReads: AllianceRecord[] = [];
    const runtime = {
        ...readers,
        cityInteger: Number,
        errors: { locked: "locked", full: "full" },
        allianceFailure: (): never => {
            throw new Error("invalid");
        },
        scienceEffects: () => {
            events.push("effects");
            return new Map([[500, 1.9]]);
        },
    };
    let rejected = "";
    const service = new AlliancePublicationService(
        async (id, players) => {
            events.push(`read:${id}:${players?.join(",")}`);
            return snapshot;
        },
        async (uid, command, body) => {
            events.push(`publish:${uid}:${command}`);
            if (rejected === command)
            {
                throw new Error("delivery failed");
            }
            deliveries.push({ uid, command, body });
        },
        rules,
        runtime,
        new AlliancePublicationMapper(runtime, new AllianceMembershipPolicy(runtime)),
        {
            publication: (help, queue) => ({
                request: sfs.string(String(help.uid)),
                queue: sfs.string(String(queue.uuid)),
            }),
        },
        {
            publication: (science, catalog, research) => {
                expect(catalog).toBe(rules);
                expect(research).toBe(snapshot.research);
                scienceReads.push(science);
                return {
                    scienceId: sfs.int(Number(science.scienceId)),
                    level: sfs.int(Number(science.level)),
                };
            },
        },
    );
    const deliver = (
        command: string,
        members: { uid: string; allianceId: string; }[] = [],
        actor = "owner",
    ) => service.deliver(encode({
        allianceId: sfs.string("guild"),
        command: sfs.string(command),
        actor: sfs.string(actor),
        members: sfs.array(
            members.map((member) =>
                sfs.object({
                    uid: sfs.string(member.uid),
                    allianceId: sfs.string(member.allianceId),
                })
            ),
        ),
    }));
    return {
        snapshot,
        rules,
        events,
        deliveries,
        scienceReads,
        deliver,
        reject: (command: string) => {
            rejected = command;
        },
    };
}

test("pending leave events revalidate current profiles before missing-alliance exit", async () => {
    const h = fixture();
    h.snapshot.record = undefined;
    h.snapshot.profiles = [{ uid: "left", allianceId: "" }, {
        uid: "rejoined",
        allianceId: "guild",
    }, { uid: "moved", allianceId: "elsewhere" }];
    await h.deliver("al.dismiss", [
        { uid: "left", allianceId: "" },
        { uid: "rejoined", allianceId: "" },
        { uid: "moved", allianceId: "" },
        { uid: "unknown", allianceId: "" },
    ]);
    expect(h.events).toEqual([
        "read:guild:left,rejoined,moved,unknown",
        "publish:left:push.al.leave",
    ]);
    expect(h.deliveries).toEqual([{
        uid: "left",
        command: "push.al.leave",
        body: { allianceId: sfs.string("guild") },
    }]);
    expect(h.scienceReads).toEqual([]);
});

test("activity reward publishes exact shared points only to current non-actor members", async () => {
    const h = fixture();
    await h.deliver("activity.accept.reward");
    expect(h.events).toEqual(["read:guild:", "publish:other:al.point.push"]);
    expect(h.deliveries).toEqual([{
        uid: "other",
        command: "al.point.push",
        body: { alliancePoint: sfs.long(9007199254740993n) },
    }]);
    expect(decode(encode(h.deliveries[0]!.body))).toEqual(h.deliveries[0]!.body);
    h.snapshot.members = [];
    await h.deliver("activity.accept.reward");
    expect(h.deliveries).toHaveLength(1);
});

test("member updates preserve publication fields and per-member leadership order", async () => {
    const h = fixture();
    await h.deliver("al.leader.trans");
    expect(h.events).toEqual([
        "read:guild:",
        "effects",
        "publish:owner:push.al.update",
        "publish:owner:push.al.leader.trans",
        "publish:other:push.al.update",
        "publish:other:push.al.leader.trans",
    ]);
    const info = fields(h.deliveries[0]!.body.alliance!);
    expect(Object.keys(info)).toEqual([
        "uid",
        "alliancename",
        "abbr",
        "intro",
        "announce",
        "member",
        "curMember",
        "maxMember",
        "language",
        "recruit",
        "icon",
        "bannerStyle",
        "permission",
        "targetScience",
        "rankone",
        "ranktwo",
        "rankthree",
        "rankfour",
        "rankfive",
        "rank",
        "point",
        "accPoint",
        "alliancepoint",
        "learderUid",
        "learderName",
    ]);
    expect(info.maxMember).toEqual(sfs.int(11));
    expect(info.member).toEqual(sfs.int(2));
    expect(info.learderUid).toEqual(sfs.string("owner"));
    expect(info.learderName).toEqual(sfs.string("Leader"));
    expect(info.alliancepoint).toEqual(sfs.long(9007199254740993n));
    expect(info.targetScience).toEqual(sfs.string("100;200"));
    expect(fields(h.deliveries[1]!.body.alliance!)).toBe(info);
    expect(fields(h.deliveries[2]!.body.alliance!).rank).toEqual(sfs.int(1));
    expect(decode(encode(h.deliveries[0]!.body))).toEqual(h.deliveries[0]!.body);
    h.snapshot.members = [{ uid: "other", rank: 1 }];
    await h.deliver("al.attr");
    expect(fields(h.deliveries.at(-1)!.body.alliance!).learderUid).toEqual(sfs.string(""));
});

test("join publication selects changed current members and catalog-order science defaults", async () => {
    const h = fixture();
    h.snapshot.sciences = [{ scienceId: 100, level: 3, donateprogress: 7 }];
    await h.deliver("al.acceptapply", [{ uid: "other", allianceId: "guild" }, {
        uid: "outsider",
        allianceId: "guild",
    }, { uid: "owner", allianceId: "elsewhere" }]);
    expect(h.deliveries.map((delivery) => [delivery.uid, delivery.command])).toEqual([
        ["owner", "push.al.update"],
        ["other", "push.al.update"],
        ["other", "push.al.join"],
    ]);
    expect(h.scienceReads).toEqual([h.snapshot.sciences[0]!, {
        scienceId: 200,
        level: 0,
        donateprogress: 0,
    }]);
    const joined = fields(h.deliveries[2]!.body.alliance!);
    expect(joined.allianceScience).toEqual(sfs.array([
        sfs.object({ scienceId: sfs.int(100), level: sfs.int(3) }),
        sfs.object({ scienceId: sfs.int(200), level: sfs.int(0) }),
    ]));
    expect(decode(encode(h.deliveries[2]!.body))).toEqual(h.deliveries[2]!.body);
});

test("help publication requires matching queue identity and owner for every current member", async () => {
    for (const command of ["al.callhelp", "al.renderhelp", "al.helpall"])
    {
        const h = fixture();
        h.snapshot.helps = [{ uid: "valid", content: "queue", senderId: "owner" }, {
            uid: "wrong-owner",
            content: "queue",
            senderId: "other",
        }, { uid: "missing", content: "missing", senderId: "owner" }];
        h.snapshot.queues = [{ uuid: "queue", ownerId: "owner" }];
        await h.deliver(command);
        const push = command === "al.callhelp" ? "push.al.help.new" : "push.al.help.update";
        expect(h.deliveries.map((delivery) => [delivery.uid, delivery.command])).toEqual([
            ["owner", "push.al.update"],
            ["owner", push],
            ["other", "push.al.update"],
            ["other", push],
        ]);
        expect(h.deliveries[1]!.body).toEqual({
            request: sfs.string("valid"),
            queue: sfs.string("queue"),
        });
    }
});

test("science publication follows each member update and retains the absolute point balance", async () => {
    for (const command of ["al.science.donate", "alliance.tick"])
    {
        const h = fixture();
        h.snapshot.sciences = [{ scienceId: 100, level: 2 }];
        await h.deliver(command);
        expect(h.deliveries.map((delivery) => [delivery.uid, delivery.command])).toEqual([
            ["owner", "push.al.update"],
            ["owner", "push.al.science"],
            ["other", "push.al.update"],
            ["other", "push.al.science"],
        ]);
        expect(h.deliveries[1]!.body).toEqual({
            scienceId: sfs.int(100),
            level: sfs.int(2),
            alliancepoint: sfs.long(9007199254740993n),
        });
        expect(h.scienceReads).toEqual([h.snapshot.sciences[0]!, h.snapshot.sciences[0]!]);
    }
});

test("delivery and mapping failures stop publication and propagate to the existing outbox owner", async () => {
    const h = fixture();
    h.reject("push.al.leader.trans");
    await expect(h.deliver("al.leader.trans")).rejects.toThrow("delivery failed");
    expect(h.deliveries.map((delivery) => delivery.uid)).toEqual(["owner"]);
    expect(h.events.at(-1)).toBe("publish:owner:push.al.leader.trans");
    const invalid = fixture();
    invalid.snapshot.record!.permission = "{\"unknown\":1}";
    await expect(invalid.deliver("al.attr")).rejects.toThrow("invalid");
    expect(invalid.deliveries).toEqual([]);
});
