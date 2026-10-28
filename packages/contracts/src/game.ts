import type { WorldQueryStores, WorldQueryCommands } from "@opencok/world/contracts/runtime";
import type {
    RankingStore,
    RankingCommands,
    RankingPublications,
} from "@opencok/ranking/contracts/runtime";
import type { HeroEventSelection, HeroEventSnapshot } from "@opencok/hero/contracts/hero-event";
import type { InventoryFields as Fields } from "@opencok/economy/contracts/inventory";
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
} from "@opencok/hero/contracts/hero-ranking";
import type { DragonRankingEntry, DragonRankingRange } from "./dragon-ranking.ts";
import type { WorldPointDetailStore } from "@opencok/world/contracts/world-point-detail";
import type { WorldPointDetailCommand } from "@opencok/world/contracts/point-detail-runtime";
import type { PlayerEffectSnapshot } from "./power";
import type { WorldResourceOwnerSnapshot } from "./world-resource-owner";
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
import type { Row } from "./rows.ts";
import type { MailUpdateInspector, MailUpdateQuery, MailUpdateSnapshot } from "./mail-updates.ts";
import type { PowerState } from "./power.ts";
import type { ReconnectProgressState, ReconnectProgressWrite } from "./reconnect.ts";

export interface AuthenticationStore
{
    getProfileById(uid: string): Promise<Row | undefined>;
    getAccountsByPlayerId(uid: string): Promise<Row[]>;
}

export interface CityState
{
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

export interface GameStore extends AuthenticationStore, RankingStore
{
    activityDirectory?(
        uid: string,
    ): Promise<import("./activity-directory").ActivityDirectorySnapshot>;
    activityOperators?(
        uid: string,
        now: number,
    ): Promise<import("./activity-operators").ActivityOperatorsSnapshot>;
    heroEvents?(
        uid: string,
        kingdomId: number,
        selection: HeroEventSelection,
        now: number,
    ): Promise<HeroEventSnapshot>;
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
    ): Promise<{ alliances: readonly Row[]; realms: readonly Row[]; }>;
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
    flowerRanking?(
        uid: string,
        realm: number,
        uids: readonly string[],
    ): Promise<FlowerRankingState>;
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
    getPowerByPlayerId(uid: string, now: number): Promise<PowerState>;
    getPlayerSummariesByIds(uids: string[], allServers: boolean): Promise<PlayerSummary[]>;
    configurationSwitches?(): Promise<Row[] | undefined>;
    updateAvatarReport?(owner: string, target: string, now: number): Promise<void>;
    getCityByPlayerId(uid: string, now: number): Promise<CityState>;
}

export interface PlayerSummary
{
    data: Row;
    kingdomId: number;
    remote: boolean;
}

export interface LoginConfigurationState
{
    profile: Row | undefined;
    switches: Row[] | undefined;
    pushSettings: Row[];
}

export interface GameServices extends RankingPublications, WorldQueryStores
{
    ranking?: RankingCommands;
    worldQueries?: WorldQueryCommands;
    celebrityDescription?: {
        read(owner: string, params: Fields, now: number): Promise<Fields>;
        save(owner: string, params: Fields, now: number): Promise<Fields>;
    };
    publicProfile?(uid: string, params: Fields): Promise<Fields>;
    playerPreferences?: {
        configuration(uid: string): Promise<LoginConfigurationState>;
        initialize(uid: string, rows: readonly Row[], now: number): Promise<void>;
        command(uid: string, command: string, params: Fields): Promise<Fields>;
    };
    profilePreference?(
        uid: string,
        command: string,
        params: Fields,
        now: number,
    ): Promise<Fields>;
    hotItemBusinessMan?(): Promise<Fields | undefined>;
    worldEffectBoard?(): Promise<Fields>;
    expeditionActivity?(owner: string): Promise<Fields>;
    mailChatEnabled?: boolean;
    reconnect?<T>(
        uid: string,
        now: number,
        plan: (
            state: ReconnectProgressState,
        ) => Promise<{ write: ReconnectProgressWrite; result: T; }>,
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
    globalCelebrityRanking?(rankType: number): Promise<readonly string[]>;
    scoreActivityRanking?(): Promise<readonly string[]>;
    trade?(
        owner: string,
        command: string,
        params: Fields,
    ): Promise<import("@opencok/economy/contracts/responses/inventory").InventoryCommandResponse>;
    shop?(
        owner: string,
        command: string,
        params: Fields,
    ): Promise<import("@opencok/economy/contracts/responses/inventory").InventoryCommandResponse>;
    mailReward?(
        owner: string,
        command: string,
        params: Fields,
    ): Promise<import("@opencok/economy/contracts/responses/inventory").InventoryCommandResponse>;
    timed?(
        owner: string,
        command: string,
        params: Fields,
    ): Promise<import("@opencok/economy/contracts/responses/inventory").InventoryCommandResponse>;
    reconcileAlliance?(owner: string): Promise<void>;
    alliance?(
        owner: string,
        command: string,
        params: Fields,
    ): Promise<import("@opencok/economy/contracts/responses/inventory").InventoryCommandResponse>;
    cityProgression?(
        owner: string,
        command: string,
        params: Fields,
    ): Promise<import("@opencok/economy/contracts/responses/inventory").InventoryCommandResponse>;
    production?(
        owner: string,
        command: string,
        params: Fields,
    ): Promise<import("@opencok/economy/contracts/responses/inventory").InventoryCommandResponse>;
    reconcileTimed?(owner: string): Promise<void>;
    inventory?(
        owner: string,
        command: string,
        params: Fields,
    ): Promise<import("@opencok/economy/contracts/responses/inventory").InventoryCommandResponse>;
    nickname?: {
        check(owner: string, params: Fields): Promise<Fields>;
        change(owner: string, params: Fields): Promise<Fields>;
    };
    nicknameForbidden?(name: string): boolean | Promise<boolean>;
    nicknameBadWords?(name: string): boolean | Promise<boolean>;
    nicknameReservedPatterns?(): readonly string[];
    filterBadWords?(text: string): string;
    worldPointDetail?: WorldPointDetailStore<PlayerEffectSnapshot, WorldResourceOwnerSnapshot>;
    worldDetail?: WorldPointDetailCommand;
    worldScout?: import("./world-scout").WorldScoutStore;
    worldFightBulletins?: import("./world-bulletins").WorldBulletinArchive;
    worldMarchInspection?: import("./world-march-inspection").WorldMarchInspectionStore;
    playerSearch?: PlayerSearchStore;
    avatar?: AvatarGrantService;
    avatarFinish?: AvatarFinishService;
    avatarVersion?: AvatarVersionService;
    friendshipMine?(
        owner: string,
        command: string,
        params: Fields,
    ): Promise<import("@opencok/economy/contracts/responses/inventory").InventoryCommandResponse>;
    notice?(
        owner: string,
        command: string,
        params: Fields,
    ): Promise<import("@opencok/economy/contracts/responses/inventory").InventoryCommandResponse>;
    postbox?(
        owner: string,
        command: string,
        params: Fields,
    ): Promise<import("@opencok/economy/contracts/responses/inventory").InventoryCommandResponse>;
    chatSession?: ChatSessionIssuer;
    social?: import("./realm-social.ts").RealmSocialExecutor;
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
