// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const compensate_record = cokdb1.table("compensate_record", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "lostPower": bigint("lostPower", { mode: "bigint" }),
  "time": bigint("time", { mode: "bigint" }),
  "rewardTime": bigint("rewardTime", { mode: "bigint" }),
  "rewardStatus": integer("rewardStatus"),
  "reward": legacyText("reward", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "num": integer("num"),
}, (table) => [
  primaryKey({ name: "compensate_record_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("compensate_record_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("compensate_record_time_idx").on(sql.raw("\"time\"")),
  index("compensate_record_uid_idx").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
