import type { Fields } from "@opencok/messages/sfs";
import type { Row } from "./rows";
import type { PlayerRankingKind, PlayerRankingQuery, PlayerRankingSnapshot } from "./ranking";
import type {
    AllianceRankingKind,
    AllianceRankingQuery,
    AllianceRankingResult,
    AllianceRankingSnapshot,
} from "./alliance-ranking";

export interface RankingCatalog
{
    readonly kingdomId: number;
    readonly items: ReadonlyMap<
        string,
        { readonly k1?: string; readonly k2?: string; readonly k4?: string; }
    >;
    readonly configuration: {
        readonly serverConfig?: ReadonlyMap<string, { readonly rankingHideGm?: string; }>;
    };
}

export type AllianceScienceEffects = (rows: readonly Row[]) => ReadonlyMap<number, number>;

export interface RankingStore
{
    getProfileById(uid: string): Promise<Row | undefined>;
    playerRanking(uid: string, query: PlayerRankingQuery): Promise<PlayerRankingSnapshot>;
    allianceRanking(uid: string, query: AllianceRankingQuery): Promise<AllianceRankingSnapshot>;
    normalRankingRealm?(): Promise<boolean>;
    rankingPrivacy?(uid: string, kind: "payment" | "consumption"): Promise<number>;
}

export interface RankingPublications
{
    attributeRanking?(type: number): Promise<readonly string[]>;
    publishedGlobalRanking?(kind: "payment" | "consumption"): Promise<readonly string[]>;
}

export interface RankingCommands
{
    ranking(uid: string, kind: PlayerRankingKind): Promise<Fields>;
    allianceRanking(uid: string, kind: AllianceRankingKind): Promise<Fields>;
    attributeRanking(uid: string, params: Fields): Promise<Fields>;
    publishedRanking(uid: string, kind: "payment" | "consumption"): Promise<Fields>;
}

export interface RankingRuntime
{
    readonly kingdomId: number;
    readonly catalog: RankingCatalog;
    readonly now: () => number;
    readonly checkProfile: (profile: Row | undefined, now: number) => Row;
    readonly scienceEffects: AllianceScienceEffects;
    readonly mapAlliance: (kind: AllianceRankingKind, ranking: AllianceRankingResult) => Fields;
    readonly featureEnabled: (key: string, now: number) => boolean;
    readonly versionAllowed: (key: string) => boolean;
}
