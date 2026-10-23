// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const device_mail_record = cokdb1.table("device_mail_record", {
  "deviceId": legacyText("deviceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "record": legacyText("record", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
}, (table) => [
  primaryKey({ name: "device_mail_record_PRIMARY", columns: [table["deviceId"], table["record"]] }),
  uniqueIndex("device_mail_record_PRIMARY_pad").on(sql.raw("rtrim(\"deviceId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"record\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
