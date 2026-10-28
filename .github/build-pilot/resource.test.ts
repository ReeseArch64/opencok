import { test, expect } from "bun:test";
import { loadNicknameWordFilter } from "@opencok/resources/nickname-words";
import words from "../../packages/resources/data/badwords.json";

test("the default resource URL resolves beside the emitted server entrypoint", async () => {
    const filter = await loadNicknameWordFilter();
    const word = words.find((entry) => entry.length > 3 && !/[v ]/.test(entry));
    expect(word).toBeDefined();
    expect(filter.contains(word!)).toBe(true);
    expect(
        filter.contains("synthetic551cleanname"),
        "failed resource reads must not look successful",
    ).toBe(false);
});
