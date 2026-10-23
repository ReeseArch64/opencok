// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const adreward = cokdb_global.table("adreward", {
  "device": legacyText("device", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "time": bigint("time", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "reward": legacyText("reward", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "user": legacyText("user", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "state": integer("state").default(sql.raw("0")),
  "sendTime": bigint("sendTime", { mode: "bigint" }),
  "tryTimes": integer("tryTimes").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "adreward_PRIMARY", columns: [table["device"], table["time"]] }),
  uniqueIndex("adreward_PRIMARY_pad").on(sql.raw("rtrim(\"device\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"time\"")),
  index("adreward_index_time").on(sql.raw("\"time\"")),
  index("adreward_index_state_tryTime").on(sql.raw("\"state\""), sql.raw("\"tryTimes\"")),
]);
