import { expect, test } from "bun:test";
import { mailRewardEntries, mailRewardSelection } from "@opencok/rules/mail-rewards";

test("attachment parsing preserves quantities and rejects malformed, negative, fractional or overflowing grants", () => {
  expect(mailRewardEntries("goods,200300,2|gold,0,3|goods,200300,4|")).toEqual([
    { category: "goods", itemId: "200300", count: 6 },
    { category: "gold", itemId: "0", count: 3 },
  ]);
  expect(mailRewardEntries("wood, 0 , 2147483647")[0]?.count).toBe(2147483647);
  for (const raw of [
    null,
    "",
    "|",
    "gold,0,-1",
    "gold,0,0",
    "gold,0,1.5",
    "gold,0,2147483648",
    "gold,0,2147483647|gold,0,1",
    "gold,0,1,ignored",
    "gold,0",
    "goods,x,1",
    "gold,0,NaN",
    "gold,0,1\u0000",
  ])
    {expect(() => mailRewardEntries(raw)).toThrow();}
  expect(() => mailRewardEntries(Array.from({ length: 65 }, () => "gold,0,1").join("|"))).toThrow();
});

test("mail selections deduplicate overlap and preserve the legacy label fallback within bounded input", () => {
  expect(mailRewardSelection(undefined, "a,b,a,,", "0,1,1,99,-1,+2", true)).toEqual({
    ids: ["a", "b"],
    labels: [0, 1, 6, 2],
    batch: true,
  });
  expect(mailRewardSelection("single", "", "", false)).toEqual({
    ids: ["single"],
    labels: [],
    batch: false,
  });
  for (const types of ["x", "1.5", "2147483648", "-2147483649", "1\0"])
    {expect(() => mailRewardSelection(undefined, "", types, true)).toThrow();}
  expect(() => mailRewardSelection("", "", "", false)).toThrow();
  expect(() => mailRewardSelection("x".repeat(41), "", "", false)).toThrow();
  expect(() =>
    mailRewardSelection(
      undefined,
      Array.from({ length: 65 }, (_, index) => String(index)).join(","),
      "",
      true,
    ),
  ).toThrow();
});
