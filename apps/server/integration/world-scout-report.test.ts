import { expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { eq, and, sql } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { world_march_checkpoint } from "@opencok/drizzle/schema/opencok_kingdom/world_march_checkpoint";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import {
    readWorldScoutTargets,
    writeWorldScoutMails,
} from "@opencok/repositories/world-scout-report";
import { fenceRealmTransaction } from "@opencok/repositories/realm-authority";
import { mailContentsProjection } from "@opencok/services/mail-contents";
import { encodeScoutReport } from "@opencok/mappings/world-scout-report";
import { decodeLegacyJsonObject } from "@opencok/messages/legacy-json";
import type { WorldScoutMail } from "@opencok/contracts/world-scout-report";
import { sfs, fields, type Value } from "@opencok/messages/sfs";
import { scoutHarness } from "./support/world-scout";
async function arrive(h: Awaited<ReturnType<typeof scoutHarness>>)
{
    const [checkpoint] = await h.db.db
        .select()
        .from(world_march_checkpoint)
        .where(
            and(eq(world_march_checkpoint.ownerUid, "owner"), eq(world_march_checkpoint.status, 0)),
        );
    h.clock.now = Number(checkpoint!.dueAt);
    await h.tick();
}
test(
    "native scout mail exposes only watchtower-selected city intel and preserves resources beyond safe JS integer range through the actual mail reader",
    async () => {
        const h = await scoutHarness();
        try
        {
            await h.db.db
                .update(user_building)
                .set({ level: 1 })
                .where(eq(user_building.uuid, "owner-watchtower"));
            await h.db.db
                .update(user_resource)
                .set({ wood: 9007199254740993n, woodbind: 100n })
                .where(eq(user_resource.uid, "other"));
            await h.scout();
            await arrive(h);
            const reports = await h.db.db
                    .select()
                    .from(mail)
                    .where(and(eq(mail.toUser, "owner"), eq(mail.type, 8))),
                notices = await h.db.db
                    .select()
                    .from(mail)
                    .where(and(eq(mail.toUser, "other"), eq(mail.type, 6)));
            expect(reports).toHaveLength(1);
            expect(notices).toHaveLength(1);
            const report = decodeLegacyJsonObject(reports[0]!.contents.toString("utf8"));
            expect(fields(report.resource).wood).toEqual(sfs.long(9007199254740993n));
            expect(report.defence).toBeUndefined();
            expect(report.fort).toBeUndefined();
            expect(report.rein_about).toBeUndefined();
            expect(fields(report.user).uid).toEqual(sfs.string("other"));
            const projected = mailContentsProjection(
                    reports.map((row) => ({
                        uid: row.uid,
                        type: row.type,
                        createTime: row.createTime,
                        contents: row.contents,
                        extra: null,
                    })),
                ),
                body = fields((projected.body.result!.value as Value[])[0]);
            expect(projected.invalidIds).toEqual([]);
            expect(fields(body.resource).wood).toEqual(sfs.long(9007199254740993n));
            expect(notices[0]!.contents.toString("utf8")).toBe("Synthetic|1|1220");
            expect(notices[0]!.fromUser).toBe("owner");
            expect(notices[0]!.rewardId).toBeNull();
            expect(reports[0]!.rewardId).toBeNull();
            expect(
                (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "other")))[
                    0
                ]!.wood,
            ).toBe(9007199254740993n);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "scout snapshots read bounded foreign facts without waiting on a foreign profile lock or exposing unrelated account fields",
    async () => {
        const h = await scoutHarness();
        const connect = async () => h.db.pool.connect();
        let foreign: Awaited<ReturnType<typeof connect>> | undefined;
        try
        {
            foreign = await h.db.pool.connect();
            await foreign.query("BEGIN");
            await foreign.query(
                "SELECT uid FROM opencok_kingdom.userprofile WHERE uid=$1 FOR UPDATE",
                [
                    "other",
                ],
            );
            const target = await h.db.db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, h.authority);
                await tx.execute(sql`SET LOCAL lock_timeout='300ms'`);
                await tx
                    .select({ uid: userprofile.uid })
                    .from(userprofile)
                    .where(eq(userprofile.uid, "owner"))
                    .for("update");
                await tx.execute(sql`select pg_advisory_xact_lock(728214,0)`);
                return (await readWorldScoutTargets(tx, [1220], 1)).get(1220)!;
            });
            expect(target.participant!.profile.uid).toBe("other");
            expect(target.participant!.armies[0]!.free).toBe(42);
            expect(Object.keys(target.participant!.profile).sort()).toEqual(
                [
                    "allianceId",
                    "appVersion",
                    "civilizationType",
                    "crossFightSrcServerId",
                    "level",
                    "name",
                    "pic",
                    "picVer",
                    "picfraId",
                    "serverId",
                    "uid",
                ].sort(),
            );
        }
        finally
        {
            if (foreign)
            {
                await foreign.query("ROLLBACK");
                foreign.release();
            }
            await h.close();
        }
    },
    120000,
);
test(
    "scout mail writes require persisted owned SCOUT admission and same-realm recipient facts, with whole-batch rollback",
    async () => {
        const h = await scoutHarness();
        try
        {
            await h.db.db.insert(world_march).values({
                uuid: "synthetic-scout",
                ownerUid: "owner",
                ownerId: 1202,
                type: 1,
                targetId: 1220,
                targetType: 1,
                marchStartTime: 1n,
                marchArrivalTime: 2n,
                state: 0,
                worldId: 0,
            });
            const value = (
                type: 2 | 6 | 8,
                recipient: string,
                patch: Partial<WorldScoutMail> = {},
            ): WorldScoutMail => ({
                id: createHash("sha256")
                    .update(`scout:synthetic-scout:${recipient}:${type}`)
                    .digest("hex")
                    .slice(0, 32) + "00",
                march: "synthetic-scout",
                owner: "owner",
                target: 1220,
                targetOwner: "other",
                recipient,
                type,
                sender: "",
                senderName: "",
                title: "",
                contents: type === 8
                    ? encodeScoutReport({
                        resource: sfs.object({ wood: sfs.long(9007199254740993n) }),
                    })
                    : Buffer.from(type === 2 ? "114005" : "notice"),
                itemIdFlag: type === 2 ? 1 : 0,
                createdAt: 10n,
                ...patch,
            });
            const write = (values: WorldScoutMail[]) =>
                h.db.db.transaction(async (tx) => {
                    await fenceRealmTransaction(tx, h.authority);
                    await writeWorldScoutMails(tx, "owner", values);
                });
            await expect(write([value(8, "owner", { march: "unowned" })])).rejects.toThrow();
            await expect(write([value(8, "owner", { recipient: "other" })])).rejects.toThrow();
            await expect(
                write([
                    value(2, "owner", { contents: Buffer.from("arbitrary reward"), itemIdFlag: 1 }),
                ]),
            ).rejects.toThrow();
            await h.db.db.update(userprofile).set({ serverId: 2 }).where(
                eq(userprofile.uid, "other"),
            );
            await expect(write([value(8, "owner"), value(6, "other")])).rejects.toThrow();
            expect(await h.db.db.select().from(mail)).toHaveLength(0);
            await h.db.db.update(userprofile).set({ serverId: 1 }).where(
                eq(userprofile.uid, "other"),
            );
            await write([value(8, "owner"), value(6, "other")]);
            const saved = await h.db.db.select().from(mail);
            expect(saved).toHaveLength(2);
            expect(
                saved.every((row) =>
                    row.rewardId === null && row.rewardStatus === 1 && row.itemIdFlag === 0
                ),
            ).toBe(true);
            expect(saved.find((row) => row.type === 8)!.contents.toString("utf8")).toContain(
                "9007199254740993",
            );
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "blank legacy client metadata keeps physical upkeep readable while actual report visibility stays source-gated",
    async () => {
        const h = await scoutHarness();
        try
        {
            await h.db.db.update(userprofile).set({ appVersion: null }).where(
                eq(userprofile.uid, "other"),
            );
            await h.scout();
            await arrive(h);
            expect(
                (await h.db.db.select().from(mail)).filter((row) =>
                    row.type === 8 && row.toUser === "owner"
                ),
            ).toHaveLength(1);
            expect(
                (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "other")))[0]!
                    .appVersion,
            ).toBeNull();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
