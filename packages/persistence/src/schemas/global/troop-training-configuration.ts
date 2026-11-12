import { Schema } from "mongoose";
import { TroopType } from "../../enums/troop-type";
import {
    configurationFields,
    configurationInteger,
    configurationQuantity,
} from "../support/configuration-fields";
import { immutableConfiguration } from "../support/immutable-configuration";

const unitCostsSchema = new Schema(
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

export const troopTrainingConfigurationSchema = new Schema({
    ...configurationFields,
    troopType: { type: String, enum: Object.values(TroopType), required: true, immutable: true },
    tier: { ...configurationInteger, max: 10 },
    requiredBuildingLevel: configurationInteger,
    trainingSecondsPerUnit: configurationInteger,
    unitCosts: { type: unitCostsSchema, required: true, immutable: true },
}, {
    collection: "troop_training_configurations",
    strict: "throw",
    bufferCommands: false,
    autoCreate: false,
    autoIndex: false,
});

troopTrainingConfigurationSchema.index(
    { publicId: 1 },
    { unique: true, name: "troop_training_configuration_public_id" },
);
troopTrainingConfigurationSchema.index(
    { troopType: 1, tier: 1, configurationVersion: 1 },
    { unique: true, name: "troop_training_configuration_version" },
);
immutableConfiguration(troopTrainingConfigurationSchema);
