import { expect, test } from "bun:test";
import { containsReservedNickname } from "../src/resources/nickname-reserved";
import { reservedNicknameText, reservedNicknamePattern } from "../src/rules/nickname-reserved";
import oracle from "./fixtures/nickname-reserved-vectors.json";

test("reserved-name normalization precedes bounded matching with Java quoting and whitespace", async () => {
    expect(reservedNicknameText("  ＡＤＭＩＮ　 User  ")).toBe("admin  user");
    expect(await containsReservedNickname(" ＧＭ Team ", ["^gm\\s+team$"])).toBe(true);
    await expect(
        containsReservedNickname("Literal.+", ["\\QLiteral.+\\E".toLowerCase()]),
    ).rejects.toThrow();
    expect(await containsReservedNickname("Literal.+", ["\\Qliteral.+\\E"])).toBe(true);
    expect(await containsReservedNickname("Nobody", ["admin|moderator"])).toBe(false);
    await expect(containsReservedNickname("Anything", ["["])).rejects.toThrow();
    await expect(containsReservedNickname("Anything", ["a++"])).rejects.toThrow();
});
test("pathological reserved patterns cannot block the realm event loop", async () => {
    const started = Date.now();
    let ticked = false;
    const tick = setTimeout(() => {
        ticked = true;
    }, 10);
    try
    {
        expect(await containsReservedNickname("a".repeat(20000) + "!", ["^(a+)+$"])).toBe(false);
    }
    catch (error)
    {
        expect(String(error)).toContain("deadline");
    }
    finally
    {
        clearTimeout(tick);
    }
    expect(ticked).toBe(true);
    expect(Date.now() - started).toBeLessThan(4000);
}, 5000);

test("reserved regex translation agrees with independent Java 8 pattern vectors", () => {
    for (const row of oracle)
    {
        const compiled = reservedNicknamePattern(row.pattern);
        expect({
            pattern: row.pattern,
            text: row.text,
            matched: new RegExp(compiled.pattern, compiled.flags).test(row.text),
        }).toEqual({ pattern: row.pattern, text: row.text, matched: row.expected });
    }
});
