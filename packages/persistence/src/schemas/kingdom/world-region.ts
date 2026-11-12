import { Schema } from "mongoose";
import { mongoDocumentFields } from "../../base/mongo-document-fields";
import { WorldRegionType } from "../../enums/world-region-type";
import { WorldRegionStatus } from "../../enums/world-region-status";
import { integerValidator } from "../../validators/integer";

export const worldRegionSchema = new Schema(
    {
        ...mongoDocumentFields,
        worldPublicId: {
            type: Schema.Types.UUID,
            required: true,
            immutable: true,
        },
        displayName: {
            type: String,
            required: true,
            maxlength: 64,
            validate: {
                validator: (value: string) =>
                    value.trim().length > 0 && Buffer.byteLength(value) <= 64,
                message: "Nome deve conter até 64 bytes e não ser vazio",
            },
        },
        regionType: {
            type: String,
            required: true,
            enum: Object.values(WorldRegionType),
        },
        regionStatus: {
            type: String,
            required: true,
            enum: Object.values(WorldRegionStatus),
            default: WorldRegionStatus.Active,
        },
        activePopulationConfigurationId: {
            type: Schema.Types.ObjectId,
            ref: "WorldPopulationConfiguration",
            default: null,
        },
        minimumCellX: {
            type: Number,
            required: true,
            min: 1,
            max: 1200,
            validate: integerValidator,
        },
        minimumCellY: {
            type: Number,
            required: true,
            min: 1,
            max: 1200,
            validate: integerValidator,
        },
        maximumCellX: {
            type: Number,
            required: true,
            min: 1,
            max: 1200,
            validate: integerValidator,
        },
        maximumCellY: {
            type: Number,
            required: true,
            min: 1,
            max: 1200,
            validate: integerValidator,
        },
    },
    {
        collection: "world_regions",
        strict: "throw",
        timestamps: true,
        bufferCommands: false,
        autoCreate: false,
        autoIndex: false,
    },
);
worldRegionSchema.index(
    { publicId: 1 },
    { unique: true, name: "world_region_public_id" },
);
worldRegionSchema.index(
    { worldPublicId: 1, regionType: 1, regionStatus: 1 },
    { name: "world_region_type_status" },
);
worldRegionSchema.pre("validate", function()
{
    if (
        this.activePopulationConfigurationId != null
        && this.regionType !== WorldRegionType.ResourceArea
    )
    {
        this.invalidate(
            "activePopulationConfigurationId",
            "Somente áreas de recursos podem ativar configuração de população",
        );
    }
    if (
        this.maximumCellX < this.minimumCellX
        || this.maximumCellY < this.minimumCellY
    )
    {
        this.invalidate("maximumCellX", "Limites da região estão invertidos");
    }
});
