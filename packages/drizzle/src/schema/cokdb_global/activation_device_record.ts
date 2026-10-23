import { sql } from "drizzle-orm";
import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const activation_device_record = cokdb_global.table("activation_device_record", {
  "code": varchar("code", { length: 40 }).notNull(),
  "deviceId": varchar("deviceId", { length: 255 }).notNull().default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "activation_device_record_PRIMARY", columns: [table["code"], table["deviceId"]] }),
]);
