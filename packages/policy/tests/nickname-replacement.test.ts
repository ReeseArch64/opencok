import { expect, test } from "bun:test";
import { filterNicknameBadWords } from "@opencok/policy/rules/nickname-words";
import vectors from "./fixtures/nickname-replacement-vectors.json";

const text = (hex: string) => Buffer.from(hex, "hex").swap16().toString("utf16le");

test("description filtering matches independently generated Java 8 replacement outcomes", () => {
    expect(vectors.cases).toHaveLength(4071);
    const failures: unknown[] = [];
    for (const [entry, name, expected] of vectors.cases)
    {
        const actual = filterNicknameBadWords(text(name!), [text(entry!)]);
        if (actual !== text(expected!))
        {
            failures.push({ entry, name, expected, actual });
        }
    }
    expect(failures).toEqual([]);
});

test("description filtering retains sequential replacement loading bypass and partial-error results", () => {
    expect(filterNicknameBadWords("BAD badder bad", ["bad"])).toBe("** badder **");
    expect(filterNicknameBadWords("A! a!", ["a!"])).toBe("****");
    expect(filterNicknameBadWords("ab", ["a|ab"])).toBe("**b");
    expect(filterNicknameBadWords("abc", [""])).toBe("**abc**");
    expect(filterNicknameBadWords("alpha beta", ["alpha", "**"])).toBe("**beta");
    expect(filterNicknameBadWords("alpha beta", ["alpha", null as unknown as string, "beta"])).toBe(
        "** beta",
    );
    expect(filterNicknameBadWords("alpha", ["alpha"], true)).toBe("alpha");
    expect(filterNicknameBadWords("Ä! ä!", ["ä!"])).toBe("Ä! **");
    expect(filterNicknameBadWords("K k", ["k"])).toBe("K **");
});
