import type { Fields } from "@opencok/messages/sfs";
import type { Row } from "./rows";
import type {
    WorldCityEffects,
    WorldResourceOwnerIdentity,
    WorldPointDetailSnapshot,
    WorldPointOwnerSnapshot,
    WorldPointOwnerDetail,
    WorldCityDetail,
    WorldSpecialDetailSnapshot,
} from "./world-point-detail";

export interface WorldPointRuleRuntime
{
    mailBlank(value: string | null | undefined): boolean;
    javaDecimal(raw: unknown, bits: 32 | 64): bigint;
}

export interface WorldSpecialDetailRuntime<TOwner extends WorldResourceOwnerIdentity>
    extends WorldPointRuleRuntime
{
    allianceBuildings():
        | readonly { type?: string; level?: string; building_value?: string; }[]
        | undefined;
    resourceRemaining(initial: number, cost: number): number;
    territorySoldierCapacity(snapshot: TOwner, kingdomId: number, now: number): Promise<number>;
}

export interface WorldDetailContext
{
    now: number;
    kingdomId: number;
    version: string;
}

export interface WorldBarbarianPlan
{
    army: { readonly size: number; };
}

export interface WorldPointDetailRuntime<
    TEffects extends WorldCityEffects,
    TOwner extends WorldResourceOwnerIdentity,
    TPlan extends WorldBarbarianPlan,
> extends WorldPointRuleRuntime
{
    cityFeature(): { readonly k3?: string; readonly k4?: string; } | undefined;
    occupied(point: Row): boolean;
    ownerBase(point: Row, owner: WorldPointOwnerSnapshot, remote: boolean): WorldPointOwnerDetail;
    cityDetail(
        observerPower: unknown,
        targetPower: unknown,
        lastBeDuelTime: unknown,
        slowDownEffect: number,
        multiplier: string | undefined,
    ): WorldCityDetail;
    resourceRemaining(initial: number, cost: number): number;
    selectExploration(
        observer: string,
        point: Row,
        marches: readonly Row[],
        remote: boolean,
    ): Row | undefined;
    specialFields(
        snapshot: WorldPointDetailSnapshot<TEffects, TOwner>,
        observer: string,
        now: number,
    ): Promise<Fields>;
    occupiedResourceFields(
        snapshot: WorldPointDetailSnapshot<TEffects, TOwner>,
        now: number,
        clock: () => number,
    ): Promise<Fields>;
    monsterHealth(point: Row, remote: boolean): Fields;
    explorationDetail(
        observer: string,
        point: Row,
        marches: readonly Row[],
        remote: boolean,
    ): Fields;
    neutralResource(point: Row, march: Row | undefined): Fields;
    barbarianArmyPlan(row: Row | undefined, now: number): TPlan | undefined;
    barbarianPower(
        plan: TPlan | undefined,
        remaining: ReadonlyMap<string | null, number | null> | null,
    ): bigint;
    hasWorldEffects(): boolean;
    worldEffects(context: WorldDetailContext): Promise<ReadonlyMap<number, number>>;
    emperorVersion(): Promise<number | null | undefined> | undefined;
    cityEffect(
        snapshot: TEffects,
        context: WorldDetailContext,
        world: ReadonlyMap<number, number>,
        emperor: number | null | undefined,
    ): number;
}

export interface WorldPointDetailCommand
{
    read(observer: string, params: Fields, now: number, clock: () => number): Promise<Fields>;
}

export interface WorldSpecialDetailInput<TOwner extends WorldResourceOwnerIdentity>
{
    point?: Row;
    kingdomId: number;
    remote: boolean;
    special?: WorldSpecialDetailSnapshot<TOwner>;
}
