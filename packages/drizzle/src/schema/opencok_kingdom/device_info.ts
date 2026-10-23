import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const device_info = opencok_kingdom.table(
  "device_info",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "signCode": varchar("signCode", { length: 100 }),
    "subscriberId": varchar("subscriberId", { length: 100 }),
    "operator_name": varchar("operator_name", { length: 100 }),
    "model": varchar("model", { length: 100 }),
    "network_type": varchar("network_type", { length: 100 }),
    "os_build": varchar("os_build", { length: 200 }),
    "os_fgpt": varchar("os_fgpt", { length: 200 }),
    "reserve1": varchar("reserve1", { length: 100 }),
    "reserve2": varchar("reserve2", { length: 100 }),
    "reserve3": varchar("reserve3", { length: 200 }),
    "reserve4": varchar("reserve4", { length: 200 }),
    "reserve5": varchar("reserve5", { length: 1000 }),
  },
  (table) => [primaryKey({ name: "device_info_PRIMARY", columns: [table["uid"]] })],
);
