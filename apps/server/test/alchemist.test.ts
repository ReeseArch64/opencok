import { test, expect } from "bun:test";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { Rules } from "@opencok/rules/game";
import { alchemistInfo } from "@opencok/mappings/alchemist";
import { sfs, encode, decode } from "@opencok/messages/sfs";
test("alchemist retains the native multihandler correlation and dedicated info fields", async () => {
  const calls: string[] = [];
  const game = new GameService(
    {} as GameStore,
    new Rules(new Map(), new Map(), new Map()),
    { kingdomId: 1 },
    () => 1000,
    {
      cityProgression: async (_owner, command) => {
        calls.push(command);
        return { body: {}, pushes: [] };
      },
    },
  );
  const response = await game.execute("owner", "alchemist", {
    M__REQUEST_ID__H: sfs.string("info"),
    _cok_: sfs.long(9007199254740993n),
  });
  expect(response.body._cok_).toEqual(sfs.long(9007199254740993n));
  expect(calls).toEqual(["alchemist"]);
  const info = alchemistInfo(
    { listen: 0, share: 0, reward: 2, rewardtime: 9007199254740993n },
    { k1: "300", k2: "3", k3: "300" },
  );
  expect(decode(encode(info)).rewardtime).toEqual(sfs.long(9007199254740993n));
  expect(Object.keys(info)).toHaveLength(9);
  expect(info.listen_total_times).toBeUndefined();
});
