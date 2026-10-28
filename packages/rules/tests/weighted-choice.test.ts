import { expect, test } from "bun:test";
import { chooseWeight } from "../src/weighted-choice";
import { errors } from "@opencok/constants/game";

test("weighted choice preserves scaled boundaries and rejects invalid random or probability input", () => {
    const limits: number[] = [];
    const select = (value: number) =>
        chooseWeight([0, 0.5, 1.5], (limit) => {
            limits.push(limit);
            return value;
        });
    expect(select(0)).toBe(1);
    expect(select(49999)).toBe(1);
    expect(select(50000)).toBe(2);
    expect(select(199999)).toBe(2);
    expect(limits).toEqual([200000, 200000, 200000, 200000]);
    for (const value of [-1, 200000, 0.5, NaN])
    {
        expect(() => select(value)).toThrow(errors.invalid);
    }
    for (const weights of [[], [0], [-1], [Infinity], [NaN], [Number.MAX_SAFE_INTEGER]])
    {
        expect(() => chooseWeight(weights, () => 0)).toThrow(errors.invalid);
    }
});
