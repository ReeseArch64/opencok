import { Repository } from "./repository";
import type { EntityDeleter } from "../interfaces/repository";
import { publicIdValidator } from "../validators/repository";

export abstract class SoftDeleteRepository extends Repository<string, boolean>
{
    constructor(protected readonly store: EntityDeleter)
    {
        super();
    }
    async execute(input: string): Promise<boolean>
    {
        return this.store.softDelete(publicIdValidator.parse(input));
    }
}
