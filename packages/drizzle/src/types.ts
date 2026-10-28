import { customType } from "drizzle-orm/pg-core";

export const bytea = customType<{ data: Buffer; driverData: Buffer; }>({
    dataType: () => "bytea",
    fromDriver: (value) => Buffer.from(value),
    toDriver: (value) => value,
});

export const utf8Bytea = customType<{ data: string; driverData: Buffer; }>({
    dataType: () => "bytea",
    fromDriver: (value) => new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(value),
    toDriver: (value) => {
        if (!value.isWellFormed())
        {
            throw new Error("Invalid UTF-16 text");
        }

        return Buffer.from(value, "utf8");
    },
});
