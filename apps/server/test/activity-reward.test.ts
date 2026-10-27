import { expect, test } from "bun:test";
import { activityRewardEntries, activityRewardVersion } from "@opencok/rules/activity-reward";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
test("activity rewards decode source padded UTF8 and preserve concatenated signed version parsing", () => {
  expect(activityRewardEntries(javaMailBytes("gold,0,3|goods,200001,2"))).toEqual([
    { category: "gold", itemId: "0", count: 3 },
    { category: "goods", itemId: "200001", count: 2 },
  ]);
  expect(activityRewardVersion("12.06.0")).toBe(12060n);
  expect(activityRewardVersion("12..5.0")).toBe(1250n);
  expect(() => activityRewardVersion("2147483648")).toThrow();
  expect(() => activityRewardEntries(new Uint8Array([0xff]))).toThrow();
  expect(() => activityRewardEntries(new Uint8Array(65536))).toThrow();
  expect(() => activityRewardEntries(javaMailBytes("gold,0,-1"))).toThrow();
});

test("activity reward entries retain repeated general and XP blocks in their exact source order", () => {
  expect(
    activityRewardEntries(javaMailBytes("general,100,1|exp,0,5|general,100,1|exp,0,7")),
  ).toEqual([
    { category: "general", itemId: "100", count: 1 },
    { category: "exp", itemId: "0", count: 5 },
    { category: "general", itemId: "100", count: 1 },
    { category: "exp", itemId: "0", count: 7 },
  ]);
});
