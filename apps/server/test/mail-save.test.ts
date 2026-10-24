import { expect, test } from "bun:test";
import { mailSaveQuery } from "@opencok/rules/mail";
import { mailSave } from "@opencok/dtos/mail";
import { sfs } from "@opencok/messages/sfs";

const now = 1792756800000;

test("mail saving preserves single identifiers and batch split semantics while normalizing flags", () => {
  expect(mailSaveQuery("save", "a,b", 99, now)).toEqual({
    mode: "save",
    ids: ["a,b"],
    flag: 1,
    now,
  });
  expect(mailSaveQuery("cancel", "", 28, now)).toEqual({ mode: "cancel", ids: [""], flag: 0, now });
  expect(mailSaveQuery("batch", ",a,,b,a, c ,", 1, now)).toEqual({
    mode: "batch",
    ids: ["a", "b", " c "],
    flag: 1,
    now,
  });
  for (const flag of [-2147483648, -1, 0, 2, 2147483647])
    expect(mailSaveQuery("batch", "a", flag, now).flag).toBe(0);
  for (const value of ["", ",,,,", " \t\n", "\u2003"])
    expect(mailSaveQuery("batch", value, 1, now).ids).toEqual([]);
  for (const value of ["\u00a0", "\u2007", "\u202f", " a "])
    expect(mailSaveQuery("batch", value, 1, now).ids).toEqual([value]);
  expect(
    mailSaveQuery("batch", Array.from({ length: 1000 }, (_, i) => `mail-${i}`).join(","), 1, now)
      .ids,
  ).toHaveLength(1000);
});

test("mail saving rejects malformed IDs, unbounded batches and invalid numeric inputs before persistence", () => {
  for (const value of [
    "x".repeat(41),
    "a\0b",
    "\ud800",
    Array.from({ length: 1001 }, () => "a").join(","),
    ",".repeat(65536),
  ])
    expect(() => mailSaveQuery("batch", value, 1, now)).toThrow();
  for (const flag of [NaN, 1.5, Infinity, 2147483648, -2147483649])
    expect(() => mailSaveQuery("save", "a", flag, now)).toThrow();
  for (const time of [-1, NaN, 1.5, Number.MAX_SAFE_INTEGER + 1])
    expect(() => mailSaveQuery("save", "a", 1, time)).toThrow();
  expect(() => mailSaveQuery("unknown" as never, "a", 1, now)).toThrow();
  expect(mailSave("save")).toEqual({ save: sfs.string("success") });
  expect(mailSave("cancel")).toEqual({ cancel: sfs.string("success") });
  expect(mailSave("unchanged")).toEqual({});
});
