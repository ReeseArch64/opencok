import type { WorldPointDetailStore } from "./world-point-detail.ts";
import type { WorldFavoriteStore } from "./world-favorites.ts";
import type { WorldSearchStore } from "./world-search.ts";
import type { PlayerSearchStore } from "./player-search.ts";
import type { AvatarFinishService } from "./files.ts";
import type { AvatarGrantService } from "./files.ts";
import type { ChatSessionIssuer } from "./chat.ts";
import type {
  MailGroupQuery,
  MailGroupInspector,
  MailBatchQuery,
  MailCategoryQuery,
  MailCategoryInspector,
  MailCategorySnapshot,
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
  profile(uid: string): Promise<Row | undefined>;
  accounts(uid: string): Promise<Row[]>;
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
  mailGroups(
    uid: string,
    query: MailGroupQuery,
    inspect: MailGroupInspector,
  ): Promise<MailCategorySnapshot>;
  mailBatch(
    uid: string,
    query: MailBatchQuery,
    inspect: MailCategoryInspector,
  ): Promise<MailCategorySnapshot>;
  mailCategory(
    uid: string,
    query: MailCategoryQuery,
    inspect: MailCategoryInspector,
  ): Promise<MailCategorySnapshot>;
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
  power(uid: string, now: number): Promise<PowerState>;
  playerSummaries(uids: string[], allServers: boolean): Promise<PlayerSummary[]>;
  configuration(uid: string): Promise<LoginConfigurationState>;
  city(uid: string, now: number): Promise<CityState>;
  world(
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
  worldPointDetail?: WorldPointDetailStore;
  playerSearch?: PlayerSearchStore;
  worldSearch?: WorldSearchStore;
  worldFavorites?: WorldFavoriteStore;
  avatar?: AvatarGrantService;
  avatarFinish?: AvatarFinishService;
  chatSession?: ChatSessionIssuer;
  expeditionRanking?(limit: number): Promise<readonly ExpeditionRankingEntry[] | undefined>;
  expeditionStage?(kingdomId: number): Promise<number | undefined>;
  worldPowerEffects?(kingdomId?: number): Promise<ReadonlyMap<string, string>>;
  emperorVersion?(kingdomId?: number): Promise<number | null | undefined>;
  playerUpdateTimes?(kingdomId: number, uids: string[]): Promise<ReadonlyMap<string, string>>;
  changeAccountCount?(deviceId: string): Promise<string | null>;
  featureAvailability?(profile: Row, now: number): Readonly<Record<string, boolean>>;
}
