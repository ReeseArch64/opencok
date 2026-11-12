import { Schema } from "mongoose";
import { mongoDocumentFields } from "../../base/mongo-document-fields";
import { worldPopulationResourceRuleSchema } from "./world-population-resource-rule";
import { integerValidator } from "../../validators/integer";

export const worldPopulationConfigurationSchema = new Schema(
    {
        ...mongoDocumentFields,
        worldRegionId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "WorldRegion",
            immutable: true,
        },
        configurationVersion: {
            type: Number,
            required: true,
            min: 1,
            max: 2147483647,
            validate: integerValidator,
            immutable: true,
        },
        maximumActiveDeposits: {
            type: Number,
            required: true,
            min: 1,
            max: 1440000,
            validate: integerValidator,
            immutable: true,
        },
        populationCheckIntervalSeconds: {
            type: Number,
            required: true,
            min: 1,
            max: 2147483647,
            validate: integerValidator,
            immutable: true,
        },
        resourceRules: {
            type: [worldPopulationResourceRuleSchema],
            required: true,
            default: undefined,
            immutable: true,
            validate: {
                validator: (rules: unknown[]) => rules.length >= 1 && rules.length <= 60,
                message: "Defina entre 1 e 60 regras de recursos",
            },
        },
    },
    {
        collection: "world_population_configurations",
        strict: "throw",
        timestamps: true,
        bufferCommands: false,
        autoCreate: false,
        autoIndex: false,
    },
);
worldPopulationConfigurationSchema.index(
    { publicId: 1 },
    { unique: true, name: "world_population_configuration_public_id" },
);
worldPopulationConfigurationSchema.index(
    { worldRegionId: 1, configurationVersion: 1 },
    { unique: true, name: "world_population_configuration_version" },
);
worldPopulationConfigurationSchema.pre("validate", function()
{
    const rules = this.resourceRules ?? [];
    const ids = rules.map((rule) => String(rule.configurationPublicId));
    if (new Set(ids).size !== ids.length)
    {
        this.invalidate(
            "resourceRules",
            "Uma configuração de recurso não pode ser repetida",
        );
    }
    if (
        rules.reduce((sum, rule) => sum + rule.targetActiveDeposits, 0)
        > this.maximumActiveDeposits
    )
    {
        this.invalidate(
            "maximumActiveDeposits",
            "A soma das quantidades-alvo excede o limite da região",
        );
    }
});
