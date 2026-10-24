import { expect, test } from "bun:test";
import { Cache } from "@opencok/storage/session";
import { DisposableRedis } from "./support/redis.ts";

test("Dragon Battle real Redis reads preserve requested windows, own append and read-only state", async () => {
  const server = new DisposableRedis();
  try {
    const cache = new Cache({ redisUrl: await server.start(), timeoutMs: 500, kingdomId: 2 });
    const board = ["a", "b", "c"].map((teamId) =>
      JSON.stringify({ teamId, fightPower: "9007199254740993" }),
    );
    expect(await cache.dragonRanking([{ start: 0, end: 1 }], "own")).toEqual([]);
    await cache.command("RPUSH", "dragon_battle_rank_data_key", ...board);
    await cache.command("ZADD", "dragon_battle_rank_key", "30", "first", "20", "own", "10", "last");
    expect(
      await cache.dragonRanking(
        [
          { start: 0, end: 1 },
          { start: 0, end: 0 },
        ],
        "own",
      ),
    ).toEqual([
      { json: board[0]!, rank: 0 },
      { json: board[1]!, rank: 1 },
      { json: board[0]!, rank: 0 },
      { json: board[1]!, rank: 1 },
    ]);
    expect(await cache.dragonRanking([{ start: -1, end: -1 }], "")).toEqual([
      { json: board[2]!, rank: -1 },
    ]);
    expect(await cache.dragonRanking([{ start: 0, end: -1 }], "")).toEqual(
      board.map((json, rank) => ({ json, rank })),
    );
    expect(await cache.dragonRanking([{ start: 0, end: -2 }], "missing")).toEqual(
      board.slice(0, 2).map((json, rank) => ({ json, rank })),
    );
    expect(await cache.command("LRANGE", "dragon_battle_rank_data_key", "0", "-1")).toEqual(board);
    expect(Number(await cache.command("ZCARD", "dragon_battle_rank_key"))).toBe(3);
    expect(Number(await cache.command("TTL", "dragon_battle_rank_data_key"))).toBe(-1);
    expect(Number(await cache.command("TTL", "dragon_battle_rank_key"))).toBe(-1);
    await cache.command("DEL", "dragon_battle_rank_data_key");
    await cache.command("SET", "dragon_battle_rank_data_key", "wrong type");
    expect(await cache.dragonRanking([{ start: 0, end: 1 }], "own")).toEqual([]);
    expect(await cache.command("GET", "dragon_battle_rank_data_key")).toBe("wrong type");
    await server.stop();
    expect(await cache.dragonRanking([{ start: 0, end: 1 }], "own")).toEqual([]);
  } finally {
    await server.stop();
  }
}, 30000);
