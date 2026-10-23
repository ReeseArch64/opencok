// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_helper = cokdb1.table("alliance_helper", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "helpId": legacyText("helpId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "senderId": legacyText("senderId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "recvId": legacyText("recvId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "stats": integer("stats").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "alliance_helper_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("alliance_helper_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_helper_index_alliance_helper").on(sql.raw("rtrim(\"helpId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"recvId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
