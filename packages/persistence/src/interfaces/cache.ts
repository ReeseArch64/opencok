export interface CacheCodec<T>
{
    encode(value: T): string;
    decode(value: string): T;
}
export interface EntityCache<T>
{
    remember(publicId: string, load: () => Promise<T | null>): Promise<T | null>;
    invalidate(publicId: string): Promise<void>;
}
export interface CacheErrorHandler
{
    (error: unknown): void;
}
