import { sql, type SQLWrapper } from "drizzle-orm";

/** Explicit PAD SPACE lookup for legacy text; column's configured collation handles case/accents. */
export function legacyTextEquals(column: SQLWrapper, value: string) {
  return sql`rtrim(${column}, ' ') = rtrim(${value}::text, ' ')`;
}
