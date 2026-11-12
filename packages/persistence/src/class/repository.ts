import type { RepositoryMethod } from "../interfaces/repository";

export abstract class Repository<Input, Output> implements RepositoryMethod<Input, Output>
{
    abstract execute(input: Input): Promise<Output>;
}
