import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { createShopRepository } from "@opencok/shop/repositories/shops";
import { ShopService } from "@opencok/shop/services/shops";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { planRealmInventoryGrants } from "@opencok/services/inventory-runtime";
import { sfs, fields } from "@opencok/messages/sfs";
import { shopHarness } from "./support/shops";

test(
    "appearance purchases persist exact currency debits and replay deliveries after restart",
    async () => {
        const harness = await shopHarness();
        try
        {
            await harness.db.db.update(userprofile).set({ crystalGold: 40n, crystal: 999n }).where(
                eq(userprofile.uid, "buyer"),
            );
            harness.rules.shops.set("diamonds", {
                ...harness.offer,
                id: "diamonds",
                sale_type: "15",
                value1_type: "8",
                value1: "20",
            });
            const request = {
                id: sfs.string("diamonds"),
                num: sfs.int(2),
                operationId: sfs.string(randomUUID()),
            };
            const replies = await Promise.all([
                harness.shops.command("buyer", "shoppingMall.buy", request),
                harness.shops.command("buyer", "shoppingMall.buy", request),
            ]);
            expect(replies[0]!.body).toEqual(replies[1]!.body);
            expect(fields(replies[0]!.body.goods).count).toEqual(sfs.int(2));
            expect(replies[0]!.pushes).toContainEqual({
                command: "push.user.crystalGold",
                body: { crystalGold: sfs.long(0) },
            });
            const saved = (await harness.db.db.select().from(userprofile).where(
                eq(userprofile.uid, "buyer"),
            ))[0]!;
            expect(saved.crystalGold).toBe(0n);
            expect(saved.crystal).toBe(999n);
            expect(saved.gold).toBe(100n);
            const committed = await harness.snapshot();
            await expect(
                harness.shops.command("buyer", "shoppingMall.buy", {
                    ...request,
                    operationId: sfs.string(randomUUID()),
                }),
            ).rejects.toThrow();
            expect(await harness.snapshot()).toEqual(committed);
            await harness.restart();
            const authority = await acquireRealmAuthority(harness.db.db, 1, () => true);
            const service = new ShopService(
                createShopRepository(harness.db.db, authority, harness.now),
                harness.rules,
                planRealmInventoryGrants,
            );
            const replay = await service.command("buyer", "shoppingMall.buy", request);
            expect(replay.body).toEqual(replies[0]!.body);
            expect(replay.pushes).toEqual(replies[0]!.pushes);
            expect(await harness.snapshot()).toEqual(committed);
            harness.rules.shops.set("fragments", {
                ...harness.offer,
                id: "fragments",
                sale_type: "15",
                value1_type: "11",
                value1: "8",
                value_item: "200300",
                value_item_num: "8",
            });
            const fragmentRequest = {
                id: sfs.string("fragments"),
                num: sfs.int(1),
                operationId: sfs.string(randomUUID()),
            };
            const bought = await service.command("buyer", "shoppingMall.buy", fragmentRequest);
            expect(fields(bought.body.goods).count).toEqual(sfs.int(3));
            expect(
                (await harness.db.db.select().from(user_item).where(eq(user_item.uuid, "source")))[
                    0
                ]!.count,
            ).toBe(0);
            const afterFragments = await harness.snapshot();
            expect((await service.command("buyer", "shoppingMall.buy", fragmentRequest)).body)
                .toEqual(bought.body);
            expect(await harness.snapshot()).toEqual(afterFragments);
            await expect(
                service.command("buyer", "shoppingMall.buy", {
                    ...fragmentRequest,
                    operationId: sfs.string(randomUUID()),
                }),
            ).rejects.toThrow();
            expect(await harness.snapshot()).toEqual(afterFragments);
            await harness.db.db.update(userprofile).set({ crystalGold: 20n }).where(
                eq(userprofile.uid, "buyer"),
            );
            await harness.db.db.execute(
                sql`CREATE FUNCTION opencok_kingdom.reject_appearance_receipt() RETURNS trigger LANGUAGE plpgsql AS 'BEGIN RAISE EXCEPTION ''synthetic rollback''; END'`,
            );
            await harness.db.db.execute(
                sql`CREATE TRIGGER reject_appearance_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_appearance_receipt()`,
            );
            const beforeFailure = await harness.snapshot();
            await expect(
                service.command("buyer", "shoppingMall.buy", {
                    ...request,
                    num: sfs.int(1),
                    operationId: sfs.string(randomUUID()),
                }),
            ).rejects.toThrow();
            expect(await harness.snapshot()).toEqual(beforeFailure);
        }
        finally
        {
            await harness.close();
        }
    },
    120000,
);
