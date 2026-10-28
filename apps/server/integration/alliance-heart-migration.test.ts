import { test, expect } from "bun:test";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres";
test(
    "heart delivery migration retains identical legacy rows and backfills distinct acknowledgment identities",
    async () => {
        const pg = new DisposablePostgres(),
            db = await pg.start();
        try
        {
            await db.query("CREATE SCHEMA opencok_kingdom");
            await db.query(
                "CREATE TABLE opencok_kingdom.receive_heart (uid varchar(40) NOT NULL, duration integer NOT NULL, effecttype varchar(2) NOT NULL, senduid varchar(40) NOT NULL)",
            );
            await db.query(
                "INSERT INTO opencok_kingdom.receive_heart VALUES ('recipient',60,'1','sender'),('recipient',60,'1','sender')",
            );
            await db.query(
                await Bun.file(
                    new URL(
                        "../../../packages/drizzle/migrations/kingdom/0026_alliance_heart_delivery.sql",
                        import.meta.url,
                    ),
                ).text(),
            );
            const rows =
                (await db.query("SELECT * FROM opencok_kingdom.receive_heart ORDER BY id")).rows;
            expect(rows).toHaveLength(2);
            expect(rows.map((row) => row.id)).toEqual([1, 2]);
            expect(
                rows.every(
                    (row) =>
                        row.uid === "recipient"
                        && row.duration === 60
                        && row.effecttype === "1"
                        && row.senduid === "sender",
                ),
            ).toBe(true);
            expect(
                (
                    await db.query(
                        "INSERT INTO opencok_kingdom.receive_heart (uid,duration,effecttype,senduid) VALUES ('recipient',60,'1','later') RETURNING id",
                    )
                ).rows[0].id,
            ).toBe(3);
            await db.query("DELETE FROM opencok_kingdom.receive_heart WHERE id = ANY($1)", [[
                1,
                2,
            ]]);
            expect((await db.query("SELECT senduid FROM opencok_kingdom.receive_heart")).rows)
                .toEqual([
                    { senduid: "later" },
                ]);
        }
        finally
        {
            await db.end();
            await pg.stop();
        }
    },
    120000,
);
