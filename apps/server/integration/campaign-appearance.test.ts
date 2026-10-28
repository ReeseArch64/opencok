import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { createRealmAvatarActivationDomain } from "../src/composition/skins";

import { anniversaryDomain } from "@opencok/services/anniversary";
import { publishCosmeticInteractionMutation } from "../src/composition/skins";
import { avatar_storage } from "@opencok/drizzle/schema/opencok_kingdom/avatar_storage";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { sfs, type Fields, type Value } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

const avatarActivationDomain = createRealmAvatarActivationDomain();

async function fixture()
{
    const h = await cityHarness([anniversaryDomain, avatarActivationDomain]);
    h.clock.now = Date.UTC(2024, 8, 5, 12);
    await h.db.db
        .insert(user_world)
        .values({ uid: "owner", pointId: 1, worldId: 0, lastCityDefTime: 0n });
    return {
        ...h,
        own: (avatarId = "509878", expirationTime = BigInt(h.clock.now + 60000), uid = "owner") =>
            h.db.db.insert(avatar_storage).values({
                uid,
                avatarId,
                expirationTime,
                effectiveSign: 1,
            }),
        activate: (avatarId = "509878", operationId = randomUUID()) =>
            h.command("avatar.activate", {
                avatarId: sfs.string(avatarId),
                operationId: sfs.string(operationId),
            }),
        counter: async (key: string) =>
            (await h.db.db.select().from(trigger_var).where(eq(trigger_var.uid, "owner"))).find(
                (row) => row.key === key,
            )?.value,
    };
}
test(
    "owned cake activation commits its saved expiry, capped points, informational mail and interested-player publication once per receipt",
    async () => {
        const h = await fixture();
        try
        {
            await h.own();
            const id = randomUUID(),
                first = await h.activate("509878", id);
            expect(first.body.statusId).toEqual(sfs.int(509878));
            expect(first.body.endTime).toEqual(sfs.long(BigInt(h.clock.now + 60000)));
            expect(first.body.status).toBeUndefined();
            expect(await h.counter("long_3th_anniversary_avatar_cake_count")).toBe("1");
            expect(await h.counter("long_3th_week1_score_count")).toBe("150");
            expect(await h.activate("509878", id)).toEqual(first);
            const saved = await h.db.db.select().from(mail);
            expect(saved).toHaveLength(1);
            expect(saved[0]?.title).toBe("152710");
            expect(saved[0]?.rewardStatus).toBe(1);
            const event = (await h.db.db.select().from(mutation_outbox)).find(
                (row) => row.eventType === "avatar.activate",
            )!;
            const sent: { owner: string; command: string; body: Fields; }[] = [];
            await publishCosmeticInteractionMutation(
                event.payload,
                async (points, owner, target) => {
                    expect(points).toEqual([1]);
                    expect(owner).toBe("owner");
                    expect(target).toBe("owner");
                    return ["other"];
                },
                async (owner, command, body) => {
                    sent.push({ owner, command, body });
                },
            );
            expect(sent.filter((entry) => entry.command === "status.push")).toEqual([
                {
                    owner: "owner",
                    command: "status.push",
                    body: Object.fromEntries(
                        Object.entries(first.body).filter(([key]) => key !== "operationId"),
                    ),
                },
            ]);
            expect(
                sent.filter((entry) => entry.command === "push.city.status").map((entry) =>
                    entry.owner
                ),
            ).toEqual(["owner", "other"]);
            await h.activate();
            await h.activate();
            expect(await h.counter("long_3th_week1_score_count")).toBe("300");
            expect(await h.counter("long_3th_anniversary_avatar_cake_count")).toBe("2");
            expect((await h.db.db.select().from(user_state))[0]?.endTime).toBe(
                BigInt(h.clock.now + 60000),
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
    "missing, foreign, expired or disabled appearance ownership cannot score or create a saved status or mail",
    async () => {
        const h = await fixture();
        try
        {
            await expect(h.activate()).rejects.toThrow();
            await h.own("509878", BigInt(h.clock.now + 60000), "other");
            await expect(h.activate()).rejects.toThrow();
            await h.own("509878", BigInt(h.clock.now));
            await expect(h.activate()).rejects.toThrow();
            await h.db.db.update(avatar_storage).set({
                expirationTime: BigInt(h.clock.now + 60000),
            });
            h.rules.features.set("avatar", {
                ...h.rules.features.get("avatar")!,
                online: "close",
                test: "close",
            });
            await expect(h.activate()).rejects.toThrow();
            expect(await h.db.db.select().from(user_state)).toHaveLength(0);
            expect(await h.db.db.select().from(mail)).toHaveLength(0);
            expect(await h.db.db.select().from(trigger_var)).toHaveLength(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "activation accepts a saved matching cosmetic family without extending its ownership and rejects a different family",
    async () => {
        const h = await fixture();
        try
        {
            await h.own("500501");
            await expect(h.activate()).rejects.toThrow();
            await h.own("500502");
            await h.activate("500500");
            const row = (await h.db.db.select().from(user_state))[0]!;
            expect(row.stateId).toBe(500500);
            expect(row.endTime).toBe(BigInt(h.clock.now + 60000));
            const owned = await h.db.db.select().from(avatar_storage);
            expect(owned.every((entry) => entry.expirationTime === BigInt(h.clock.now + 60000)))
                .toBe(true);
            expect(await h.db.db.select().from(mail)).toHaveLength(0);
            const event = (await h.db.db.select().from(mutation_outbox)).find(
                (entry) => entry.eventType === "avatar.activate",
            )!;
            const sent: Fields[] = [];
            await publishCosmeticInteractionMutation(
                event.payload,
                async () => [],
                async (_owner, command, body) => {
                    if (command === "status.push")
                    {
                        sent.push(body);
                    }
                },
            );
            expect((sent[0]!.status!.value as Value[]).length).toBeGreaterThan(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "a failed activation receipt rolls back the appearance, campaign mail, counter and ownership marker before retry",
    async () => {
        const h = await fixture();
        try
        {
            await h.own();
            await h.db.pool.query(
                `create function reject_avatar_receipt() returns trigger language plpgsql as $$ begin if new.command='avatar.activate' then raise exception 'synthetic activation receipt failure'; end if; return new; end $$`,
            );
            await h.db.pool.query(
                `create trigger reject_avatar_receipt before insert on opencok_kingdom.command_receipt for each row execute function reject_avatar_receipt()`,
            );
            const id = randomUUID();
            await expect(h.activate("509878", id)).rejects.toThrow();
            expect(await h.db.db.select().from(user_state)).toHaveLength(0);
            expect(await h.db.db.select().from(mail)).toHaveLength(0);
            expect(await h.db.db.select().from(trigger_var)).toHaveLength(0);
            expect((await h.db.db.select().from(avatar_storage))[0]?.effectiveSign).toBe(1);
            await h.db.pool.query(
                `drop trigger reject_avatar_receipt on opencok_kingdom.command_receipt`,
            );
            await h.activate("509878", id);
            expect(await h.counter("long_3th_week1_score_count")).toBe("150");
            expect((await h.db.db.select().from(avatar_storage))[0]?.effectiveSign).toBe(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "closed campaign dates do not block a valid owned appearance, and permanent ownership retains the native indefinite sentinel",
    async () => {
        const h = await fixture();
        try
        {
            h.clock.now = Date.UTC(2024, 8, 13);
            await h.own("500500", -1n);
            const first = await h.activate("500500");
            expect(first.body.endTime).toEqual(sfs.long(2147000000000n));
            expect((await h.db.db.select().from(user_state))[0]?.endTime).toBe(
                9223372036854775807n,
            );
            expect(await h.db.db.select().from(trigger_var)).toHaveLength(0);
            expect(await h.db.db.select().from(mail)).toHaveLength(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
