import { expect, test } from "bun:test";
import { worldCityDetail } from "@opencok/rules/world-point-detail";
import { worldCityFields } from "@opencok/mappings/world-point-detail";
import { decode, encode, sfs } from "@opencok/messages/sfs";
import vectors from "./fixtures/world-city-vectors.json";

test("city strength comparison matches 1331 independent Java 8 signed-long multiplication vectors", () => {
    expect(vectors).toHaveLength(1331);
    for (const [observer, target, factor, expected] of vectors)
    {
        const detail = worldCityDetail(
            BigInt(observer as string),
            BigInt(target as string),
            9007199254740997n,
            1,
            factor as string,
        );
        expect(detail.targetTooStrong).toBe(expected as boolean);
        expect(detail.targetPower).toBe(BigInt(target as string));
        expect(detail.lastBeDuelTime).toBe(9007199254740997n);
        const fields = worldCityFields(detail);
        expect(fields).toEqual({
            slowDown: sfs.bool(true),
            targetTooStrong: sfs.bool(expected as boolean),
            targetPower: sfs.long(BigInt(target as string)),
            lastBeDuelTime: sfs.long(9007199254740997n),
        });
        expect(decode(encode(fields))).toEqual(fields);
    }
});

test("city multiplier follows Java decimal parsing and exact signed-long limits", () => {
    for (const multiplier of ["+٢", "00002", "２", "2"])
    {
        expect(worldCityDetail(2n, 5n, 0n, 0, multiplier).targetTooStrong).toBe(true);
    }
    for (
        const multiplier of [
            undefined,
            "",
            " 2",
            "2 ",
            "2.0",
            "2e0",
            "+",
            "--1",
            "9223372036854775808",
            "-9223372036854775809",
            "𝟚",
        ]
    )
    {
        expect(() => worldCityDetail(2n, 5n, 0n, 0, multiplier)).toThrow("102192");
    }
});

test("city projection preserves nullable primitive defaults, strict positive float comparison and rejects invalid state", () => {
    expect(worldCityDetail(null, null, null, -0, "1")).toEqual({
        slowDown: false,
        targetTooStrong: false,
        targetPower: 0n,
        lastBeDuelTime: 0n,
    });
    for (const effect of [0, -0, -1, -Math.fround(1e-45)])
    {
        expect(worldCityDetail(0n, 0n, 0n, effect, "1").slowDown).toBe(false);
    }
    for (const effect of [1, Math.fround(1e-45)])
    {
        expect(worldCityDetail(0n, 0n, 0n, effect, "1").slowDown).toBe(true);
    }
    for (const invalid of [1, "1", 9223372036854775808n, -9223372036854775809n])
    {
        expect(() => worldCityDetail(invalid, 0n, 0n, 0, "1")).toThrow("102192");
        expect(() => worldCityDetail(0n, invalid, 0n, 0, "1")).toThrow("102192");
        expect(() => worldCityDetail(0n, 0n, invalid, 0, "1")).toThrow("102192");
    }
    for (const effect of [NaN, Infinity, -Infinity, 0.1])
    {
        expect(() => worldCityDetail(0n, 0n, 0n, effect, "1")).toThrow("102192");
    }
});
