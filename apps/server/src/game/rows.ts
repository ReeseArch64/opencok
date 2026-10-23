export type Row = Record<string, string | number | bigint | Buffer | null>;
export const text = (row: Row, key: string) => String(row[key] ?? "");
export const num = (row: Row, key: string) => Number(row[key] ?? 0);
export const long = (row: Row, key: string) => BigInt(String(row[key] ?? 0));
