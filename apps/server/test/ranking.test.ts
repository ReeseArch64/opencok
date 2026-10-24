import { expect, test } from "bun:test";
import { playerRankingQuery, selectPlayerRanking } from "@opencok/rules/ranking";
import { playerRanking } from "@opencok/mappings/ranking";
import { Rules } from "@opencok/rules/game";
import type { PlayerRankingSnapshot, PlayerRankingKind } from "@opencok/contracts/ranking";
import type { Row } from "@opencok/contracts/rows";
import { decode, encode, sfs } from "@opencok/messages/sfs";

const now = 1792756800000;
function rules(limit = "2") {
  return new Rules(
    new Map(),
    new Map(),
    new Map(),
    undefined,
    new Map([["ranking", { k2: limit }]]),
    undefined,
    undefined,
    undefined,
    1,
    undefined,
    { serverConfig: new Map([["power_limit", { rankingHideGm: "1" }]]) },
  );
}
function row(uid: string, changes: Row = {}): Row {
  return {
    uid,
    profileUid: uid,
    name: `Player ${uid}`,
    pic: "",
    picVer: 0,
    picfraId: 0,
    allianceId: "",
    banTime: 0n,
    power: 0n,
    armyKill: 0n,
    level: 1,
    exp: 0,
    ...changes,
  };
}
function snapshot(candidates: Row[], fallbackRank = 8n): PlayerRankingSnapshot {
  return { profile: { uid: "self", level: 1 }, candidates, fallbackRank };
}

test("ranking options preserve the configured top limit and exact GM hiding switch", () => {
  const catalog = rules();
  expect(playerRankingQuery("power", catalog, now)).toEqual({
    kind: "power",
    limit: 2,
    hideGm: true,
    now,
  });
  catalog.configuration.serverConfig!.get("power_limit")!.rankingHideGm = "01";
  expect(playerRankingQuery("power", catalog, now).hideGm).toBe(false);
  for (const limit of ["0", "-1", "1.5", "32768", " 2", "1e2", ""])
    expect(() => playerRankingQuery("power", rules(limit), now)).toThrow("102192");
  expect(() => playerRankingQuery("power", catalog, NaN)).toThrow();
});

test("bans are removed after candidate selection and own ordinal includes prefetched rows beyond the displayed list", () => {
  const query = playerRankingQuery("power", rules(), now);
  const state = snapshot([
    row("banned", { banTime: BigInt(now + 1) }),
    row("first", { banTime: BigInt(now) }),
    row("second"),
    row("self"),
  ]);
  expect(selectPlayerRanking("self", query, state)).toEqual({
    rows: state.candidates.slice(1, 3),
    selfRanking: 3,
  });
  expect(selectPlayerRanking("other", query, state).selfRanking).toBe(8);
  expect(selectPlayerRanking("self", query, snapshot([], 2147483648n)).selfRanking).toBe(
    -2147483648,
  );
  expect(selectPlayerRanking("self", query, snapshot([])).rows).toEqual([]);
});

test("missing presentation dependencies are skipped after taking the top list without renumbering self position", () => {
  const query = playerRankingQuery("kills", rules(), now);
  const state = snapshot([
    row("orphan", { profileUid: null }),
    row("self", { allianceId: "lost", allianceUid: null }),
    row("third"),
  ]);
  expect(selectPlayerRanking("self", query, state)).toEqual({ rows: [], selfRanking: 2 });
  state.candidates = [row("self", { allianceId: " ", allianceUid: null }), row("second")];
  expect(selectPlayerRanking("self", query, state).rows).toHaveLength(2);
});

test("ranking response preserves cached JSON numeric widths and explicit public field allowlists", () => {
  const entry = row("self", {
    name: "Ranked",
    pic: "portrait",
    picVer: 2,
    picfraId: 3,
    power: 9007199254740993n,
    armyKill: 2147483647n,
    level: 6,
    exp: 80,
    banTime: BigInt(now - 1),
    allianceId: "a",
    allianceUid: "a",
    abbr: "S",
    alliancename: "Synthetic",
    email: "private",
    gold: 999n,
    gmFlag: 1,
  });
  const publicFields = {
    uid: sfs.string("self"),
    name: sfs.string("Ranked"),
    pic: sfs.string("portrait"),
    picVer: sfs.int(2),
    picfraId: sfs.int(3),
    allianceId: sfs.string("a"),
    abbr: sfs.string("S"),
    alliancename: sfs.string("Synthetic"),
  };
  for (const [kind, metric] of [
    ["power", { power: sfs.long(9007199254740993n) }],
    ["kills", { armyKill: sfs.int(2147483647) }],
    ["level", { level: sfs.int(6), exp: sfs.int(80), banTime: sfs.long(now - 1) }],
  ] as const) {
    const result = decode(encode(playerRanking(kind, { rows: [entry], selfRanking: 2 })));
    expect(result).toEqual({
      selfRanking: sfs.int(2),
      serverRanking: sfs.array([sfs.object({ ...publicFields, ...metric })]),
    });
  }
  for (const value of [
    -2147483649n,
    -2147483648n,
    2147483647n,
    2147483648n,
    9223372036854775807n,
  ]) {
    const result = playerRanking("power", {
      rows: [row("self", { power: value })],
      selfRanking: 1,
    });
    const expected =
      value < -2147483648n || value > 2147483647n ? sfs.long(value) : sfs.int(Number(value));
    expect(result.serverRanking).toEqual(
      sfs.array([
        sfs.object({
          uid: sfs.string("self"),
          name: sfs.string("Player self"),
          pic: sfs.string(""),
          picVer: sfs.int(0),
          picfraId: sfs.int(0),
          power: expected,
        }),
      ]),
    );
  }
  expect(
    playerRanking("power", { rows: [row("self", { power: null })], selfRanking: 1 }).serverRanking,
  ).toEqual(
    sfs.array([
      sfs.object({
        uid: sfs.string("self"),
        name: sfs.string("Player self"),
        pic: sfs.string(""),
        picVer: sfs.int(0),
        picfraId: sfs.int(0),
      }),
    ]),
  );
});

test("unrepresentable ranking snapshots fail instead of returning truncated or rounded positions", () => {
  for (const kind of ["power", "kills", "level"] as PlayerRankingKind[]) {
    const query = playerRankingQuery(kind, rules(), now);
    for (const state of [
      snapshot([row("same"), row("same")]),
      snapshot([row("")]),
      snapshot([], 0n),
      snapshot([], 9223372036854775808n),
      snapshot([row("self", { banTime: 9007199254740992 })]),
      snapshot(Array.from({ length: 7 }, (_, i) => row(String(i)))),
    ])
      expect(() => selectPlayerRanking("self", query, state)).toThrow("102192");
  }
  for (const power of [9007199254740992, "9223372036854775808", "1.5"])
    expect(() =>
      playerRanking("power", { rows: [row("self", { power })], selfRanking: 1 }),
    ).toThrow("102192");
});
