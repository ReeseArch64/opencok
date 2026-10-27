import { expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { mysqlUtf8UnicodeKey as key } from "@opencok/rules/mysql-unicode";

test("nickname comparison keys match public MySQL UCA 4 weights for every valid BMP character", () => {
  const keys: string[] = [];
  for (let code = 0; code <= 65535; code++) {
    if (code >= 0xd800 && code <= 0xdfff) {continue;}
    keys.push(`${code.toString(16).padStart(4, "0")}:${key(String.fromCharCode(code))}`);
  }
  expect(keys).toHaveLength(63488);
  expect(createHash("sha256").update(keys.join("\n")).digest("hex")).toBe(
    "5b4f2a62764df55c6d214ecdcd96cfff64f921ef621759690c371643ec11209e",
  );
});

test("nickname comparison preserves primary case accent width and expansion equivalence", () => {
  for (const [left, right] of [
    ["Café", "CAFE"],
    ["Cafe\u0301", "café"],
    ["Straße", "STRASSE"],
    ["œuvre", "OEUVRE"],
    ["ﬁrst", "FIRST"],
    ["ＡＢＣ", "abc"],
    ["²", "2"],
    ["Kelvin", "KELVIN"],
    ["㍿", "株式会社"],
    ["\uf900", "\u8c48"],
    ["Αθήνα", "αθηνα"],
    ["Й", "й"],
  ])
    {expect(key(left!), `${left} / ${right}`).toBe(key(right!));}
});

test("nickname comparison retains UCA 4 exclusions instead of using modern Unicode normalization", () => {
  for (const [left, right] of [
    ["Æ", "AE"],
    ["Й", "И"],
    ["ı", "i"],
    ["ẞ", "ß"],
    ["가", "가"],
    ["а", "a"],
    ["a\u1ab0", "a"],
    ["ﷺ", "صلى الله عليه وسلم"],
    ["\u0e40\u0e01", "\u0e01\u0e40"],
  ])
    {expect(key(left!), `${left} / ${right}`).not.toBe(key(right!));}
});

test("nickname comparison ignores primary zero weights and pads only trailing space weights", () => {
  for (const text of ["name ", "name\u00a0", "name\u2000", "name \u0301", "name\0", "na\u200bme"])
    {expect(key(text)).toBe(key("NAME"));}
  for (const text of ["", " ", "\0", "\u0301", " \u0301\u00a0"]) {expect(key(text)).toBe("");}
  for (const text of [" name", "na me", "name\t", "name\n"])
    {expect(key(text)).not.toBe(key("name"));}
  expect(key("na\u00a0me")).toBe(key("na me"));
  expect(key("name ") + key("x")).not.toBe(key("name x"));
});

test("nickname comparison keeps implicit weights distinct at historical CJK boundaries", () => {
  expect(
    [0x33ff, 0x3400, 0x4db5, 0x4db6, 0x4e00, 0x7fff, 0x8000, 0x9fa5, 0x9fa6, 0xfdfa, 0xffff].map(
      (code) => key(String.fromCharCode(code)),
    ),
  ).toEqual([
    "0ec10e330f2e",
    "fb80b400",
    "fb80cdb5",
    "fbc0cdb6",
    "fb40ce00",
    "fb40ffff",
    "fb418000",
    "fb419fa5",
    "fbc19fa6",
    "fbc1fdfa",
    "fbc1ffff",
  ]);
});

test("nickname comparison rejects text outside the legacy three-byte UTF-8 domain", () => {
  for (const text of ["\ud800", "\udfff", "a\ud800b", "😀", "𐀀", "a".repeat(65536)])
    {expect(() => key(text)).toThrow();}
  for (const text of [null, undefined, 1, {}, []]) {expect(() => key(text as string)).toThrow();}
  expect(key("a".repeat(65535))).toHaveLength(65535 * 4);
  expect(key("\ufeff".repeat(65535))).toBe("");
});
