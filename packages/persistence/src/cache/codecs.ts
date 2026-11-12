import { mongo, type HydratedDocument, type Model } from "mongoose";
import type { CacheCodec } from "../interfaces/cache";
import type { BaseEntity } from "../base/base-entity";

export function postgresCacheCodec<T extends BaseEntity>(construct: () => T): CacheCodec<T>
{
    return {
        encode: value => JSON.stringify(value),
        decode: value => {
            const data = JSON.parse(value) as Record<string, unknown>;
            for (const key of ["createdAt", "updatedAt", "deletedAt", "archivedAt", "depletedAt"])
            {
                if (typeof data[key] === "string")
                {
                    data[key] = new Date(data[key]);
                }
            }
            return Object.assign(construct(), data);
        },
    };
}
export function mongoCacheCodec<T>(model: Model<T>): CacheCodec<HydratedDocument<T>>
{
    return {
        encode: value =>
            Buffer.from(mongo.BSON.serialize(value.toObject({ getters: false }))).toString(
                "base64",
            ),
        decode: value => model.hydrate(mongo.BSON.deserialize(Buffer.from(value, "base64"))),
    };
}
