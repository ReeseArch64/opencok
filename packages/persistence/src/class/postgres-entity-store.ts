import {
    IsNull,
    type DeepPartial,
    type EntityManager,
    type EntityTarget,
    type FindOptionsWhere,
    type Repository as OrmRepository,
} from "typeorm";
import type { BaseEntity } from "../base/base-entity";
import type { EntityStore } from "../interfaces/repository";
import type { Validator } from "../interfaces/validator";
import type { Page, ValidatedPageQuery } from "../types/repository";

export class PostgresEntityStore<T extends BaseEntity, C, P> implements EntityStore<T, C, P>
{
    constructor(
        private readonly manager: EntityManager,
        private readonly target: EntityTarget<T>,
        private readonly createValidator: Validator<unknown>,
        private readonly updateValidator: Validator<unknown>,
        private readonly validateState: (entity: T) => void,
    )
    {}

    private active(publicId?: string): FindOptionsWhere<T>
    {
        return {
            ...(publicId ? { publicId } : {}),
            archivedAt: IsNull(),
            deletedAt: IsNull(),
        } as FindOptionsWhere<T>;
    }
    private repository(manager = this.manager): OrmRepository<T>
    {
        return manager.getRepository(this.target);
    }

    findByPublicId(publicId: string): Promise<T | null>
    {
        return this.repository().findOne({ where: this.active(publicId) });
    }
    async list({ offset, limit }: ValidatedPageQuery): Promise<Page<T>>
    {
        const items = await this.repository().createQueryBuilder("entity")
            .where("entity.archivedAt IS NULL").andWhere("entity.deletedAt IS NULL")
            .orderBy("entity.id", "ASC").skip(offset).take(limit + 1).getMany();
        return { items: items.slice(0, limit), offset, limit, hasMore: items.length > limit };
    }
    async create(input: C): Promise<T>
    {
        const value = this.createValidator.parse(input) as DeepPartial<T>;
        const repository = this.repository();
        const entity = repository.create(value);
        this.validateState(entity);
        return repository.save(entity);
    }
    async update(publicId: string, input: P): Promise<T | null>
    {
        const patch = this.updateValidator.parse(input);
        return this.manager.transaction(async manager => {
            const repository = this.repository(manager);
            const entity = await repository.findOne({
                where: this.active(publicId),
                lock: { mode: "pessimistic_write" },
            });
            if (!entity)
            {
                return null;
            }
            Object.assign(entity, patch);
            this.validateState(entity);
            return repository.save(entity);
        });
    }
    async softDelete(publicId: string): Promise<boolean>
    {
        const result = await this.repository().softDelete(this.active(publicId));
        return (result.affected ?? 0) > 0;
    }
}
