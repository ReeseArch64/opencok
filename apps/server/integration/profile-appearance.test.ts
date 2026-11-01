import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { ProfilePictureDomain } from "@opencok/player/services/profile-picture";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { avatar_storage } from "@opencok/drizzle/schema/opencok_kingdom/avatar_storage";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { sfs } from "@opencok/messages/sfs";
import { createRealmAvatarActivationDomain } from "../src/composition/skins";
import { cityHarness } from "./support/city";

const domains = [new ProfilePictureDomain(), createRealmAvatarActivationDomain()];

test(
    "portrait and avatar frame survive a fresh session and receipt replay without a second debit",
    async () => {
        const h = await cityHarness(domains);
        try
        {
            const picture = [...h.rules.profile.lordImages!.values()].find((row) =>
                row.name === "g044"
            )!;
            expect(picture).toBeDefined();
            const frame = [...h.rules.power.statuses!.values()].find((row) =>
                row.type2 === "115" && Number(row.frameID) > 0 && row.overlap === "2"
            )!;
            expect(frame).toBeDefined();
            await h.db.db.insert(user_world).values({
                uid: "owner",
                pointId: 1,
                worldId: 0,
                lastCityDefTime: 0n,
            });
            await h.db.db.insert(avatar_storage).values({
                uid: "owner",
                avatarId: String(frame.id),
                expirationTime: -1n,
                effectiveSign: 1,
            });
            const request = {
                pic: sfs.string(String(picture.name)),
                picid: sfs.string(String(picture.id)),
                operationId: sfs.string(randomUUID()),
            };
            const first = await h.command("pic.change", request);
            expect(first.body.result).toEqual(sfs.bool(true));
            await h.command("avatar.activate", {
                avatarId: sfs.string(String(frame.id)),
                operationId: sfs.string(randomUUID()),
            });
            const saved =
                (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!;
            expect(saved.pic).toBe("g044");
            expect(saved.picfraId).toBe(Number(frame.frameID));
            expect(saved.gold).toBe(100000n - BigInt(String(picture.value)));
            expect(saved.level).toBe(1);
            expect(saved.exp).toBe(0);
            expect(
                (await h.db.db.select().from(user_state).where(eq(user_state.uid, "owner"))).some((
                    row,
                ) => row.stateId === Number(frame.id)),
            ).toBe(true);
            const next = await cityHarness(domains, false, undefined, 1200, {
                connection: h.connection,
                seed: false,
                now: h.clock.now,
            });
            try
            {
                expect(await next.command("pic.change", request)).toEqual(first);
                const reloaded = (await next.db.db.select().from(userprofile).where(
                    eq(userprofile.uid, "owner"),
                ))[0]!;
                expect(reloaded.pic).toBe(saved.pic);
                expect(reloaded.picfraId).toBe(saved.picfraId);
                expect(reloaded.gold).toBe(saved.gold);
            }
            finally
            {
                await next.close();
            }
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test("using and switching castle and wing skins retains both wardrobe entries", async () => {
    const { PlayerEffectsDomain } = await import("@opencok/services/player-effects");
    const h = await cityHarness([...domains, new PlayerEffectsDomain()]);
    try
    {
        await h.db.db.insert(user_world).values({
            uid: "owner",
            pointId: 1,
            worldId: 0,
            lastCityDefTime: 0n,
        });
        for (const type of ["100", "109"])
        {
            const choices = [...h.rules.goods.values()].filter((row) => {
                const status = h.rules.power.statuses!.get(String(row.para1));
                return row.type === "4" && status?.type2 === type && status.overlap === "2"
                    && status.subgroup;
            });
            const first = choices[0]!;
            const second = choices.find((row) =>
                h.rules.power.statuses!.get(String(row.para1))!.subgroup
                    !== h.rules.power.statuses!.get(String(first.para1))!.subgroup
            )!;
            expect(second).toBeDefined();
            await h.command("effect.item", {
                itemId: sfs.string(String(first.id)),
                count: sfs.int(1),
                operationId: sfs.string(randomUUID()),
            });
            await h.command("effect.item", {
                itemId: sfs.string(String(second.id)),
                count: sfs.int(1),
                operationId: sfs.string(randomUUID()),
            });
            const owned = await h.db.db.select().from(avatar_storage).where(
                eq(avatar_storage.uid, "owner"),
            );
            expect(owned.some((row) => row.avatarId === String(first.para1))).toBe(true);
            expect(owned.some((row) => row.avatarId === String(second.para1))).toBe(true);
            const active = await h.command("avatar.activate", {
                avatarId: sfs.string(String(first.para1)),
                operationId: sfs.string(randomUUID()),
            });
            expect(active.body.statusId).toEqual(sfs.int(Number(first.para1)));
        }
    }
    finally
    {
        await h.close();
    }
}, 120000);

test("temporary frame expiry and explicit removal clear the persisted profile frame", async () => {
    const { PlayerEffectsDomain } = await import("@opencok/services/player-effects");
    const h = await cityHarness([...domains, new PlayerEffectsDomain()]);
    try
    {
        const frame = [...h.rules.power.statuses!.values()].find((row) =>
            row.type2 === "115" && Number(row.frameID) > 0 && row.overlap === "2"
        )!;
        await h.db.db.insert(user_world).values({
            uid: "owner",
            pointId: 1,
            worldId: 0,
            lastCityDefTime: 0n,
        });
        await h.db.db.insert(avatar_storage).values({
            uid: "owner",
            avatarId: String(frame.id),
            expirationTime: BigInt(h.clock.now + 60000),
            effectiveSign: 1,
        });
        await h.command("avatar.activate", {
            avatarId: sfs.string(String(frame.id)),
            operationId: sfs.string(randomUUID()),
        });
        await h.command("status.remove", {
            statusId: sfs.int(Number(frame.id)),
            operationId: sfs.string(randomUUID()),
        });
        expect(
            (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!
                .picfraId,
        ).toBe(0);
        await h.command("avatar.activate", {
            avatarId: sfs.string(String(frame.id)),
            operationId: sfs.string(randomUUID()),
        });
        h.clock.now += 60001;
        await h.command("effects.init", { operationId: sfs.string(randomUUID()) });
        expect(
            (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!
                .picfraId,
        ).toBe(0);
        expect(
            (await h.db.db.select().from(user_state).where(eq(user_state.uid, "owner"))).some((
                row,
            ) => row.stateId === Number(frame.id)),
        ).toBe(false);
    }
    finally
    {
        await h.close();
    }
}, 120000);

test(
    "inventory cosmetic use preserves batch duration, ownership and durable publication on replay",
    async () => {
        const { PlayerEffectsDomain } = await import("@opencok/services/player-effects");
        const { createInventoryService } = await import("@opencok/services/inventory-runtime");
        const { createRealmInventoryExecutor } = await import(
            "@opencok/repositories/inventory-runtime"
        );
        const { user_item } = await import("@opencok/drizzle/schema/opencok_kingdom/user_item");
        const { mutation_outbox } = await import(
            "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox"
        );
        const { encode, decode } = await import("@opencok/messages/sfs");
        const { publishCosmeticInteractionMutation } = await import("../src/composition/skins");
        const h = await cityHarness([...domains, new PlayerEffectsDomain()]);
        try
        {
            await h.db.db.insert(user_world).values({
                uid: "owner",
                pointId: 1,
                worldId: 0,
                lastCityDefTime: 0n,
            });
            let failAfterEffect = false;
            const inventory = createInventoryService(
                createRealmInventoryExecutor(h.db.db, h.authority, () => h.clock.now, {
                    useEffect: async (tx, owner, itemId, count, now, economy) => {
                        const prepared = await h.handlers.command(
                            tx,
                            owner,
                            "effect.item",
                            encode({ itemId: sfs.string(itemId), count: sfs.int(count) }),
                            now,
                            economy,
                        );
                        if (prepared.event)
                        {
                            economy.event!({
                                id: "cosmetic",
                                type: "effect.item",
                                payload: prepared.event,
                            });
                        }
                        if (failAfterEffect)
                        {
                            throw new Error("Interrupted cosmetic item use");
                        }
                        return decode(Buffer.from(prepared.response));
                    },
                }),
                h.rules,
                h.effects,
                () => h.clock.now,
            );
            const wing = [...h.rules.goods.values()].find((row) => {
                const status = h.rules.power.statuses!.get(String(row.para1));
                return row.type === "4" && status?.type2 === "109" && status.overlap === "2"
                    && Number(status.time) > 0 && status.subgroup;
            })!;
            expect(wing).toBeDefined();
            const duration = BigInt(h.rules.power.statuses!.get(String(wing.para1))!.time!) * 1000n;
            const grant = await inventory.grant("owner", randomUUID(), String(wing.id), 4);
            const request = {
                uuid: grant.uuid!,
                num: sfs.int(2),
                operationId: sfs.string(randomUUID()),
            };
            const response = await inventory.command("owner", "item.use", request);
            const expected = BigInt(h.clock.now) + 2n * duration;
            const owned = async () =>
                (await h.db.db.select().from(avatar_storage).where(eq(avatar_storage.uid, "owner")))
                    .find((row) => row.avatarId === String(wing.para1))!;
            expect((await owned()).expirationTime).toBe(expected);
            expect(await inventory.command("owner", "item.use", request)).toEqual(response);
            expect((await owned()).expirationTime).toBe(expected);
            expect(
                (await h.db.db.select().from(user_item).where(
                    eq(user_item.uuid, String(grant.uuid!.value)),
                ))[0]!.count,
            ).toBe(2);
            const events = await h.db.db.select().from(mutation_outbox).where(
                eq(mutation_outbox.eventType, "effect.item"),
            );
            expect(events).toHaveLength(1);
            const commands: string[] = [];
            await publishCosmeticInteractionMutation(
                events[0]!.payload,
                async () => ["other"],
                async (_uid, command) => {
                    commands.push(command);
                },
            );
            expect(commands).toEqual(["status.push", "push.world.point", "push.world.point"]);
            await inventory.command("owner", "item.use", {
                ...request,
                num: sfs.int(1),
                operationId: sfs.string(randomUUID()),
            });
            expect((await owned()).expirationTime).toBe(expected + duration);
            expect(
                (await h.db.db.select().from(user_item).where(
                    eq(user_item.uuid, String(grant.uuid!.value)),
                ))[0]!.count,
            ).toBe(1);
            const maiden = await inventory.grant("owner", randomUUID(), "36042950", 1);
            const maidenRequest = {
                uuid: maiden.uuid!,
                num: sfs.int(1),
                operationId: sfs.string(randomUUID()),
            };
            failAfterEffect = true;
            await expect(inventory.command("owner", "item.use", maidenRequest)).rejects.toThrow(
                "Interrupted cosmetic item use",
            );
            expect(
                (await h.db.db.select().from(avatar_storage).where(eq(avatar_storage.uid, "owner")))
                    .some((row) => row.avatarId === "55000419"),
            ).toBe(false);
            expect(
                (await h.db.db.select().from(user_item).where(
                    eq(user_item.uuid, String(maiden.uuid!.value)),
                ))[0]!.count,
            ).toBe(1);
            failAfterEffect = false;
            await inventory.command("owner", "item.use", maidenRequest);
            expect(
                (await h.db.db.select().from(avatar_storage).where(eq(avatar_storage.uid, "owner")))
                    .find((row) => row.avatarId === "55000419")?.expirationTime,
            ).toBe(-1n);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
