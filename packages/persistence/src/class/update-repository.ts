import { Repository } from "./repository";
import type { EntityUpdater } from "../interfaces/repository";
import { publicIdValidator } from "../validators/repository";
import type { UpdateInput } from "../types/repository";

export abstract class UpdateRepository<T, P> extends Repository<UpdateInput<P>, T | null>
{
    constructor(protected readonly store: EntityUpdater<T, P>)
    {
        super();
    }
    async execute(input: UpdateInput<P>): Promise<T | null>
    {
        return this.store.update(publicIdValidator.parse(input.publicId), input.patch);
    }
}
