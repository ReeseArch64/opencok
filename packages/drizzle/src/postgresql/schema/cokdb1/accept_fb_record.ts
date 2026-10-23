// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const accept_fb_record = cokdb1.table("accept_fb_record", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "accept_fb_record_PRIMARY", columns: [table["uid"], table["uuid"]] }),
  uniqueIndex("accept_fb_record_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
