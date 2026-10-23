import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const alliance_donate = opencok_kingdom.table(
  "alliance_donate",
  {
    "uerid": varchar("uerid", { length: 45 }).notNull(),
    "scienceid": integer("scienceid").notNull(),
    "highres": varchar("highres", { length: 45 }),
    "midres": varchar("midres", { length: 45 }),
    "lowres": varchar("lowres", { length: 45 }),
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
  },
  (table) => [
    primaryKey({ name: "alliance_donate_PRIMARY", columns: [table["uerid"], table["scienceid"]] }),
  ],
);
