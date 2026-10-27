import { expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { javaNicknameCharacter } from "@opencok/rules/java-nickname-characters";
import { containsNicknameBadWords, nicknameBadWordEntries } from "@opencok/rules/nickname-words";
import { checkNickname } from "@opencok/rules/nickname";
import vectors from "./fixtures/nickname-word-vectors.json";

const text = (hex: string) => Buffer.from(hex, "hex").swap16().toString("utf16le");

test("nickname boundary properties match every Unicode code point in Java 8", () => {
  const properties = Buffer.alloc(0x110000);
  let word = 0,
    marks = 0;
  for (let codePoint = 0; codePoint <= 0x10ffff; codePoint++) {
    const property = javaNicknameCharacter(codePoint);
    properties[codePoint] = property === 1 ? 119 : property === 2 ? 109 : 46;
    if (property === 1) {word++;}
    if (property === 2) {marks++;}
  }
  expect(createHash("sha256").update(properties).digest("hex")).toBe(vectors.propertiesSha256);
  expect([word, marks]).toEqual([107270, 1280]);
  for (const codePoint of [-1, 0.5, NaN, Infinity, 0x110000])
    {expect(javaNicknameCharacter(codePoint)).toBe(0);}
});

test("nickname matching follows 4071 independently generated Java 8 regex outcomes", () => {
  expect(vectors.cases).toHaveLength(4071);
  const failures: unknown[] = [];
  for (const [entry, name, expected] of vectors.cases as [string, string, boolean][]) {
    const actual = containsNicknameBadWords(text(name), [text(entry)]);
    if (actual !== expected) {failures.push({ entry, name, actual, expected });}
  }
  expect(failures).toEqual([]);
});

test("ASCII words use Unicode Java boundaries and ASCII-only case folding", () => {
  for (const name of ["abc", "ABC", " abc ", "abc-", "!AbC!", "\u0301abc"])
    {expect(containsNicknameBadWords(name, ["abc"]), name).toBe(true);}
  for (const name of [
    "xabc",
    "abc2",
    "中abc",
    "abc中",
    "äabc",
    "abc_",
    "a\u0301abc",
    "abc\u0301",
    "𐐀abc",
  ])
    {expect(containsNicknameBadWords(name, ["abc"]), name).toBe(false);}
  expect(containsNicknameBadWords("K", ["k"])).toBe(false);
  expect(containsNicknameBadWords("K", ["k"])).toBe(true);
  expect(containsNicknameBadWords("_\u0301abc", ["abc"])).toBe(true);
  expect(containsNicknameBadWords("𞤀abc", ["abc"])).toBe(true);
});

test("non-word entries retain case and permit only Java ASCII whitespace between literal units", () => {
  expect(containsNicknameBadWords("中 文", ["中文"])).toBe(true);
  expect(containsNicknameBadWords("中\t\n\v\f\r 文", ["中文"])).toBe(true);
  for (const gap of ["\u00a0", "\u2000", "\u3000"])
    {expect(containsNicknameBadWords(`中${gap}文`, ["中文"])).toBe(false);}
  expect(containsNicknameBadWords("A !", ["A!"])).toBe(true);
  expect(containsNicknameBadWords("a!", ["A!"])).toBe(false);
  for (const punctuation of ["+", ".", "{", "}", "*", "[", "]", "(", ")", "\\", "?"])
    {expect(containsNicknameBadWords(`a ${punctuation} b`, [`a${punctuation}b`])).toBe(true);}
});

test("unescaped anchors and alternatives keep their generated-pattern semantics", () => {
  expect(containsNicknameBadWords("anything", ["|"])).toBe(true);
  expect(containsNicknameBadWords("xyzb", ["a|b"])).toBe(true);
  expect(containsNicknameBadWords(" x a", ["^a"])).toBe(false);
  expect(containsNicknameBadWords(" a", ["^a"])).toBe(true);
  for (const suffix of ["", "\n", "\r", "\r\n", "\u0085", "\u2028", "\u2029"])
    {expect(containsNicknameBadWords(`a${suffix}`, ["a$"])).toBe(true);}
  expect(containsNicknameBadWords("ab", ["a$"])).toBe(false);
  expect(containsNicknameBadWords("a$", ["a$"])).toBe(false);
});

test("entry loading preserves length order duplicate entries and single removals", () => {
  const previous = ["old", "v", " "];
  const result = nicknameBadWordEntries(
    ["ab", "cd", "", "longest", "v", " ", "v", " ", "A", "B\u2028C"],
    previous,
  );
  expect(result).toEqual(["old", "longest", "B\u2028C", "ab", "cd", "v", " ", "v", " ", "A"]);
  expect(previous).toEqual(["old", "v", " "]);
  expect(nicknameBadWordEntries(["😀", "ab", "中"], [])).toEqual(["😀", "ab", "中"]);
  expect(nicknameBadWordEntries(["v", "v", " ", " ", "V"])).toEqual(["v", " ", "V"]);
});

test("locking wins over entries and matching failures stop the remaining list", () => {
  expect(containsNicknameBadWords("abc", [], true)).toBe(true);
  expect(containsNicknameBadWords("abc", [null, "abc"] as unknown as string[])).toBe(false);
  expect(containsNicknameBadWords("abc", ["abc", null] as unknown as string[])).toBe(true);
  expect(containsNicknameBadWords(null as unknown as string, ["abc"])).toBe(false);
  expect(containsNicknameBadWords(null as unknown as string, [], true)).toBe(true);
  expect(containsNicknameBadWords("a".repeat(65536), ["a"])).toBe(false);
});

test("nickname checks consume the actual word matcher before global occupation", async () => {
  let occupied = 0;
  const providers = {
    containsBadWords: (name: string) => containsNicknameBadWords(name, ["blocked", "中文"]),
    occupied: async () => {
      occupied++;
      return false;
    },
  };
  expect((await checkNickname(" BLOCKED ", 0, providers)).exist).toBe(-1);
  expect((await checkNickname("中 文", 0, providers)).exist).toBe(-1);
  expect(occupied).toBe(0);
  expect((await checkNickname("clear", 0, providers)).exist).toBe(0);
  expect(occupied).toBe(1);
});
