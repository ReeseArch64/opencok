import { expect, test } from "bun:test";
import { decodeJavaIntMap } from "@opencok/messages/java-int-map";
import { javaHashMapOrder } from "@opencok/rules/java-hash-map-order";
import { barbarianArmyPlan, barbarianPower } from "@opencok/rules/world-barbarian-detail";
import { Rules } from "@opencok/rules/game";
import { sfs, encode, decode } from "@opencok/messages/sfs";
import vectors from "./fixtures/world-barbarian-vectors.json";

function fixture()
{
    const rules = new Rules(new Map(), new Map(), new Map());
    rules.world.barbarians = new Map([["camp", { para3: "1", army: "formation" }]]);
    rules.world.armies = new Map([["formation", { arm: "a;100" }]]);
    rules.arms.set("a", { power: "1.5" });
    const row = { pointId: 701, configId: "camp", lastBeAttackedTime: 0n };
    return { rules, row };
}

test("bounded Java HashMap decoder reads independent Java 8 serialized maps and references without loading classes", () => {
    for (const vector of vectors.maps)
    {
        const data = Buffer.from(vector.data, "base64");
        const before = Buffer.from(data);
        expect([...decodeJavaIntMap(data)!]).toEqual(
            vector.entries as [string | null, number | null][],
        );
        expect(data).toEqual(before);
    }
    expect(decodeJavaIntMap(Buffer.from(vectors.nullMap, "base64"))).toBeNull();
});

test("Java map decoder rejects truncated streams, unexpected classes, wrong descriptors and invalid references", () => {
    const data = Buffer.from(vectors.maps[1]!.data, "base64");
    for (let size = 0; size < data.length; size++)
    {
        expect(() => decodeJavaIntMap(data.subarray(0, size))).toThrow();
    }
    for (
        const bad of [
            Buffer.concat([data, Buffer.from([0])]),
            Buffer.alloc(65536),
            Buffer.from("{}"),
            Buffer.from("aced000574000178", "hex"),
        ]
    )
    {
        expect(() => decodeJavaIntMap(bad)).toThrow();
    }
    const unknown = Buffer.from(data);
    unknown[unknown.indexOf(Buffer.from("HashMap"))] = 0x58;
    expect(() => decodeJavaIntMap(unknown)).toThrow();
    const descriptor = Buffer.from(data);
    const serialId = descriptor.indexOf(Buffer.from("0507dac1c31660d1", "hex"));
    descriptor[serialId] = descriptor[serialId]! ^ 1;
    expect(() => decodeJavaIntMap(descriptor)).toThrow();
    const overflow = Buffer.from(data);
    const block = overflow.indexOf(Buffer.from("7708", "hex"));
    overflow.writeInt32BE(4097, block + 6);
    expect(() => decodeJavaIntMap(overflow)).toThrow();
    const reference = Buffer.from(data);
    const ref = reference.indexOf(Buffer.from("71007e", "hex"));
    expect(ref).toBeGreaterThan(0);
    reference.writeUInt32BE(0x7fffffff, ref + 1);
    expect(() => decodeJavaIntMap(reference)).toThrow();
});

test("fresh Java HashMap traversal matches 60 Java 8 collision, treeification, root-movement and resize vectors twice", () => {
    expect(vectors.orders).toHaveLength(60);
    for (const vector of vectors.orders)
    {
        const order = javaHashMapOrder(vector.input);
        expect(order).toEqual(vector.first);
        expect(javaHashMapOrder(order)).toEqual(vector.second);
        const f = fixture();
        f.rules.world.armies!.set("formation", {
            arm: vector.input.map((id) => `${id};1`).join("|"),
        });
        expect([...barbarianArmyPlan(f.row, f.rules, 0)!.army.keys()]).toEqual(vector.first);
    }
    expect(() => javaHashMapOrder(Array.from({ length: 4097 }, (_, i) => String(i)))).toThrow();
});

test("barbarian recovery and power match 1800 independent Java 8 arithmetic and numeric parsing vectors", () => {
    expect(vectors.numbers).toHaveLength(1800);
    for (const vector of vectors.numbers)
    {
        const [now, attacked, seconds, total, last, unit, expected] = vector as [
            string,
            string,
            string,
            number,
            number,
            string,
            string,
        ];
        const f = fixture();
        f.row.lastBeAttackedTime = BigInt(attacked);
        f.rules.world.barbarians!.get("camp")!.para3 = seconds;
        f.rules.world.armies!.get("formation")!.arm = `a;${total}`;
        f.rules.arms.get("a")!.power = unit;
        const power = barbarianPower(
            barbarianArmyPlan(f.row, f.rules, Number(now)),
            new Map([["a", last]]),
            f.rules,
        );
        expect(power).toBe(BigInt(expected));
        const fields = { barbarionPower: sfs.long(power) };
        expect(decode(encode(fields))).toEqual(fields);
    }
});

test("barbarian formations preserve final duplicates and whole-separator trailing-token behavior", () => {
    const f = fixture();
    f.rules.world.armies!.get("formation")!.arm = "||a;1|a;;+٢|ignored|ignored;1;tail|ignored;1;|";
    expect([...barbarianArmyPlan(f.row, f.rules, 0)!.army]).toEqual([["a", 2]]);
    expect(barbarianPower(barbarianArmyPlan(f.row, f.rules, 0), new Map([["a", 2]]), f.rules)).toBe(
        3n,
    );
    for (const raw of ["a;", "a; 1", "a;2147483648", "a;1.5"])
    {
        f.rules.world.armies!.get("formation")!.arm = raw;
        expect(() => barbarianArmyPlan(f.row, f.rules, 0)).toThrow("102192");
    }
});

test("missing barbarian records and empty formations return zero while required malformed state rejects", () => {
    const f = fixture();
    expect(barbarianPower(barbarianArmyPlan(undefined, f.rules, 0), null, f.rules)).toBe(0n);
    for (const raw of [undefined, "", "\u180e", "ignored|a;1;tail"])
    {
        f.rules.world.armies!.set("formation", raw === undefined ? {} : { arm: raw });
        expect(barbarianPower(barbarianArmyPlan(f.row, f.rules, 0), null, f.rules)).toBe(0n);
    }
    f.rules.world.armies!.set("formation", { arm: "a;100" });
    expect(() => barbarianPower(barbarianArmyPlan(f.row, f.rules, 0), null, f.rules)).toThrow(
        "102192",
    );
    expect(barbarianPower(barbarianArmyPlan(f.row, f.rules, 0), new Map(), f.rules)).toBe(0n);
    expect(
        barbarianPower(barbarianArmyPlan(f.row, f.rules, 0), new Map([["a", null]]), f.rules),
    ).toBe(0n);
    for (const raw of ["", "1e", "0x10", "1_000", "\u00a01", "one"])
    {
        f.rules.world.barbarians!.get("camp")!.para3 = raw;
        expect(() => barbarianArmyPlan(f.row, f.rules, 0)).toThrow("102192");
    }
    f.rules.world.barbarians!.get("camp")!.para3 = "1";
    f.rules.arms.clear();
    expect(() => barbarianPower(barbarianArmyPlan(f.row, f.rules, 0), new Map(), f.rules)).toThrow(
        "102192",
    );
    f.rules.world.armies!.clear();
    expect(() => barbarianArmyPlan(f.row, f.rules, 0)).toThrow("102192");
});

test("barbarian power sums in Java map order before flooring rather than formation declaration order", () => {
    const f = fixture();
    f.rules.world.armies!.get("formation")!.arm = "c;1|b;1|a;1";
    f.rules.arms.set("a", { power: "1e16" });
    f.rules.arms.set("b", { power: "-1e16" });
    f.rules.arms.set("c", { power: "1" });
    const remaining = new Map([
        ["c", 1],
        ["b", 1],
        ["a", 1],
    ]);
    expect(barbarianPower(barbarianArmyPlan(f.row, f.rules, 0), remaining, f.rules)).toBe(1n);
    f.rules.arms.set("a", { power: "-0.25" });
    f.rules.arms.set("b", { power: "0" });
    f.rules.arms.set("c", { power: "0" });
    expect(barbarianPower(barbarianArmyPlan(f.row, f.rules, 0), remaining, f.rules)).toBe(-1n);
});
