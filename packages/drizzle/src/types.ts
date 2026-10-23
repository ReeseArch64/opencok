import { customType } from "drizzle-orm/pg-core";

/** PostgreSQL binary values retain arbitrary bytes, including NUL. */
export const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType: () => "bytea",
  fromDriver: (value) => Buffer.from(value),
  toDriver: (value) => value,
});
