// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_donate = cokdb1.table("alliance_donate", {
  "uerid": legacyText("uerid", {"sqlType":"character varying(45)","collation":"legacy_meta.sv_ci"}).notNull(),
  "scienceid": integer("scienceid").notNull(),
  "highres": legacyText("highres", {"sqlType":"character varying(45)","collation":"legacy_meta.sv_ci"}),
  "midres": legacyText("midres", {"sqlType":"character varying(45)","collation":"legacy_meta.sv_ci"}),
  "lowres": legacyText("lowres", {"sqlType":"character varying(45)","collation":"legacy_meta.sv_ci"}),
  "highnum": integer("highnum").default(sql.raw("0")),
  "midnum": integer("midnum").default(sql.raw("0")),
  "lownum": integer("lownum").default(sql.raw("0")),
  "higprogress": integer("higprogress").default(sql.raw("0")),
  "midprogress": integer("midprogress").default(sql.raw("0")),
  "lowprogress": integer("lowprogress").default(sql.raw("0")),
  "highcontribute": integer("highcontribute").default(sql.raw("0")),
  "midcontribute": integer("midcontribute").default(sql.raw("0")),
  "lowcontribute": integer("lowcontribute").default(sql.raw("0")),
  "lastrefreshtime": bigint("lastrefreshtime", { mode: "bigint" }).default(sql.raw("0")),
  "highNotUse": integer("highNotUse").default(sql.raw("0")),
  "midNotUse": integer("midNotUse").default(sql.raw("0")),
  "midAvailable": integer("midAvailable").default(sql.raw("0")),
  "highAvailable": integer("highAvailable").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "alliance_donate_PRIMARY", columns: [table["uerid"], table["scienceid"]] }),
  uniqueIndex("alliance_donate_PRIMARY_pad").on(sql.raw("rtrim(\"uerid\", ' ') COLLATE \"legacy_meta\".\"sv_ci\""), sql.raw("\"scienceid\"")),
]);
