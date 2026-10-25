import { test, expect } from "bun:test";
import {
  campaignMath,
  campaignCompare,
  campaignRefresh,
  campaignTimestamp,
} from "@opencok/rules/local-campaign";
import { GameService } from "@opencok/services/game";
import { Rules } from "@opencok/rules/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs } from "@opencok/messages/sfs";

test("campaign arithmetic preserves signed longs and UTC refresh boundaries", () => {
  expect(campaignMath(9223372036854775807n, "+", 1n)).toBe(-9223372036854775808n);
  expect(campaignMath(-5n, "/", 2n)).toBe(-2n);
  expect(() => campaignMath(1n, "/", 0n)).toThrow();
  expect(campaignCompare(100n, ">=", 100n)).toBe(true);
  expect(() => campaignCompare(1n, "javascript", 1n)).toThrow();
  expect(campaignTimestamp("2020-02-30 00:00:00")).toBeUndefined();
  expect(campaignTimestamp("2020-02-29 00:00:00")).toBe(BigInt(Date.UTC(2020, 1, 29)));
  expect(campaignRefresh(86399000n, 86400000n, 3, 1)).toBe(true);
  expect(campaignRefresh(0n, 59999n, 1, 1)).toBe(false);
  expect(campaignRefresh(0n, 60000n, 1, 1)).toBe(true);
});

test("anniversary public commands preserve correlation and reject internal event injection", async () => {
  const commands: string[] = [];
  const game = new GameService(
    {} as GameStore,
    new Rules(new Map(), new Map(), new Map()),
    { kingdomId: 1 },
    () => 1000,
    {
      cityProgression: async (_owner, command) => {
        commands.push(command);
        return { body: { success: sfs.string("1") }, pushes: [] };
      },
    },
  );
  for (const command of [
    "1year.info",
    "third.anniversary",
    "third.anniversary.reward",
    "get.activity.value",
  ])
    expect((await game.execute("owner", command, { _cok_: sfs.int(5) })).body._cok_).toEqual(
      sfs.int(5),
    );
  expect(commands).toHaveLength(4);
  await expect(game.execute("owner", "campaign.action", { event: sfs.int(58) })).rejects.toThrow();
  await expect(game.execute("owner", "campaign.init", {})).rejects.toThrow();
});
