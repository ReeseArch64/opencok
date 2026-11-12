import type { EntityStore } from "../interfaces/repository";
import type { EntityCache } from "../interfaces/cache";
import type { ValidatedPageQuery } from "../types/repository";

export class CachedEntityStore<T extends { publicId: unknown; }, C, P>
    implements EntityStore<T, C, P>
{
    constructor(
        private readonly store: EntityStore<T, C, P>,
        private readonly cache: EntityCache<T>,
    )
    {}
    findByPublicId(publicId: string): Promise<T | null>
    {
        return this.cache.remember(publicId, () => this.store.findByPublicId(publicId));
    }
    list(query: ValidatedPageQuery)
    {
        return this.store.list(query);
    }
    async create(input: C): Promise<T>
    {
        const value = await this.store.create(input);
        await this.cache.invalidate(String(value.publicId));
        return value;
    }
    async update(publicId: string, patch: P): Promise<T | null>
    {
        const value = await this.store.update(publicId, patch);
        await this.cache.invalidate(publicId);
        return value;
    }
    async softDelete(publicId: string): Promise<boolean>
    {
        const result = await this.store.softDelete(publicId);
        await this.cache.invalidate(publicId);
        return result;
    }
}
