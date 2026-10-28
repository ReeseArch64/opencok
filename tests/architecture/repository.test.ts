import { expect, test } from "bun:test";
import baseline from "./baseline.json";
import { RepositoryInventory } from "./repository-inventory.ts";

test(
    "maintained workspaces introduce no new architecture violations and retain no stale baseline entries",
    () => {
        const report = new RepositoryInventory(new URL("../../", import.meta.url).pathname).read();
        const expected = new Set(baseline.violations);
        const actual = new Set(report.violations);

        expect(baseline.violations).toEqual([...expected].sort());
        expect(report.violations.filter((violation) => !expected.has(violation))).toEqual([]);
        expect(baseline.violations.filter((violation) => !actual.has(violation))).toEqual([]);
        expect(report.workspaces.length).toBeGreaterThan(0);
        expect(report.modules.length).toBeGreaterThan(0);
    },
    60000,
);
