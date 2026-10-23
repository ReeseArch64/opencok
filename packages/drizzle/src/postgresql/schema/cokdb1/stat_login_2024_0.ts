// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const stat_login_2024_0 = cokdb1.table("stat_login_2024_0", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "disconnect": bigint("disconnect", { mode: "bigint" }).default(sql.raw("0")),
  "ip": legacyText("ip", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
  "level": integer("level"),
  "castlelevel": integer("castlelevel"),
  "payTotal": bigint("payTotal", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "deviceId": legacyText("deviceId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "regTime": bigint("regTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "pf": legacyText("pf", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
  "country": legacyText("country", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}),
  "trulyip": legacyText("trulyip", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
  "linkname": legacyText("linkname", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "curpf": legacyText("curpf", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
  "curcountry": legacyText("curcountry", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}),
  "curgaid": legacyText("curgaid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "curdeviceid": legacyText("curdeviceid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "appversion": legacyText("appversion", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "curip": legacyText("curip", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "stat_login_2024_0_PRIMARY", columns: [table["uid"], table["time"]] }),
  uniqueIndex("stat_login_2024_0_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"time\"")),
  index("stat_login_2024_0_index_timeStamp").on(sql.raw("\"time\"")),
]);
