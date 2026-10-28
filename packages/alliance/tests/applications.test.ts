import { expect, test } from "bun:test";
import { decode, encode, sfs } from "@opencok/messages/sfs";
import { AllianceApplicationsService } from "../src/services/applications";
import { AllianceApplicationsMapper } from "../src/mappings/applications";
import { AllianceMembershipPolicy } from "../src/rules/membership";
import type { AllianceApplicationContext } from "../src/contracts/applications";
import type { AllianceRecord } from "../src/contracts/records";

const fail = (code = "invalid"): never => {
    throw new Error(code);
};
const readers = {
    text: (row: AllianceRecord, key: string) => String(row[key] ?? ""),
    num: (row: AllianceRecord, key: string) => Number(row[key] ?? 0),
    long: (row: AllianceRecord, key: string) => BigInt(String(row[key] ?? 0)),
};
const policy = new AllianceMembershipPolicy({
    ...readers,
    allianceFailure: fail,
    errors: { locked: "locked", full: "full" },
    cityInteger: (value, minimum = 0, maximum = Number.MAX_SAFE_INTEGER) => {
        const number = Number(value);

        if (!Number.isSafeInteger(number) || number < minimum || number > maximum)
        {
            fail();
        }

        return number;
    },
});

function application(
    uid = "pending",
    type = 1,
    userId = "visitor",
    allianceId = "alliance",
    applyTime = 1n,
): AllianceRecord
{
    return { uid, type, userId, allianceId, applyTime, message: Buffer.alloc(0) };
}

function fixture(owner = "visitor", now = 1000n)
{
    const members: AllianceRecord[] = [{ uid: "leader", allianceId: "alliance", rank: 5 }];
    const profiles = new Map<string, AllianceRecord>([
        ["visitor", { uid: "visitor", name: "Visitor", allianceId: "" }],
        ["leader", { uid: "leader", name: "Leader", allianceId: "alliance" }],
        ["other", { uid: "other", name: "Other", allianceId: "" }],
    ]);
    const alliance = {
        uid: "alliance",
        alliancename: "Guild",
        language: "en",
        maxMember: 5,
        recruit: 0,
    };
    const joins: string[] = [];
    let generated = 0;
    const context: AllianceApplicationContext = {
        owner,
        now,
        allianceId: owner === "leader" ? "alliance" : "",
        rules: {
            alliance: { ranks: new Map([["7105", { invite: "1" }]]) },
            items: new Map(),
            mail: new Map([["10009", { title: "Invitation" }], ["10010", {
                title: "Application",
            }]]),
        },
        state: { applications: [], mails: [], members, selection: {} },
        write: {},
        member: (uid = owner, id = context.allianceId) => policy.allianceMember(members, uid, id),
        alliance: (id = context.allianceId) => {
            if (id !== "alliance")
            {
                fail();
            }

            return alliance;
        },
        profile: (uid = owner) => profiles.get(uid) ?? fail(),
        list: () => members,
        right: (key) => policy.allianceRight(context.member(), context.rules, key),
        power: () => 100n,
        castle: () => 6,
        scienceEffect: () => 0,
        join: (uid, row) => {
            joins.push(uid);

            return { uid: sfs.string(uid), allianceId: sfs.string(String(row.uid)) };
        },
    };
    const runtime = {
        ...readers,
        allianceFailure: fail,
        errors: { locked: "locked" },
        randomUUID: () => `new-${++generated}`,
    };

    return {
        context,
        alliance,
        profiles,
        joins,
        generated: () => generated,
        service: new AllianceApplicationsService(
            context,
            runtime,
            policy,
            new AllianceApplicationsMapper(readers),
        ),
    };
}

function invitation(h: ReturnType<typeof fixture>, changes: Partial<AllianceRecord> = {})
{
    h.context.state.applications = [application("imported-application", 2)];
    h.context.state.mails = [{
        uid: "imported-mail",
        toUser: "visitor",
        type: 17,
        contents: Buffer.from(JSON.stringify({ allianceId: "alliance", deal: 0 })),
        ...changes,
    }];

    return { mailId: sfs.string("imported-mail") };
}

test("application creation trims oldest entries and binds its leader mail to one identity", () => {
    const h = fixture();
    h.context.state.applications = [
        application("old-1", 1, "visitor", "elsewhere-1", 1n),
        application("old-2", 1, "visitor", "elsewhere-2", 2n),
        application("old-3", 1, "visitor", "elsewhere-3", 3n),
        application("old-4", 1, "visitor", "elsewhere-4", 4n),
        application("other-player", 1, "other"),
    ];
    const result = h.service.command("al.apply", { allianceId: sfs.string("alliance") });
    expect(h.context.write.deletedApplications).toEqual(["old-1"]);
    expect(h.context.write.applications?.[0]).toMatchObject({
        uid: "new-1",
        userId: "visitor",
        allianceId: "alliance",
        type: 1,
        applyTime: 1000n,
    });
    expect(h.context.write.mails?.[0]).toMatchObject({
        uid: "new-1",
        toUser: "leader",
        fromUser: "visitor",
        type: 25,
        title: "Application",
    });
    expect(AllianceApplicationsMapper.mailData(h.context.write.mails![0]!.contents as Buffer))
        .toMatchObject({ applicantId: "visitor", applicantName: "Visitor", deal: 0 });
    expect(result).toEqual({
        join: sfs.bool(false),
        joinBool: sfs.bool(false),
        mailId: sfs.string("new-1"),
    });
    expect(decode(encode(result))).toEqual(result);
    const restored = fixture();
    restored.context.state.applications = h.context.write.applications!;
    expect(restored.service.command("al.apply", { allianceId: sfs.string("alliance") })).toEqual({
        join: sfs.bool(false),
        joinBool: sfs.bool(false),
    });
    expect(restored.generated()).toBe(0);
    expect(restored.context.write).toEqual({});
    restored.service.command("al.cancelapply", { allianceId: sfs.string("alliance") });
    expect(restored.context.write.deletedApplications).toEqual(["new-1"]);
});

test("open recruitment delegates entry only after authoritative eligibility checks", () => {
    const h = fixture();
    h.alliance.recruit = 1;
    h.service.command("al.apply", { allianceId: sfs.string("alliance") });
    expect(h.joins).toEqual(["visitor"]);
    expect(h.generated()).toBe(0);
    const full = fixture();
    full.alliance.recruit = 1;
    full.alliance.maxMember = 1;
    expect(() => full.service.command("al.apply", { allianceId: sfs.string("alliance") })).toThrow(
        "full",
    );
    expect(full.joins).toEqual([]);
    const foreign = fixture();
    foreign.profiles.get("visitor")!.crossFightSrcServerId = 1;
    expect(() => foreign.service.command("al.apply", { allianceId: sfs.string("alliance") }))
        .toThrow("locked");
    expect(foreign.context.write).toEqual({});
});

test("invitation and cancellation retain rights, local eligibility and refusal cooldown", () => {
    const h = fixture("leader");
    const result = h.service.command("al.invite", { playerId: sfs.string("visitor") });
    expect(h.context.write.applications?.[0]).toMatchObject({
        uid: "new-1",
        type: 2,
        userId: "visitor",
    });
    expect(h.context.write.mails?.[0]).toMatchObject({
        uid: "new-1",
        type: 17,
        toUser: "visitor",
        title: "Invitation",
    });
    expect(Object.keys(result)).toEqual([
        "allianceId",
        "inviteSenderId",
        "inviteReceiver",
        "mailId",
    ]);
    expect(decode(encode(result))).toEqual(result);
    for (const type of [1, 2, 3])
    {
        const pending = fixture("leader");
        pending.context.state.applications = [application("existing", type)];
        expect(() => pending.service.command("al.invite", { playerId: sfs.string("visitor") }))
            .toThrow("locked");
        expect(pending.generated()).toBe(0);
    }
    const expired = fixture("leader", 28800001n);
    expired.context.state.applications = [application("expired", 3)];
    expect(() => expired.service.command("al.invite", { playerId: sfs.string("visitor") })).not
        .toThrow();
    const cancelled = fixture("leader");
    cancelled.context.state.applications = h.context.write.applications!;
    cancelled.service.command("al.cancelinvite", { playerId: sfs.string("visitor") });
    expect(cancelled.context.write.deletedApplications).toEqual(["new-1"]);
    expect(() => fixture().service.command("al.invite", { playerId: sfs.string("other") })).toThrow(
        "locked",
    );
});

test("imported invitation mail binds by saved alliance and becomes consumed across reconstruction", () => {
    const h = fixture();
    const params = invitation(h);
    const result = h.service.command("al.acceptinvite", params);
    expect(h.joins).toEqual(["visitor"]);
    expect(result.result).toEqual(sfs.int(1));
    expect(decode(encode(result))).toEqual(result);
    expect(
        AllianceApplicationsMapper.mailData(h.context.write.mailUpdates![0]!.contents as Buffer)
            .deal,
    ).toBe(1);
    const restored = fixture();
    invitation(restored);
    restored.context.state.mails = h.context.write.mailUpdates!;
    expect(() => restored.service.command("al.acceptinvite", params)).toThrow("locked");
    expect(restored.joins).toEqual([]);
    for (
        const changes of [{ toUser: "other" }, { type: 25 }, {
            contents: Buffer.from("{\"allianceId\":\"wrong\",\"deal\":0}"),
        }, { contents: Buffer.from("{\"allianceId\":\"alliance\",\"deal\":1}") }]
    )
    {
        const invalid = fixture();
        expect(() => invalid.service.command("al.acceptinvite", invitation(invalid, changes)))
            .toThrow();
        expect(invalid.joins).toEqual([]);
        expect(invalid.context.write).toEqual({});
    }
    const due = fixture("visitor", 28800001n);
    expect(() => due.service.command("al.acceptinvite", invitation(due))).toThrow("locked");
    const before = fixture("visitor", 28800000n);
    expect(() => before.service.command("al.acceptinvite", invitation(before))).not.toThrow();
    expect(() => fixture().service.command("al.acceptinvite", {})).toThrow("locked");
});

test("application acceptance and refusals retain owner binding and distinct saved states", () => {
    const h = fixture("leader");
    h.context.state.applications = [application()];
    h.context.state.mails = [{
        uid: "legacy-mail",
        toUser: "leader",
        type: 25,
        contents: Buffer.from("{\"applicantId\":\"visitor\",\"deal\":0}"),
    }];
    h.service.command("al.acceptapply", { mailId: sfs.string("legacy-mail") });
    expect(h.joins).toEqual(["visitor"]);
    const refused = fixture("leader");
    refused.context.state.applications = [application()];
    expect(refused.service.command("al.refuseapply", { playerId: sfs.string("visitor") })).toEqual({
        result: sfs.int(1),
    });
    expect(refused.context.write.deletedApplications).toEqual(["pending"]);
    const invited = fixture();
    invited.service.command("al.refuseinvite", invitation(invited));
    expect(invited.context.write.applications?.[0]).toMatchObject({
        uid: "imported-application",
        type: 3,
    });
    expect(invited.joins).toEqual([]);
    const foreign = fixture("leader");
    foreign.context.state.applications = [application("pending", 1, "visitor", "elsewhere")];
    expect(() => foreign.service.command("al.acceptapply", { playerId: sfs.string("visitor") }))
        .toThrow("locked");
});

test("application messages require active identity and authorized readers", () => {
    const h = fixture();
    h.context.state.applications = [application()];
    h.service.queries("al.apply.message", {
        allianceId: sfs.string("alliance"),
        message: sfs.string("Please invite me"),
    });
    expect(h.context.write.applications?.[0]!.message).toEqual(Buffer.from("Please invite me"));
    const leader = fixture("leader");
    leader.context.state.applications = h.context.write.applications!;
    const result = leader.service.queries("al.apply.message.get", {
        allianceId: sfs.string("alliance"),
        uid: sfs.string("visitor"),
    });
    expect(result).toEqual({ message: sfs.string("Please invite me") });
    expect(decode(encode(result))).toEqual(result);
    const other = fixture("other");
    other.context.state.applications = h.context.write.applications!;
    expect(() =>
        other.service.queries("al.apply.message.get", {
            allianceId: sfs.string("alliance"),
            uid: sfs.string("visitor"),
        })
    ).toThrow("locked");
    for (const message of ["x".repeat(201), "<bad>", "a\u0000b"])
    {
        expect(() =>
            h.service.queries("al.apply.message", {
                allianceId: sfs.string("alliance"),
                message: sfs.string(message),
            })
        ).toThrow("invalid");
    }
});

test("native lists retain expiry filtering, deterministic pagination and exact long values", () => {
    const now = 9007199254740993n;
    const h = fixture("visitor", now);
    h.context.state.selection.page = 2;
    h.context.state.applications = [
        ...Array.from(
            { length: 12 },
            (_, i) =>
                application(`a${String(11 - i).padStart(2, "0")}`, 1, "visitor", "alliance", now),
        ),
        application("other", 1, "other", "alliance", now),
        application("expired", 1, "visitor", "alliance", now - 28800000n),
        application("invite", 2, "visitor", "alliance", now),
    ];
    const result = h.service.queries("al.userapplylist", {});
    expect(result).toEqual({
        list: sfs.array(
            ["a10", "a11"].map((uid) =>
                sfs.object({
                    uid: sfs.string(uid),
                    playerId: sfs.string("visitor"),
                    allianceId: sfs.string("alliance"),
                    applyTime: sfs.long(now),
                    message: sfs.string(""),
                })
            ),
        ),
        page: sfs.int(2),
    });
    expect(decode(encode(result))).toEqual(result);
    expect(() => h.service.queries("al.applylist", {})).toThrow("locked");
    const defaultPage = fixture();
    expect(defaultPage.service.queries("al.userapplylist", {}).page).toEqual(sfs.int(0));
});

test("mail decoder preserves legacy whitespace and scalar fields while rejecting invalid envelopes", () => {
    expect(
        AllianceApplicationsMapper.mailData(
            Buffer.from(" \n{\"allianceId\":\"a\",\"deal\":0,\"nested\":{},\"flag\":true}\u0000 "),
        ),
    ).toEqual({ allianceId: "a", deal: 0 });
    for (const raw of ["", "null", "[]", "1", "{"])
    {
        expect(() => AllianceApplicationsMapper.mailData(Buffer.from(raw))).toThrow();
    }
});
