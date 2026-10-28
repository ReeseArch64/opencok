import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { createVipBoxDomain } from "@opencok/services/vip-box";
import { user_vip } from "@opencok/drizzle/schema/opencok_kingdom/user_vip";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { vip_box_turntable } from "@opencok/drizzle/schema/opencok_kingdom/vip_box_turntable";
import { vip_box_history } from "@opencok/drizzle/schema/opencok_kingdom/vip_box_history";
import { sfs, fields, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture()
{
    const h = await cityHarness([createVipBoxDomain(() => 0)]);
    h.clock.now = Date.UTC(2026, 9, 26, 12);
    h.rules.features.set("box_vip", {
        id: "box_vip",
        online: "all",
        test: "all",
        version: "1.0.0",
    });
    h.rules.advanced.vipBoxes!.clear();
    for (const vip of [8, 11])
    {
        h.rules.advanced.vipBoxes!.set(String(990000 + vip), {
            id: String(990000 + vip),
            vip: String(vip),
            condition: "1;1",
            cond_rate: "1",
            deplete: "210923",
            deplete_num: "1;5",
            item: "200200;200201;200202",
            item_num: "1;2;3",
            rate: "1;1;1",
            notice_item: "1;2;3",
        });
    }
    const score = [...h.rules.power.vip!.values()].find(
        (rule) => (Number(rule.id) % 100) + 1 === 8,
    )!.point!;
    await h.db.db.insert(user_vip).values({
        uid: "owner",
        score: Number(score),
        level: 8,
        loginDays: 0,
        lastLoginTime: 0n,
        vipEndTime: 0n,
    });
    await h.db.db
        .insert(user_item)
        .values({ uuid: "tokens", ownerId: "owner", itemId: "210923", count: 20, value: 0 });
    const command = (name: string, params: Fields = {}) => h.command(name, params);
    const ui = (vip = 8) => command("vip.box.turntable.ui", { vip: sfs.int(vip) });
    const saved = async () =>
        (await h.db.db.select().from(vip_box_turntable).where(eq(vip_box_turntable.uid, "owner")))
            .find(
                (row) => row.vip === 8,
            )!;
    const items = async () =>
        h.db.db.select().from(user_item).where(eq(user_item.ownerId, "owner"));
    return { ...h, command, ui, saved, items };
}
test(
    "VIP wheel pins its daily table, grants one free draw and consumes escalating owned tokens without replacement",
    async () => {
        const h = await fixture();
        try
        {
            await expect(h.command("vip.box.turntable.reward")).rejects.toThrow();
            const ui = await h.ui();
            expect(ui.body.vip_now_level).toEqual(sfs.int(8));
            expect(
                fields((ui.body.box_vip_list!.value as import("@opencok/messages/sfs").Value[])[0])
                    .free,
            ).toEqual(sfs.bool(false));
            const original = await h.saved();
            await h.ui();
            expect(await h.saved()).toEqual(original);
            const first = { operationId: sfs.string(randomUUID()) };
            const replies = await Promise.all(
                Array.from({ length: 4 }, () => h.command("vip.box.turntable.reward", first)),
            );
            expect(replies.every((reply) => reply.body.index?.value === 0)).toBe(true);
            expect((await h.items()).find((row) => row.itemId === "210923")!.count).toBe(20);
            expect((await h.command("vip.box.init")).body.box_vip_free).toEqual(sfs.bool(true));
            expect((await h.command("vip.box.turntable.reward")).body.index).toEqual(sfs.int(1));
            expect((await h.command("vip.box.turntable.reward")).body.index).toEqual(sfs.int(2));
            expect((await h.items()).find((row) => row.itemId === "210923")!.count).toBe(14);
            expect(await h.saved()).toMatchObject({ itemidlist: "0,1,2,", stepNum: 3, free: 1 });
            await expect(h.command("vip.box.turntable.reward")).rejects.toThrow();
            expect(await h.db.db.select().from(vip_box_history)).toHaveLength(3);
            expect((await h.ui()).body.show_list!.value).toHaveLength(3);
            h.clock.now += 86400000;
            await expect(h.command("vip.box.turntable.reward")).rejects.toThrow();
            await h.ui();
            expect(await h.saved()).toMatchObject({ itemidlist: "", stepNum: 0, free: 0 });
            await h.command("vip.box.turntable.reward");
            expect((await h.items()).find((row) => row.itemId === "210923")!.count).toBe(14);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "VIP wheel keeps higher-band previews separate and rolls back draws and notices on a receipt failure",
    async () => {
        const h = await fixture();
        try
        {
            await h.ui(11);
            await expect(h.command("vip.box.turntable.reward")).rejects.toThrow();
            await h.ui();
            await h.db.db.execute(
                sql`CREATE FUNCTION opencok_kingdom.reject_vip_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic receipt failure'; END $$`,
            );
            await h.db.db.execute(
                sql`CREATE TRIGGER reject_vip_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_vip_receipt()`,
            );
            await expect(h.command("vip.box.turntable.reward")).rejects.toThrow();
            expect((await h.saved()).stepNum).toBe(0);
            expect(await h.db.db.select().from(vip_box_history)).toHaveLength(0);
            expect((await h.items()).filter((row) => row.itemId !== "210923")).toHaveLength(0);
            await h.db.db.execute(
                sql`DROP TRIGGER reject_vip_receipt ON opencok_kingdom.command_receipt`,
            );
            await h.command("vip.box.turntable.reward");
            expect((await h.saved()).stepNum).toBe(1);
            h.rules.features.get("box_vip")!.online = "close";
            expect((await h.command("vip.box.init")).body.box_vip_free).toBeUndefined();
            await expect(h.ui()).rejects.toThrow();
            expect(
                await h.db.db.select().from(vip_box_turntable).where(
                    eq(vip_box_turntable.uid, "other"),
                ),
            ).toHaveLength(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "notable VIP results retain a bounded shared history without losing the just-committed result",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.insert(vip_box_history).values(
                Array.from({ length: 60 }, (_, index) => ({
                    id: `synthetic-${index}`,
                    uid: "other",
                    name: "Synthetic",
                    itemId: "200200",
                    count: 1,
                    createdAt: BigInt(h.clock.now - 60 + index),
                })),
            );
            await h.ui();
            await h.command("vip.box.turntable.reward");
            const history = await h.db.db.select().from(vip_box_history);
            expect(history).toHaveLength(50);
            expect(history.filter((row) => row.uid === "owner")).toHaveLength(1);
            expect((await h.ui()).body.show_list!.value).toHaveLength(50);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
