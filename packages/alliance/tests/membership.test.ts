import { expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { decode, encode, sfs } from "@opencok/messages/sfs";
import type { RewardPreview } from "@opencok/economy/contracts/reward-preview";
import { AllianceMembershipService } from "../src/services/membership";
import { AllianceMembershipMapper } from "../src/mappings/membership";
import { AllianceMembershipPolicy } from "../src/rules/membership";
import type { AllianceMembershipContext } from "../src/contracts/membership";
import type { AllianceMembershipCatalog } from "../src/contracts/membership-catalog";
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
        const result = Number(value);

        if (!Number.isSafeInteger(result) || result < minimum || result > maximum)
        {
            fail();
        }

        return result;
    },
});
const stableId = (value: string) => createHash("sha256").update(value).digest("hex").slice(0, 32);
const mapper = new AllianceMembershipMapper({ allianceFailure: fail, allianceStableId: stableId });

function fixture(allianceId = "", now = 1000n)
{
    const profile: AllianceRecord = { uid: "owner", allianceId, country: "BR" };
    let alliance: AllianceRecord = { uid: "guild", maxMember: 2, curMember: 1 };
    const charges: bigint[] = [];
    const previews: unknown[] = [];
    const events: string[] = [];
    let draws = 0;
    let castle = 4;
    let effect = 0;
    let rewards: readonly RewardPreview[] = [{ kind: "count", type: 5, value: 200 }];
    const ledger = {};
    const context: AllianceMembershipContext<AllianceMembershipCatalog, typeof ledger> = {
        owner: "owner",
        allianceId,
        now,
        ledger,
        rules: {
            kingdomId: 7,
            alliance: {},
            items: new Map([["alliance_cost", { k8: "4", k6: "6", k5: "200" }]]),
            mail: new Map([["10011", {
                reward: "reward",
                message: "Welcome",
                sender: "System",
                title: "First join",
            }]]),
        },
        state: {
            lords: [{ uid: "owner", firstJoinAllianceFlag: 0 }],
            points: [],
            marches: [],
            members: [{ uid: "leader", allianceId: "guild", rank: 5 }],
            directory: [],
        },
        write: {},
        productionOwners: new Set(),
        profile: () => profile,
        alliance: () => alliance,
        list: (id = allianceId) => context.state.members.filter((row) => row.allianceId === id),
        power: () => 100n,
        castle: () => castle,
        scienceEffect: () => effect,
        setMember: (row) => {
            context.write.members = [row];
        },
        setAlliance: (row) => {
            alliance = row;
            context.write.alliances = [row];
        },
        snapshot: (row, member) => {
            events.push("snapshot");

            return {
                uid: sfs.string(String(row.uid)),
                jointime: sfs.long(BigInt(String(member.jointime))),
            };
        },
    };
    const runtime = {
        ...readers,
        allianceFailure: fail,
        errors: { locked: "locked" },
        randomUUID: () => `${++draws === 1 ? "abc" : "def"}-identity`,
        randomInt: (maximum: number) => maximum - 1,
        previewRewards: (
            reward: string | undefined,
            rules: AllianceMembershipCatalog,
            info: { kingdomId: number; version: string; now: number; },
            random: (maximum: number) => number,
        ) => {
            previews.push({ reward, sameCatalog: rules === context.rules, info, draw: random(10) });
            events.push("rewards");

            return rewards;
        },
        javaMailBytes: (value: string | undefined) => {
            events.push("bytes");

            return value ? Uint8Array.from([87, 0, 0]) : null;
        },
        activityEconomy: (value: typeof ledger) => {
            expect(value).toBe(ledger);

            return {
                gold: (delta: bigint) => {
                    charges.push(delta);
                },
            };
        },
    };

    return {
        context,
        profile,
        charges,
        previews,
        events,
        runtime,
        draws: () => draws,
        setCastle: (value: number) => {
            castle = value;
        },
        setEffect: (value: number) => {
            effect = value;
        },
        setRewards: (value: readonly RewardPreview[]) => {
            rewards = value;
        },
        service: new AllianceMembershipService(context, runtime, policy, mapper),
    };
}

test("creation preserves castle costs, collision UUID order and native leader defaults", () => {
    const h = fixture();
    h.context.state.directory = [{ abbr: "new" }];
    const result = h.service.create({
        name: sfs.string("  New Guild  "),
        intro: sfs.string("Hello"),
        language: sfs.string("en"),
    });
    expect(h.charges).toEqual([-200n]);
    expect(h.draws()).toBe(2);
    expect(h.context.write.alliances?.[0]).toMatchObject({
        uid: "def-identity",
        alliancename: "New Guild",
        abbr: "ABC",
        intro: "Hello",
        language: "en",
        maxMember: 50,
        curMember: 1,
        recruit: 1,
        icon: "Alliance_Flag_1",
        bannerStyle: "BR",
        alliancepoint: 0n,
    });
    expect(h.context.write.members?.[0]).toMatchObject({
        uid: "owner",
        allianceId: "def-identity",
        rank: 5,
    });
    expect(h.context.write.memberships).toEqual([{ uid: "owner", allianceId: "def-identity" }]);
    expect(h.context.write.actions).toEqual([{ uid: "owner", kind: "alliance.join", count: 1 }]);
    expect([...h.context.productionOwners]).toEqual(["owner"]);
    expect(Object.keys(result)).toEqual(["alliance", "join", "joinBool", "rank", "isfirstJoin"]);
    expect(decode(encode(result))).toEqual(result);
    const free = fixture();
    free.setCastle(6);
    free.service.create({ name: sfs.string("Free Guild") });
    expect(free.charges).toEqual([0n]);
    expect(free.draws()).toBe(1);
    expect(free.context.write.alliances?.[0]!.abbr).toBe("Fre");
});

test("invalid creation and existing or foreign memberships fail before charges", () => {
    for (const name of ["ab", "x".repeat(21), "<bad>"])
    {
        const h = fixture();
        expect(() => h.service.create({ name: sfs.string(name) })).toThrow();
        expect(h.charges).toEqual([]);
        expect(h.context.write).toEqual({});
    }
    for (const kind of ["existing", "cross", "castle", "member"])
    {
        const h = fixture(kind === "existing" ? "guild" : "");
        if (kind === "cross")
        {
            h.profile.crossFightSrcServerId = 1;
        }
        if (kind === "castle")
        {
            h.setCastle(3);
        }
        if (kind === "member")
        {
            h.context.state.members = [{ uid: "owner", allianceId: "elsewhere" }];
        }
        expect(() => h.service.create({ name: sfs.string("Guild") })).toThrow("locked");
        expect(h.charges).toEqual([]);
    }
});

test("entry guards team, foreign and incoming marches at the exact arrival boundary", () => {
    for (
        const march of [
            { ownerUid: "owner", teamId: "team" },
            { ownerUid: "owner", allianceId: "foreign" },
            { allianceId: "guild", state: 0, targetUid: "owner", marchArrivalTime: 1000n },
            { allianceId: "guild", state: 0, targetId: 9, marchArrivalTime: 1001n },
        ] as AllianceRecord[]
    )
    {
        const h = fixture();
        h.context.state.marches = [march];
        h.context.state.points = [{ ownerId: "owner", id: 9 }];
        expect(() => h.service.join("owner", h.context.alliance())).toThrow("locked");
        expect(h.context.write).toEqual({});
    }
    const bounded = fixture();
    bounded.context.state.marches = Array.from({ length: 8193 }, () => ({}));
    expect(() => bounded.service.join("owner", bounded.context.alliance())).toThrow("locked");
    const arrived = fixture();
    arrived.context.state.marches = [{
        allianceId: "guild",
        state: 0,
        targetUid: "owner",
        marchArrivalTime: 999n,
    }];
    expect(() => arrived.service.join("owner", arrived.context.alliance())).not.toThrow();
});

test("entry uses current population plus truncated science capacity and preserves prior honor", () => {
    const h = fixture("", 9007199254740993n);
    h.context.state.members = [{ uid: "leader", allianceId: "guild", rank: 5 }, {
        uid: "owner",
        allianceId: "",
        point: 7,
        accPoint: 12,
    }];
    const alliance = { ...h.context.alliance(), maxMember: 1 };
    h.setEffect(0.9);
    expect(() => h.service.join("owner", alliance)).toThrow("full");
    h.setEffect(1.9);
    const result = h.service.join("owner", alliance);
    expect(h.context.write.members?.[0]).toMatchObject({
        rank: 1,
        point: 7,
        accPoint: 12,
        jointime: 9007199254740993n,
        donateAvailable: 1,
        donateTime: 0n,
    });
    expect(decode(encode(result))).toEqual(result);
    expect(h.previews).toEqual([]);
    expect(h.context.write.mails).toBeUndefined();
});

test("first membership pins a deterministic reward mail and preserves preview and byte ordering", () => {
    const h = fixture();
    h.context.state.lords = [];
    h.setRewards([{ kind: "item", type: 7, id: "item", count: 2 }, {
        kind: "count",
        type: 5,
        value: 200,
    }]);
    const result = h.service.join("owner", h.context.alliance());
    expect(h.previews).toEqual([{
        reward: "reward",
        sameCatalog: true,
        info: { kingdomId: 7, version: "12.06.0", now: 1000 },
        draw: 9,
    }]);
    expect(h.context.write.mails?.[0]).toEqual({
        uid: stableId("alliance-first-join:owner") + "00",
        toUser: "owner",
        fromUser: null,
        fromName: "System",
        title: "First join",
        type: 2,
        contents: Buffer.from([87, 0, 0]),
        rewardId: "goods,item,2|gold,0,200",
        rewardStatus: 0,
        createTime: 1000n,
        itemIdFlag: 1,
    });
    expect(h.events).toEqual(["rewards", "bytes", "snapshot"]);
    expect(result.isfirstJoin).toEqual(sfs.int(1));
    const empty = fixture();
    empty.context.state.lords = [];
    empty.setRewards([]);
    empty.service.join("owner", empty.context.alliance());
    expect(empty.context.write.mails?.[0]).toMatchObject({ rewardId: null, rewardStatus: 1 });
    const missing = fixture();
    missing.context.state.lords = [];
    (missing.context.rules.mail as Map<string, unknown>).clear();
    missing.service.join("owner", missing.context.alliance());
    expect(missing.context.write.mails).toBeUndefined();
    expect(missing.previews).toEqual([]);
});

test("unsupported reward kinds and missing message bytes abort the membership plan", () => {
    for (
        const rewards of [
            [{ kind: "prestige", type: 31, currentCivilization: true, value: 1 }],
            [{ kind: "count", type: 6, value: 1 }],
        ] as RewardPreview[][]
    )
    {
        const h = fixture();
        h.context.state.lords = [];
        h.setRewards(rewards);
        expect(() => h.service.join("owner", h.context.alliance())).toThrow("invalid");
        expect(h.context.write.mails).toBeUndefined();
        expect([...h.context.productionOwners]).toEqual([]);
    }
    const missing = fixture();
    missing.context.state.lords = [];
    missing.runtime.javaMailBytes = () => null;
    expect(() => missing.service.join("owner", missing.context.alliance())).toThrow("invalid");
    expect(missing.context.write.mails).toBeUndefined();
});

test("removal closes first-join eligibility and schedules production only after guards", () => {
    const h = fixture("guild");
    h.context.state.members = [{ uid: "owner", allianceId: "guild", rank: 1 }, {
        uid: "leader",
        allianceId: "guild",
        rank: 5,
    }];
    const result = h.service.remove("owner");
    expect(h.context.write.memberships).toEqual([{ uid: "owner", allianceId: "" }]);
    expect(h.context.write.removedMembers).toEqual(["owner"]);
    expect(h.context.write.firstJoin).toEqual(["owner"]);
    expect(h.context.write.alliances?.[0]!.curMember).toBe(1);
    expect([...h.context.productionOwners]).toEqual(["owner"]);
    expect(result).toEqual({ uid: sfs.string("owner"), allianceId: sfs.string("guild") });
    expect(decode(encode(result))).toEqual(result);
    for (const kind of ["team", "cross"])
    {
        const rejected = fixture("guild");
        if (kind === "team")
        {
            rejected.context.state.marches = [{ ownerUid: "owner", teamId: "team" }];
        }
        else
        {
            rejected.profile.crossFightSrcServerId = 1;
        }
        expect(() => rejected.service.remove("owner")).toThrow("locked");
        expect(rejected.context.write).toEqual({});
    }
});
