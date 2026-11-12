import { Repository } from "./repository";
import type { EntityReader } from "../interfaces/repository";
import { pageQueryValidator } from "../validators/repository";
import type { Page, PageQuery } from "../types/repository";

export abstract class ListRepository<T> extends Repository<PageQuery, Page<T>>
{
    constructor(protected readonly store: EntityReader<T>)
    {
        super();
    }
    async execute(input: PageQuery): Promise<Page<T>>
    {
        return this.store.list(pageQueryValidator.parse(input));
    }
}
