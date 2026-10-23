import { customType } from "drizzle-orm/mysql-core";

/** Preserve arbitrary bytes, including invalid UTF-8, in legacy blobs and chat keys. */
export const binaryData = customType<{
  data: Buffer;
  driverData: Buffer;
  config: { type: string };
  configRequired: true;
}>({
  dataType: (config) => config.type,
  fromDriver: (value) => Buffer.from(value),
  toDriver: (value) => value,
});
