// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_exchange_cycle = cokdb1.table("user_exchange_cycle", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "stage": integer("stage").default(sql.raw("0")),
  "totalstage": integer("totalstage").default(sql.raw("0")),
  "waittime": bigint("waittime", { mode: "bigint" }).default(sql.raw("0")),
  "totalstage1": integer("totalstage1").default(sql.raw("0")),
  "waittime1": bigint("waittime1", { mode: "bigint" }).default(sql.raw("0")),
  "totalstage2": integer("totalstage2").default(sql.raw("0")),
  "waittime2": bigint("waittime2", { mode: "bigint" }).default(sql.raw("0")),
  "exchanges": legacyText("exchanges", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "stage1": integer("stage1").default(sql.raw("0")),
  "stage2": integer("stage2").default(sql.raw("0")),
  "cdtime": bigint("cdtime", { mode: "bigint" }).default(sql.raw("-1")),
  "cdtime1": bigint("cdtime1", { mode: "bigint" }).default(sql.raw("-1")),
  "cdtime2": bigint("cdtime2", { mode: "bigint" }).default(sql.raw("-1")),
  "receive_reward": legacyText("receive_reward", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "receive_reward1": legacyText("receive_reward1", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "receive_reward2": legacyText("receive_reward2", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "user_exchange_cycle_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_exchange_cycle_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
