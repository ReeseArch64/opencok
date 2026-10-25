import { test, expect } from "bun:test";
import { totemEndTime, totemFootprint, totemNeighbours } from "@opencok/rules/totem";
import { GameService } from "@opencok/services/game";
import { Rules } from "@opencok/rules/game";
import type { GameServices, GameStore } from "@opencok/contracts/game";
import { sfs } from "@opencok/messages/sfs";

test("totem synchronization respects minimum time and excludes the square corners", () => {
  const rule = {
    id: "synthetic",
    take_effect_time: "60",
    minimum_time: "5",
    reduce_time: "5",
    range_of_action: "9",
  };
  expect(totemFootprint(1440000, 1, 1200)).toEqual([1440000]);
  expect(() => totemFootprint(1440000, 2, 1200)).toThrow();
  expect(totemFootprint(1, 2, 1200)).toEqual([1, 2, 1201, 1202]);
  expect(totemNeighbours(1, 10810, 9, 1200)).toBe(false);
  expect(totemNeighbours(1, 10809, 9, 1200)).toBe(true);
  expect(totemEndTime([], rule, 0n, 1200)).toBe(3600000n);
  expect(totemEndTime([{ point: 1, dueAt: 3500000n }], rule, 0n, 1200)).toBe(3200000n);
  expect(totemEndTime([{ point: 1, dueAt: 100000n }], rule, 0n, 1200)).toBe(100000n);
  expect(totemEndTime([{ point: 1, dueAt: 400000n }], rule, 0n, 1200)).toBe(300000n);
});

test("native civilization and totem commands reach the mutation service with correlation", async () => {
  const calls: string[] = [];
  const services: GameServices = {
    cityProgression: async (_owner, command) => {
      calls.push(command);
      return { command, body: { success: sfs.bool(true) }, pushes: [] };
    },
  };
  const game = new GameService(
    {} as GameStore,
    new Rules(new Map(), new Map(), new Map()),
    { kingdomId: 1 },
    () => 1000,
    services,
  );
  for (const command of ["civilizationCastle", "totem"]) {
    const response = await game.execute("owner", command, {
      M__REQUEST_ID__H: sfs.string("info"),
      _cok_: sfs.long(42n),
    });
    expect(response.body._cok_?.value).toBe(42n);
  }
  expect(calls).toEqual(["civilizationCastle", "totem"]);
  await expect(game.execute("owner", "totem.tick", {})).rejects.toThrow();
});
