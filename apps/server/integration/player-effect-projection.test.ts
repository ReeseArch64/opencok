import { expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { readPlayerEffects } from "@opencok/repositories/power";
import { user_general } from "@opencok/drizzle/schema/opencok_kingdom/user_general";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { user_civilization_prestige } from "@opencok/drizzle/schema/opencok_kingdom/user_civilization_prestige";
import { cityHarness } from "./support/city";

test(
    "effect projection preserves precision, binary abilities, ordering, isolation and freshness",
    async () => {
        const h = await cityHarness();

        try
        {
            await h.db.db.insert(user_general).values([
                {
                    uuid: "z",
                    uid: "owner",
                    generalId: "1001",
                    status: 0,
                    level: 2,
                    ability: Buffer.from([0, 255, 92, 34]),
                },
                { uuid: "a", uid: "owner", generalId: "1002", status: 0, level: 3, ability: null },
                { uuid: "other", uid: "other", generalId: "1003", status: 0, level: 4 },
            ]);
            await h.db.db.insert(user_state).values({
                uid: "owner",
                stateId: 510001,
                startTime: 10n,
                endTime: 9007199254740993n,
            });
            await h.db.db.insert(user_civilization_prestige).values({
                uid: "owner",
                civilizationType: 1,
                prestigeValue: 9223372036854775807n,
            });
            const profile = { uid: "owner", allianceId: "" };
            const before = await readPlayerEffects(h.db.db, profile, true);
            const actual = await readPlayerEffects(h.db.db, profile, true, true);

            expect(actual).toEqual(before);
            expect(actual.generals.map((row) => row.generalId)).toEqual(["1002", "1001"]);
            expect(actual.generals[1]!.ability).toEqual(Buffer.from([0, 255, 92, 34]));
            expect(actual.states[0]!.endTime).toBe(9007199254740993n);
            expect(actual.prestige[0]!.prestigeValue).toBe(9223372036854775807n);

            await h.db.db.update(user_state).set({ endTime: 123n }).where(
                eq(user_state.uid, "owner"),
            );
            const changed = await readPlayerEffects(h.db.db, profile, true, true);

            expect(changed.states[0]!.endTime).toBe(123n);
            expect((await readPlayerEffects(h.db.db, { uid: "other" }, true, true)).states).toEqual(
                [],
            );
        }
        finally
        {
            await h.close();
        }
    },
    60000,
);
