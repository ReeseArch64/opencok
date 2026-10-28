import { expect, test } from "bun:test";
import {
    decodeWorldMarchArmy,
    decodeWorldResourceArmy,
} from "@opencok/messages/world-resource-army";
import fixture from "./fixtures/reconnect-march-army.json";
import legacyFixtures from "./fixtures/world-resource-army-vectors.json";

const bytes = Buffer.from(fixture.companions, "base64");

test("reconnect decodes saved march companions and basic troop families without changing the load decoder", () => {
    const army = decodeWorldMarchArmy(bytes)!;
    const soldier = {
        owner: "synthetic-owner",
        armsId: "100001",
        total: 10,
        dead: 2,
        loadEffect: 7,
        basicArm: 1,
    };
    expect(army).toEqual({
        owner: "synthetic-owner",
        cachedLoad: 45,
        soldiers: [soldier, soldier],
        dragons: [{ owner: "synthetic-owner", uuid: "synthetic-dragon", itemId: 3001, level: 4 }],
        general: { owner: "synthetic-owner", id: 2001, level: 9 },
    });
    expect(army.soldiers![0]).not.toBe(army.soldiers![1]);
    expect(decodeWorldResourceArmy(bytes)!.soldiers![0]).not.toHaveProperty("basicArm");
    expect(bytes).toEqual(Buffer.from(fixture.companions, "base64"));
});

test("older march snapshots retain nullable companion fields and reject incompatible companion classes", () => {
    expect(decodeWorldMarchArmy(Buffer.from(legacyFixtures.nullRoot, "base64"))).toBeNull();
    expect(decodeWorldMarchArmy(Buffer.from(legacyFixtures.missingFields, "base64"))).toEqual({
        owner: null,
        cachedLoad: 0,
        soldiers: null,
        dragons: null,
        general: null,
    });
    for (const className of ["FightDragon", "FightNewGeneral"])
    {
        const changed = Buffer.from(bytes);
        const name = Buffer.from(
            `com.elex.cok.gameengine.world.march.WorldMarchGeneralArmy$${className}`,
        );
        const offset = changed.indexOf(name);
        expect(offset).toBeGreaterThan(0);
        changed[offset + name.length] = changed[offset + name.length]! ^ 1;
        expect(() => decodeWorldMarchArmy(changed)).toThrow();
    }
    const changed = Buffer.from(bytes);
    const offset = changed.indexOf(Buffer.from("CAVALRY"));
    changed[offset] = 88;
    expect(() => decodeWorldMarchArmy(changed)).toThrow();
    for (let length = 0; length < bytes.length; length++)
    {
        expect(() => decodeWorldMarchArmy(bytes.subarray(0, length))).toThrow();
    }
});

test("native serialized soldier star levels remain factual fields of the march snapshot", () => {
    const source = Buffer.from(fixture.companions, "base64"),
        field = Buffer.from([0x49, 0, 5, ...Buffer.from("total")]),
        at = source.indexOf(field);
    expect(at).toBeGreaterThan(0);
    Buffer.from("level").copy(source, at + 3);
    const march = decodeWorldMarchArmy(source)!;
    expect(march.soldiers![0]!.level).toBe(10);
    expect(march.soldiers![0]!.total).toBe(0);
    expect(decodeWorldResourceArmy(source)!.soldiers![0]).not.toHaveProperty("level");
});
