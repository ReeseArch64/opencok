import { afterEach, expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { alliance_science } from "@opencok/drizzle/schema/opencok_kingdom/alliance_science";
import { alliance_donate } from "@opencok/drizzle/schema/opencok_kingdom/alliance_donate";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { user_gift } from "@opencok/drizzle/schema/opencok_kingdom/user_gift";
import { timed_activity } from "@opencok/drizzle/schema/opencok_kingdom/timed_activity";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { economy_posting } from "@opencok/drizzle/schema/opencok_kingdom/economy_posting";
import { createAllianceRepository } from "@opencok/repositories/alliance-gameplay";
import { createCityProductionBoundary } from "@opencok/production/repositories/city-boundary";
import { createRealmAllianceService } from "../src/composition/alliance";
import { createRealmResearchDomain } from "../src/composition/research";
import { fields, str, int, sfs, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

const researchDomain = createRealmResearchDomain();

let close: (() => Promise<void>) | undefined;
afterEach(async () => {
    await close?.();
    close = undefined;
});
async function harness()
{
    const h = await cityHarness([researchDomain]);
    close = h.close;
    await h.db.db.update(user_building).set({ level: 4 }).where(eq(user_building.itemId, 400000));
    const boundary = createCityProductionBoundary(h.preparation, (row) => {
        const rule = h.rules.building(
            String(row.itemId),
            Number(row.level),
            Number(row.star ?? 0),
            Number(row.progress ?? 0),
        );
        return rule.effects?.productionPerHour === undefined
            ? undefined
            : ["wood", "stone", "iron", "food"][rule.effects.productionResourceId ?? -1];
    });
    const repository = createAllianceRepository(
        h.db.db,
        h.authority,
        boundary,
        () => h.clock.now,
        h.handlers.domains,
    );
    const service = createRealmAllianceService(repository, h.rules, h.effects);
    const command = (name: string, params: Fields = {}, owner = "owner") =>
        service.command(owner, name, { operationId: sfs.string(randomUUID()), ...params });
    const create = async () => {
        const result = await command("al.create", {
            name: sfs.string("Synthetic"),
            intro: sfs.string("Synthetic alliance"),
        });
        return str(fields(result.body.alliance), "uid");
    };
    return { ...h, repository, allianceService: service, allianceCommand: command, create };
}
test("alliance creation and concurrent joins preserve one membership and one leader", async () => {
    const h = await harness(),
        id = await h.create();
    const params = { allianceId: sfs.string(id), operationId: sfs.string(randomUUID()) };
    const [a, b] = await Promise.all([
        h.allianceCommand("al.apply", params, "other"),
        h.allianceCommand("al.apply", params, "other"),
    ]);
    expect(a).toEqual(b);
    const members = await h.db.db.select().from(alliance_member);
    expect(members.filter((row) => row.allianceId === id)).toHaveLength(2);
    expect(members.filter((row) => row.rank === 5)).toHaveLength(1);
    expect(
        (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "other")))[0]!
            .allianceId,
    ).toBe(id);
    await expect(h.allianceCommand("al.leave")).rejects.toThrow();
    const transferred = await h.allianceCommand("al.leader.trans", {
        playerId: sfs.string("other"),
    });
    expect(int(fields(transferred.body.alliance), "rank")).toBe(4);
    await h.allianceCommand("al.leave");
    const reloaded = createRealmAllianceService(h.repository, h.rules, h.effects);
    const init = await reloaded.command("other", "alliance.init", {});
    expect(str(fields(init.body.alliance), "learderUid")).toBe("other");
    expect(int(fields(init.body.alliance), "member")).toBe(1);
    await expect(
        h.allianceCommand("al.setrank", { playerId: sfs.string("other"), rank: sfs.int(5) }),
    ).rejects.toThrow();
}, 30000);
test("member ranking returns each player's selected avatar and frame", async () => {
    const h = await harness(),
        id = await h.create();
    await h.allianceCommand("al.apply", { allianceId: sfs.string(id) }, "other");
    await h.db.db
        .update(userprofile)
        .set({ pic: "g529", picVer: 3, picfraId: 17 })
        .where(eq(userprofile.uid, "owner"));
    await h.db.db
        .update(userprofile)
        .set({ pic: "g522", picVer: 5, picfraId: 19 })
        .where(eq(userprofile.uid, "other"));
    const result = await h.allianceCommand("al.rank");
    const members = (result.body.list!.value as ReturnType<typeof sfs.object>[]).map(fields);
    expect(
        members.map((member) => [
            str(member, "uid"),
            str(member, "pic"),
            int(member, "picVer"),
            int(member, "picfraId"),
        ]),
    ).toEqual([
        ["owner", "g529", 3, 17],
        ["other", "g522", 5, 19],
    ]);
}, 30000);
test("applications require current authority and invitations require their recipient", async () => {
    const h = await harness(),
        id = await h.create();
    await h.allianceCommand("al.attr", { recruit: sfs.int(0) });
    const applied = await h.allianceCommand("al.apply", { allianceId: sfs.string(id) }, "other");
    expect(applied.body.joinBool?.value).toBe(false);
    await expect(
        h.allianceCommand("al.acceptapply", { playerId: sfs.string("other") }, "other"),
    ).rejects.toThrow();
    await h.allianceCommand("al.acceptapply", { playerId: sfs.string("other") });
    await h.allianceCommand("al.leave", {}, "other");
    const invited = await h.allianceCommand("al.invite", { playerId: sfs.string("other") });
    const mailId = str(invited.body, "mailId");
    await expect(
        h.allianceCommand("al.acceptinvite", { mailId: sfs.string(mailId) }),
    ).rejects.toThrow();
    await h.allianceCommand("al.acceptinvite", { mailId: sfs.string(mailId) }, "other");
    await expect(
        h.allianceCommand("al.acceptinvite", { mailId: sfs.string(mailId) }, "other"),
    ).rejects.toThrow();
    await expect(
        h.allianceCommand("al.permission.modify", { rankData: sfs.string("0_1:0") }, "other"),
    ).rejects.toThrow();
    await h.db.db.update(userprofile).set({ allianceId: "" }).where(eq(userprofile.uid, "owner"));
    await expect(
        h.allianceCommand("al.setrank", { playerId: sfs.string("other"), rank: sfs.int(2) }),
    ).rejects.toThrow();
    expect(
        (await h.db.db.select().from(alliance_member).where(eq(alliance_member.uid, "other")))[0]!
            .rank,
    ).toBe(1);
}, 30000);
test("capacity, realm checks and receipt conflicts roll back alliance operations", async () => {
    const h = await harness(),
        id = await h.create();
    await h.db.db.update(alliance).set({ maxMember: 1 }).where(eq(alliance.uid, id));
    await expect(
        h.allianceCommand("al.apply", { allianceId: sfs.string(id) }, "other"),
    ).rejects.toThrow();
    expect(
        (await h.db.db.select().from(alliance_member)).filter((row) => row.allianceId === id),
    ).toHaveLength(1);
    const operationId = randomUUID();
    await h.allianceCommand("al.permission.modify", {
        rankData: sfs.string("0_1:0"),
        operationId: sfs.string(operationId),
    });
    await expect(
        h.allianceCommand("al.permission.modify", {
            rankData: sfs.string("0_1:1"),
            operationId: sfs.string(operationId),
        }),
    ).rejects.toThrow("receipt conflict");
    await h.db.db.update(userprofile).set({ serverId: 2 }).where(eq(userprofile.uid, "other"));
    await expect(h.allianceCommand("al.invite", { playerId: sfs.string("other") })).rejects
        .toThrow();
    expect((await h.db.db.select().from(alliance)).at(0)!.permission).toContain("\"0_1\":0");
}, 30000);
test("donations debit once, cap progress and complete durable research after restart", async () => {
    const h = await harness(),
        id = await h.create();
    const fresh = await h.allianceCommand("al.science.fresh", { scienceId: sfs.int(250000) });
    expect(int(fresh.body, "lowNum")).toBe(3000);
    const operationId = randomUUID(),
        params = {
            scienceId: sfs.int(250000),
            option: sfs.int(0),
            operationId: sfs.string(operationId),
        };
    const before =
        (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!
            .gold;
    const a = await h.allianceCommand("al.science.donate", params),
        b = await h.allianceCommand("al.science.donate", params);
    expect(a).toEqual(b);
    expect((await h.db.db.select().from(alliance_science))[0]!.donateprogress).toBe(40);
    expect((await h.db.db.select().from(alliance_member))[0]!.point).toBe(200);
    expect(
        (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold,
    ).toBe(before);
    expect(await h.db.db.select().from(alliance_donate)).toHaveLength(1);
    await h.db.db
        .update(alliance_science)
        .set({ donateprogress: 40000, donatefinish: 1 })
        .where(eq(alliance_science.allianceId, id));
    const started = await h.allianceCommand("al.science.research", { scienceId: sfs.int(250000) });
    await expect(
        h.allianceCommand("al.science.research", { scienceId: sfs.int(250000) }),
    ).rejects.toThrow();
    h.clock.now = Number(started.body.finishTime!.value);
    const { AllianceScienceRecoveryReader } = await import(
        "@opencok/alliance/repositories/science-recovery"
    );
    const pending = await new AllianceScienceRecoveryReader(h.db.db).due(1, BigInt(h.clock.now));
    expect(pending).toHaveLength(1);
    expect(Buffer.isBuffer(pending[0]!.accelerate)).toBe(true);
    const restarted = createRealmAllianceService(h.repository, h.rules, h.effects);
    await restarted.command("owner", "alliance.init", {});
    await restarted.command("owner", "alliance.init", {});
    const science = (await h.db.db.select().from(alliance_science))[0]!;
    expect(science.level).toBe(1);
    expect(science.donateprogress).toBe(0);
    expect(
        (await h.db.db.select().from(command_receipt)).filter((row) =>
            row.requestId === operationId
        ),
    ).toHaveLength(1);
    expect(
        (await h.db.db.select().from(economy_posting)).filter((row) =>
            row.requestId === operationId
        ),
    ).toHaveLength(1);
}, 30000);
test("help binds to the active generation and each helper can shorten it once", async () => {
    const h = await harness(),
        id = await h.create();
    await h.allianceCommand("al.apply", { allianceId: sfs.string(id) }, "other");
    await h.db.db.insert(user_building).values({
        uuid: "embassy",
        uid: "owner",
        itemId: 402000,
        level: 1,
        pos: 2,
        opType: 0,
        refreshTime: BigInt(h.clock.now),
    });
    await h.command("build.upgrade", { uuid: sfs.string("owner-413000") });
    const before = await h.active(0),
        called = await h.allianceCommand("al.callhelp", {
            queueId: sfs.string(before.queueId),
            qType: sfs.int(0),
            itemId: sfs.string("413000"),
        });
    const helpId = str(called.body, "helpId");
    await expect(
        h.allianceCommand(
            "al.renderhelp",
            { helpId: sfs.string(helpId), uid: sfs.string("owner") },
            "other",
        ),
    ).rejects.toThrow();
    await h.allianceCommand(
        "al.renderhelp",
        { helpId: sfs.string(helpId), uid: sfs.string("other") },
        "other",
    );
    const after = await h.active(0);
    expect(after.dueAt).toBeLessThan(before.dueAt);
    expect(after.version).toBe(before.version + 1);
    await expect(
        h.allianceCommand("al.renderhelp", { helpId: sfs.string(helpId) }, "other"),
    ).rejects.toThrow();
    expect(
        (await h.db.db.select().from(queue).where(eq(queue.uuid, before.queueId)))[0]!.updateTime,
    ).toBe(after.dueAt);
    await h.finish(0);
    await h.command("build.upgrade", { uuid: sfs.string("owner-413000") });
    await expect(
        h.allianceCommand("al.renderhelp", { helpId: sfs.string(helpId) }, "other"),
    ).rejects.toThrow();
    expect(
        (await h.db.db.select().from(timed_activity)).filter((row) => row.status === 1),
    ).toHaveLength(1);
}, 30000);
test(
    "shared gift claims enforce recipient, expiry and one reward per saved entitlement",
    async () => {
        const h = await harness(),
            id = await h.create();
        await h.allianceCommand("al.apply", { allianceId: sfs.string(id) }, "other");
        for (const uid of ["owner", "other"])
        {
            await h.db.db.insert(user_gift).values({
                uuid: uid + "-gift",
                giftId: "shared",
                uid,
                allianceId: id,
                gifttype: 30000,
                level: 1,
                item: "6",
                num: 50,
                exp: 10,
                time: BigInt(h.clock.now),
                expiretime: 4,
                valid: 1,
            });
        }
        await expect(
            h.allianceCommand("al.opengift", { giftId: sfs.string("other-gift") }),
        ).rejects.toThrow();
        await Promise.all([
            h.allianceCommand("al.opengift", { giftId: sfs.string("owner-gift") }),
            h.allianceCommand("al.opengift", { giftId: sfs.string("other-gift") }, "other"),
        ]);
        await expect(
            h.allianceCommand("al.opengift", { giftId: sfs.string("owner-gift") }),
        ).rejects.toThrow();
        expect((await h.db.db.select().from(alliance))[0]!.giftlevel).toBe(20);
        expect((await h.db.db.select().from(alliance_member)).map((row) => row.point)).toEqual([
            50,
            50,
        ]);
        await h.allianceCommand("al.cleargift", { giftId: sfs.string("owner-gift") });
        expect(await h.db.db.select().from(user_gift)).toHaveLength(1);
    },
    30000,
);

test(
    "trusted gift publication pins one outcome per member and blocks client generation",
    async () => {
        const h = await harness(),
            id = await h.create();
        await h.allianceCommand("al.apply", { allianceId: sfs.string(id) }, "other");
        const event = randomUUID();
        const [first, second] = await Promise.all([
            h.allianceService.publishGift("owner", event, 30000),
            h.allianceService.publishGift("other", event, 30000),
        ]);
        expect(str(first.body, "giftId")).toBe(str(second.body, "giftId"));
        const before = await h.db.db.select().from(user_gift);
        expect(before).toHaveLength(2);
        expect(new Set(before.map((row) => row.uid)).size).toBe(2);
        const restarted = createRealmAllianceService(h.repository, h.rules, h.effects);
        await restarted.publishGift("owner", event, 30000);
        expect(await h.db.db.select().from(user_gift)).toEqual(before);
        await expect(h.allianceCommand("al.gengift", { typeId: sfs.int(30000) })).rejects.toThrow();
        h.clock.now += 5 * 3600000;
        await expect(
            h.allianceCommand(
                "al.opengift",
                { giftId: sfs.string(before[0]!.uuid) },
                before[0]!.uid,
            ),
        ).rejects.toThrow();
    },
    30000,
);
test(
    "first membership sends one claimable system mail and leaving closes the first-join exception",
    async () => {
        const h = await harness(),
            id = await h.create();
        await h.allianceCommand("al.apply", { allianceId: sfs.string(id) }, "other");
        const { mail } = await import("@opencok/drizzle/schema/opencok_kingdom/mail");
        const first = (await h.db.db.select().from(mail)).filter(
            (row) => row.toUser === "other" && row.type === 2,
        );
        expect(first).toHaveLength(1);
        expect(first[0]!.rewardId?.replaceAll("\0", "")).toBe("gold,0,200");
        await h.allianceCommand("al.leave", {}, "other");
        await h.allianceCommand("al.apply", { allianceId: sfs.string(id) }, "other");
        expect(
            (await h.db.db.select().from(mail)).filter((row) =>
                row.toUser === "other" && row.type === 2
            ),
        ).toHaveLength(1);
        await h.allianceCommand("al.science.fresh", { scienceId: sfs.int(250000) }, "other");
        await expect(
            h.allianceCommand(
                "al.science.donate",
                { scienceId: sfs.int(250000), option: sfs.int(0) },
                "other",
            ),
        ).rejects.toThrow();
    },
    30000,
);
test(
    "research schedules the production effect at its deadline before delayed completion",
    async () => {
        const h = await harness(),
            id = await h.create();
        const { building_production } = await import(
            "@opencok/drizzle/schema/opencok_kingdom/building_production"
        );
        const { decodeProductionRates } = await import("@opencok/production/mappings/production");
        const { allianceScienceStage, allianceScienceRule } = await import(
            "@opencok/rules/alliance-science"
        );
        const scienceId = 251200,
            total = allianceScienceStage(allianceScienceRule(h.rules, scienceId), 0).total;
        await h.db.db
            .insert(alliance_science)
            .values({
                allianceId: id,
                scienceId,
                level: 0,
                donatefinish: 1,
                donateprogress: total,
            });
        const research = await h.allianceCommand("al.science.research", {
                scienceId: sfs.int(scienceId),
            }),
            deadline = BigInt(String(research.body.finishTime!.value));
        const account = (
            await h.db.db
                .select()
                .from(building_production)
                .where(eq(building_production.buildingId, "owner-413000"))
        )[0]!;
        const rates = decodeProductionRates(account.rates),
            before = rates.find((row) => row.at < deadline)!,
            after = rates.find((row) => row.at === deadline)!;
        expect(after.perHour).toBeGreaterThan(before.perHour);
        h.clock.now = Number(deadline) + 3600000;
        await h.production.command("owner", "production.settle", {});
        await h.allianceService.command("owner", "alliance.tick", {});
        const saved = (
            await h.db.db
                .select()
                .from(building_production)
                .where(eq(building_production.buildingId, "owner-413000"))
        )[0]!;
        expect(decodeProductionRates(saved.rates)[0]!.perHour).toBe(after.perHour);
        expect((await h.db.db.select().from(alliance_science))[0]!.level).toBe(1);
    },
    30000,
);
test("outbox publication uses current members and preserves pending unrelated events", async () => {
    const h = await harness(),
        id = await h.create();
    await h.allianceCommand("al.attr", { recruit: sfs.int(0) });
    await h.allianceCommand("al.apply", { allianceId: sfs.string(id) }, "other");
    await h.allianceCommand("al.acceptapply", { playerId: sfs.string("other") });
    const { relayMutationEvent } = await import("@opencok/repositories/mutation");
    const { publishAllianceMutation, createAlliancePublicationReader } = await import(
        "../src/composition/alliance"
    );
    const { mutation_outbox } = await import(
        "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox"
    );
    const notifications: { owner: string; command: string; body: Fields; }[] = [];
    const publish = (owner: string, command: string, body: Fields) => {
        notifications.push({ owner, command, body });
        return Promise.resolve();
    };
    const drain = async () => {
        while (
            await relayMutationEvent(
                h.db.db,
                h.authority,
                (event) =>
                    publishAllianceMutation(
                        createAlliancePublicationReader(h.db.db, h.authority),
                        event.payload,
                        publish,
                        h.rules,
                    ),
                () => h.clock.now,
                "alliance.changed",
            )
        )
        {
        }
    };
    await drain();
    expect(notifications.some((row) => row.owner === "other" && row.command === "push.al.join"))
        .toBe(
            true,
        );
    notifications.length = 0;
    await h.allianceCommand("al.kick", { playerId: sfs.string("other") });
    await drain();
    expect(
        notifications.some((row) => row.owner === "other" && row.command === "push.al.leave"),
    ).toBe(true);
    expect(
        notifications
            .filter((row) => row.command === "push.al.update")
            .every((row) => row.owner === "owner"),
    ).toBe(true);
    expect(
        (await h.db.db.select().from(mutation_outbox)).filter(
            (row) => row.eventType === "inventory.changed" && row.publishedAt === 0n,
        ).length,
    ).toBeGreaterThan(0);
    notifications.length = 0;
    await h.allianceCommand("al.attr", { recruit: sfs.int(1) });
    await h.allianceCommand("al.apply", { allianceId: sfs.string(id) }, "other");
    await h.allianceCommand("al.leave", {}, "other");
    const next = await h.allianceCommand(
        "al.create",
        { name: sfs.string("Another"), intro: sfs.string("") },
        "other",
    );
    const nextId = str(fields(next.body.alliance), "uid");
    await drain();
    expect(
        notifications.some((row) => row.owner === "other" && row.command === "push.al.leave"),
    ).toBe(false);
    expect(
        notifications.some(
            (row) =>
                row.owner === "other"
                && row.command === "push.al.update"
                && str(fields(row.body.alliance), "uid") === nextId,
        ),
    ).toBe(true);
}, 30000);

test(
    "native name, abbreviation, lookup and first-page commands preserve their meanings",
    async () => {
        const h = await harness(),
            id = await h.create();
        expect(
            (await h.allianceCommand("al.name", { name: sfs.string("Synthetic") })).body.result
                ?.value,
        ).toBe(true);
        expect((await h.allianceCommand("al.abbr", { abbr: sfs.string("Syn") })).body.result?.value)
            .toBe(
                true,
            );
        expect(
            str(
                (await h.allianceCommand("al.check", { uid: sfs.string("owner") })).body,
                "allianceId",
            ),
        ).toBe(id);
        const search = await h.allianceCommand("al.search", {
            key: sfs.string("Synthetic"),
            page: sfs.int(1),
            type: sfs.int(1),
        });
        expect((search.body.list!.value as unknown[]).length).toBe(1);
        expect(search.body.total?.value).toBe(1n);
        await h.allianceCommand("al.targetscience.set", {
            scienceId: sfs.string("250000"),
            isuse: sfs.int(1),
        });
        expect(
            str(
                fields(
                    (await h.allianceService.command("owner", "alliance.init", {})).body.alliance,
                ),
                "targetScience",
            ),
        ).toBe("250000");
        await expect(
            h.allianceCommand("al.view", { operationId: sfs.string("alliance-research:reserved") }),
        ).rejects.toThrow();
        await expect(
            h.allianceCommand("al.science.donate", {
                scienceId: sfs.int(250000),
                option: sfs.string("0"),
            }),
        ).rejects.toThrow();
    },
    30000,
);
test("simultaneous applicants cannot both consume the final alliance slot", async () => {
    const h = await harness(),
        id = await h.create();
    const { user_resource } = await import("@opencok/drizzle/schema/opencok_kingdom/user_resource");
    const template = (
        await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "other"))
    )[0]!;
    await h.db.db.insert(userprofile).values({
        uid: "third",
        name: "Synthetic third",
        country: "BR",
        level: 1,
        exp: 0,
        serverId: 1,
        gold: 1000n,
    });
    await h.db.db.insert(user_resource).values({ ...template, uid: "third" });
    await h.db.db.update(alliance).set({ maxMember: 2 }).where(eq(alliance.uid, id));
    const results = await Promise.allSettled([
        h.allianceCommand("al.apply", { allianceId: sfs.string(id) }, "other"),
        h.allianceCommand("al.apply", { allianceId: sfs.string(id) }, "third"),
    ]);
    expect(results.filter((row) => row.status === "fulfilled")).toHaveLength(1);
    expect(
        (await h.db.db.select().from(alliance_member)).filter((row) => row.allianceId === id),
    ).toHaveLength(2);
    expect((await h.db.db.select().from(alliance))[0]!.curMember).toBe(2);
}, 30000);

test(
    "an unresolved imported alliance does not block initialization or clear the saved profile",
    async () => {
        const h = await harness();
        await h.db.db
            .update(userprofile)
            .set({ allianceId: "unresolved" })
            .where(eq(userprofile.uid, "owner"));
        const initialized = await h.allianceService.command("owner", "alliance.init", {});
        expect(fields(initialized.body.alliance)).toEqual({});
        expect(
            (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!
                .allianceId,
        ).toBe("unresolved");
        await expect(
            h.allianceCommand("al.create", { name: sfs.string("Another"), intro: sfs.string("") }),
        ).rejects.toThrow();
    },
    30000,
);
test(
    "weekly donation history expires on reads and resets on the first contribution in a new period",
    async () => {
        const h = await harness();
        await h.create();
        const { donate_history } = await import(
            "@opencok/drizzle/schema/opencok_kingdom/donate_history"
        );
        const { readDonationRanking } = await import("@opencok/repositories/community-ranking");
        const { rankingCalendar } = await import("@opencok/rules/community-ranking");
        await h.allianceCommand("al.science.fresh", { scienceId: sfs.int(250000) });
        await h.allianceCommand("al.science.donate", {
            scienceId: sfs.int(250000),
            option: sfs.int(0),
        });
        expect((await h.db.db.select().from(donate_history))[0]!.donate).toBe(200);
        h.clock.now = Number(rankingCalendar(h.clock.now).nextMonday) + 1;
        expect(
            (await readDonationRanking(h.db.db, "owner", h.clock.now)).rows[0]!.historyDonate,
        ).toBeNull();
        await h.allianceCommand("al.science.donate", {
            scienceId: sfs.int(250000),
            option: sfs.int(0),
        });
        expect((await h.db.db.select().from(donate_history))[0]!.donate).toBe(200);
        expect((await h.db.db.select().from(alliance_member))[0]!.point).toBe(400);
    },
    30000,
);
