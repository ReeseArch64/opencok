// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const red_packets = cokdb1.table("red_packets", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "range": integer("range").default(sql.raw("0")),
  "rangeId": legacyText("rangeId", {"sqlType":"character varying(255)","collation":"C"}).default(sql.raw("''")),
  "type": integer("type").default(sql.raw("0")),
  "sender": legacyText("sender", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "senderName": legacyText("senderName", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "pic": legacyText("pic", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "picVer": integer("picVer").default(sql.raw("0")),
  "total": integer("total").default(sql.raw("0")),
  "remain": integer("remain").default(sql.raw("0")),
  "sendTime": bigint("sendTime", { mode: "bigint" }).default(sql.raw("0")),
  "endTime": bigint("endTime", { mode: "bigint" }).default(sql.raw("0")),
  "totalPeople": integer("totalPeople").default(sql.raw("0")),
  "curPeople": integer("curPeople").default(sql.raw("0")),
  "state": integer("state").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "red_packets_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("red_packets_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\"")),
  index("red_packets_state_index").on(sql.raw("\"state\"")),
]);
