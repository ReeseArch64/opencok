import type { InventoryFields as Fields } from "./inventory.ts";
import type { BattleRankingState, PlayoffPublication } from "./battle-ranking.ts";
import type { FlowerRankingPublication, FlowerRankingState } from "./flower-ranking.ts";
import type { CommunityRankingSnapshot, DonationScore } from "./community-ranking.ts";
import type { ThroneRankingPeriod, ThroneRankingSnapshot } from "./throne-ranking.ts";
import type {
  HeroRankingSnapshot,
  HeroRankingLookup,
  HeroInsideRankingSnapshot,
  HeroHistorySnapshot,
  HeroHistoryPublication,
} from "./hero-ranking.ts";
import type { DragonRankingEntry, DragonRankingRange } from "./dragon-ranking.ts";
import type { WorldPointDetailStore } from "./world-point-detail.ts";
import type { WorldFavoriteStore } from "./world-favorites.ts";
import type { WorldSearchStore } from "./world-search.ts";
import type { PlayerSearchStore } from "./player-search.ts";
import type { AvatarFinishService } from "./files.ts";
import type { AvatarVersionService } from "./avatar-version.ts";
import type { AvatarGrantService } from "./files.ts";
import type { ChatSessionIssuer } from "./chat.ts";
import type {
  MailSystemQuery,
  MailSystemInspector,
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
  MailConversationReadQuery,
  MailConversationReadSnapshot,
  MailCategoryDeleteQuery,
  MailCategoryDeleteInspector,
  MailBatchInvitationPlanner,
  MailCategoryDeleteSnapshot,
  MailTypeDeleteQuery,
  MailConversationDeleteQuery,
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
import type { MailUpdateInspector, MailUpdateQuery, MailUpdateSnapshot } from "./mail-updates.ts";
import type { PowerState } from "./power.ts";
import type { RoutedPublicProfile } from "./profile.ts";
import type { PlayerRankingQuery, PlayerRankingSnapshot } from "./ranking.ts";
import type { ReconnectProgressState, ReconnectProgressWrite } from "./reconnect.ts";

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
  sciences?: Row[];
  equipment?: Row[];
  hospital?: Row[];
  forts?: Row[];
  items: Row[];
  lord: Row | undefined;
  civilizationPrestige?: bigint;
}
export interface GameStore extends AuthenticationStore {
  rankingPrivacy?(uid: string, kind: "payment" | "consumption"): Promise<number>;
  battleRankingState?(uid: string, now: number): Promise<BattleRankingState>;
  heroHistory?(
    uid: string,
    kingdomId: number,
    type: number,
    now: number,
  ): Promise<HeroHistorySnapshot>;
  heroHistoryPresentation?(
    alliances: readonly string[],
    realms: readonly number[],
  ): Promise<{ alliances: readonly Row[]; realms: readonly Row[] }>;
  heroInsideRanking?(
    uid: string,
    kingdomId: number,
    eventId: string,
    now: number,
  ): Promise<HeroInsideRankingSnapshot>;
  heroRanking?(
    uid: string,
    kingdomId: number,
    activityId: string,
    now: number,
  ): Promise<HeroRankingSnapshot>;
  throneRanking?(
    kingdomId: number,
    publication?: ThroneRankingPeriod,
  ): Promise<ThroneRankingSnapshot>;
  donationRanking?(uid: string, now: number): Promise<CommunityRankingSnapshot>;
  cemeteryRanking?(uid: string, type: "0" | "1", now: number): Promise<CommunityRankingSnapshot>;
  crossRankingRealm?(): Promise<boolean>;
  flowerRanking?(uid: string, realm: number, uids: readonly string[]): Promise<FlowerRankingState>;
  normalRankingRealm?(): Promise<boolean>;
  getSystemMailByPlayerId?(
    uid: string,
    query: MailSystemQuery,
    inspect: MailSystemInspector,
  ): Promise<MailCategorySnapshot>;
  mailUpdates?(
    uid: string,
    query: MailUpdateQuery,
    inspect: MailUpdateInspector,
  ): Promise<MailUpdateSnapshot>;
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
  mailConversationRead?(
    uid: string,
    query: MailConversationReadQuery,
  ): Promise<MailConversationReadSnapshot>;
  mailCategoryDelete?(
    uid: string,
    query: MailCategoryDeleteQuery,
    inspect: MailCategoryDeleteInspector,
    invitations?: MailBatchInvitationPlanner,
    chatEnabled?: boolean,
  ): Promise<MailCategoryDeleteSnapshot>;
  mailConversationDelete?(
    uid: string,
    query: MailConversationDeleteQuery,
  ): Promise<MailCategoryDeleteSnapshot>;
  mailTypeDelete?(uid: string, query: MailTypeDeleteQuery): Promise<MailCategoryDeleteSnapshot>;
  mailSave(uid: string, query: MailSaveQuery): Promise<MailSaveSnapshot>;
  mailStatus(uid: string, query: MailStatusQuery): Promise<MailStatusSnapshot>;
  allianceRanking(uid: string, query: AllianceRankingQuery): Promise<AllianceRankingSnapshot>;
  playerRanking(uid: string, query: PlayerRankingQuery): Promise<PlayerRankingSnapshot>;
  publicProfile(uid: string, observerAllianceId: string): Promise<RoutedPublicProfile | undefined>;
  getPowerByPlayerId(uid: string, now: number): Promise<PowerState>;
  getPlayerSummariesByIds(uids: string[], allServers: boolean): Promise<PlayerSummary[]>;
  getConfigurationByPlayerId(uid: string): Promise<LoginConfigurationState>;
  configurationSwitches?(): Promise<Row[] | undefined>;
  initializeWorldNewsPreference?(uid: string, now: number): Promise<void>;
  setPushPreference?(uid: string, preference: PushPreference, now: number): Promise<void>;
  nicknameOccupied?(name: string): Promise<boolean>;
  updateAvatarReport?(owner: string, target: string, now: number): Promise<void>;
  celebrityDescription?(uid: string, kingdomId: number): Promise<Buffer | null>;
  saveCelebrityDescription?(
    uid: string,
    now: number,
    readDescription: () => Buffer | null,
  ): Promise<void>;
  updateProfilePreference?(
    uid: string,
    field: ProfilePreferenceField,
    now: number,
    readValue: () => number,
  ): Promise<number | undefined>;
  getCityByPlayerId(uid: string, now: number): Promise<CityState>;
  getWorldByPointIds(
    uid: string,
    ids: number[],
  ): Promise<{ world: Row | undefined; points: Row[]; hasMarches: boolean }>;
}

export interface PushPreference {
  type: number;
  status: number;
  audio: number;
}

export type ProfilePreferenceField =
  | "showEquip"
  | "showMedal"
  | "marchSoldierShow"
  | "colorblind"
  | "scrollEquip"
  | "showBanner"
  | "clientSaveFlag";

export interface PlayerSummary {
  data: Row;
  kingdomId: number;
  remote: boolean;
}

export interface LoginConfigurationState {
  profile: Row | undefined;
  switches: Row[] | undefined;
  pushSettings: Row[];
}

export interface GameServices {
  mailChatEnabled?: boolean;
  reconnect?<T>(
    uid: string,
    now: number,
    plan: (state: ReconnectProgressState) => Promise<{ write: ReconnectProgressWrite; result: T }>,
  ): Promise<T>;
  dragonRanking?(
    ranges: readonly DragonRankingRange[],
    allianceId: string,
  ): Promise<readonly DragonRankingEntry[]>;
  battleFightPublication?(): Promise<string | undefined>;
  playoffPublication?(): Promise<PlayoffPublication>;
  heroHistoryPublication?(
    keys: readonly string[],
    alliance: boolean,
  ): Promise<readonly HeroHistoryPublication[]>;
  heroRankingPosition?(query: HeroRankingLookup): Promise<number>;
  throneRankingPeriod?(realm: number): Promise<ThroneRankingPeriod | undefined>;
  donationScores?(
    allianceId: string,
    kind: "resource-day" | "resource-week" | "resource-history",
    date: string,
  ): Promise<readonly DonationScore[]>;
  flowerRankingPublication?(
    realm: number,
    uid: string,
    limit: number,
    global: boolean,
  ): Promise<FlowerRankingPublication>;
  militaryRanking?(type: number, group: number): Promise<readonly string[]>;
  attributeRanking?(type: number): Promise<readonly string[]>;
  publishedGlobalRanking?(kind: "payment" | "consumption"): Promise<readonly string[]>;
  globalCelebrityRanking?(rankType: number): Promise<readonly string[]>;
  scoreActivityRanking?(): Promise<readonly string[]>;
  trade?(
    owner: string,
    command: string,
    params: Fields,
  ): Promise<import("./responses/inventory.ts").InventoryCommandResponse>;
  shop?(
    owner: string,
    command: string,
    params: Fields,
  ): Promise<import("./responses/inventory.ts").InventoryCommandResponse>;
  mailReward?(
    owner: string,
    command: string,
    params: Fields,
  ): Promise<import("./responses/inventory.ts").InventoryCommandResponse>;
  timed?(
    owner: string,
    command: string,
    params: Fields,
  ): Promise<import("./responses/inventory.ts").InventoryCommandResponse>;
  cityProgression?(
    owner: string,
    command: string,
    params: Fields,
  ): Promise<import("./responses/inventory.ts").InventoryCommandResponse>;
  production?(
    owner: string,
    command: string,
    params: Fields,
  ): Promise<import("./responses/inventory.ts").InventoryCommandResponse>;
  reconcileTimed?(owner: string): Promise<void>;
  inventory?(
    owner: string,
    command: string,
    params: Fields,
  ): Promise<import("./responses/inventory.ts").InventoryCommandResponse>;
  nicknameChange?(
    owner: string,
    operationId: string,
    validatedName: string,
    now: number,
  ): Promise<import("./nickname-change.ts").NicknameChangeRecord>;
  nicknameForbidden?(name: string): boolean | Promise<boolean>;
  nicknameBadWords?(name: string): boolean | Promise<boolean>;
  nicknameReservedPatterns?(): readonly string[];
  filterBadWords?(text: string): string;
  worldPointDetail?: WorldPointDetailStore;
  playerSearch?: PlayerSearchStore;
  worldSearch?: WorldSearchStore;
  worldFavorites?: WorldFavoriteStore;
  avatar?: AvatarGrantService;
  avatarFinish?: AvatarFinishService;
  avatarVersion?: AvatarVersionService;
  chatSession?: ChatSessionIssuer;
  expeditionRanking?(limit: number): Promise<readonly ExpeditionRankingEntry[] | undefined>;
  expeditionStage?(kingdomId: number): Promise<number | undefined>;
  worldPowerEffects?(kingdomId?: number): Promise<ReadonlyMap<string, string>>;
  emperorVersion?(kingdomId?: number): Promise<number | null | undefined>;
  worldTurretKills?(kingdomId: number, territory: string): Promise<ReadonlyMap<string, string>>;
  lastSystemMail?(uid: string): Promise<string | null>;
  systemMailPage?(
    uid: string,
    ids: readonly string[],
    count: number,
    time: bigint,
    inspect: (indices: readonly number[], more: boolean) => void,
  ): Promise<void>;
  playerUpdateTimes?(kingdomId: number, uids: string[]): Promise<ReadonlyMap<string, string>>;
  changeAccountCount?(deviceId: string): Promise<string | null>;
  featureAvailability?(profile: Row, now: number): Readonly<Record<string, boolean>>;
}
