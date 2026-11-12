import type { Page, PageQuery, UpdateInput, ValidatedPageQuery } from "../types/repository";

export interface RepositoryMethod<Input, Output>
{
    execute(input: Input): Promise<Output>;
}
export interface EntityReader<T>
{
    findByPublicId(publicId: string): Promise<T | null>;
    list(query: ValidatedPageQuery): Promise<Page<T>>;
}
export interface EntityCreator<T, C>
{
    create(input: C): Promise<T>;
}
export interface EntityUpdater<T, P>
{
    update(publicId: string, patch: P): Promise<T | null>;
}
export interface EntityDeleter
{
    softDelete(publicId: string): Promise<boolean>;
}
export interface EntityStore<T, C, P>
    extends EntityReader<T>, EntityCreator<T, C>, EntityUpdater<T, P>, EntityDeleter
{}
export interface ReadRepositories<T>
{
    findByPublicId: RepositoryMethod<string, T | null>;
    list: RepositoryMethod<PageQuery, Page<T>>;
}
export interface PublishRepositories<T, C> extends ReadRepositories<T>
{
    create: RepositoryMethod<C, T>;
}
export interface MutableRepositories<T, C, P> extends PublishRepositories<T, C>
{
    update: RepositoryMethod<UpdateInput<P>, T | null>;
    softDelete: RepositoryMethod<string, boolean>;
}
