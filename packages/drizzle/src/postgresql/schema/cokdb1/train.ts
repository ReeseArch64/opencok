// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const train = cokdb1.table("train", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "id": legacyText("id", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "genUid": legacyText("genUid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "finishTrain": bigint("finishTrain", { mode: "bigint" }).notNull(),
  "endTime": bigint("endTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "train_PRIMARY", columns: [table["uid"], table["id"]] }),
  uniqueIndex("train_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
