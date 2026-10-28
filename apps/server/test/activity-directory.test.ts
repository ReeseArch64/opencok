import { expect, test } from "bun:test";
import { activityDirectoryEntries } from "@opencok/rules/activity-directory";
import { legacyIntegerOrder } from "@opencok/messages/legacy-object-order";
import { activityDirectory } from "@opencok/mappings/activity-directory";
import { sfs, type Fields, type Value } from "@opencok/messages/sfs";

test("native schedule seconds wrap as Java ints and retain optional fields and integer map order", () => {
    const rows = activityDirectoryEntries(
        [
            { id: 2, type: 2, openTime: 2147483648000n, startTime: -1n, endTime: null },
            {
                id: 1,
                type: 1,
                openTime: 4294967295000n,
                startTime: 4294967296000n,
                endTime: 9223372036854775807n,
            },
            { id: 4294967295, type: 7, openTime: 1n },
        ],
        0,
        legacyIntegerOrder,
    );
    expect(rows).toEqual([
        { t: 7, opt: 0 },
        { t: 1, opt: -1, st: 0, et: -1511828489 },
        { t: 2, opt: -2147483648 },
    ]);
    const mapped = (activityDirectory(rows).act!.value as Value[]).map(
        (value) => value.value as Fields,
    );
    expect(mapped[1]).toEqual({
        t: sfs.int(1),
        opt: sfs.int(-1),
        st: sfs.int(0),
        et: sfs.int(-1511828489),
    });
    expect(Object.keys(mapped[1]!)).toEqual(["t", "opt", "st", "et"]);
    expect(activityDirectoryEntries([], 0, legacyIntegerOrder)).toEqual([]);
    expect(() => activityDirectoryEntries([], -1, legacyIntegerOrder)).toThrow();
    expect(() =>
        activityDirectoryEntries([{ id: -1, type: 1, openTime: 1n }], 0, legacyIntegerOrder)
    ).toThrow();
    expect(() => activityDirectoryEntries(Array(4097).fill({}), 0, legacyIntegerOrder)).toThrow();
});
