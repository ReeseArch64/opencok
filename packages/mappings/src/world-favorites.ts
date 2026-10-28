import { validateFields } from "@opencok/messages/validations/fields";
import { worldFavoritesSchema } from "@opencok/validations/world-favorites";

import type { WorldFavoriteList } from "@opencok/contracts/world-favorites";
import { favoriteInteger, favoriteServerType } from "@opencok/rules/world-favorites";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { sfs, type Fields } from "@opencok/messages/sfs";

function serializeWorldFavorites(state: WorldFavoriteList, owner: string): Fields
{
    if (state.rows.length > 32767)
    {
        throw new GameError(errors.unsupported, "world_favorite_size");
    }

    const favorites = state.rows.map((row) => {
        if (row.uid !== owner)
        {
            throw new GameError(errors.invalid);
        }

        const value: Fields = {};

        for (const key of ["point", "type", "server", "resType", "cityType"])
        {
            if (row[key] == null)
            {
                continue;
            }

            if (!favoriteInteger(row[key]))
            {
                throw new GameError(errors.invalid);
            }

            value[key] = sfs.int(row[key]);
        }

        if (row.name != null)
        {
            if (
                typeof row.name !== "string"
                || !row.name.isWellFormed()
                || row.name.includes("\0")
                || row.name.length > 255
            )
            {
                throw new GameError(errors.invalid);
            }

            value.name = sfs.string(row.name);
        }

        if (row.createTime != null)
        {
            if (
                typeof row.createTime !== "bigint"
                || BigInt.asIntN(64, row.createTime) !== row.createTime
            )
            {
                throw new GameError(errors.invalid);
            }

            value.createTime = sfs.long(row.createTime);
        }

        if (row.server != null)
        {
            value.serverType = sfs.int(
                favoriteServerType(Number(row.server), state.serverTypes.get(Number(row.server))),
            );
        }

        return sfs.object(value);
    });
    const body = { favo: sfs.array(favorites) };

    return body;
}

export function worldFavorites(...args: Parameters<typeof serializeWorldFavorites>): Fields
{
    return validateFields(worldFavoritesSchema, serializeWorldFavorites(...args));
}
