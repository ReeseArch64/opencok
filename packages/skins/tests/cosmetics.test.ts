import { expect, test } from "bun:test";
import { CosmeticOwnership } from "../src/services/ownership";
import { CosmeticParticipants } from "../src/services/participants";
import { CosmeticPublication } from "../src/services/publication";
import { AvatarActivationDomain } from "../src/services/activation";
import { CosmeticPolicy } from "../src/rules/projection";
import { CosmeticMapper } from "../src/mappings/cosmetics";
import { CosmeticEventMapper } from "../src/mappings/interaction";
import type { CosmeticRecord, CosmeticRule } from "../src/contracts/records";
import type { CosmeticContext, CosmeticCatalog } from "../src/contracts/context";
import { decode, encode, sfs, type Fields } from "@opencok/messages/sfs";
import { cosmeticStatusRule, isCosmeticStatus } from "../src/rules/attributes";

const readers = {
    num: (row: CosmeticRecord, key: string) => Number(row[key] ?? 0),
    long: (row: CosmeticRecord, key: string) => BigInt(String(row[key] ?? 0)),
    text: (row: CosmeticRecord, key: string) => String(row[key] ?? ""),
    cityInteger: (value: unknown) => Number(value),
    serverFeature: () => true,
};
const recipient = (value: string) => {
    if (!value || value.includes("\0"))
    {
        throw new Error("Invalid recipient");
    }

    return value;
};
const catalog = (): CosmeticCatalog => ({
    kingdomId: 1,
    power: {
        statuses: new Map<string, CosmeticRule>([
            ["101", { type2: "100", subgroup: "1", time: "5", overlap: "2" }],
            ["102", { type2: "100", subgroup: "1", time: "5", overlap: "2" }],
            ["201", { type2: "105", subgroup: "1", time: "5", overlap: "2" }],
            ["301", { type2: "200", subgroup: "1", time: "5", overlap: "5" }],
        ]),
    },
});
function context(
    avatars: readonly CosmeticRecord[] = [],
    uid = "target",
    rules = catalog(),
): CosmeticContext<CosmeticCatalog>
{
    return {
        owner: "owner",
        now: 1000n,
        rules,
        state: {
            effects: { states: [] },
            cosmeticTarget: { uid, realm: 1, point: 7, states: [], avatars },
        },
        write: {},
    };
}
const ownership = new CosmeticOwnership(readers);
const policy = new CosmeticPolicy(readers);
const mapper = new CosmeticMapper();
const events = new CosmeticEventMapper(readers, policy, mapper, ownership.cosmeticTargetStates);

test.each([
    100,
    101,
    102,
    103,
    104,
    105,
    106,
    108,
    109,
    114,
    115,
    116,
    117,
    118,
    121,
    123,
    124,
    200,
])(
    "cosmeticStatusRule_type%s_removesAttributesAndAbilitiesWhileKeepingVisualMetadata",
    (type) => {
        const rule = {
            type2: String(type),
            effect: "487;100|14;1|50;30",
            effectAdd: "487;500",
            skill: "12345",
            random: "1",
            subgroup: "1",
            time: "3600",
            frameID: "20490040",
        };
        const before = { ...rule };

        expect(cosmeticStatusRule(rule)).toEqual({
            ...rule,
            effect: "14;1",
            effectAdd: "",
            skill: "",
            random: "0",
        });
        expect(rule).toEqual(before);
    },
);

test("cosmeticStatusRule_throneCounterAndOrdinaryEffects_preservesLegitimateBonuses", () => {
    const throne = { type2: "110", effect: "2189;1", overlap: "5" };
    const ordinary = { type2: "9", effect: "50;25", random: "1" };
    const unclassified = { type2: "202", effect: "50;25" };

    expect(cosmeticStatusRule(throne)).toBe(throne);
    expect(cosmeticStatusRule(ordinary)).toBe(ordinary);
    expect(cosmeticStatusRule(unclassified)).toBe(unclassified);
    expect(isCosmeticStatus(undefined)).toBe(false);
    expect(cosmeticStatusRule({ ...throne, subgroup: "308" }).effect).toBe("");
});

test("avatarActivationResponse_savedRandomSkin_omitsBonusesAndPreservesExpiryAndSwitchContract", () => {
    const rules = catalog();
    const declarations = new Map(rules.power.statuses);
    declarations.set("101", { type2: "100", random: "1", effect: "487;999" });
    const row = {
        stateId: 101,
        startTime: 1000n,
        endTime: 8000n,
        ranEffId: 487,
        ranEffValue: 999,
    };

    const response = decode(encode(mapper.avatarActivationResponse(
        row,
        { ...rules, power: { statuses: declarations } },
        102,
    )));

    expect(response.status).toBeUndefined();
    expect(response.statusId).toEqual(sfs.int(101));
    expect(response.endTime).toEqual(sfs.long(8000n));
    expect(response.oldStatus).toEqual(sfs.string("102"));
    expect(row.ranEffValue).toBe(999);
});

test("cosmetic ownership extends pending city expiry, preserves bubble expiry and replaces expired ownership", () => {
    const c = context([{
        uid: "target",
        avatarId: "101",
        expirationTime: 2000n,
        effectiveSign: 1,
    }]);
    c.write.cosmeticTarget = {
        uid: "target",
        states: [],
        deleted: [],
        avatars: [{ uid: "target", avatarId: "101", expirationTime: 3000n, effectiveSign: 0 }],
    };
    const states = [{ stateId: 102, endTime: 0n }];
    const owned = ownership.cosmeticOwnership(c, "target", "102", [], states)!;
    expect(owned).toEqual([{
        uid: "target",
        avatarId: "101",
        expirationTime: 8000n,
        effectiveSign: 0,
    }]);
    expect(states[0]!.endTime).toBe(8000n);
    const bubble = context([{
        uid: "target",
        avatarId: "201",
        expirationTime: 3000n,
        effectiveSign: 1,
    }]);
    expect(ownership.cosmeticOwnership(bubble, "target", "201", [], [])![0]!.expirationTime).toBe(
        3000n,
    );
    const expired = context([{
        uid: "target",
        avatarId: "101",
        expirationTime: 1000n,
        effectiveSign: 1,
    }]);
    expect(ownership.cosmeticOwnership(expired, "target", "102", [], [])![0]!.avatarId).toBe("102");
    expect(ownership.cosmeticOwnership(expired, "target", "102", [], [])![0]!.expirationTime).toBe(
        6000n,
    );
    expect(c.state.cosmeticTarget!.avatars[0]!.expirationTime).toBe(2000n);
});

test("counter overlap avoids ownership writes and permanent appearances retain long expiry", () => {
    const c = context([{ uid: "target", avatarId: "301", expirationTime: -1n, effectiveSign: 1 }]);
    const states = [{ stateId: 301, endTime: 0n }];
    expect(
        ownership.cosmeticOwnership(c, "target", "301", [{ stateId: 301, endTime: 2000n }], states),
    )
        .toBeUndefined();
    expect(states[0]!.endTime).toBe(9223372036854775807n);
    expect(
        policy.cityCosmeticProjection(
            [{ stateId: 301, type2: 200, endTime: 9223372036854775807n, count: 3 }],
            c.rules,
            1000n,
        ),
    )
        .toEqual({ overlap: { sid: 301, set: 2147000000, count: 3 } });
    expect(
        policy.cityCosmeticProjection(
            [{ stateId: 101, type2: 100, endTime: 2147483648000n }],
            c.rules,
            1000n,
        ),
    )
        .toEqual({ sid: 101, set: -2147483648 });
    expect(
        policy.cityCosmeticProjection(
            [{ stateId: 101, type2: 100, endTime: 1000n }],
            c.rules,
            1000n,
        ),
    )
        .toEqual({});
});

test("cosmetic publication preserves private-before-world delivery and deduplicates interested recipients", async () => {
    const c = context();
    c.write.cosmeticTarget = {
        uid: "target",
        deleted: [],
        states: [{ uid: "target", stateId: 101, type2: 100, startTime: 1000n, endTime: 6000n }],
    };
    c.write.cosmeticChanges = [{ uid: "target", id: 101, previous: 102 }];
    const sent: { uid: string; command: string; body: Fields; }[] = [];
    const publisher = new CosmeticPublication({
        playerItemGiftRecipient: recipient,
        interested: async (points, owner, target) => {
            expect(points).toEqual([7]);
            expect([owner, target]).toEqual(["owner", "target"]);
            return ["owner", "target", "observer", "observer", ""];
        },
        publish: async (uid, command, body) => {
            sent.push({ uid, command, body });
        },
    }, mapper);
    await publisher.publishCosmeticInteractionMutation(events.cosmeticInteractionEvent(c)!);
    expect(sent.map(({ uid, command }) => [uid, command])).toEqual([
        ["target", "status.push"],
        ["target", "push.server.action"],
        ["owner", "push.city.status"],
        ["target", "push.city.status"],
        ["observer", "push.city.status"],
    ]);
    expect(sent[0]!.body.oldStatus).toEqual(sfs.string("102"));
    expect(decode(encode(sent[2]!.body))).toEqual({
        sid: sfs.int(101),
        set: sfs.int(6),
        uid: sfs.string("target"),
        worldpointid: sfs.int(7),
    });
    const invalid = decode(Buffer.from(events.cosmeticInteractionEvent(c)!));
    invalid.statuses = sfs.array([
        sfs.object({ kind: sfs.int(999), body: sfs.object({ statusId: sfs.int(101) }) }),
    ]);
    await expect(publisher.publishCosmeticInteractionMutation(encode(invalid))).rejects.toThrow(
        "Invalid cosmetic private status kind",
    );
    expect(sent).toHaveLength(5);
});

test("avatar activation delegates the campaign event and persists the owned expiry before publication", async () => {
    const c = context(
        [{ uid: "owner", avatarId: "101", expirationTime: 8000n, effectiveSign: 1 }],
        "owner",
    );
    const calls: string[] = [];
    const domain = new AvatarActivationDomain(
        {
            ...readers,
            randomInt: () => 0,
            campaignFailure: () => {
                throw new Error("Unavailable cosmetic");
            },
            recordCampaignEvent: (_context, type, id) => {
                calls.push(`${type}:${id}`);
            },
            temporaryEffect: () => {
                calls.push("effect");
                return {
                    states: [{
                        uid: "owner",
                        stateId: 102,
                        type2: 100,
                        startTime: 1000n,
                        endTime: 2000n,
                    }],
                    deleted: [101],
                };
            },
        },
        mapper,
        events,
    );
    expect(domain.handles("avatar.activate")).toBe(true);
    const result = await domain.prepare(c, "avatar.activate", { avatarId: sfs.string("102") });
    expect(calls).toEqual(["59:102", "effect"]);
    expect(c.write.states![0]!.endTime).toBe(8000n);
    expect(c.write.deletedStates).toEqual([101]);
    expect(c.write.cosmeticTarget!.avatars![0]!.effectiveSign).toBe(0);
    expect(decode(Buffer.from(result.response)).endTime).toEqual(sfs.long(8000n));
    expect(result.event).not.toBeNull();
    await expect(
        domain.prepare(context([], "owner"), "avatar.activate", { avatarId: sfs.string("101") }),
    )
        .rejects.toThrow("Unavailable cosmetic");
    expect(calls).toEqual(["59:102", "effect"]);
});

test("interaction participant selection keeps actor-first deduplication and ignores unrelated commands", () => {
    const participants = new CosmeticParticipants({ playerItemGiftRecipient: recipient });
    const select = participants.cosmeticInteractionParticipants;
    expect(select("owner", "trigger.activity", { type: sfs.int(45), uid: sfs.string("target") }))
        .toEqual(["owner", "target"]);
    expect(select("owner", "trigger.activity", { type: sfs.int(45), uid: sfs.string("owner") }))
        .toEqual(["owner"]);
    expect(select("owner", "avatar.activate", { type: sfs.int(45), uid: sfs.string("target") }))
        .toBeUndefined();
});

test.each([
    [104, "npavatar"],
    [108, "castleEffect"],
    [109, "wings"],
    [115, "avatarframe"],
    [116, "aura"],
])("cosmetic type %i survives world projection under its native field", (type, field) => {
    const c = context();
    const value = policy.cityCosmeticProjection(
        [{ stateId: 901, type2: type, endTime: 9000n }],
        c.rules,
        1000n,
    );
    expect(value).toEqual({ [field]: { sid: 901, set: 9 } });
    expect(mapper.cityCosmeticFields(value)).toEqual({
        [field]: sfs.object({ sid: sfs.int(901), set: sfs.int(9) }),
    });
});

test("expired world cosmetics are omitted independently of a still-active castle", () => {
    const c = context();
    const value = policy.cityCosmeticProjection(
        [
            { stateId: 101, type2: 100, endTime: 9000n },
            { stateId: 901, type2: 109, endTime: 1000n },
        ],
        c.rules,
        1000n,
    );
    expect(value).toEqual({ sid: 101, set: 9 });
});

test.each([101, 102, 103, 104, 108, 109, 115, 116])(
    "cosmetic type %i is stored as owned without granting foreign ownership",
    (type) => {
        const c = context([], "owner", {
            ...catalog(),
            power: {
                statuses: new Map([...catalog().power.statuses!, ["901", {
                    type2: String(type),
                    subgroup: "901",
                    overlap: "2",
                }]]),
            },
        });
        const states = [{ stateId: 901, type2: type, endTime: 9000n }];
        expect(ownership.cosmeticOwnership(c, "owner", "901", [], states)).toBeDefined();
        expect(ownership.cosmeticOwnership(c, "foreign", "901", [], states)).toBeUndefined();
    },
);

test("item use retains an already active legacy skin before replacing its only status", () => {
    const c = context([], "owner", {
        ...catalog(),
        power: {
            statuses: new Map([...catalog().power.statuses!, ["901", {
                type2: "100",
                subgroup: "901",
                overlap: "2",
            }]]),
        },
    });
    const recovered = ownership.cosmeticOwnership(
        c,
        "owner",
        "901",
        [
            { uid: "owner", stateId: 101, type2: 100, endTime: 9223372036854775807n },
            { uid: "foreign", stateId: 201, type2: 105, endTime: 9000n },
            { uid: "owner", stateId: 301, type2: 200, endTime: 9000n, count: 5 },
        ],
        [{ uid: "owner", stateId: 901, type2: 100, endTime: 9223372036854775807n }],
        1,
        true,
    );
    expect(recovered).toEqual([
        { uid: "owner", avatarId: "101", expirationTime: -1n, effectiveSign: 0 },
        { uid: "owner", avatarId: "901", expirationTime: -1n, effectiveSign: 0 },
    ]);
});
