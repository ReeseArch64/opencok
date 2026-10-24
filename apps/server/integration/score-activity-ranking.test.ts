import { expect, test } from "bun:test";
import { Cache } from "@opencok/storage/session";
import { DisposableRedis } from "./support/redis.ts";

test("score activity ranking reads isolated Redis boards without changing contents or expiry", async () => {
  const server = new DisposableRedis();
  try {
    const redisUrl = await server.start();
    const one = new Cache({ redisUrl, timeoutMs: 500, kingdomId: 1 });
    const two = new Cache({ redisUrl, timeoutMs: 500, kingdomId: 2 });
    expect(await one.scoreActivityRanking()).toEqual([]);
    await one.command("RPUSH", "SCORE_ACT_RANK_1", "private-to-one");
    const board = ["opaque", "", "opaque", "城\0value"];
    await one.command("RPUSH", "SCORE_ACT_RANK_2", ...board);
    expect(await two.scoreActivityRanking()).toEqual(board);
    expect(await two.scoreActivityRanking()).toEqual(board);
    expect(await one.scoreActivityRanking()).toEqual(["private-to-one"]);
    expect(Number(await one.command("LLEN", "SCORE_ACT_RANK_2"))).toBe(4);
    expect(Number(await one.command("TTL", "SCORE_ACT_RANK_2"))).toBe(-1);
    await one.command("DEL", "SCORE_ACT_RANK_2");
    await one.command("SET", "SCORE_ACT_RANK_2", "wrong-type");
    expect(await two.scoreActivityRanking()).toEqual([]);
    expect(await one.command("GET", "SCORE_ACT_RANK_2")).toBe("wrong-type");
    await server.stop();
    expect(await two.scoreActivityRanking()).toEqual([]);
  } finally {
    await server.stop();
  }
}, 30000);
