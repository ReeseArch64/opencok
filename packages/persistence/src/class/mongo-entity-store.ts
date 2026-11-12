import type { HydratedDocument, Model, QueryFilter } from "mongoose";
import type { EntityStore } from "../interfaces/repository";
import type { Page, ValidatedPageQuery } from "../types/repository";
import { MongoEntityValidator, validateMongoInput } from "../validators/mongo-entity";

export class MongoEntityStore<T, C, P> implements EntityStore<HydratedDocument<T>, C, P>
{
    constructor(private readonly model: Model<T>)
    {}

    private active(publicId?: string): QueryFilter<T>
    {
        const filter: Record<string, unknown> = publicId ? { publicId } : {};
        if (this.model.schema.path("deletedAt"))
        {
            filter.deletedAt = null;
        }
        if (this.model.schema.path("archivedAt"))
        {
            filter.archivedAt = null;
        }
        return filter as QueryFilter<T>;
    }
    async findByPublicId(publicId: string): Promise<HydratedDocument<T> | null>
    {
        return this.model.findOne(this.active(publicId)).exec();
    }
    async list({ offset, limit }: ValidatedPageQuery): Promise<Page<HydratedDocument<T>>>
    {
        const items = await this.model.find(this.active()).sort({ _id: 1 }).skip(offset).limit(
            limit + 1,
        ).exec();
        return { items: items.slice(0, limit), offset, limit, hasMore: items.length > limit };
    }
    async create(input: C): Promise<HydratedDocument<T>>
    {
        const document = await new MongoEntityValidator<T>(this.model).parse(input);
        await document.save();
        return document;
    }
    async update(publicId: string, patch: P): Promise<HydratedDocument<T> | null>
    {
        const values = validateMongoInput(patch, this.model as unknown as Model<unknown>, true);
        const document = await this.findByPublicId(publicId);
        if (!document)
        {
            return null;
        }
        const version = document.get("__v") as number | undefined;
        document.set(values);
        await document.validate();
        const changed: Record<string, unknown> = {};
        for (const key of Object.keys(values))
        {
            changed[key] = document.get(key, undefined, { getters: false });
        }
        changed.updatedAt = new Date();
        const filter = {
            ...this.active(publicId),
            __v: version === undefined ? { $exists: false } : version,
        } as QueryFilter<T>;
        const result = await this.model.findOneAndUpdate(
            filter,
            { $set: changed, $inc: { __v: 1 } },
            { returnDocument: "after", timestamps: false },
        ).exec();
        if (!result)
        {
            throw new Error(
                "Documento alterado concorrentemente; releia antes de tentar novamente",
            );
        }
        return result;
    }
    async softDelete(publicId: string): Promise<boolean>
    {
        if (!this.model.schema.path("deletedAt"))
        {
            throw new Error("Documento não possui exclusão lógica");
        }
        const result = await this.model.updateOne(this.active(publicId), {
            $set: { deletedAt: new Date() },
            $inc: { __v: 1 },
        }).exec();
        return result.modifiedCount > 0;
    }
}
