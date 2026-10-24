import { expect, test } from "bun:test";
import type { AllianceRankingSnapshot } from "@opencok/contracts/alliance-ranking";
import type { Row } from "@opencok/contracts/rows";
import { Rules } from "@opencok/rules/game";
import { allianceRankingQuery, selectAllianceRanking } from "@opencok/rules/alliance-ranking";
import { allianceRanking } from "@opencok/dtos/alliance-ranking";
import { decode, encode, sfs } from "@opencok/messages/sfs";

const now = 1792756800000;
function rules(limit = "2") {
  return new Rules(
    new Map(),
    new Map(),
    new Map(),
    undefined,
    new Map([["ranking", { k1: limit }]]),
    undefined,
    undefined,
    undefined,
    1,
    undefined,
    undefined,
    { allianceSciences: new Map([["1001", { para1: "500", para2: "2.9" }]]) },
  );
}
function row(uid: string, changes: Row = {}): Row {
  return {
    uid,
    leaderUid: `${uid}-leader`,
    leader: "Leader",
    alliancename: uid,
    abbr: "S",
    icon: "",
    curMember: 4,
    maxMember: 10,
    ckfThroneFightFlag: 0,
    nums: "3",
    fightpower: "200",
    armyKill: "100",
    ...changes,
  };
}
function snapshot(candidates: Row[], allianceId = "self"): AllianceRankingSnapshot {
  return {
    profile: { uid: "owner", allianceId },
    candidates,
    sciences: [],
    videos: [],
    fallbackRank: 8n,
  };
}

test("alliance limits use k1 and reject malformed or unrepresentable configuration", () => {
  expect(allianceRankingQuery("power", rules(), now)).toEqual({ kind: "power", limit: 2, now });
  expect(allianceRankingQuery("kills", rules("+32767"), now).limit).toBe(32767);
  for (const limit of ["", " 2", "2 ", "0", "-1", "2.5", "32768", "1e2"])
    expect(() => allianceRankingQuery("power", rules(limit), now)).toThrow("102192");
  expect(() => allianceRankingQuery("power", rules(), NaN)).toThrow();
});

test("kill boards drop the last candidate even on short lists and power preserves every fetched row", () => {
  const catalog = rules();
  for (const size of [0, 1, 2, 3, 4]) {
    const state = snapshot(
      Array.from({ length: size }, (_, i) => row(String(i))),
      String(size - 1),
    );
    const result = selectAllianceRanking(
      allianceRankingQuery("kills", catalog, now),
      state,
      catalog,
    );
    expect(result.rows.map((entry) => entry.alliance.uid)).toEqual(
      state.candidates
        .slice(0, -1)
        .slice(0, 2)
        .map((entry) => entry.uid),
    );
    expect(result.selfRanking).toBe(8);
  }
  const state = snapshot([row("first"), row("second"), row("self")]);
  const result = selectAllianceRanking(allianceRankingQuery("power", catalog, now), state, catalog);
  expect(result.rows.map((entry) => entry.alliance.uid)).toEqual(["first", "second"]);
  expect(result.selfRanking).toBe(3);
});

test("duplicate leader joins retain both entries and the final cached position while absent membership omits self", () => {
  const catalog = rules();
  const query = allianceRankingQuery("power", catalog, now);
  const state = snapshot([row("self"), row("self", { leaderUid: "second-leader" }), row("other")]);
  const result = selectAllianceRanking(query, state, catalog);
  expect(result.selfRanking).toBe(2);
  expect(result.rows).toHaveLength(2);
  state.profile!.allianceId = " ";
  expect(
    allianceRanking("power", selectAllianceRanking(query, state, catalog)).selfRanking,
  ).toBeUndefined();
  state.profile!.allianceId = "absent";
  state.fallbackRank = 2147483648n;
  expect(selectAllianceRanking(query, state, catalog).selfRanking).toBe(-2147483648);
  state.fallbackRank = 4294967296n;
  expect(
    allianceRanking("power", selectAllianceRanking(query, state, catalog)).selfRanking,
  ).toBeUndefined();
});

test("capacity uses owner-scoped science float accumulation and int wrapping without modifying scores", () => {
  const catalog = rules();
  const query = allianceRankingQuery("power", catalog, now);
  const state = snapshot([row("self", { maxMember: 2147483647 }), row("other")]);
  state.sciences = [{ allianceId: "self", scienceId: 1000, level: 1 }];
  const result = selectAllianceRanking(query, state, catalog);
  expect(result.rows.map((entry) => entry.maxMember)).toEqual([-2147483647, 10]);
  expect(result.rows[0]?.alliance.fightpower).toBe("200");
  expect(state.candidates[0]?.maxMember).toBe(2147483647);
  state.candidates = [row("self", { ckfThroneFightFlag: 1 }), row("other"), row("third")];
  expect(
    selectAllianceRanking(query, state, catalog).rows.map((entry) => entry.alliance.uid),
  ).toEqual(["other"]);
  expect(selectAllianceRanking(query, state, catalog).selfRanking).toBe(1);
});

test("alliance wire aggregates retain cached decimal types while counts and video retain their own widths", () => {
  const catalog = rules();
  const query = allianceRankingQuery("power", catalog, now);
  const video = {
    allianceId: "self",
    vedioURL: "https://example.invalid/v",
    thumbnailURL: "thumb",
    vedioH: 20,
    vedioW: 30,
    vedioSize: 40,
    vedioLength: 50,
    checkSign: -1,
  };
  const state = snapshot([
    row("self", {
      icon: "crest",
      nums: "2147483648",
      fightpower: "9007199254740993",
      email: "private",
      wood: 1000n,
    }),
  ]);
  state.videos = [video];
  expect(
    decode(encode(allianceRanking("power", selectAllianceRanking(query, state, catalog)))),
  ).toEqual({
    selfRanking: sfs.int(1),
    allianceRanking: sfs.array([
      sfs.object({
        uid: sfs.string("self"),
        alliancename: sfs.string("self"),
        abbr: sfs.string("S"),
        curMember: sfs.int(4),
        maxMember: sfs.int(10),
        nums: sfs.long(2147483648n),
        leader: sfs.string("Leader"),
        icon: sfs.string("crest"),
        fightpower: sfs.double(9007199254740992),
        allianceVideo: sfs.object({
          allianceid: sfs.string("self"),
          videoURL: sfs.string("https://example.invalid/v"),
          thumbnailURL: sfs.string("thumb"),
          videoH: sfs.int(20),
          videoW: sfs.int(30),
          videoSize: sfs.int(40),
          videoLength: sfs.int(50),
          checksign: sfs.byte(-1),
        }),
      }),
    ]),
  });
  for (const [raw, expected] of [
    ["9999999", sfs.int(9999999)],
    ["10000000", sfs.double(10000000)],
    ["-9999999", sfs.int(-9999999)],
    ["-10000000", sfs.double(-10000000)],
    ["9223372036854775808", sfs.double(9223372036854775808)],
  ] as const) {
    const value = allianceRanking("kills", {
      rows: [{ alliance: row("self", { armyKill: raw }), maxMember: 10, video: undefined }],
      selfRanking: 0,
    });
    expect(value.allianceRanking).toEqual(
      sfs.array([
        sfs.object({
          uid: sfs.string("self"),
          alliancename: sfs.string("self"),
          abbr: sfs.string("S"),
          curMember: sfs.int(4),
          maxMember: sfs.int(10),
          nums: sfs.int(3),
          leader: sfs.string("Leader"),
          armyKill: expected,
        }),
      ]),
    );
  }
  expect(
    allianceRanking("power", {
      rows: [
        {
          alliance: row("self", { fightpower: null, leader: null }),
          maxMember: 0,
          video: undefined,
        },
      ],
      selfRanking: 0,
    }).allianceRanking,
  ).toEqual(
    sfs.array([
      sfs.object({
        uid: sfs.string("self"),
        alliancename: sfs.string("self"),
        abbr: sfs.string("S"),
        curMember: sfs.int(4),
        maxMember: sfs.int(0),
        nums: sfs.int(3),
      }),
    ]),
  );
});

test("invalid or mixed-alliance inputs reject instead of leaking records or emitting rounded counts", () => {
  const catalog = rules();
  const query = allianceRankingQuery("power", catalog, now);
  for (const state of [
    snapshot([row("self"), row("self")]),
    snapshot([row("self", { leaderUid: "" })]),
    snapshot(Array.from({ length: 4 }, (_, i) => row(String(i)))),
    { ...snapshot([row("self")]), sciences: [{ allianceId: "other", scienceId: 1000, level: 1 }] },
    { ...snapshot([row("self")]), sciences: [{ allianceId: "self", scienceId: 2000, level: 1 }] },
    { ...snapshot([row("self")]), videos: [{ allianceId: "other" }] },
    { ...snapshot([]), fallbackRank: 0n },
  ])
    expect(() => selectAllianceRanking(query, state, catalog)).toThrow();
  const invalidRows: Row[] = [
    { nums: "9223372036854775808" },
    { fightpower: 9007199254740992 },
    { fightpower: "1.5" },
    { fightpower: "9".repeat(310) },
    { curMember: 2147483648 },
  ];
  for (const changes of invalidRows)
    expect(() =>
      allianceRanking("power", {
        rows: [{ alliance: row("self", changes), maxMember: 10, video: undefined }],
        selfRanking: 1,
      }),
    ).toThrow();
});

test("missing alliance labels consume their slots and model strings retain Java trim boundaries", () => {
  const catalog = rules();
  const query = allianceRankingQuery("power", catalog, now);
  const state = snapshot([
    row("self", { alliancename: null }),
    row("other", { abbr: null }),
    row("third"),
  ]);
  expect(selectAllianceRanking(query, state, catalog)).toEqual({ rows: [], selfRanking: 1 });
  const result = allianceRanking("power", {
    rows: [
      {
        alliance: row("self", {
          alliancename: " \t Name\r\n",
          abbr: "\u00a0S\u00a0",
          icon: " \tcrest ",
        }),
        maxMember: 10,
        video: undefined,
      },
    ],
    selfRanking: 1,
  });
  expect(result.allianceRanking).toEqual(
    sfs.array([
      sfs.object({
        uid: sfs.string("self"),
        alliancename: sfs.string("Name"),
        abbr: sfs.string("\u00a0S\u00a0"),
        icon: sfs.string("crest"),
        curMember: sfs.int(4),
        maxMember: sfs.int(10),
        nums: sfs.int(3),
        leader: sfs.string("Leader"),
        fightpower: sfs.int(200),
      }),
    ]),
  );
});
