// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const device_info = cokdb1.table("device_info", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "signCode": legacyText("signCode", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "subscriberId": legacyText("subscriberId", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "operator_name": legacyText("operator_name", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "model": legacyText("model", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "network_type": legacyText("network_type", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "os_build": legacyText("os_build", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "os_fgpt": legacyText("os_fgpt", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "reserve1": legacyText("reserve1", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "reserve2": legacyText("reserve2", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "reserve3": legacyText("reserve3", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "reserve4": legacyText("reserve4", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "reserve5": legacyText("reserve5", {"sqlType":"character varying(1000)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "device_info_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("device_info_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
