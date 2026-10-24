import { expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Effect, Layer } from "effect";
import type { GameStore } from "@opencok/contracts/game";
import { GameService as Game } from "@opencok/services/game";
import { EnvironmentSource } from "@opencok/env/effect";
import { decode, encode, fields, sfs, Type } from "@opencok/messages/sfs";
import { loadRules } from "@opencok/resources/rules";
import { config } from "../src/config.ts";
import { dataConfigItems } from "./fixtures/data-config.ts";
import wireContract from "./fixtures/configuration-wire-contract.json";

test("complete configuration wire contract survives XML loading, realm composition and reconstruction", async () => {
  const directory = await mkdtemp(join(tmpdir(), "opencok-config-contract-"));
  const now = Date.UTC(2026, 9, 24, 12);
  try {
    await writeFile(
      join(directory, "building.xml"),
      '<database><ItemSpec id="400030" level="30"/></database>',
    );
    await writeFile(join(directory, "position.xml"), '<database><ItemSpec id="1"/></database>');
    await writeFile(
      join(directory, "role.xml"),
      '<database><ItemSpec id="100105" stamina="150"/></database>',
    );
    const items = dataConfigItems({
      FB_follow: { k1: "follow" },
      lordtips_time: { k1: "tip" },
      loading_show_type: { k1: "2" },
      ranking: { k3: "rank" },
      alliance_quest: { k10: "6", k12: "quest" },
      scoutmark_on: { k1: "all", k2: "scout" },
      serviceterms_on: { k1: "1", k2: "terms", k3: "all" },
      wa_score: { k10: "9007199254740993" },
      monster: { k3: "100" },
    });
    await writeFile(
      join(directory, "item.xml"),
      `<database><Group id="data_config">${[...items.values()]
        .map(
          (rule) =>
            `<ItemSpec ${Object.entries(rule)
              .map(([key, value]) => `${key}="${value}"`)
              .join(" ")}/>`,
        )
        .join("")}</Group></database>`,
    );
    await writeFile(
      join(directory, "function_on.xml"),
      '<database><Group id="function_on"><ItemSpec id="stamina_limit" pf="all" online="1" version="12.6.0" start="2026-10-24-12-00" end="2026-10-24-12-00"/></Group></database>',
    );
    const unexpected = async (): Promise<never> => {
      throw new Error("Unexpected configuration dependency");
    };
    const store: GameStore = {
      getProfileById: async (uid: string) => ({ uid, level: 5 }),
      getAccountsByPlayerId: unexpected,
      getCityByPlayerId: unexpected,
      getWorldByPointIds: unexpected,
      getPlayerSummariesByIds: unexpected,
      getConfigurationByPlayerId: unexpected,
      getPowerByPlayerId: unexpected,
      mailGroups: unexpected,
      mailBatch: unexpected,
      mailCategory: unexpected,
      mailContents: unexpected,
      mailConversationSave: unexpected,
      mailDelete: unexpected,
      mailRead: unexpected,
      mailSave: unexpected,
      mailStatus: unexpected,
      allianceRanking: unexpected,
      playerRanking: unexpected,
      publicProfile: unexpected,
    };
    const expected = Object.fromEntries(
      Object.entries(wireContract).map(([key, type]) => [key, Type[type as keyof typeof Type]]),
    );
    expect(Object.keys(expected)).toHaveLength(229);
    for (const kingdomId of [1, 2]) {
      const source = Layer.succeed(EnvironmentSource, {
        DATABASE_URL: "postgresql://unused.invalid/global",
        GAME_LOGIN_SECRET: "synthetic",
        KINGDOM_ID: String(kingdomId),
        GAME_CHAT_INTERVAL: String(kingdomId + 4),
        GAME_FEED_MAX_COUNT: String(kingdomId + 8),
      });
      let previous: Buffer | undefined;
      for (let reload = 0; reload < 2; reload++) {
        const settings = await Effect.runPromise(config.pipe(Effect.provide(source)));
        const rules = await loadRules(directory, settings.kingdomId);
        const game = new Game(store, rules, settings, () => now);
        const response = await game.execute("synthetic", "login.dataconfig", {
          uid: sfs.string("untrusted"),
          kingdomId: sfs.int(99),
          _cok_: sfs.string("contract"),
          cmdBaseTime: sfs.string("42"),
        });
        const encoded = encode(response.body);
        const decoded = decode(encoded);
        const output = fields(decoded.dataConfig);
        expect(
          Object.fromEntries(Object.entries(output).map(([key, value]) => [key, value.type])),
        ).toEqual(expected);
        expect(output.monster_count).toEqual(sfs.int(kingdomId === 1 ? 150 : 100));
        expect(output.dbf_maxScoreView).toEqual(sfs.long(9007199254740993n));
        expect(fields(output.serverConfig)).toEqual({
          chat_interval: sfs.int(kingdomId + 4),
          feed_maxCount: sfs.int(kingdomId + 8),
        });
        expect(decoded._cok_).toEqual(sfs.string("contract"));
        expect(decoded.cmdBaseTime).toEqual(sfs.string("42"));
        expect(response.pushes).toEqual([]);
        if (previous) expect(encoded).toEqual(previous);
        previous = encoded;
        const expired = await new Game(store, rules, settings, () => now + 1).execute(
          "synthetic",
          "login.dataconfig",
          {},
        );
        expect(fields(expired.body.dataConfig).monster_count).toEqual(sfs.int(100));
        const optional = [
          "followFB",
          "lordtips_time",
          "loading_show_type",
          "ranking",
          "alliance_quest_init_level",
          "scoutmark_on",
          "serviceTerms_on",
        ];
        for (const id of ["FB_follow", "lordtips_time", "loading_show_type", "scoutmark_on"])
          rules.configuration.dataConfig!.delete(id);
        delete rules.configuration.dataConfig!.get("ranking")!.k3;
        delete rules.configuration.dataConfig!.get("alliance_quest")!.k10;
        rules.configuration.dataConfig!.get("serviceterms_on")!.k1 = "0";
        const baseline = fields(
          decode(encode((await game.execute("synthetic", "login.dataconfig", {})).body)).dataConfig,
        );
        expect(Object.keys(baseline)).toHaveLength(222);
        expect(
          Object.fromEntries(Object.entries(baseline).map(([key, value]) => [key, value.type])),
        ).toEqual(
          Object.fromEntries(Object.entries(expected).filter(([key]) => !optional.includes(key))),
        );
      }
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
