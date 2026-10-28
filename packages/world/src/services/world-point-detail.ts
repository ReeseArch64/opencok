import { roundTripLegacyObject } from "@opencok/messages/legacy-json";
import { decodeJavaIntMap } from "@opencok/messages/java-int-map";
import { legacyObjectOrder } from "@opencok/messages/legacy-object-order";
import { sfs, Type, type Fields } from "@opencok/messages/sfs";
import { errors, MOBILE_CLIENT_VERSION } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import type { Row } from "../contracts/rows";
import type {
    WorldPointDetailStore,
    WorldCityEffects,
    WorldResourceOwnerIdentity,
    WorldTurretReader,
} from "../contracts/world-point-detail";
import type {
    WorldPointDetailRuntime,
    WorldBarbarianPlan,
} from "../contracts/point-detail-runtime";
import { worldPointOwner, worldCityFields } from "../mappings/world-point-detail";
import { worldPointDetailQuery } from "../rules/world-point-detail";
import { favoriteInteger } from "../rules/world-favorites";

function unsupported(): never
{
    throw new GameError(errors.unsupported, "world_point_detail");
}

export function restoredExplorationMarch(
    observer: string,
    point: Row,
    marches: readonly Row[],
    selectWorldExplorationMarch: (
        observer: string,
        point: Row,
        marches: readonly Row[],
        remote: boolean,
    ) => Row | undefined,
): string | undefined
{
    if (marches.length > 4096)
    {
        return unsupported();
    }

    const byId = new Map<string, Row>();

    for (const row of marches)
    {
        if (typeof row.uuid !== "string" || !row.uuid || byId.has(row.uuid))
        {
            return unsupported();
        }

        byId.set(row.uuid, row);
    }

    const keys = [...byId.keys()].sort();
    const ordered = legacyObjectOrder(keys).map((key) => byId.get(key)!);

    return selectWorldExplorationMarch(observer, point, ordered, false)?.uuid as string | undefined;
}

export class WorldPointDetailService<
    TEffects extends WorldCityEffects,
    TOwner extends WorldResourceOwnerIdentity,
    TPlan extends WorldBarbarianPlan,
>
{
    constructor(
        readonly runtime: WorldPointDetailRuntime<TEffects, TOwner, TPlan>,
        readonly turret: () => WorldTurretReader | undefined = () => undefined,
    )
    {}

    async read(
        store: WorldPointDetailStore<TEffects, TOwner>,
        observer: string,
        params: Fields,
        kingdomId: number,
        now: number,
        clock: () => number = () => now,
    ): Promise<Fields>
    {
        if (
            params.point?.type !== Type.Int
            || !favoriteInteger(params.point.value)
            || (params.serverId !== undefined
                && (params.serverId.type !== Type.Int || !favoriteInteger(params.serverId.value)))
        )
        {
            throw new GameError(errors.invalid);
        }

        const query = worldPointDetailQuery(
            params.point.value,
            params.serverId?.value as number | undefined,
            kingdomId,
            now,
        );
        const cityFeature = this.runtime.cityFeature();
        const state = await store.read(
            observer,
            { ...query, cityExtras: cityFeature?.k3 === "1", resourceEffects: true },
            (point, marches) =>
                restoredExplorationMarch(observer, point, marches, this.runtime.selectExploration),
            this.turret(),
        );
        const profile = state.profile;

        if (!profile)
        {
            throw new GameError(errors.missing);
        }

        if (
            profile.uid !== observer
            || profile.serverId !== kingdomId
            || (profile.banFlag ?? 0) !== 0
            || typeof (profile.banTime ?? 0n) !== "bigint"
            || ((profile.banTime ?? 0n) as bigint) > BigInt(now)
            || state.kingdomId !== query.kingdomId
            || state.remote !== (query.kingdomId !== kingdomId)
        )
        {
            throw new GameError(errors.invalid);
        }

        if (query.point <= 0)
        {
            return {};
        }

        const point = state.point;

        if (!point)
        {
            throw new GameError(errors.missing);
        }

        if (
            !state.world
            || state.world.uid !== observer
            || !favoriteInteger(state.world.worldId)
            || point.id !== query.point
            || point.worldId !== (state.remote ? 0 : state.world.worldId)
            || !favoriteInteger(point.pointType)
            || !state.owner
        )
        {
            return unsupported();
        }

        const type = point.pointType;

        if (type < 0 || type > 69)
        {
            return unsupported();
        }

        const occupied = this.runtime.occupied(point);

        if (state.remote)
        {
            if (type === 3 && !occupied)
            {
                return roundTripLegacyObject({
                    point: sfs.int(query.point),
                    tq: sfs.int(
                        this.runtime.resourceRemaining(
                            point.resInitValue as number,
                            point.resCostValue as number,
                        ),
                    ),
                });
            }

            return roundTripLegacyObject({
                ...worldPointOwner(this.runtime.ownerBase(point, state.owner, true)),
                ...(await this.runtime.specialFields(state, observer, now)),
                ...(await this.runtime.occupiedResourceFields(state, now, clock)),
                point: sfs.int(query.point),
            });
        }

        const owner = worldPointOwner(this.runtime.ownerBase(point, state.owner, false));

        if (!occupied && (type === 3 || type === 37))
        {
            const result: Fields = {
                ...owner,
                point: sfs.int(query.point),
                tq: sfs.int(
                    this.runtime.resourceRemaining(
                        point.resInitValue as number,
                        point.resCostValue as number,
                    ),
                ),
            };

            if (type === 37)
            {
                if (!favoriteInteger(point.monsterCurrHP ?? 0))
                {
                    return unsupported();
                }

                result.existMember = sfs.int((point.monsterCurrHP ?? 0) as number);
            }

            return result;
        }

        if (!occupied && (type === 49 || type === 50))
        {
            return {
                ...owner,
                ...(await this.runtime.specialFields(state, observer, now)),
                point: sfs.int(query.point),
            };
        }

        const result: Fields = {
            ...owner,
            ...(await this.runtime.specialFields(state, observer, now)),
            ...(await this.runtime.occupiedResourceFields(state, now, clock)),
            ...this.runtime.monsterHealth(point, false),
            point: sfs.int(query.point),
        };

        if (type === 1 && cityFeature?.k3 === "1" && state.owner.profile)
        {
            const city = state.city;

            if (
                !city
                || !city.observerStatistics
                || city.observerStatistics.uid !== observer
                || !city.mixed
                || city.mixed.uid !== point.ownerId
                || city.effects.profile.uid !== point.ownerId
                || city.effects.profile.serverId !== kingdomId
                || !this.runtime.hasWorldEffects()
            )
            {
                return unsupported();
            }

            const context = { now, kingdomId, version: MOBILE_CLIENT_VERSION };
            const world = await this.runtime.worldEffects(context);
            const emperor = city.effects.throneRewards.length
                ? await this.runtime.emperorVersion()
                : undefined;
            const effect = this.runtime.cityEffect(city.effects, context, world, emperor);
            Object.assign(
                result,
                worldCityFields(
                    this.runtime.cityDetail(
                        city.observerStatistics.power,
                        state.owner.statistics?.power,
                        city.mixed.lastBeDuelTime,
                        effect,
                        cityFeature.k4,
                    ),
                ),
            );
        }

        if (type === 44)
        {
            if (!state.barbarian)
            {
                return unsupported();
            }

            const row = state.barbarian.row;

            if (row && row.pointId !== query.point)
            {
                return unsupported();
            }

            const plan = this.runtime.barbarianArmyPlan(row, clock());
            let remaining: ReadonlyMap<string | null, number | null> | null = null;

            if (plan?.army.size && row?.lastArmyMapByteArray != null)
            {
                try
                {
                    remaining = decodeJavaIntMap(row.lastArmyMapByteArray as Buffer);
                }
                catch
                {
                    return unsupported();
                }
            }

            result.barbarionPower = sfs.long(this.runtime.barbarianPower(plan, remaining));
        }

        if (type === 6)
        {
            if (!state.exploration)
            {
                return unsupported();
            }

            const marches = state.exploration.march ? [state.exploration.march] : [];
            Object.assign(
                result,
                this.runtime.explorationDetail(observer, point, marches, false),
            );
        }

        if (type === 60 && !this.runtime.mailBlank(point.pointItem as string | null))
        {
            if (!state.neutralResource)
            {
                return unsupported();
            }

            Object.assign(
                result,
                this.runtime.neutralResource(point, state.neutralResource.march),
            );
        }

        if (
            (type === 3 || type === 18)
            && point.active === 1
            && !this.runtime.mailBlank(point.territoryAlliance as string | null)
            && point.territoryAlliance === profile.allianceId
        )
        {
            result.territory_positive_effect = sfs.int(1);
        }

        return result;
    }
}
