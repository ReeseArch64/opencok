import { test, expect } from "bun:test";
import { heroMatchGroups, heroMatchIdentity } from "@opencok/hero/rules/hero-matching";
test("hero matching groups by exact power before shuffling each bounded power cohort", () => {
    const realms = [
        { kingdomId: 1, power: 9007199254740993n, shuffle: 9 },
        { kingdomId: 2, power: 9007199254740992n, shuffle: 1 },
        { kingdomId: 3, power: 50n, shuffle: 2 },
        { kingdomId: 4, power: 49n, shuffle: 0 },
        { kingdomId: 5, power: 0n, shuffle: 0 },
    ];
    expect(heroMatchGroups(realms, 2, 2)).toEqual([
        { kingdomId: 2, serverGroup: "2|1" },
        { kingdomId: 1, serverGroup: "2|1" },
        { kingdomId: 4, serverGroup: "4|3" },
        { kingdomId: 3, serverGroup: "4|3" },
        { kingdomId: 5, serverGroup: "5" },
    ]);
    expect(heroMatchGroups(realms.toReversed(), 2, 2)).toEqual(heroMatchGroups(realms, 2, 2));
    expect(() => heroMatchGroups([...realms, realms[0]!], 2, 2)).toThrow();
    expect(() => heroMatchGroups(realms, 2, 3)).toThrow();
    expect(heroMatchIdentity("period", 1n)).not.toBe(heroMatchIdentity("period", 2n));
});
test("hero matching uses realm identity to break equal power and shuffle ties without inventing opponents", () => {
    expect(
        heroMatchGroups(
            [
                { kingdomId: 2, power: 1n, shuffle: 0 },
                { kingdomId: 1, power: 1n, shuffle: 0 },
                { kingdomId: 3, power: 1n, shuffle: 0 },
            ],
            30,
            2,
        ),
    ).toEqual([
        { kingdomId: 1, serverGroup: "1|2" },
        { kingdomId: 2, serverGroup: "1|2" },
        { kingdomId: 3, serverGroup: "3" },
    ]);
    expect(heroMatchGroups([], 30, 2)).toEqual([]);
});
