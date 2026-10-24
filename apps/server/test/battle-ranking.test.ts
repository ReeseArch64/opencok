import { expect, test } from "bun:test";
import { GameService as Game } from "@opencok/services/game";
import { Rules } from "@opencok/rules/game";
import type { GameStore } from "@opencok/contracts/game";
import type { BattleRankingState } from "@opencok/contracts/battle-ranking";
import { loadBattleFightRanking, loadPlayoffRanking } from "@opencok/storage/battle-ranking";
import { playoffPairs, playoffTimes } from "@opencok/rules/battle-ranking";
import { sfs } from "@opencok/messages/sfs";
import { decodeStoredJson, decodePublishedJson } from "@opencok/messages/stored-json";
import { decodeFightRanking, decodePlayoffTeams } from "@opencok/services/battle-ranking";

function rules() {
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.items.set("wa_info", { k1: "0" });
  rules.items.set("wap_info", { k1: "0", k9: "6" });
  rules.items.set("wa_switch", { k1: "all", k2: "1.0.0" });
  rules.features.set("wap_switch", { online: "all", test: "all", version: "1.0.0" });
  return rules;
}
const now = Date.UTC(2026, 9, 24, 5);
function snapshot(): BattleRankingState {
  return {
    profile: { uid: "self", serverId: 1, allianceId: "a", banFlag: 0 },
    realmType: 3,
    openedAt: 0n,
    observerTeam: undefined,
    tickets: [],
  };
}
function teams() {
  return Array.from({ length: 8 }, (_, index) =>
    JSON.stringify({
      teamId: `t${index}`,
      teamName: `Team ${index}`,
      kingId: 1,
      score: 100 - index,
      groupId: index,
      index: Math.floor(index / 2),
      results: [1, 1, 1, 0, 0, 0],
      enemyIds: [null, null, null, `t${index ^ 1}`, null, null],
      curEnemyId: `t${index ^ 1}`,
      fightPower: "9007199254740993",
      rankNum: index,
    }),
  );
}

test("fight ranking scopes participants to the authenticated encounter and never enters a battle", async () => {
  const state = snapshot();
  const publication = JSON.stringify([
    {
      teamId: "a",
      enemyId: "b",
      fightPlayerMap: {
        active: {
          id: "member",
          teamId: "a",
          state: 1,
          score: 7,
          killNum: "4294967297",
          rankNum: 2,
        },
        inactive: { id: "inactive", teamId: "b", state: 0 },
      },
    },
    { teamId: "foreign", enemyId: "other", fightPlayerMap: { secret: { id: "secret", state: 1 } } },
  ]);
  const game = new Game(
    { battleRankingState: async () => state } as unknown as GameStore,
    rules(),
    { kingdomId: 1 },
    () => now,
    { battleFightPublication: async () => publication },
  );
  const response = await game.execute("self", "dragon.battle.fight.rank", {
    teamId: sfs.string("foreign"),
  });
  expect(response.body.rank).toEqual(
    sfs.array([
      sfs.object({
        rankNum: sfs.int(2),
        id: sfs.string("member"),
        teamId: sfs.string("a"),
        name: sfs.string(""),
        winNum: sfs.int(0),
        failNum: sfs.int(0),
        killNum: sfs.int(1),
        score: sfs.int(7),
        awardNum: sfs.int(0),
        holdNum: sfs.int(0),
        campType: sfs.int(0),
      }),
    ]),
  );
  expect(response.pushes).toEqual([]);
  state.observerTeam = "b";
  expect((await game.execute("self", "dragon.battle.fight.rank", {})).body.rank).toEqual(
    response.body.rank,
  );
  state.realmType = 0;
  expect((await game.execute("self", "dragon.battle.fight.rank", {})).body.rank).toBeUndefined();
});

test("playoff query pairs champions, promotes the owner's match and preserves tickets and long power", async () => {
  const state = snapshot();
  state.profile!.allianceId = "t6";
  state.tickets = ["t7"];
  const game = new Game(
    { battleRankingState: async () => state } as unknown as GameStore,
    rules(),
    { kingdomId: 1 },
    () => now,
    {
      playoffPublication: async () => ({
        state: 5,
        turns: 4,
        start: BigInt(Date.UTC(2026, 9, 24)),
        duration: 86400000n,
        teams: teams(),
      }),
    },
  );
  const response = await game.execute("self", "dragon.playoff.rank.info", {});
  expect(response.body.state).toEqual(sfs.byte(5));
  expect(response.body.enemyId).toEqual(sfs.string("t7"));
  expect(response.body.battleState).toEqual(sfs.int(0));
  const groups = response.body.groups!.value as { value: Record<string, unknown> }[];
  expect(groups).toHaveLength(8);
  expect(groups[0]!.value.teamId).toEqual(sfs.string("t6"));
  expect(groups[0]!.value.fightPower).toEqual(sfs.long(9007199254740993n));
  expect(groups[1]!.value.ticketPayed).toEqual(sfs.bool(true));
  expect(groups[0]!.value.start).toEqual(sfs.long(BigInt(Date.UTC(2026, 9, 24, 6)) / 1000n));
  expect(groups[0]!.value.rankNum).toEqual(sfs.int(7));
});

test("playoff pairing rejects incomplete brackets and retains deterministic group ties", () => {
  const parsed = decodePlayoffTeams(teams());
  parsed.forEach((team) => {
    team.score = 1;
  });
  expect(playoffPairs(parsed.reverse(), 4, "").map((team) => team.teamId)).toEqual(
    Array.from({ length: 8 }, (_, i) => `t${i}`),
  );
  expect(() => playoffPairs(parsed.slice(1), 4, "")).toThrow();
  const self = parsed.find((team) => team.teamId === "t6")!;
  expect(
    playoffTimes(
      { state: 5, turns: 4, start: 0n, duration: 1n, teams: [] },
      self,
      Date.UTC(2026, 9, 24, 6),
    ),
  ).toEqual({ battleState: 1, endTime: 28800n });
  expect(
    playoffTimes(
      { state: 5, turns: 4, start: 0n, duration: 1n, teams: [] },
      self,
      Date.UTC(2026, 9, 24, 8),
    ),
  ).toEqual({ battleState: 2, endTime: 0n });
});

test("battle publication adapters are bounded and read playoff state and version atomically", async () => {
  expect(
    await loadBattleFightRanking(async (name, key) => {
      expect([name, key]).toEqual(["GET", "dragon_battle_tops_info_1"]);
      return null;
    }, 1),
  ).toBeUndefined();
  const result = await loadPlayoffRanking(async (name, script, count) => {
    expect([name, count]).toEqual(["EVAL", "0"]);
    expect(script).toContain("'dragon_playoff_teaminfo' .. version");
    expect(script).not.toMatch(/SET|DEL|HSET/);
    return ["8", "4", "9007199254740993", "86400000", teams()];
  });
  expect(result.start).toBe(9007199254740993n);
  await expect(loadPlayoffRanking(async () => [])).rejects.toThrow();
  await expect(loadBattleFightRanking(async () => "a".repeat(4194305), 1)).rejects.toThrow();
});

test("publication decoding preserves large integers without relaxing the stored message limit", () => {
  const raw = Buffer.from(`{"data":"${"x".repeat(70000)}","power":9007199254740993}`);
  expect(() => decodeStoredJson(raw)).toThrow();
  expect(decodePublishedJson(raw)).toMatchObject({ power: 9007199254740993n });
  expect(() => decodePublishedJson(Buffer.alloc(4194305))).toThrow();
  expect(() =>
    decodeFightRanking(
      '[{"teamId":"a","enemyId":"b","fightPlayerMap":{"x":{"id":"x","teamId":"c","state":1}}}]',
      "a",
    ),
  ).toThrow();
});
