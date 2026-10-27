import { expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { javaGbkLength } from "@opencok/rules/java-gbk";
import {
  checkNickname,
  nicknameCharactersAllowed,
  nicknameLength,
  nicknameTrim,
} from "@opencok/rules/nickname";
import vectors from "./fixtures/nickname-vectors.json";

const text = (hex: string) => Buffer.from(hex, "hex").swap16().toString("utf16le");

test("GBK widths match the Java 8 checksum for every UTF-16 code unit", () => {
  const widths: number[] = [];
  for (let unit = 0; unit <= 65535; unit++) {widths.push(javaGbkLength(String.fromCharCode(unit)));}
  expect(createHash("sha256").update(widths.join("")).digest("hex")).toBe(vectors.gbkWidthsSha256);
  expect(widths.filter((width) => width === 2)).toHaveLength(23940);
});

test("nickname text primitives match 2264 independent Java 8 GBK whitespace and character vectors", () => {
  expect(vectors.cases).toHaveLength(2264);
  for (const entry of vectors.cases) {
    const name = text(entry.utf16);
    expect(nicknameLength(name), entry.utf16).toBe(entry.length);
    expect(nicknameTrim(name), entry.utf16).toBe(text(entry.trimmed));
    expect(nicknameLength(nicknameTrim(name)), entry.utf16).toBe(entry.trimmedLength);
    expect(nicknameCharactersAllowed(name), entry.utf16).toBe(entry.allowed);
  }
});

test("nickname feedback and provider eligibility match the primitive vectors without mutating input", async () => {
  for (const entry of vectors.cases) {
    const raw = text(entry.utf16),
      normalized = text(entry.trimmed);
    const calls: string[] = [];
    const result = await checkNickname(raw, 0, {
      containsBadWords: (name) => {
        expect(name).toBe(normalized);
        calls.push("filter");
        return false;
      },
      occupied: async (name) => {
        expect(name).toBe(normalized);
        calls.push("occupied");
        return false;
      },
    });
    const eligible = entry.trimmedLength >= 3 && entry.trimmedLength <= 16 && entry.trimmedAllowed;
    expect(result).toEqual({
      occupied: 0,
      exist: entry.initialInvalid || !eligible ? -1 : 0,
      length: entry.trimmedLength + entry.spaces,
      remainLength: 16 - entry.trimmedLength - entry.spaces,
    });
    expect(calls).toEqual(eligible ? ["filter", "occupied"] : []);
  }
});

test("reported lengths double-count internal ASCII spaces and can exceed the validation limit", async () => {
  const providers = { containsBadWords: () => false, occupied: async () => false };
  expect(await checkNickname(" a b ", 0, providers)).toEqual({
    occupied: 0,
    exist: 0,
    length: 6,
    remainLength: 10,
  });
  expect(await checkNickname(" ".repeat(20) + "abc", 0, providers)).toEqual({
    occupied: 0,
    exist: 0,
    length: 23,
    remainLength: -7,
  });
  expect(await checkNickname("\t abc\t", 0, providers)).toEqual({
    occupied: 0,
    exist: 0,
    length: 4,
    remainLength: 12,
  });
  expect(await checkNickname(" ".repeat(20), 0, providers)).toEqual({
    occupied: 0,
    exist: -1,
    length: 20,
    remainLength: -4,
  });
});

test("leading-parenthesis invalidity does not bypass later filtering and occupancy", async () => {
  const calls: string[] = [];
  const result = await checkNickname(" (abc ", 0, {
    containsBadWords: (name) => {
      calls.push(`filter:${name}`);
      return false;
    },
    occupied: async (name) => {
      calls.push(`occupied:${name}`);
      return true;
    },
  });
  expect(result).toEqual({ occupied: 1, exist: -1, length: 6, remainLength: 10 });
  expect(calls).toEqual(["filter:(abc", "occupied:(abc"]);
});

test("invalid syntax or weighted length skips providers while a filter match skips occupancy", async () => {
  const calls: string[] = [];
  const providers = {
    containsBadWords: (name: string) => {
      calls.push(`filter:${name}`);
      return true;
    },
    occupied: async (name: string) => {
      calls.push(`occupied:${name}`);
      return true;
    },
  };
  for (const name of [
    "ab",
    "a".repeat(17),
    "中".repeat(9),
    "a{b",
    "a}b",
    "a/b",
    "😀ab",
    "abc\nxyz",
  ])
    {expect((await checkNickname(name, 0, providers)).exist).toBe(-1);}
  expect(calls).toEqual([]);
  expect(await checkNickname("abc", 0, providers)).toEqual({
    occupied: 0,
    exist: -1,
    length: 3,
    remainLength: 13,
  });
  expect(calls).toEqual(["filter:abc"]);
});

test("only type zero checks global occupancy while every eligible type still filters", async () => {
  for (const type of [-2147483648, -1, 0, 1, 2, 2147483647]) {
    const calls: string[] = [];
    const result = await checkNickname("abc", type, {
      containsBadWords: () => {
        calls.push("filter");
        return false;
      },
      occupied: async () => {
        calls.push("occupied");
        return true;
      },
    });
    expect(result.exist).toBe(type === 0 ? -1 : 0);
    expect(result.occupied).toBe(type === 0 ? 1 : 0);
    expect(calls).toEqual(type === 0 ? ["filter", "occupied"] : ["filter"]);
  }
});

test("reached provider failures propagate and preserve the evaluation boundary", async () => {
  let occupied = 0;
  const filterFailure = {
    containsBadWords: () => {
      throw new Error("filter unavailable");
    },
    occupied: async () => {
      occupied++;
      return false;
    },
  };
  await expect(checkNickname("abc", 0, filterFailure)).rejects.toThrow("filter unavailable");
  await expect(checkNickname("(abc", 0, filterFailure)).rejects.toThrow("filter unavailable");
  expect(occupied).toBe(0);
  const globalFailure = {
    containsBadWords: () => false,
    occupied: async () => {
      throw new Error("global unavailable");
    },
  };
  await expect(checkNickname("abc", 0, globalFailure)).rejects.toThrow("global unavailable");
  expect((await checkNickname("abc", 1, globalFailure)).exist).toBe(0);
});

test("GBK replacement and compressed UTF-16 preserve the weighted length independently of character eligibility", () => {
  expect(javaGbkLength("中文")).toBe(4);
  expect(javaGbkLength("Ω")).toBe(2);
  expect(nicknameLength("Ω")).toBe(1);
  expect(javaGbkLength("😀")).toBe(1);
  expect(nicknameLength("a😀b")).toBe(3);
  expect(nicknameCharactersAllowed("a😀b")).toBe(false);
  expect(nicknameLength("\ud800~\udc00")).toBe(2);
  expect(nicknameLength("\ud800中\udc00")).toBe(4);
  expect(nicknameCharactersAllowed("a\0b")).toBe(true);
  expect(nicknameCharactersAllowed("a{b}c")).toBe(true);
});

test("text bounds and malformed check types fail without consulting providers", async () => {
  const never = () => {
    throw new Error("Unexpected provider");
  };
  const providers = { containsBadWords: never, occupied: never };
  for (const value of [undefined, null, 12, "a".repeat(65536)]) {
    for (const fn of [nicknameTrim, nicknameLength, nicknameCharactersAllowed, javaGbkLength])
      {expect(() => fn(value as string)).toThrow();}
    await expect(checkNickname(value as string, 0, providers)).rejects.toThrow();
  }
  for (const type of [NaN, Infinity, 0.5, 2147483648, -2147483649])
    {await expect(checkNickname("abc", type, providers)).rejects.toThrow();}
  expect(nicknameLength("a".repeat(65535))).toBe(65535);
});
