import { sql } from "drizzle-orm";
import { check, numeric, primaryKey, text } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const adcost = opencok_global.table("adcost", {
  "date": text("date").notNull(),
  "googleplay": numeric("googleplay", { precision: 12, scale: 2, mode: "number" }),
  "facebook": numeric("facebook", { precision: 12, scale: 2, mode: "number" }),
  "cn": numeric("cn", { precision: 12, scale: 2, mode: "number" }),
  "kr": numeric("kr", { precision: 12, scale: 2, mode: "number" }),
  "jp": numeric("jp", { precision: 12, scale: 2, mode: "number" }),
  "th": numeric("th", { precision: 12, scale: 2, mode: "number" }),
  "ru": numeric("ru", { precision: 12, scale: 2, mode: "number" }),
  "tw": numeric("tw", { precision: 12, scale: 2, mode: "number" }),
}, (table) => [
  primaryKey({ name: "adcost_PRIMARY", columns: [table["date"]] }),
  check("adcost_date_temporal", sql.raw("(\"date\" IS NULL OR (CASE WHEN \"date\" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01])$' THEN CASE WHEN left(\"date\",4) <> '0000' AND substring(\"date\",6,2) <> '00' AND substring(\"date\",9,2) <> '00' THEN to_char(to_date(left(\"date\",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left(\"date\",10) ELSE true END ELSE false END))")),
]);
