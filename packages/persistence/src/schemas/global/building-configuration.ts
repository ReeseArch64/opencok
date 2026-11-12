import { randomUUID } from "node:crypto";
import { Schema } from "mongoose";
import { BuildingType } from "../../enums/building-type";
import { TroopType } from "../../enums/troop-type";
import { CharacterResource } from "../../enums/character-resource";
import { integerValidator } from "../../validators/integer";

const quantity = {
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
        message: "Quantidade fora do intervalo bigint não negativo",
    },
} as const;

const positiveInteger = {
    type: Number,
    required: true,
    min: 1,
    max: 2147483647,
    validate: integerValidator,
    immutable: true,
} as const;

const costsSchema = new Schema(
    {
        wood: quantity,
        food: quantity,
        stone: quantity,
        iron: quantity,
        silver: quantity,
        gold: quantity,
        crystals: quantity,
    },
    { _id: false, strict: "throw" },
);

const requirementSchema = new Schema(
    {
        buildingType: {
            type: String,
            enum: Object.values(BuildingType),
            required: true,
            immutable: true,
        },
        level: positiveInteger,
    },
    { _id: false, strict: "throw" },
);

const productionSchema = new Schema(
    {
        resource: {
            type: String,
            enum: [
                CharacterResource.Wood,
                CharacterResource.Food,
                CharacterResource.Stone,
                CharacterResource.Iron,
            ],
            required: true,
            immutable: true,
        },
        perHour: quantity,
        capacity: quantity,
    },
    { _id: false, strict: "throw" },
);

const trainingSchema = new Schema(
    {
        troopType: {
            type: String,
            enum: Object.values(TroopType),
            required: true,
            immutable: true,
        },
        maxBatchSize: positiveInteger,
    },
    { _id: false, strict: "throw" },
);

export const buildingConfigurationSchema = new Schema({
    publicId: {
        type: Schema.Types.UUID,
        required: true,
        default: randomUUID,
        immutable: true,
    },
    schemaVersion: { ...positiveInteger, enum: [1] },
    configurationVersion: positiveInteger,
    buildingType: {
        type: String,
        enum: Object.values(BuildingType),
        required: true,
        immutable: true,
    },
    level: positiveInteger,
    maxInstances: positiveInteger,
    constructionSeconds: { ...positiveInteger, min: 0 },
    costs: { type: costsSchema, required: true, immutable: true },
    requiredBuildings: {
        type: [requirementSchema],
        required: true,
        default: undefined,
        immutable: true,
        validate: {
            validator: (values: { buildingType: string; }[]) =>
                values.length <= Object.values(BuildingType).length
                && new Set(values.map(value => value.buildingType)).size === values.length,
            message: "Informe requisitos sem repetir tipos de construção",
        },
    },
    production: { type: productionSchema, default: null, immutable: true },
    training: { type: trainingSchema, default: null, immutable: true },
    createdAt: { type: Date, required: true, default: Date.now, immutable: true },
}, {
    collection: "building_configurations",
    strict: "throw",
    bufferCommands: false,
    autoCreate: false,
    autoIndex: false,
});

buildingConfigurationSchema.index(
    { publicId: 1 },
    { unique: true, name: "building_configuration_public_id" },
);
buildingConfigurationSchema.index(
    { buildingType: 1, level: 1, configurationVersion: 1 },
    { unique: true, name: "building_configuration_version" },
);
buildingConfigurationSchema.pre("validate", function()
{
    const resources: Record<string, CharacterResource> = {
        [BuildingType.Farm]: CharacterResource.Food,
        [BuildingType.Sawmill]: CharacterResource.Wood,
        [BuildingType.Quarry]: CharacterResource.Stone,
        [BuildingType.IronMine]: CharacterResource.Iron,
    };
    if (this.buildingType === BuildingType.Castle)
    {
        if (this.maxInstances !== 1)
        {
            this.invalidate("maxInstances", "Castelo deve ter uma instância por cidade");
        }
        if (this.production != null)
        {
            this.invalidate("production", "Castelo não possui produção de recursos");
        }
    }
    else if (resources[this.buildingType] != null)
    {
        if (this.production == null || this.production.resource !== resources[this.buildingType])
        {
            this.invalidate("production", "Produção deve corresponder ao recurso da construção");
        }
    }
    else if (this.production != null)
    {
        this.invalidate("production", "Prédios de treinamento não produzem recursos");
    }

    const troops: Partial<Record<BuildingType, TroopType>> = {
        [BuildingType.Barracks]: TroopType.Infantry,
        [BuildingType.Stable]: TroopType.Cavalry,
        [BuildingType.ArcheryRange]: TroopType.Archer,
        [BuildingType.SiegeWorkshop]: TroopType.Siege,
    };
    const troopType = troops[this.buildingType];
    if (troopType != null)
    {
        if (this.training == null || this.training.troopType !== troopType)
        {
            this.invalidate("training", "Treinamento deve corresponder ao tipo do prédio");
        }
    }
    else if (this.training != null)
    {
        this.invalidate("training", "Construção não permite treinamento de tropas");
    }
});

buildingConfigurationSchema.pre("save", function()
{
    if (!this.isNew && this.isModified())
    {
        throw new Error("Publicações de construções são imutáveis; crie uma nova versão");
    }
});
buildingConfigurationSchema.pre(
    [
        "updateOne",
        "updateMany",
        "findOneAndUpdate",
        "replaceOne",
        "findOneAndReplace",
        "deleteOne",
        "deleteMany",
        "findOneAndDelete",
    ],
    function()
    {
        throw new Error("Publicações de construções são imutáveis; crie uma nova versão");
    },
);

buildingConfigurationSchema.pre("bulkWrite", function(operations)
{
    if (operations.some(operation => !("insertOne" in operation)))
    {
        throw new Error("Publicações de construções são imutáveis; crie uma nova versão");
    }
});
