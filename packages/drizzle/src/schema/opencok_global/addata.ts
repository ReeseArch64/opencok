import { sql } from "drizzle-orm";
import { bigint, check, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_global } from "../namespaces";

export const addata = opencok_global.table("addata", {
  "device": varchar("device", { length: 100 }).notNull().default(sql.raw("''")),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
  "tracker": varchar("tracker", { length: 200 }),
  "country": varchar("country", { length: 10 }),
  "data": bytea("data"),
}, (table) => [
  primaryKey({ name: "addata_PRIMARY", columns: [table["device"]] }),
  index("addata_index_time_tracker_country").on(sql.raw("\"time\""), sql.raw("\"tracker\""), sql.raw("\"country\"")),
  check("addata_data_length", sql.raw("octet_length(\"data\") <= 65535")),
]);
