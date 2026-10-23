import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const account_device_mapping = opencok_global.table("account_device_mapping", {
  "gameUid": varchar("gameUid", { length: 100 }).notNull(),
  "deviceId": varchar("deviceId", { length: 200 }).notNull(),
  "type": integer("type"),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "account_device_mapping_PRIMARY", columns: [table["gameUid"], table["deviceId"]] }),
]);
