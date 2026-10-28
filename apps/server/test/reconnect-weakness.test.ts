import { expect, test } from "bun:test";
import { reconnectWeaknessPlan } from "@opencok/rules/reconnect-weakness";
import { Rules } from "@opencok/rules/game";

function rules(ratio = "500")
{
    const result = new Rules(new Map(), new Map(), new Map());
    result.items.set("week_info", { k1: "1", k2: ratio });
    result.arms.set("knight", { new_arms: "1" });
    result.arms.set("ordinary", { new_arms: "0" });
    return result;
}

test("starvation moves calculated troops to weakness capacity and records overflow deaths once", () => {
    const initial = [{ uid: "owner", armyId: "knight", free: 10, defence: 5, march: 10, pve: 0 }];
    const first = reconnectWeaknessPlan(initial, [], 2500n, 0n, 14, rules());
    expect(first.weaknessTime).toBe(500n);
    expect(first.armies[0]!.free).toBe(0);
    expect(first.armies[0]!.defence).toBe(0);
    expect(first.armies[0]!.march).toBe(10);
    expect(first.weakness[0]!.weakness).toBe(14);
    expect(first.weakness[0]!.marchWeakness).toBe(4);
    expect(first.weakened).toBe(14);
    expect(first.dead).toBe(1);
    expect(first.inserted).toEqual(["knight"]);
    expect(initial[0]!.free).toBe(10);
    const repeated = reconnectWeaknessPlan(
        first.armies,
        first.weakness,
        0n,
        first.weaknessTime,
        14,
        rules(),
    );
    expect(repeated.armies).toEqual(first.armies);
    expect(repeated.weakness).toEqual(first.weakness);
    expect(repeated.weakened).toBe(0);
    expect(repeated.dead).toBe(0);
});

test("weakness allocation conserves troops when free troops cover the loss and when the rate is zero", () => {
    const army = [{ uid: "owner", armyId: "knight", free: 20, defence: 10, march: 0, pve: 0 }];
    const half = reconnectWeaknessPlan(army, [], 1000n, 0n, 100, rules());
    expect(half.armies[0]!.free).toBe(5);
    expect(half.armies[0]!.defence).toBe(10);
    expect(half.weakened).toBe(15);
    const zero = reconnectWeaknessPlan(army, [], 1000n, 0n, 100, rules("0"));
    expect(zero.armies).toEqual(army);
    expect(zero.weakened).toBe(0);
    expect(zero.dead).toBe(0);
});

test("pending march weakness consumes available troops before another starvation loss", () => {
    const army = [{ uid: "owner", armyId: "knight", free: 3, defence: 2, march: 0, pve: 0 }];
    const result = reconnectWeaknessPlan(
        army,
        [{ armyId: "knight", weakness: 7, marchWeakness: 4, heal: 0, finishTime: 0n }],
        1000n,
        0n,
        10,
        rules(),
    );
    expect(result.armies[0]!.free).toBe(0);
    expect(result.armies[0]!.defence).toBe(0);
    expect(result.weakness[0]!.marchWeakness).toBe(0);
    expect(result.weakness[0]!.weakness).toBe(10);
    expect(result.weakened).toBe(3);
    expect(result.dead).toBe(2);
    const ordinary = [{ armyId: "ordinary", free: 5, defence: 2 }];
    expect(reconnectWeaknessPlan(ordinary, [], 1000n, 0n, 0, rules()).armies).toEqual(ordinary);
});
