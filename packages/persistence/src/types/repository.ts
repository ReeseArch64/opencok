export type PageQuery = { offset?: number; limit?: number; };
export type ValidatedPageQuery = { offset: number; limit: number; };
export type Page<T> = { items: T[]; offset: number; limit: number; hasMore: boolean; };
export type UpdateInput<P> = { publicId: string; patch: P; };
