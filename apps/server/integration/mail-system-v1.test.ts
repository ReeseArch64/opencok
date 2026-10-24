import { beforeAll, afterAll, expect, test } from "bun:test";
import { Cache } from "@opencok/storage/session";
import { DisposableRedis } from "./support/redis.ts";

const redis = new DisposableRedis();
let cache: Cache;
beforeAll(async () => {
  cache = new Cache({ redisUrl: await redis.start(), timeoutMs: 2000, kingdomId: 1 });
}, 60000);
afterAll(() => redis.stop());
const key = (owner: string) => `opencok:kingdom:1:chat-user-info:${owner}`;
async function page(owner: string, count: number, time = 1000n) {
  let result: { indices: readonly number[]; more: boolean } | undefined;
  await cache.systemMailPage(owner, ["a", "b", "c"], count, time, (indices, more) => {
    result = { indices, more };
  });
  return result!;
}

test("concurrent V1 pages atomically reserve distinct IDs and count both sends", async () => {
  const pages = await Promise.all([page("concurrent", 1), page("concurrent", 1)]);
  expect(pages.flatMap((entry) => entry.indices).sort()).toEqual([0, 1]);
  expect(pages.every((entry) => entry.more)).toBe(true);
  expect(await page("concurrent", 1)).toEqual({ indices: [2], more: true });
  expect(await page("concurrent", 1)).toEqual({ indices: [], more: false });
  expect(await cache.command("HGET", key("concurrent"), "chat_user_sendtimemail")).toBe("1000:4");
  expect(await page("other", 1)).toEqual({ indices: [0], more: true });
});

test("V1 preserves all-fit, zero-time, nonpositive-count and changing-time quirks", async () => {
  expect(await page("quirks", 0)).toEqual({ indices: [0], more: true });
  expect(await page("quirks", -1)).toEqual({ indices: [1], more: true });
  expect(await page("quirks", 3)).toEqual({ indices: [0, 1, 2], more: false });
  expect(await page("quirks", 1, 2000n)).toEqual({ indices: [0], more: true });
  expect(await page("zero", 1, 0n)).toEqual({ indices: [0], more: true });
  expect(await page("zero", 1, 0n)).toEqual({ indices: [0], more: true });
  expect(await cache.command("HGET", key("zero"), "chat_user_hassendmail")).toBe("");
});

test("failed response validation and malformed metadata cannot change pagination state", async () => {
  await expect(
    cache.systemMailPage("failed", ["a"], 1, 0n, () => {
      throw new Error("synthetic wire failure");
    }),
  ).rejects.toThrow("synthetic wire failure");
  expect(await cache.command("EXISTS", key("failed"))).toBe(0);
  await cache.command("HSET", key("failed"), "chat_user_hassendmail", "bad:a,");
  await expect(page("failed", 1)).rejects.toThrow();
  expect(await cache.command("HGET", key("failed"), "chat_user_sendtimemail")).toBeNull();
});

test("send counters retain Java signed wrap and fail on a Redis outage", async () => {
  await cache.command("HSET", key("wrap"), "chat_user_sendtimemail", "1000:2147483647");
  await page("wrap", 3);
  expect(await cache.command("HGET", key("wrap"), "chat_user_sendtimemail")).toBe(
    "1000:-2147483648",
  );
  const unavailable = new Cache({ redisUrl: "redis://127.0.0.1:1", timeoutMs: 100, kingdomId: 1 });
  await expect(unavailable.systemMailPage("self", ["a"], 1, 0n, () => {})).rejects.toThrow();
});
