import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const device_mail_record = cokdb1.table("device_mail_record", {
  "deviceId": varchar("deviceId", { length: 40 }).notNull(),
  "record": varchar("record", { length: 40 }).notNull(),
}, (table) => [
  primaryKey({ name: "device_mail_record_PRIMARY", columns: [table["deviceId"], table["record"]] }),
]);
