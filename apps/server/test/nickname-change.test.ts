import { expect, test } from "bun:test";
import {
  validateNicknameChange,
  nicknameGoldDebit,
  nicknameGoldRefund,
  nicknameItemDebit,
  type NicknameGoldBalances,
} from "@opencok/rules/nickname-change";
import vectors from "./fixtures/nickname-refund-vectors.json";

const initial: Readonly<NicknameGoldBalances> = Object.freeze({
  gold: 20n,
  paidGold: 50n,
  paidSpecialGold: 30n,
  dmmGold: 10n,
  dmmPaidGold: 70n,
  dmmPaidSpecialGold: 20n,
});
const unusedRatio = () => {
  throw new Error("Unexpected refund ratio read");
};

function filters() {
  const calls: [string, string][] = [];
  return {
    calls,
    providers: {
      forbidden: async (name: string) => {
        calls.push(["forbidden", name]);
        return false;
      },
      badWords: async (name: string) => {
        calls.push(["badWords", name]);
        return false;
      },
    },
  };
}

function errorCode(run: () => unknown, code: string) {
  let failure: unknown;
  try {
    run();
  } catch (error) {
    failure = error;
  }
  expect(failure).toMatchObject({ code });
}

test("rename validation replaces both LF forms before filters and trims only the reserved-name input", async () => {
  const instance = filters();
  expect(await validateNicknameChange(" a\nb\\nc ", instance.providers)).toBe("a b c");
  expect(instance.calls).toEqual([
    ["forbidden", "a b c"],
    ["badWords", " a b c "],
  ]);
  const carriage = filters();
  await expect(validateNicknameChange("ab\r\nc", carriage.providers)).rejects.toMatchObject({
    code: "105251",
  });
  expect(carriage.calls).toEqual([
    ["forbidden", "ab\r c"],
    ["badWords", "ab\r c"],
  ]);
});

test("rename validation retains reserved-name bad-word and control precedence over blank and length checks", async () => {
  for (const name of ["", "  ", "\0", "ab", "(a", "a".repeat(17)]) {
    const calls: string[] = [];
    await expect(
      validateNicknameChange(name, {
        forbidden: () => {
          calls.push("forbidden");
          return true;
        },
        badWords: () => {
          calls.push("badWords");
          return true;
        },
      }),
    ).rejects.toMatchObject({ code: "105251" });
    expect(calls).toEqual(["forbidden"]);
    await expect(
      validateNicknameChange(name, {
        forbidden: () => false,
        badWords: () => true,
      }),
    ).rejects.toMatchObject({ code: "105251" });
  }
  for (const code of [0, 8, 9, 13, 31, 127, 128, 159])
    {await expect(
      validateNicknameChange(String.fromCharCode(code), filters().providers),
    ).rejects.toMatchObject({ code: "105251" });}
  expect(await validateNicknameChange("a\nb", filters().providers)).toBe("a b");
});

test("rename validation emits distinct blank parenthesis weighted-length and character errors", async () => {
  for (const name of ["", "  ", "\n\\n", "\u2000", "a", "ab", "a".repeat(17), "a{"])
    {await expect(validateNicknameChange(name, filters().providers)).rejects.toMatchObject({
      code: "E000000",
    });}
  for (const name of ["(a", " (alpha)", "(" + "a".repeat(20)])
    {await expect(validateNicknameChange(name, filters().providers)).rejects.toMatchObject({
      code: "113995",
    });}
  for (const name of ["ab/", "ab\\", "a{b", "ab}", 'a"b', "abc😀", "abc☃"])
    {await expect(validateNicknameChange(name, filters().providers)).rejects.toMatchObject({
      code: "105229",
    });}
  for (const name of ["a{b}", "中文", "ééé", "a b c d e f g h", "a".repeat(16)])
    {expect(await validateNicknameChange(` ${name} `, filters().providers)).toBe(name);}
});

test("rename validation preserves reached provider failures and rejects malformed pure inputs", async () => {
  const failure = new Error("Synthetic filter failure");
  for (const failing of ["forbidden", "badWords"] as const) {
    const instance = filters();
    instance.providers[failing] = async () => {
      throw failure;
    };
    await expect(validateNicknameChange("alpha", instance.providers)).rejects.toBe(failure);
    expect(instance.calls).toEqual(failing === "forbidden" ? [] : [["forbidden", "alpha"]]);
  }
  for (const value of [null, undefined, 1, {}, "a".repeat(65536)]) {
    const instance = filters();
    await expect(validateNicknameChange(value as string, instance.providers)).rejects.toMatchObject(
      { code: "E000000" },
    );
    expect(instance.calls).toEqual([]);
  }
});

test("rename item cost consumes exactly one and preserves configuration-before-inventory errors", () => {
  expect(nicknameItemDebit(1, "0")).toBe(0);
  expect(nicknameItemDebit(2147483647, "１７")).toBe(2147483646);
  for (const count of [undefined, null, 0, -1, -2147483648]) {
    errorCode(() => nicknameItemDebit(count, "0"), "102198");
    errorCode(() => nicknameItemDebit(count, "17"), "E100165");
    errorCode(() => nicknameItemDebit(count, "20"), "E100165");
  }
  for (const type of [undefined, null, "", " 0", "1.0", "2147483648"])
    {expect(() => nicknameItemDebit(0, type)).toThrow("Invalid decimal integer");}
  for (const count of [NaN, 0.5, 2147483648, -2147483649])
    {expect(() => nicknameItemDebit(count, "0")).toThrow("Invalid nickname item count");}
});

test("rename gold debit spends free then special then paid balances with the DMM response exception", () => {
  for (const platform of [null, "android", "cn1", "dmm", "DMM"]) {
    const result = nicknameGoldDebit(initial, platform, "65");
    const dmm = platform === "dmm";
    expect(result).toEqual({
      balances: dmm
        ? { ...initial, dmmGold: 0n, dmmPaidSpecialGold: 0n, dmmPaidGold: 35n }
        : { ...initial, gold: 0n, paidSpecialGold: 0n, paidGold: 35n },
      gold: dmm ? 100n : 35n,
      delta: -65n,
      pool: dmm ? "dmm" : "mobile",
    });
  }
  expect(initial.gold).toBe(20n);
  expect(initial.dmmGold).toBe(10n);
  expect(nicknameGoldDebit(initial, null, "+１５").balances.gold).toBe(5n);
  expect(nicknameGoldDebit(initial, null, "0").balances).toEqual(initial);
});

test("rename gold debit agrees with allocation conservation across small synthetic balance combinations", () => {
  for (let free = 0; free <= 6; free++)
    {for (let special = 0; special <= 6; special++)
      {for (let paid = 0; paid <= 6; paid++)
        {for (let price = 0; price <= free + special + paid; price++) {
          const state = {
            ...initial,
            gold: BigInt(free),
            paidSpecialGold: BigInt(special),
            paidGold: BigInt(paid),
          };
          const result = nicknameGoldDebit(state, null, String(price));
          const usedFree = Math.min(price, free);
          const usedSpecial = Math.min(price - usedFree, special);
          const usedPaid = price - usedFree - usedSpecial;
          expect(result.balances).toEqual({
            ...state,
            gold: BigInt(free - usedFree),
            paidSpecialGold: BigInt(special - usedSpecial),
            paidGold: BigInt(paid - usedPaid),
          });
          expect(result.gold).toBe(BigInt(free + special + paid - price));
        }}}}
});

test("rename gold debit distinguishes insufficient funds from malformed or negative prices and totals", () => {
  errorCode(() => nicknameGoldDebit(initial, null, "101"), "E100001");
  errorCode(() => nicknameGoldDebit(initial, "dmm", "101"), "E100001");
  expect(() => nicknameGoldDebit(initial, null, "-1")).toThrow("Negative nickname gold cost");
  for (const value of [undefined, null, "", " 1", "1 ", "1.0", "2147483648", "-2147483649"])
    {expect(() => nicknameGoldDebit(initial, null, value)).toThrow("Invalid decimal integer");}
  expect(() => nicknameGoldDebit({ ...initial, gold: -100n }, null, "0")).toThrow(
    "Negative total gold",
  );
  expect(() => nicknameGoldDebit({ ...initial, gold: 9223372036854775807n }, null, "0")).toThrow(
    "Negative total gold",
  );
  expect(() => nicknameGoldDebit({ ...initial, gold: 9223372036854775808n }, null, "0")).toThrow(
    "Invalid gold balance",
  );
});

test("rename gold debit preserves signed bucket and long-overflow behavior without clamping saved state", () => {
  const negative = nicknameGoldDebit(
    { ...initial, gold: -5n, paidSpecialGold: -3n, paidGold: 20n },
    null,
    "10",
  );
  expect([
    negative.balances.gold,
    negative.balances.paidSpecialGold,
    negative.balances.paidGold,
    negative.gold,
  ]).toEqual([-5n, -3n, 10n, 2n]);
  const wrapped = nicknameGoldDebit(
    {
      ...initial,
      gold: -9223372036854775808n,
      paidSpecialGold: -9223372036854775808n,
      paidGold: 10n,
    },
    null,
    "7",
  );
  expect(wrapped.balances.paidGold).toBe(3n);
  expect(wrapped.gold).toBe(3n);
  const borrowing = nicknameGoldDebit(
    { ...initial, gold: 2n, paidSpecialGold: -3n, paidGold: 20n },
    null,
    "4",
  );
  expect([
    borrowing.balances.gold,
    borrowing.balances.paidSpecialGold,
    borrowing.balances.paidGold,
    borrowing.gold,
  ]).toEqual([0n, 0n, 15n, 15n]);
});

test("rename refund credits free gold without restoring paid buckets and uses current parsed price", () => {
  const charged = nicknameGoldDebit(initial, null, "65");
  const refunded = nicknameGoldRefund(charged.balances, null, "65", unusedRatio);
  expect(refunded.balances).toEqual({ ...initial, gold: 65n, paidGold: 35n, paidSpecialGold: 0n });
  expect(refunded.gold).toBe(100n);
  expect(refunded.delta).toBe(65n);
  expect(nicknameGoldRefund(charged.balances, null, "67", unusedRatio).gold).toBe(102n);
  const dmm = nicknameGoldRefund(
    nicknameGoldDebit(initial, "dmm", "65").balances,
    "dmm",
    "65",
    unusedRatio,
  );
  expect(dmm.balances).toEqual({
    ...initial,
    dmmGold: 65n,
    dmmPaidGold: 35n,
    dmmPaidSpecialGold: 0n,
  });
  expect(dmm.gold).toBe(100n);
  expect(dmm.pool).toBe("dmm");
  const different = nicknameGoldRefund({ ...initial, gold: 1n }, "dmm", "1", unusedRatio);
  expect(different.gold).toBe(81n);
});

test("rename refund reads the reduction ratio only for exact CN1 after parsing the price", () => {
  let calls = 0;
  const ratio = () => {
    calls++;
    return 0.5;
  };
  expect(nicknameGoldRefund(initial, "cn1", "3", ratio).delta).toBe(1n);
  expect(calls).toBe(1);
  for (const platform of [null, "cn2", "CN1", "dmm"])
    {expect(nicknameGoldRefund(initial, platform, "3", unusedRatio).delta).toBe(3n);}
  expect(() => nicknameGoldRefund(initial, "cn1", "bad", ratio)).toThrow("Invalid decimal integer");
  expect(calls).toBe(1);
  expect(() => nicknameGoldRefund(initial, "cn1", "1", unusedRatio)).toThrow(
    "Unexpected refund ratio read",
  );
  expect(nicknameGoldRefund(initial, null, "-3", unusedRatio).delta).toBe(-3n);
});

test("rename refund float multiplication and long casts match 294 independent Java 8 primitive vectors", () => {
  expect(vectors.cases).toHaveLength(294);
  for (const [price, bits, credited] of vectors.cases) {
    const ratio = Buffer.from(bits!, "hex").readFloatBE();
    const result = nicknameGoldRefund(initial, "cn1", price, () => ratio);
    expect(result.delta, `${price}/${bits}`).toBe(BigInt(credited!));
    expect(result.balances.gold).toBe(BigInt.asIntN(64, initial.gold + BigInt(credited!)));
    expect(result.gold).toBe(
      BigInt.asIntN(
        64,
        initial.gold + initial.paidGold + initial.paidSpecialGold + BigInt(credited!),
      ),
    );
  }
  expect(nicknameGoldRefund(initial, null, "16777217", unusedRatio).delta).toBe(16777216n);
  expect(nicknameGoldRefund(initial, null, "2147483647", unusedRatio).delta).toBe(2147483648n);
});
