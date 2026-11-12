import { Schema } from "mongoose";
import { TroopType } from "../../enums/troop-type";
import {
    configurationFields,
    configurationInteger,
    configurationPositiveQuantity,
} from "../support/configuration-fields";
import { immutableConfiguration } from "../support/immutable-configuration";

export const troopConfigurationSchema = new Schema({
    ...configurationFields,
    troopType: { type: String, enum: Object.values(TroopType), required: true, immutable: true },
    tier: { ...configurationInteger, max: 10 },
    speedCellsPerHour: configurationInteger,
    carryCapacity: configurationPositiveQuantity,
}, {
    collection: "troop_configurations",
    strict: "throw",
    bufferCommands: false,
    autoCreate: false,
    autoIndex: false,
});

troopConfigurationSchema.index(
    { publicId: 1 },
    { unique: true, name: "troop_configuration_public_id" },
);
troopConfigurationSchema.index(
    { troopType: 1, tier: 1, configurationVersion: 1 },
    { unique: true, name: "troop_configuration_version" },
);
immutableConfiguration(troopConfigurationSchema);
