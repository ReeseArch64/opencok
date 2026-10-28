export type ResponseValue =
    | null
    | boolean
    | number
    | bigint
    | string
    | Buffer
    | ResponseValue[]
    | { readonly [key: string]: ResponseValue; };
