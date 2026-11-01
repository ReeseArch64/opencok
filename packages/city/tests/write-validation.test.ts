import { expect, test } from "bun:test";
import { validateCityWrite } from "../src/validations/write";

const building = { uid: "owner", uuid: "building", level: 1 };

test("city writes reject foreign, missing and oversized row identities", () => {
    for (
        const row of [
            { ...building, uid: "other" },
            { ...building, uuid: "" },
            { ...building, uuid: "x".repeat(41) },
        ]
    )
    {
        expect(() => validateCityWrite({ buildings: [row] }, "owner")).toThrow(
            "Invalid city owner",
        );
    }
    expect(() => validateCityWrite({ sciences: [{ uid: "other", itemId: "science" }] }, "owner"))
        .toThrow("Invalid city owner");
    expect(() => validateCityWrite({ armies: [{ uid: "owner", armyId: "" }] }, "owner"))
        .toThrow("Invalid city owner");
});

test("city write bounds retain unique 1024-row sets and reject duplicates or excess", () => {
    const rows = Array.from({ length: 1024 }, (_, index) => ({ ...building, uuid: String(index) }));
    expect(() => validateCityWrite({ buildings: rows }, "owner")).not.toThrow();
    expect(() =>
        validateCityWrite({ buildings: [...rows, { ...building, uuid: "extra" }] }, "owner")
    )
        .toThrow("Invalid city write set");
    expect(() => validateCityWrite({ buildings: [building, building] }, "owner"))
        .toThrow("Invalid city write set");
    expect(() => validateCityWrite({}, "owner")).not.toThrow();
});

test("city quantities preserve signed-32 bounds and reject negative, fractional or nonfinite values", () => {
    for (const value of [-1, 0.5, 2147483648, NaN, Infinity])
    {
        expect(() => validateCityWrite({ buildings: [{ ...building, level: value }] }, "owner"))
            .toThrow("Invalid city quantity");
    }
    expect(() => validateCityWrite({ buildings: [{ ...building, level: 2147483647 }] }, "owner"))
        .not.toThrow();
    expect(() =>
        validateCityWrite({ hospital: [{ uid: "owner", armyId: "unit", heal: -1 }] }, "owner")
    )
        .toThrow("Invalid city quantity");
    expect(() => validateCityWrite({ forts: [{ uid: "owner", armyId: "unit", num: -1 }] }, "owner"))
        .toThrow("Invalid city quantity");
});

test("saved city deadlines retain exact signed-64 precision", () => {
    expect(() =>
        validateCityWrite(
            { buildings: [{ ...building, updateTime: 9223372036854775807n }] },
            "owner",
        )
    )
        .not.toThrow();
    for (const value of [-1n, 9223372036854775808n, "1.5"])
    {
        expect(() =>
            validateCityWrite({ buildings: [{ ...building, updateTime: value }] }, "owner")
        )
            .toThrow();
    }
});

test("appearance writes preserve portrait and frame without changing progression fields", () => {
    expect(() =>
        validateCityWrite({ appearance: { pic: "g044", picVer: 1000017, picfraId: 5000 } }, "owner")
    ).not.toThrow();
});

test.each([
    { pic: "" },
    { pic: "x".repeat(41) },
    { pic: "g\0x" },
    { picVer: -1 },
    { picfraId: 0.5 },
    { picfraId: 2147483648 },
])("invalid appearance values cannot enter persistence: %j", (appearance) => {
    expect(() => validateCityWrite({ appearance }, "owner")).toThrow("Invalid profile appearance");
});
