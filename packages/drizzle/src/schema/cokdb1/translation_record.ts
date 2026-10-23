import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const translation_record = cokdb1.table("translation_record", {
  "date": varchar("date", { length: 255 }).notNull(),
  "month": integer("month"),
  "day": integer("day"),
  "num": integer("num"),
  "words": integer("words"),
  "countryCharacters": integer("countryCharacters").default(sql.raw("0")),
  "allianceCharacters": integer("allianceCharacters").default(sql.raw("0")),
  "en": integer("en").default(sql.raw("0")),
  "zh-Hans": integer("zh-Hans").default(sql.raw("0")),
  "zh-Hant": integer("zh-Hant").default(sql.raw("0")),
  "ja": integer("ja").default(sql.raw("0")),
  "ko": integer("ko").default(sql.raw("0")),
  "ru": integer("ru").default(sql.raw("0")),
  "es": integer("es").default(sql.raw("0")),
  "ms": integer("ms").default(sql.raw("0")),
  "fr": integer("fr").default(sql.raw("0")),
  "de": integer("de").default(sql.raw("0")),
  "it": integer("it").default(sql.raw("0")),
  "pt": integer("pt").default(sql.raw("0")),
  "other": integer("other").default(sql.raw("0")),
  "fromDB": integer("fromDB").default(sql.raw("0")),
  "fromMS": integer("fromMS").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "translation_record_PRIMARY", columns: [table["date"]] }),
]);
