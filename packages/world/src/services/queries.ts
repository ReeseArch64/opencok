import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { sfs, Type, type Fields, type Value } from "@opencok/messages/sfs";
import type { Row } from "../contracts/rows";
import type { WorldQueryStores, WorldQueryRuntime, WorldQueryCommands } from "../contracts/runtime";
import type { CreateWorldFavoriteDto } from "../dtos/world-favorites/create-world-favorite.dto";
import { favoriteInteger, favoriteName } from "../rules/world-favorites";
import { worldFavorites } from "../mappings/world-favorites";
import { worldSearch } from "../mappings/world-search";
import { worldSearchName, worldSearchOffset } from "../rules/world-search";
import { worldUtility } from "./world-utility";

export class WorldQueryService implements WorldQueryCommands
{
    constructor(readonly stores: WorldQueryStores, readonly runtime: WorldQueryRuntime)
    {}

    async search(uid: string, params: Fields): Promise<Fields>
    {
        const store = this.stores.worldSearch;

        if (!store)
        {
            throw new GameError(errors.unsupported);
        }

        const integer = (key: string, fallback: number) => {
            const field = params[key];

            if (field === undefined)
            {
                return fallback;
            }

            if (field.type !== Type.Int || !favoriteInteger(field.value))
            {
                throw new GameError(errors.invalid);
            }

            return field.value;
        };
        const name = params.name === undefined ? "" : params.name.value;

        if (
            (params.name !== undefined && params.name.type !== Type.String)
            || !worldSearchName(name)
        )
        {
            throw new GameError(errors.invalid);
        }

        const kingdomId = integer("serverId", this.runtime.kingdomId);
        const offset = worldSearchOffset(integer("page", 1));
        const now = this.runtime.now();

        if (kingdomId < 1 || !Number.isSafeInteger(now) || now < 0)
        {
            throw new GameError(errors.invalid);
        }

        const state = await store.search(uid, { name, offset, kingdomId, now });
        const profile = this.runtime.checkProfile(state.profile, now);

        if (
            profile.uid !== uid
            || profile.serverId !== this.runtime.kingdomId
            || state.kingdomId !== kingdomId
        )
        {
            throw new GameError(errors.invalid);
        }

        return worldSearch(state.rows);
    }

    async favorites(uid: string, command: string, params: Fields): Promise<Fields>
    {
        const store = this.stores.worldFavorites;

        if (!store)
        {
            throw new GameError(errors.unsupported);
        }

        const now = this.runtime.now();

        if (!Number.isSafeInteger(now) || now < 0)
        {
            throw new GameError(errors.invalid);
        }

        const check = (profile: Row | undefined) => {
            const owned = this.runtime.checkProfile(profile, now);

            if (owned.uid !== uid || owned.serverId !== this.runtime.kingdomId)
            {
                throw new GameError(errors.invalid);
            }
        };

        if (command === "world.favo.get")
        {
            const state = await store.list(uid, now);
            check(state.profile);

            return worldFavorites(state, uid);
        }

        const integer = (key: string, fallback?: number) => {
            const field = params[key];

            if (field === undefined && fallback !== undefined)
            {
                return fallback;
            }

            if (field?.type !== Type.Int || !favoriteInteger(field.value))
            {
                throw new GameError(errors.invalid);
            }

            return field.value;
        };

        if (command === "world.favo.add")
        {
            if (params.name?.type !== Type.String || !favoriteName(params.name.value))
            {
                throw new GameError(errors.invalid);
            }

            const dto: CreateWorldFavoriteDto = {
                point: integer("point"),
                type: integer("type"),
                cityType: integer("cityType", -1),
                resType: integer("resType", -1),
                name: params.name.value,
                server: this.runtime.favoriteServer(
                    params.server === undefined ? undefined : integer("server"),
                    this.runtime.kingdomId,
                ),
            };
            const state = await store.add(uid, { ...dto, now });
            check(state.profile);
            const repliedAt = this.runtime.now();

            if (!Number.isSafeInteger(repliedAt) || repliedAt < 0)
            {
                throw new GameError(errors.invalid);
            }

            return {
                state: sfs.int(1),
                createTime: sfs.long(repliedAt),
                point: sfs.int(dto.point),
            };
        }

        const selection = (key: string): number[] => {
            const field = params[key];

            if (
                field?.type !== Type.Array || !Array.isArray(field.value)
                || field.value.length > 32767
            )
            {
                throw new GameError(errors.invalid);
            }

            return field.value.map((entry: Value) => {
                if (entry?.type !== Type.Int || !favoriteInteger(entry.value))
                {
                    throw new GameError(errors.invalid);
                }

                return entry.value;
            });
        };
        const points = selection("point"),
            servers = selection("server");

        if (points.length !== servers.length)
        {
            throw new GameError(errors.invalid);
        }

        const result = await store.remove(
            uid,
            points.map((point, index) => ({ point, server: servers[index]! })),
            now,
        );
        check(result.profile);

        return {
            state: sfs.int(result.success ? 1 : 0),
            pointArray: sfs.array(points.map(sfs.int)),
            serverArray: sfs.array(servers.map(sfs.int)),
        };
    }

    async utility(owner: string, command: string, params: Fields): Promise<Fields>
    {
        if (!this.stores.worldUtility)
        {
            throw new GameError(errors.unsupported);
        }

        return worldUtility(
            this.stores.worldUtility,
            owner,
            command,
            params,
            this.runtime.kingdomId,
            this.runtime.mapSize(),
            this.runtime.now(),
        );
    }
}
