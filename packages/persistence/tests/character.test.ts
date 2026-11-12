import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { characterCreateValidator, characterUpdateValidator } from "../src/validators/character";
import { createCharacterRepositories } from "../src/factories/character-repositories";
import { createPostgresDataSource } from "../src/factories/postgres-data-source";
import { Character } from "../src/models/kingdom/character";

const accountPublicId = randomUUID();

test("characters start at level one, normalize names and preserve exact experience", () => {
    expect(characterCreateValidator.parse({ accountPublicId, displayName: "  Aurora  " }))
        .toEqual({ accountPublicId, displayName: "Aurora", level: 1, experience: "0" });
    expect(characterUpdateValidator.parse({ experience: "9223372036854775807" }))
        .toEqual({ experience: "9223372036854775807" });
    for (
        const patch of [
            {},
            { accountPublicId: randomUUID() },
            { publicId: randomUUID() },
            { level: 0 },
            { level: 1.5 },
            { experience: "-1" },
            { experience: "9223372036854775808" },
            { experience: 1 },
            { displayName: " \t\n" },
            { displayName: "á".repeat(33) },
            { level: undefined },
        ]
    )
    {
        expect(() => characterUpdateValidator.parse(patch)).toThrow();
    }
    expect(() =>
        characterCreateValidator.parse({ accountPublicId: "invalid", displayName: "Aurora" })
    ).toThrow();
});

test("character repositories are restricted to the selected kingdom", () => {
    const global = createPostgresDataSource("global");
    expect(() => createCharacterRepositories(global.manager, 1)).toThrow("banco incorreto");
    const kingdom = createPostgresDataSource("kingdom_1");
    expect(() => createCharacterRepositories(kingdom.manager, 2)).toThrow("banco incorreto");
    expect(createCharacterRepositories(kingdom.manager, 1).create).toBeDefined();
    expect(kingdom.options.entities).toContain(Character);
    expect(global.options.entities).not.toContain(Character);
});
