import { Schema } from "mongoose";
import { ResourceType } from "../../enums/resource-type";
import {
    configurationFields,
    configurationInteger,
    configurationPositiveQuantity,
} from "../support/configuration-fields";
import { immutableConfiguration } from "../support/immutable-configuration";

const gatheringRateSchema = new Schema(
    {
        resourceType: {
            type: String,
            enum: Object.values(ResourceType),
            required: true,
            immutable: true,
        },
        perTroopPerHour: configurationPositiveQuantity,
    },
    { _id: false, strict: "throw" },
);

export const marchConfigurationSchema = new Schema({
    ...configurationFields,
    maxActiveMarches: configurationInteger,
    maxTroopsPerMarch: configurationInteger,
    gatheringRates: {
        type: [gatheringRateSchema],
        required: true,
        default: undefined,
        immutable: true,
        validate: {
            validator: (values: { resourceType: string; }[]) =>
                values.length > 0
                && values.length <= Object.values(ResourceType).length
                && new Set(values.map(value => value.resourceType)).size === values.length,
            message: "Informe taxas de coleta sem repetir recursos",
        },
    },
}, {
    collection: "march_configurations",
    strict: "throw",
    bufferCommands: false,
    autoCreate: false,
    autoIndex: false,
});

marchConfigurationSchema.index(
    { publicId: 1 },
    { unique: true, name: "march_configuration_public_id" },
);
marchConfigurationSchema.index(
    { configurationVersion: 1 },
    { unique: true, name: "march_configuration_version" },
);
immutableConfiguration(marchConfigurationSchema);
