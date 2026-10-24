import type {
  MailContentsQuery,
  MailContentsSnapshot,
  MailContentsInspector,
  MailConversationSaveQuery,
  MailConversationSaveSnapshot,
  MailDeleteQuery,
  MailDeletePlanner,
  MailDeleteSnapshot,
  MailReadQuery,
  MailReadSnapshot,
  MailSaveQuery,
  MailSaveSnapshot,
  MailStatusQuery,
  MailStatusSnapshot,
} from "./mail.ts";
import type { ExpeditionRankingEntry } from "./expedition-ranking.ts";
import type { AllianceRankingQuery, AllianceRankingSnapshot } from "./alliance-ranking.ts";
import type { Row } from "./rows.ts";
import type { PowerState } from "./power.ts";
import type { RoutedPublicProfile } from "./profile.ts";
import type { PlayerRankingQuery, PlayerRankingSnapshot } from "./ranking.ts";

export interface AuthenticationStore {
  getProfileById(uid: string): Promise<Row | undefined>;
  getAccountsByPlayerId(uid: string): Promise<Row[]>;
}
export interface CityState {
  profile: Row | undefined;
  resource: Row | undefined;
  buildings: Row[];
  queues: Row[];
  world: Row | undefined;
  hasMarches: boolean;
  armies: Row[];
  items: Row[];
  lord: Row | undefined;
}
export interface GameStore extends AuthenticationStore {
  mailContents(
    uid: string,
    query: MailContentsQuery,
    inspect: MailContentsInspector,
  ): Promise<MailContentsSnapshot>;
  mailConversationSave(
    uid: string,
    query: MailConversationSaveQuery,
  ): Promise<MailConversationSaveSnapshot>;
  mailDelete(
    uid: string,
    query: MailDeleteQuery,
    plan: MailDeletePlanner,
  ): Promise<MailDeleteSnapshot>;
  mailRead(uid: string, query: MailReadQuery): Promise<MailReadSnapshot>;
  mailSave(uid: string, query: MailSaveQuery): Promise<MailSaveSnapshot>;
  mailStatus(uid: string, query: MailStatusQuery): Promise<MailStatusSnapshot>;
  allianceRanking(uid: string, query: AllianceRankingQuery): Promise<AllianceRankingSnapshot>;
  playerRanking(uid: string, query: PlayerRankingQuery): Promise<PlayerRankingSnapshot>;
  publicProfile(uid: string, observerAllianceId: string): Promise<RoutedPublicProfile | undefined>;
  getPowerByPlayerId(uid: string, now: number): Promise<PowerState>;
  getPlayerSummariesByIds(uids: string[], allServers: boolean): Promise<PlayerSummary[]>;
  getConfigurationByPlayerId(uid: string): Promise<LoginConfigurationState>;
  getCityByPlayerId(uid: string, now: number): Promise<CityState>;
  getWorldByPointIds(
    uid: string,
    ids: number[],
  ): Promise<{ world: Row | undefined; points: Row[]; hasMarches: boolean }>;
}

export interface PlayerSummary {
  data: Row;
  kingdomId: number;
  remote: boolean;
}

export interface LoginConfigurationState {
  profile: Row | undefined;
  switches: Row[];
  pushSettings: Row[];
}

export interface GameServices {
  expeditionRanking?(limit: number): Promise<readonly ExpeditionRankingEntry[] | undefined>;
  worldPowerEffects?(): Promise<ReadonlyMap<string, string>>;
  emperorVersion?(): Promise<number | null | undefined>;
  playerUpdateTimes?(kingdomId: number, uids: string[]): Promise<ReadonlyMap<string, string>>;
  changeAccountCount?(deviceId: string): Promise<bigint | null>;
  featureAvailability?(profile: Row, now: number): Readonly<Record<string, boolean>>;
}
