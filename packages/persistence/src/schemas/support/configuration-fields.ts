import { randomUUID } from "node:crypto";
import { Schema } from "mongoose";

export const configurationInteger = {
    type: Number,
    required: true,
    min: 1,
    max: 2147483647,
    validate: { validator: Number.isInteger, message: "Informe um inteiro positivo" },
    immutable: true,
} as const;

export const configurationQuantity = {
    type: String,
    required: true,
    immutable: true,
    set: (value: unknown) => {
        if (typeof value !== "string")
        {
            throw new TypeError("Quantidade deve ser uma string decimal exata");
        }
        return value;
    },
    validate: {
        validator: (value: string) =>
            /^(0|[1-9][0-9]{0,18})$/.test(value)
            && BigInt(value) <= 9223372036854775807n,
        message: "Quantidade deve ser um bigint não negativo",
    },
} as const;

export const configurationPositiveQuantity = {
    ...configurationQuantity,
    validate: {
        validator: (value: string) =>
            /^[1-9][0-9]{0,18}$/.test(value)
            && BigInt(value) <= 9223372036854775807n,
        message: "Quantidade deve ser um bigint positivo",
    },
} as const;

export const configurationFields = {
    publicId: { type: Schema.Types.UUID, required: true, default: randomUUID, immutable: true },
    schemaVersion: { ...configurationInteger, enum: [1] },
    configurationVersion: configurationInteger,
    createdAt: { type: Date, required: true, default: Date.now, immutable: true },
} as const;
