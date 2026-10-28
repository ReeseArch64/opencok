import { expect, test } from "bun:test";
import { publicEquipment, publicMedal, publicStatistics } from "@opencok/mappings/profile";
import { decode, encode, sfs, Type } from "@opencok/messages/sfs";

test("public statistics distinguish absent records from zero totals and retain exact stored power", () => {
    expect(publicStatistics(undefined)).toEqual({});
    const result = decode(
        encode(
            publicStatistics({
                power: 9007199254740993n,
                armyKill: 9223372036854775807n,
                battlesWin: 7,
                cityDestroyed: 3,
                buildingPower: 100000n,
                uid: "private-owner",
            }),
        ),
    );
    expect(result.power).toEqual(sfs.long(9007199254740993n));
    expect(result.armyKill).toEqual(sfs.long(9223372036854775807n));
    expect(result.battleWin).toEqual(sfs.int(7));
    expect(result.cityDes).toEqual(sfs.int(3));
    expect(result.attackLose).toEqual(sfs.int(0));
    expect(Object.keys(result)).toHaveLength(11);
    expect(publicStatistics({}).power).toEqual(sfs.long(0));
    for (const power of [9007199254740992, "9223372036854775808", "1.2", "NaN"])
    {
        expect(() => publicStatistics({ power })).toThrow();
    }
});

test("public equipment has explicit wire fields and gated strengthening presentation", () => {
    const row = {
        uuid: "equip-synthetic",
        itemId: 1234,
        on: 1,
        extraProperty: null,
        refineProperty: "7,8",
        reforgeCount: 3,
        strengthLevel: 4,
        lockProperty: null,
        uid: "private-owner",
        cost: "private-cost",
        generalid: 15,
    };
    const plain = publicEquipment(row, false);
    expect(decode(encode(plain))).toEqual({
        uuid: sfs.string("equip-synthetic"),
        itemId: sfs.string("1234"),
        on: sfs.int(1),
        extraProperty: sfs.string(""),
        refineProperty: sfs.string("7,8"),
        reforgeCount: sfs.int(3),
    });
    const strengthened = decode(encode(publicEquipment(row, true)));
    expect(strengthened.strength_level).toEqual(sfs.int(4));
    expect(strengthened.suit_effect).toEqual(sfs.string("2-2910#4-774#6-756#8-68#10-69"));
    expect(strengthened.suit_value).toEqual(
        sfs.string("2-6.5536#4-6.5536#6-655.36#8-13.1072#10-13.1072"),
    );
    expect(strengthened.suit_value_type).toEqual(sfs.string("2-0#4-0#6-0#8-1#10-1"));
    expect(strengthened.suit_value_sign).toEqual(sfs.string("2-2#4-2#6-2#8-1#10-1"));
    for (const alias of ["Buff", "buff", "buff_str", "buff_Str", "buffStr", "BuffStr"])
    {
        expect(strengthened[alias]).toEqual({ type: Type.String, value: "50" });
    }
    expect(Object.keys(strengthened)).toHaveLength(17);
    expect(() => publicEquipment({ ...row, itemId: 2147483648 }, false)).toThrow();
    expect(() => publicEquipment({ ...row, strengthLevel: 1.5 }, true)).toThrow();
    expect(publicEquipment({ ...row, strengthLevel: 1.5 }, false)).toEqual(plain);
});

test("equipment locks preserve legacy delimiter and flag semantics without leaking flags", () => {
    for (
        const [raw, expected] of [
            ["7,1|8,0|9,1", "7|9"],
            ["7,01|8, 1|9,1,extra|", "9"],
            ["7,0", ""],
            [",1|8,1", "8"],
            ["7,1|,1|8,1", "7||8"],
            ["||", ""],
        ]
    )
    {
        expect(publicEquipment({ lockProperty: raw! }, false).lockProperty).toEqual(
            sfs.string(expected!),
        );
    }
    expect(publicEquipment({}, false)).not.toHaveProperty("lockProperty");
    for (const lockProperty of ["", "7", "7,", "7,1||8,1"])
    {
        expect(() => publicEquipment({ lockProperty }, false)).toThrow();
    }
});

test("public medals serialize only id and signed level", () => {
    expect(publicMedal({ id: null, level: null, uid: "private" })).toEqual({
        id: sfs.string(""),
        level: sfs.int(0),
    });
    expect(publicMedal({ id: "synthetic", level: -1 }).level).toEqual(sfs.int(-1));
    expect(() => publicMedal({ level: "2147483648" })).toThrow();
});
