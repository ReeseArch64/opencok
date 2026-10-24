export type DtoValue =
  | null
  | boolean
  | number
  | bigint
  | string
  | Buffer
  | DtoValue[]
  | { readonly [key: string]: DtoValue };
