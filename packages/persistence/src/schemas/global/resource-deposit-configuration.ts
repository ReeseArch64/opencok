import { randomUUID } from "node:crypto";
import { Schema } from "mongoose";
import { ResourceType } from "../../enums/resource-type";
import { ResourceRespawnPolicy } from "../../enums/resource-respawn-policy";
import { integerValidator } from "../../validators/integer";

export const resourceDepositConfigurationSchema = new Schema(
    {
        publicId: {
            type: Schema.Types.UUID,
            required: true,
            default: randomUUID,
            immutable: true,
        },
        resourceType: {
            type: String,
            enum: Object.values(ResourceType),
            required: true,
            immutable: true,
        },
        resourceLevel: {
            type: Number,
            required: true,
            min: 1,
            max: 10,
            validate: integerValidator,
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
        initialQuantity: {
            type: Number,
            required: true,
            min: 1,
            max: Number.MAX_SAFE_INTEGER,
            validate: {
                validator: Number.isSafeInteger,
                message: "Quantidade deve ser um inteiro seguro",
            },
            immutable: true,
        },
        respawnPolicy: {
            type: String,
            enum: Object.values(ResourceRespawnPolicy),
            required: true,
            immutable: true,
        },
        respawnDelaySeconds: {
            type: Number,
            default: null,
            min: 1,
            max: 2147483647,
            validate: {
                validator: (value: number | null) => value == null || Number.isInteger(value),
                message: "Tempo deve ser inteiro",
            },
            immutable: true,
        },
        createdAt: { type: Date, default: Date.now, immutable: true },
    },
    {
        collection: "resource_deposit_configurations",
        strict: "throw",
        bufferCommands: false,
        autoCreate: false,
        autoIndex: false,
    },
);

resourceDepositConfigurationSchema.index(
    { publicId: 1 },
    { unique: true, name: "resource_deposit_configuration_public_id" },
);
resourceDepositConfigurationSchema.index(
    { resourceType: 1, resourceLevel: 1, configurationVersion: 1 },
    { unique: true, name: "resource_deposit_configuration_version" },
);
resourceDepositConfigurationSchema.pre("validate", function()
{
    if (
        this.respawnPolicy === ResourceRespawnPolicy.Never
        && this.respawnDelaySeconds != null
    )
    {
        this.invalidate(
            "respawnDelaySeconds",
            "Reposição desativada não aceita tempo de reposição",
        );
    }
    if (
        this.respawnPolicy === ResourceRespawnPolicy.AfterDepletion
        && this.respawnDelaySeconds == null
    )
    {
        this.invalidate(
            "respawnDelaySeconds",
            "Reposição após esgotamento exige tempo em segundos",
        );
    }
});
