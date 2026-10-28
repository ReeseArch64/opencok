import { expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { branchCityDomain } from "@opencok/services/branch-city";
import { user_branch_city_info } from "@opencok/drizzle/schema/opencok_kingdom/user_branch_city_info";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { sfs } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

test(
    "branch visibility persists across handlers and retries without resetting reward counters",
    async () => {
        const h = await cityHarness([branchCityDomain]);
        try
        {
            await h.db.db
                .update(user_building)
                .set({ level: 20 })
                .where(eq(user_building.uuid, "owner-400000"));
            const request = { branchCityType: sfs.int(1), operationId: sfs.string("branch-hero") };
            const hero = await h.command("branchcity.open", request);
            expect(hero.body.branchcityopen).toEqual(sfs.int(2));
            expect((await h.command("branchcity.open", request)).body).toEqual(hero.body);
            await h.db.db
                .update(user_branch_city_info)
                .set({ takerewardcount: 7, takerewardtime: 123456n })
                .where(eq(user_branch_city_info.uid, "owner"));
            expect(
                (await h.command("branchcity.open", { branchCityType: sfs.int(2) })).body
                    .branchcityopen,
            ).toEqual(sfs.int(1));
            expect(
                (await h.command("branchcity.open", { branchCityType: sfs.int(1) })).body
                    .branchcityopen,
            ).toEqual(sfs.int(1));
            expect((await h.command("branchcity.init", {})).body.branchcityopen).toEqual(
                sfs.int(1),
            );
            const [saved] = await h.db.db
                .select()
                .from(user_branch_city_info)
                .where(eq(user_branch_city_info.uid, "owner"));
            expect(saved).toEqual({
                uid: "owner",
                openstate: 1,
                takerewardcount: 7,
                takerewardtime: 123456n,
            });
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
