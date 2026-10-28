import { expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import type { GameStore } from "@opencok/contracts/game";
import { activity } from "@opencok/drizzle/schema/opencok_kingdom/activity";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { readActivityDirectory } from "@opencok/repositories/activity-directory";
import { GameService } from "@opencok/services/game";
import { sfs, type Fields, type Value } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

test(
    "native activity directory projects saved realm schedules without admitting combat or changing periods",
    async () => {
        const h = await cityHarness();
        try
        {
            h.clock.now = 2000000;
            await h.db.db.insert(activity).values([
                { id: 17, type: 2, openTime: 1000n, startTime: 3000000n, endTime: 4000000n },
                { id: 0, type: 0, openTime: 1000n, startTime: 1000000n, endTime: 3000000n },
                { id: 1, type: 9, openTime: 1000n, startTime: 1000000n, endTime: 2000000n },
                { id: 2, type: 6, openTime: 1000n },
                { id: 3, type: 99, openTime: 1000n },
                { id: 4, type: 3, openTime: 0n, endTime: 3000000n },
                { id: 5, type: 4, openTime: 1000n, endTime: 1999999n },
                { id: 6, type: 5, openTime: 3000000n },
            ]);
            const store = {
                getProfileById: async (uid: string) =>
                    (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, uid)))[0],
                activityDirectory: (uid: string) => readActivityDirectory(h.db.db, uid),
            } as Pick<GameStore, "getProfileById" | "activityDirectory"> as GameStore;
            const game = () => new GameService(store, h.rules, { kingdomId: 1 }, () => h.clock.now);
            const before = await h.db.db.select().from(activity).orderBy(activity.id);
            const result = await game().execute("owner", "act.ls", {
                _cok_: sfs.long(9007199254740993n),
            });
            const rows = (result.body.act!.value as Value[]).map((value) => value.value as Fields);
            expect(result.body._cok_).toEqual(sfs.long(9007199254740993n));
            expect(rows.map((row) => row.t!.value)).toEqual([0, 9, 2, 5]);
            expect(Object.keys(rows[0]!)).toEqual(["t", "opt", "st", "et"]);
            expect(rows[0]).toEqual({
                t: sfs.int(0),
                opt: sfs.int(1),
                st: sfs.int(1000),
                et: sfs.int(3000),
            });
            expect(rows[3]).toEqual({ t: sfs.int(5), opt: sfs.int(3000) });
            expect(await h.db.db.select().from(activity).orderBy(activity.id)).toEqual(before);
            expect(result.pushes).toEqual([]);
            h.clock.now++;
            const afterBoundary = await game().execute("owner", "act.ls", {});
            expect(
                (afterBoundary.body.act!.value as Value[]).map((value) =>
                    (value.value as Fields).t!.value
                ),
            ).toEqual([0, 2, 5]);
            await h.db.db.update(activity).set({ endTime: 4000000n }).where(eq(activity.id, 1));
            expect((await game().execute("owner", "act.ls", {})).body.act!.value).toHaveLength(4);
            await expect(game().execute("absent", "act.ls", {})).rejects.toThrow();
            await h.db.db.update(userprofile).set({ serverId: 2 }).where(
                eq(userprofile.uid, "other"),
            );
            await expect(game().execute("other", "act.ls", {})).rejects.toThrow();
            await h.db.db
                .update(userprofile)
                .set({ banFlag: 1, banTime: BigInt(h.clock.now + 10000) })
                .where(eq(userprofile.uid, "owner"));
            await expect(game().execute("owner", "act.ls", {})).rejects.toThrow();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
