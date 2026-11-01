import type { Fields } from "@opencok/messages/sfs";
import type { Row } from "./rows";
import type { WorldFavoriteStore } from "./world-favorites";
import type { WorldSearchStore } from "./world-search";
import type { WorldUtilityStore } from "./world-utility";

export interface WorldFavoriteCatalog
{
    readonly profile: {
        readonly servers?: ReadonlyMap<string, { readonly id?: string; readonly test?: string; }>;
    };
}

export interface WorldQueryStores
{
    worldFavorites?: WorldFavoriteStore;
    worldSearch?: WorldSearchStore;
    worldUtility?: WorldUtilityStore;
}

export interface WorldQueryCommands
{
    search(owner: string, params: Fields): Promise<Fields>;
    favorites(owner: string, command: string, params: Fields): Promise<Fields>;
    utility(owner: string, command: string, params: Fields): Promise<Fields>;
}

export interface WorldQueryRuntime
{
    readonly kingdomId: number;
    readonly now: () => number;
    readonly checkProfile: (profile: Row | undefined, now: number) => Row;
    readonly mapSize: () => number;
    readonly favoriteServer: (server: number | undefined, local: number) => number;
}

export interface WorldMapStore
{
    getWorldByPointIds(uid: string, ids: number[]): Promise<{
        world: Row | undefined;
        points: Row[];
        hasMarches: boolean;
        cosmetics?: readonly Row[];
        alliances?: readonly Row[];
    }>;
}

export interface WorldPointProjections
{
    cosmetics(rows: readonly Row[], now: bigint): Readonly<object>;
    monster(row: Row): Readonly<Record<string, number>>;
}

export interface WorldMapLive
{
    now?: () => number;
    subscribe(owner: string, x: number, y: number): Promise<void>;
    marches(ids: readonly number[]): Promise<readonly Row[]>;
    projectMarch(row: Row): Fields;
}
