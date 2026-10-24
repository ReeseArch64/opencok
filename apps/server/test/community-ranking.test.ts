import { expect, test } from "bun:test";
import { donationRankingRows, rankingCalendar } from "@opencok/rules/community-ranking";
import {
  donationRanking,
  resourceDonationRanking,
  cemeteryRanking,
} from "@opencok/mappings/community-ranking";
import { loadDonationRanking } from "@opencok/storage/donation-ranking";
import { sfs, fields, type Value } from "@opencok/messages/sfs";
import type { CommunityRankingSnapshot } from "@opencok/contracts/community-ranking";

const now = Date.UTC(2026, 9, 25, 12);
const row = {
  uid: "self",
  profileUid: "self",
  name: "Self",
  pic: "",
  picVer: 1,
  picfraId: 2,
  rank: 4,
  allianceId: "alliance",
  power: 9007199254740993n,
  point: 10,
  progress: 2,
  donateTime: BigInt(now),
  todaydonate: 7,
  todayprogress: 1,
};
const snapshot = (rows = [row]): CommunityRankingSnapshot => ({
  profile: { uid: "self", allianceId: "alliance" },
  rows,
});

test("donation rankings preserve wrapped composite keys, rank and exact-power tie breaks", () => {
  const rows = [
    row,
    { ...row, uid: "other", power: row.power + 1n },
    { ...row, uid: "leader", rank: 5, progress: 1 },
  ];
  expect(donationRankingRows(rows, "all", now).map((row) => row.uid)).toEqual([
    "other",
    "self",
    "leader",
  ]);
  expect(donationRankingRows(rows, "today", now).map((row) => row.uid)).toEqual([
    "leader",
    "other",
    "self",
  ]);
  const wrapped = donationRankingRows([{ ...row, progress: 2147483647 }], "all", now)[0]!;
  expect(wrapped.key).toBe(-6);
  const result = fields((donationRanking(snapshot(), "all", now).donateRank!.value as Value[])[0]);
  expect(result.power).toEqual(sfs.long(row.power));
  expect(result.key).toEqual(sfs.int(24));
});

test("daily and weekly donations preserve zeroed expired days and missing-history field omission", () => {
  const stale = snapshot([{ ...row, donateTime: BigInt(now - 86400000) }]);
  const daily = fields((donationRanking(stale, "today", now).donateRank!.value as Value[])[0]);
  expect(daily.donation).toEqual(sfs.int(0));
  expect(daily.alliance_honor).toEqual(sfs.int(0));
  const weekly = fields((donationRanking(snapshot(), "week", now).donateRank!.value as Value[])[0]);
  expect(weekly).not.toHaveProperty("donation");
  expect(weekly).not.toHaveProperty("alliance_honor");
  expect(weekly.key).toEqual(sfs.int(4));
  expect(weekly.allianceId).toEqual(sfs.string("alliance"));
});

test("resource ranking keys use Sunday weeks while refresh deadlines use Monday", async () => {
  const calendar = rankingCalendar(now);
  expect(calendar.dayKey).toBe("20261025");
  expect(calendar.weekKey).toBe("20261025");
  expect(calendar.nextMonday).toBe(BigInt(Date.UTC(2026, 9, 26)));
  const result = await loadDonationRanking(
    async (...args) => {
      expect(args).toEqual([
        "ZREVRANGE",
        "bsDonateRankWeek120261025alliance",
        "0",
        "100",
        "WITHSCORES",
      ]);
      return ["self", "7.25", "former", "9"];
    },
    1,
    "alliance",
    "resource-week",
    calendar.weekKey,
  );
  const state = snapshot([row, { ...row, uid: "unranked", profileUid: "unranked" }]);
  const wire = resourceDonationRanking(state, result, true, now);
  expect(wire.weekendTime).toEqual(sfs.long(calendar.nextMonday));
  expect((wire.ranks!.value as Value[]).map((value) => fields(value).score)).toEqual([
    sfs.double(7.25),
    sfs.double(0),
  ]);
});

test("resource readers reject malformed scores and maintain the inclusive 101-row boundary", async () => {
  for (const values of [["self"], ["self", "NaN"], ["self", ""], Array(204).fill("1")])
    await expect(
      loadDonationRanking(async () => values, 1, "a", "resource-history", ""),
    ).rejects.toThrow();
  const values = Array.from({ length: 101 }, (_, i) => [String(i), String(i)]).flat();
  expect(
    await loadDonationRanking(async () => values, 1, "a", "resource-history", ""),
  ).toHaveLength(101);
});

test("cemetery rankings retain candidate self positions, skipped metadata and 49 displayed entries", () => {
  const rows = Array.from({ length: 100 }, (_, i) => ({
    ...row,
    uid: String(i),
    profileUid: i === 0 ? null : String(i),
    allianceId: "",
    useItemSum: 1,
    deadSum: 9007199254740993n,
  }));
  const state = { profile: { uid: "99" }, rows, ownItems: 1 };
  const result = cemeteryRanking(state, "99");
  expect(result.myRanking).toEqual(sfs.int(100));
  expect(result.serverRanking?.value).toHaveLength(49);
  expect(fields((result.serverRanking!.value as Value[])[0]).uid).toEqual(sfs.string("1"));
  expect(fields((result.serverRanking!.value as Value[])[0]).deadSum).toEqual(
    sfs.long(9007199254740993n),
  );
  expect(cemeteryRanking({ ...state, ownItems: 0 }, "99").myRanking).toEqual(sfs.int(0));
});

test("community commands retain authenticated membership, type selectors and correlation", async () => {
  const { Game } = await import("@opencok/controllers/game");
  const { Rules } = await import("@opencok/rules/game");
  const state = snapshot();
  state.profile = { uid: "self", serverId: 1, allianceId: "alliance", banFlag: 0 };
  const calls: string[] = [];
  const store = {
    getProfileById: async () => state.profile,
    crossRankingRealm: async () => false,
    donationRanking: async (uid: string) => {
      expect(uid).toBe("self");
      return state;
    },
    cemeteryRanking: async (uid: string, type: string) => {
      expect([uid, type]).toEqual(["self", "1"]);
      return { ...state, ownItems: 0, rows: [] };
    },
  } as unknown as import("@opencok/contracts/game").GameStore;
  const game = new Game(
    store,
    new Rules(new Map(), new Map(), new Map()),
    { kingdomId: 1 },
    () => now,
    {
      donationScores: async (allianceId, kind) => {
        calls.push(`${allianceId}:${kind}`);
        return [];
      },
    },
  );
  for (const command of [
    "al.donate.rank.all",
    "al.donate.rank.today",
    "al.donate.rank.week",
    "al.donate.res.rank.day",
    "al.donate.res.rank.week",
    "al.donate.res.rank.history",
    "cemetery.get.ranking",
  ]) {
    const response = await game.execute("self", command, {
      uid: sfs.string("foreign"),
      allianceId: sfs.string("foreign"),
      type: sfs.string("1"),
      _cok_: sfs.int(4),
    });
    expect(response.body._cok_).toEqual(sfs.int(4));
    expect(response.pushes).toEqual([]);
  }
  expect(calls).toEqual([
    "alliance:resource-day",
    "alliance:resource-week",
    "alliance:resource-history",
  ]);
  store.crossRankingRealm = async () => true;
  const response = await game.execute("self", "al.donate.res.rank.day", {});
  expect(response.body).not.toHaveProperty("ranks");
  await expect(
    game.execute("self", "cemetery.get.ranking", { type: sfs.string("2") }),
  ).rejects.toThrow();
});
