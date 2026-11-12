import { Repository } from "./repository";
import type { EntityReader } from "../interfaces/repository";
import { publicIdValidator } from "../validators/repository";

export abstract class FindByPublicIdRepository<T> extends Repository<string, T | null>
{
    constructor(protected readonly store: EntityReader<T>)
    {
        super();
    }
    async execute(input: string): Promise<T | null>
    {
        return this.store.findByPublicId(publicIdValidator.parse(input));
    }
}
