import { Repository } from "./repository";
import type { EntityCreator } from "../interfaces/repository";

export abstract class CreateRepository<T, C> extends Repository<C, T>
{
    constructor(protected readonly store: EntityCreator<T, C>)
    {
        super();
    }
    async execute(input: C): Promise<T>
    {
        return this.store.create(input);
    }
}
