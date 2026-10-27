import { loadWorldFightBulletins } from "./world-bulletins";
import { publishExpeditionDiscovery } from "./expedition-discovery";
import type { ExpeditionDiscoveryPublication } from "@opencok/contracts/expedition-score-publication";
import { loadGeneralDrawRanking } from "@opencok/hero/storage/general-draws";
import { selectSystemMailPage } from "./mail-system.ts";
import { loadBattleFightRanking, loadPlayoffRanking } from "./battle-ranking.ts";
import { loadMilitaryRanking } from "./military-ranking.ts";
import { loadFlowerRanking } from "./flower-ranking.ts";
import { loadDonationRanking } from "./donation-ranking.ts";
import { loadThroneRankingPeriod } from "./throne-ranking.ts";
import {
  publishHeroRanking,
  loadHeroRankingPosition,
  loadHeroHistoryPublication,
} from "@opencok/hero/storage/hero-ranking";
import type { HeroRankingLookup } from "@opencok/hero/contracts/hero-ranking";
import { loadAttributeRanking, loadPublishedGlobalRanking } from "./published-ranking.ts";
import { loadDragonRanking } from "./dragon-ranking.ts";
import type { DragonRankingRange } from "@opencok/contracts/dragon-ranking";
import { publishPlayerUpdate } from "./player-update.ts";
import { publishSharedUser, loadSharedUser } from "./shared-user.ts";
import type { SharedUserLayout, SharedUserUpdate } from "@opencok/contracts/shared-user";
import { loadExpeditionRanking } from "./expedition-ranking.ts";
import { loadScoreActivityRanking } from "./score-activity-ranking.ts";
import { loadGlobalCelebrityRanking } from "./global-celebrity-ranking.ts";
import { loadExpeditionStage } from "./expedition-stage.ts";
import { SESSION_TTL_SECONDS } from "@opencok/constants/connection";
import { RedisClient } from "bun";
import { DependencyError } from "@opencok/errors/dependency";
import { bounded } from "./timeout.ts";

export interface SessionConfig {
  redisUrl: string;
  timeoutMs: number;
  kingdomId: number;
}

export class Cache {
  private sessionOwner?: bigint;

  bindRealmOwner(epoch: bigint) {
    if (
      this.sessionOwner !== undefined ||
      typeof epoch !== "bigint" ||
      epoch <= 0n ||
      epoch > 9223372036854775807n
    )
      throw new DependencyError("redis session owner");

    this.sessionOwner = epoch;
  }

  private sessionKey(uid: string) {
    return this.sessionOwner === undefined
      ? `opencok:kingdom:${this.config.kingdomId}:session:${uid}`
      : `opencok:kingdom:${this.config.kingdomId}:owner:${this.sessionOwner}:session:${uid}`;
  }

  constructor(readonly config: SessionConfig) {}

  async command(command: string, ...args: string[]): Promise<unknown> {
    const client = new RedisClient(this.config.redisUrl, {
      connectionTimeout: this.config.timeoutMs,
      idleTimeout: this.config.timeoutMs,
      autoReconnect: false,
      enableOfflineQueue: false,
    });

    try {
      return await bounded(
        (async () => {
          await client.connect();
          const result = await client.send(command, args);

          if (
            command.toUpperCase() === "HGETALL" &&
            result !== null &&
            typeof result === "object" &&
            !Array.isArray(result)
          )
            return Object.entries(result).flat();

          return result;
        })(),
        this.config.timeoutMs,
        "redis",
      );
    } catch {
      throw new DependencyError("redis");
    } finally {
      client.close();
    }
  }

  publishExpeditionDiscovery(value: ExpeditionDiscoveryPublication) {
    return publishExpeditionDiscovery((command, ...args) => this.command(command, ...args), value);
  }

  expeditionRanking(limit: number) {
    return loadExpeditionRanking(
      (command, ...args) => this.command(command, ...args),
      this.config.kingdomId,
      limit,
    );
  }

  scoreActivityRanking(): Promise<readonly string[]> {
    return loadScoreActivityRanking(
      (command, ...args) => this.command(command, ...args),
      this.config.kingdomId,
    );
  }

  battleFightPublication() {
    return loadBattleFightRanking(
      (name, ...args) => this.command(name, ...args),
      this.config.kingdomId,
    );
  }

  playoffPublication() {
    return loadPlayoffRanking((name, ...args) => this.command(name, ...args));
  }

  heroHistoryPublication(keys: readonly string[], alliance: boolean) {
    return loadHeroHistoryPublication(
      (name, ...args) => this.command(name, ...args),
      keys,
      alliance,
    );
  }

  publishHeroRanking(
    rows: readonly import("@opencok/hero/contracts/hero-rank-publication").HeroRankVersionedScore[],
  ) {
    return publishHeroRanking(
      (name, ...args) => this.command(name, ...args),
      this.config.kingdomId,
      rows,
    );
  }

  heroRankingPosition(query: HeroRankingLookup) {
    return loadHeroRankingPosition((name, ...args) => this.command(name, ...args), query);
  }

  throneRankingPeriod(realm: number) {
    return loadThroneRankingPeriod((name, ...args) => this.command(name, ...args), realm);
  }

  donationScores(
    allianceId: string,
    kind: "resource-day" | "resource-week" | "resource-history",
    date: string,
  ) {
    return loadDonationRanking(
      (name, ...args) => this.command(name, ...args),
      this.config.kingdomId,
      allianceId,
      kind,
      date,
    );
  }

  flowerRankingPublication(realm: number, uid: string, limit: number, global: boolean) {
    return loadFlowerRanking(
      (name, ...args) => this.command(name, ...args),
      realm,
      uid,
      limit,
      global,
    );
  }

  militaryRanking(type: number, group: number) {
    return loadMilitaryRanking((name, ...args) => this.command(name, ...args), type, group);
  }

  attributeRanking(type: number) {
    return loadAttributeRanking(
      (name, ...args) => this.command(name, ...args),
      this.config.kingdomId,
      type,
    );
  }

  generalDrawRanking() {
    return loadGeneralDrawRanking((name, ...args) => this.command(name, ...args));
  }

  publishedGlobalRanking(kind: "payment" | "consumption") {
    return loadPublishedGlobalRanking((name, ...args) => this.command(name, ...args), kind);
  }

  globalCelebrityRanking(rankType: number): Promise<readonly string[]> {
    return loadGlobalCelebrityRanking(
      (command, ...args) => this.command(command, ...args),
      this.config.kingdomId,
      rankType,
    );
  }

  dragonRanking(ranges: readonly DragonRankingRange[], allianceId: string) {
    return loadDragonRanking(
      (command, ...args) => this.command(command, ...args),
      ranges,
      allianceId,
    );
  }

  expeditionStage(kingdomId = this.config.kingdomId): Promise<number | undefined> {
    return loadExpeditionStage((command, ...args) => this.command(command, ...args), kingdomId);
  }

  async claim(uid: string, token: string): Promise<boolean> {
    return (
      (await this.command(
        "SET",
        this.sessionKey(uid),
        token,
        "NX",
        "EX",
        String(SESSION_TTL_SECONDS),
      )) === "OK"
    );
  }

  async deviceChangeCount(deviceId: string): Promise<string | null> {
    if (deviceId.length > 255) throw new DependencyError("redis");

    const value = await this.command("GET", `opencok:global:device-account-change:${deviceId}`);

    if (value === null) return null;

    if (typeof value !== "string" || value.length > 65535) throw new DependencyError("redis");

    return value;
  }

  async nicknameForbiddenWords(key: string): Promise<readonly string[]> {
    if (
      !["regular", "strict", "pattern", "weight", "name"].some(
        (kind) => key === `forbidden_words_${kind}`,
      )
    )
      throw new DependencyError("nickname forbidden list");

    let entries: unknown;

    try {
      entries = await this.command("LRANGE", key, "0", "-1");
    } catch {
      return [];
    }

    if (!Array.isArray(entries) || entries.length > 65536)
      throw new DependencyError("nickname forbidden list");

    let bytes = 0;

    for (const entry of entries) {
      if (typeof entry !== "string" || Buffer.byteLength(entry) > 65535)
        throw new DependencyError("nickname forbidden list");

      bytes += Buffer.byteLength(entry);

      if (bytes > 16 * 1024 * 1024) throw new DependencyError("nickname forbidden list");
    }

    return [...entries];
  }

  publishPlayerUpdateTime(uid: string, updatedAt: string): Promise<void> {
    return publishPlayerUpdate(
      (command, ...args) => this.command(command, ...args),
      this.config.kingdomId,
      uid,
      updatedAt,
    );
  }

  systemMailPage(
    uid: string,
    ids: readonly string[],
    count: number,
    time: bigint,
    inspect: (indices: readonly number[], more: boolean) => void,
  ): Promise<void> {
    return selectSystemMailPage(
      (command, ...args) => this.command(command, ...args),
      this.config.kingdomId,
      uid,
      ids,
      count,
      time,
      inspect,
    );
  }

  async lastSystemMail(uid: string): Promise<string | null> {
    if (!uid || uid.length > 40 || uid.includes("\0") || !uid.isWellFormed())
      throw new DependencyError("mail cursor");

    const value = await this.command(
      "HGET",
      `opencok:kingdom:${this.config.kingdomId}:chat-user-info:${uid}`,
      "chat_last_mail_id",
    );

    if (value === null) return null;

    if (
      typeof value !== "string" ||
      value.length > 40 ||
      value.includes("\0") ||
      !value.isWellFormed()
    )
      throw new DependencyError("mail cursor");

    return value;
  }

  async publishSharedUserInfo(
    update: SharedUserUpdate,
    layout: SharedUserLayout = "hash",
  ): Promise<void> {
    if (update.kingdomId !== this.config.kingdomId) throw new DependencyError("shared user cache");

    return publishSharedUser((command, ...args) => this.command(command, ...args), update, layout);
  }

  sharedUserInfo(owner: string, layout: SharedUserLayout = "hash"): Promise<string | null> {
    return loadSharedUser((command, ...args) => this.command(command, ...args), owner, layout);
  }

  async playerUpdateTimes(kingdomId: number, uids: string[]): Promise<ReadonlyMap<string, string>> {
    if (
      !Number.isSafeInteger(kingdomId) ||
      kingdomId < 1 ||
      uids.length > 50 ||
      uids.some((uid) => !uid || uid.length > 255)
    )
      throw new DependencyError("redis");

    if (!uids.length) return new Map();

    const values = await this.command(
      "MGET",
      ...uids.map((uid) => `opencok:kingdom:${kingdomId}:player-update:${uid}`),
    );

    if (!Array.isArray(values) || values.length !== uids.length) throw new DependencyError("redis");

    const updates = new Map<string, string>();

    for (const [index, value] of values.entries()) {
      if (value === null || (typeof value === "string" && !value.trim())) continue;

      if (
        typeof value !== "string" ||
        !/^\d{1,19}$/.test(value) ||
        BigInt(value) > 9223372036854775807n
      )
        throw new DependencyError("redis");

      updates.set(uids[index]!, value);
    }

    return updates;
  }

  async emperorVersion(kingdomId = this.config.kingdomId): Promise<number | null | undefined> {
    if (!Number.isSafeInteger(kingdomId) || kingdomId < 1) throw new DependencyError("redis");

    const value = await this.command("GET", `opencok:kingdom:${kingdomId}:emperor-version`);

    if (value === null) return undefined;

    if (value === "none") return null;

    if (typeof value !== "string" || !/^(?:0|-?[1-9]\d{0,9})$/.test(value))
      throw new DependencyError("redis");

    const version = Number(value);

    if (version < -2147483648 || version > 2147483647) throw new DependencyError("redis");

    return version;
  }

  async worldTurretKills(
    kingdomId: number,
    territory: string,
  ): Promise<ReadonlyMap<string, string>> {
    if (
      !Number.isSafeInteger(kingdomId) ||
      kingdomId < 1 ||
      !/^[a-zA-Z0-9_-]{1,40}$/.test(territory)
    )
      throw new DependencyError("redis");

    const values = await this.command(
      "HGETALL",
      `opencok:kingdom:${kingdomId}:turret:${territory}`,
    );

    if (!Array.isArray(values) || values.length > 2000 || values.length % 2 !== 0)
      throw new DependencyError("redis");

    const result = new Map<string, string>();
    let bytes = 0;

    for (let i = 0; i < values.length; i += 2) {
      const uid = values[i];
      const content = values[i + 1];

      if (
        typeof uid !== "string" ||
        !/^[a-zA-Z0-9_-]{1,40}$/.test(uid) ||
        typeof content !== "string" ||
        result.has(uid)
      )
        throw new DependencyError("redis");

      bytes += Buffer.byteLength(content);

      if (bytes > 4 * 1024 * 1024) throw new DependencyError("redis");

      result.set(uid, content);
    }

    return result;
  }

  async worldFightBulletins(
    alliance: string,
    start: number,
    end: number,
  ): Promise<readonly string[]> {
    return loadWorldFightBulletins(
      (...args) => this.command(...args),
      this.config.kingdomId,
      alliance,
      start,
      end,
    );
  }

  async worldEffects(kingdomId = this.config.kingdomId): Promise<ReadonlyMap<string, string>> {
    if (!Number.isSafeInteger(kingdomId) || kingdomId < 1) throw new DependencyError("redis");

    const values = await this.command("HGETALL", `opencok:kingdom:${kingdomId}:world-effects`);

    if (!Array.isArray(values) || values.length > 8192 || values.length % 2 !== 0)
      throw new DependencyError("redis");

    const effects = new Map<string, string>();
    let bytes = 0;

    for (let index = 0; index < values.length; index += 2) {
      const key = values[index];
      const value = values[index + 1];

      if (
        typeof key !== "string" ||
        !/^(?:0|[1-9]\d{0,9})$/.test(key) ||
        Number(key) > 2147483647 ||
        typeof value !== "string" ||
        effects.has(key)
      )
        throw new DependencyError("redis");

      const size = Buffer.byteLength(value);
      bytes += size;

      if (size > 65535 || bytes > 1048576) throw new DependencyError("redis");

      effects.set(key, value);
    }

    return effects;
  }

  async refresh(uid: string, token: string): Promise<boolean> {
    return (
      Number(
        await this.command(
          "EVAL",
          "if redis.call('GET',KEYS[1]) == ARGV[1] then return redis.call('EXPIRE',KEYS[1],ARGV[2]) else return 0 end",
          "1",
          this.sessionKey(uid),
          token,
          String(SESSION_TTL_SECONDS),
        ),
      ) === 1
    );
  }

  async release(uid: string, token: string) {
    await this.command(
      "EVAL",
      "if redis.call('GET',KEYS[1]) == ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end",
      "1",
      this.sessionKey(uid),
      token,
    );
  }
}
