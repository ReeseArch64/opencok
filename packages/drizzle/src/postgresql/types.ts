import { customType } from "drizzle-orm/pg-core";

export const legacyText = customType<{ data: string; driverData: string; config: { sqlType: string; collation: string } }>({
  dataType: (config) => `${config!.sqlType} COLLATE ${config!.collation === "C" ? '"C"' : config!.collation.split(".").map((part) => `"${part}"`).join(".")}`,
  toDriver(value) {
    if (typeof value !== "string" || value.includes("\0")) throw new Error("PostgreSQL text cannot represent this source value");
    return value;
  },
});

export const legacyTemporal = customType<{ data: string; driverData: string }>({
  dataType: () => "text",
  toDriver(value) {
    if (typeof value !== "string") throw new Error("Legacy temporal values must remain strings");
    return value;
  },
});

export const legacyBytes = customType<{ data: Buffer; driverData: Buffer }>({
  dataType: () => "bytea", fromDriver: (value) => Buffer.from(value),
  toDriver(value) {
    if (!Buffer.isBuffer(value)) throw new Error("Legacy binary values must remain bytes");
    return value;
  },
});

export const unsignedBigint = customType<{ data: bigint; driverData: string }>({
  dataType: () => "numeric(20,0)", fromDriver: (value) => BigInt(value),
  toDriver(value) {
    if (typeof value !== "bigint" || value < 0n || value > 18446744073709551615n) throw new Error("Unsigned bigint outside source range");
    return value.toString();
  },
});

/** Bounded MariaDB FLOAT/DOUBLE(M,D): preserve the driver's rounded numeric value. */
export const legacyNumber = customType<{ data: number; driverData: string; config: { sqlType: string } }>({
  dataType: (config) => config!.sqlType, fromDriver: (value) => Number(value),
  toDriver(value) {
    if (typeof value !== "number" || !Number.isFinite(value)) throw new Error("Invalid legacy floating-point value");
    return value.toString();
  },
});
