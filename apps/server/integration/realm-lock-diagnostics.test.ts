import { expect, test } from "bun:test";
import { readRealmLockDiagnostics } from "@opencok/repositories/realm-lock-diagnostics";
import { cityHarness } from "./support/city";

test(
    "realm diagnostics identify bounded lock owners and waiters without SQL or account fields",
    async () => {
        const h = await cityHarness();
        const owner = await h.db.pool.connect();
        const waiter = await h.db.pool.connect();
        let pending: Promise<unknown> | undefined;

        try
        {
            await owner.query("BEGIN");
            await owner.query(
                "SELECT 1 FROM opencok_kingdom.realm_authority FOR UPDATE",
            );
            const result = await owner.query<{ pid: number; }>("SELECT pg_backend_pid() AS pid");
            const pid = result.rows[0]!.pid;
            pending = waiter.query(
                "SELECT 1 FROM opencok_kingdom.realm_authority LIMIT 1 FOR UPDATE",
            );
            let rows = await readRealmLockDiagnostics(h.db.db);

            for (let attempt = 0; attempt < 20 && !rows.some((row) => !row.granted); attempt++)
            {
                await Bun.sleep(10);
                rows = await readRealmLockDiagnostics(h.db.db);
            }

            expect(rows.some((row) => row.granted && row.pid === pid)).toBe(true);
            expect(rows.some((row) => !row.granted && row.blockers.includes(pid))).toBe(true);
            expect(rows.length).toBeLessThanOrEqual(64);
            expect(Object.keys(rows[0]!).sort()).toEqual([
                "blockers",
                "granted",
                "mode",
                "pid",
                "transactionAgeMs",
                "waitAgeMs",
            ]);
        }
        finally
        {
            await owner.query("ROLLBACK");
            await pending;
            owner.release();
            waiter.release();
            await h.close();
        }
    },
    120000,
);
