// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const invitee = cokdb1.table("invitee", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "inviterUid": legacyText("inviterUid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "status": integer("status"),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "invitee_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("invitee_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
