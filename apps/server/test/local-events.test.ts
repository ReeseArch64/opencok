import { test, expect } from "bun:test";
import { eventTimestamp, localEventWindow } from "@opencok/rules/local-events";

test("local event windows validate UTC calendar dates and include both reference boundaries", () => {
    const start = eventTimestamp("2026-01-01-00-00")!;
    const end = eventTimestamp("2026-01-01-00-01")!;
    const rule = { function_on: "1", start: "2026-01-01-00-00", end: "2026-01-01-00-01" };
    expect(end - start).toBe(60000n);
    expect(localEventWindow(rule, start)).toEqual({ start, end });
    expect(localEventWindow(rule, end)).toEqual({ start, end });
    expect(localEventWindow(rule, start - 1n)).toBeUndefined();
    expect(localEventWindow(rule, end + 1n)).toBeUndefined();
    expect(localEventWindow({ ...rule, function_on: "0" }, start)).toBeUndefined();
    for (
        const value of [
            "2026-02-29-00-00",
            "2026-01-32-00-00",
            "2026-01-01-24-00",
            "2026-01-01-00-60",
            "bad",
            "2026-00-01-00-00",
        ]
    )
    {
        expect(eventTimestamp(value)).toBeUndefined();
    }
    expect(eventTimestamp("2024-02-29-00-00")).toBeDefined();
});
