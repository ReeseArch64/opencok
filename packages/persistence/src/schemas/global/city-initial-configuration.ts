import { Schema } from "mongoose";
import { BuildingType } from "../../enums/building-type";
import {
    configurationFields,
    configurationInteger,
    configurationQuantity,
} from "../support/configuration-fields";
import { immutableConfiguration } from "../support/immutable-configuration";

const resourcesSchema = new Schema(
    {
        wood: configurationQuantity,
        food: configurationQuantity,
        stone: configurationQuantity,
        iron: configurationQuantity,
        silver: configurationQuantity,
        gold: configurationQuantity,
        crystals: configurationQuantity,
    },
    { _id: false, strict: "throw" },
);

const buildingSchema = new Schema(
    {
        buildingType: {
            type: String,
            enum: Object.values(BuildingType),
            required: true,
            immutable: true,
        },
        position: { ...configurationInteger, min: 0 },
        level: configurationInteger,
    },
    { _id: false, strict: "throw" },
);

export const cityInitialConfigurationSchema = new Schema({
    ...configurationFields,
    resources: { type: resourcesSchema, required: true, immutable: true },
    buildings: {
        type: [buildingSchema],
        required: true,
        default: undefined,
        immutable: true,
        validate: {
            validator: (values: { buildingType: string; position: number; }[]) =>
                values.filter(value => value.buildingType === BuildingType.Castle).length === 1
                && new Set(values.map(value => value.position)).size === values.length,
            message: "Informe exatamente um Castelo e posições distintas",
        },
    },
}, {
    collection: "city_initial_configurations",
    strict: "throw",
    bufferCommands: false,
    autoCreate: false,
    autoIndex: false,
});

cityInitialConfigurationSchema.index(
    { publicId: 1 },
    { unique: true, name: "city_initial_configuration_public_id" },
);
cityInitialConfigurationSchema.index(
    { configurationVersion: 1 },
    { unique: true, name: "city_initial_configuration_version" },
);
immutableConfiguration(cityInitialConfigurationSchema);
