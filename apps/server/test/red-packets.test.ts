import { GameService } from "@opencok/services/game";
import { Rules } from "@opencok/rules/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs } from "@opencok/messages/sfs";
import { expect, test } from "bun:test";
import { packetDistribution, packetStatus } from "@opencok/rules/red-packets";
import { paidGiftOperation } from "@opencok/services/red-packets";
import type { Row } from "@opencok/contracts/rows";
const parameters = "0.1;6;2;5;0.3";
test("saved random distributions exhaust maintained pools in the configured claimant count and reserve one gold per later claimant", () => {
  let seed = 314159;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const firstClaims = new Set<number>();
  for (const [total, people] of [
    [250, 5],
    [750, 8],
    [1500, 10],
    [2400, 15],
    [6000, 20],
    [12000, 30],
  ])
    for (let draw = 0; draw < 100; draw++) {
      const packet: Row = {
        total: total!,
        remain: total!,
        totalPeople: people!,
        curPeople: 0,
        type: 0,
      };
      for (let person = 0; person < people!; person++) {
        const value = packetDistribution(packet, parameters, random);
        if (person === 0 && total === 250) firstClaims.add(value);
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(Number(packet.remain));
        packet.remain = Number(packet.remain) - value;
        packet.curPeople = person + 1;
        expect(Number(packet.remain)).toBeGreaterThanOrEqual(people! - person - 1);
      }
      expect(packet.remain).toBe(0);
    }
  expect(firstClaims.size).toBeGreaterThan(5);
});
test("average distribution preserves the source ceiling and last-recipient remainder while statuses distinguish claimed empty and strict expiry", () => {
  expect(
    packetDistribution(
      { total: 10, remain: 10, totalPeople: 3, curPeople: 0, type: 1 },
      parameters,
      () => 0,
    ),
  ).toBe(4);
  expect(
    packetDistribution(
      { total: 10, remain: 2, totalPeople: 3, curPeople: 2, type: 1 },
      parameters,
      () => 0,
    ),
  ).toBe(2);
  const packet: Row = { totalPeople: 3, curPeople: 0, remain: 10, endTime: 100n, state: 0 };
  expect(packetStatus(packet, false, 99n)).toBe(1);
  expect(packetStatus(packet, false, 100n)).toBe(3);
  expect(packetStatus(packet, true, 101n)).toBe(0);
  expect(packetStatus({ ...packet, remain: 0 }, false, 101n)).toBe(2);
  expect(packetStatus(undefined, false, 0n)).toBe(3);
});
test("paid producer identities bind owner provider and order independently and reject invalid evidence selections", () => {
  expect(
    new Set([
      paidGiftOperation("owner", "order", "provider"),
      paidGiftOperation("other", "order", "provider"),
      paidGiftOperation("owner", "another", "provider"),
      paidGiftOperation("owner", "order", "different"),
    ]).size,
  ).toBe(4);
  expect(() => paidGiftOperation("owner", "", "provider")).toThrow();
  expect(() =>
    packetDistribution(
      { total: 250, remain: 250, totalPeople: 5, curPeople: 0, type: 0 },
      parameters,
      () => 1,
    ),
  ).toThrow();
});

test("native packet commands preserve correlation while trusted paid producers and internal event injection stay unreachable", async () => {
  const routed: string[] = [],
    game = new GameService(
      {} as GameStore,
      new Rules(new Map(), new Map(), new Map()),
      { kingdomId: 1 },
      () => 1000,
      {
        cityProgression: async (_owner, command) => {
          routed.push(command);
          return { body: {}, pushes: [] };
        },
      },
    );
  for (const command of [
    "redPackets.sd",
    "redPackets.rv",
    "redPackets.status",
    "redPackets.rvd.id",
  ])
    expect((await game.execute("owner", command, { _cok_: sfs.int(7) })).body._cok_).toEqual(
      sfs.int(7),
    );
  expect(routed).toHaveLength(4);
  for (const command of [
    "campaign.paid.gift",
    "campaign.action",
    "campaign.record",
    "redPackets.expire",
  ])
    await expect(game.execute("owner", command, { event: sfs.int(56) })).rejects.toThrow();
  expect(routed).toHaveLength(4);
});
