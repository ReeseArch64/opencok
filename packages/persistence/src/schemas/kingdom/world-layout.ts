import { randomUUID } from "node:crypto";
import { Schema } from "mongoose";
import { worldCellSchema } from "./world-cell";
import { integerValidator } from "../../validators/integer";

export const worldLayoutSchema = new Schema(
    {
        publicId: {
            type: Schema.Types.UUID,
            required: true,
            default: randomUUID,
            immutable: true,
        },
        worldPublicId: {
            type: Schema.Types.UUID,
            required: true,
            immutable: true,
        },
        layoutVersion: {
            type: Number,
            required: true,
            min: 1,
            max: 2_147_483_647,
            validate: integerValidator,
            immutable: true,
        },
        templateWidthInCells: {
            type: Number,
            required: true,
            min: 1,
            max: 1200,
            validate: integerValidator,
            immutable: true,
        },
        templateHeightInCells: {
            type: Number,
            required: true,
            min: 1,
            max: 1200,
            validate: integerValidator,
            immutable: true,
        },
        blockedCells: {
            type: [worldCellSchema],
            required: true,
            default: () => [],
            immutable: true,
        },
        createdAt: { type: Date, default: Date.now, immutable: true },
    },
    {
        collection: "world_layouts",
        strict: "throw",
        bufferCommands: false,
        autoCreate: false,
        autoIndex: false,
    },
);

worldLayoutSchema.index(
    { publicId: 1 },
    { unique: true, name: "world_layout_public_id" },
);

worldLayoutSchema.index(
    { worldPublicId: 1, layoutVersion: 1 },
    { unique: true, name: "world_layout_version" },
);

worldLayoutSchema.pre("validate", function()
{
    const seen = new Set<string>();
    if (this.blockedCells.length > 4096)
    {
        this.invalidate(
            "blockedCells",
            "Modelo limitado a 4096 células bloqueadas",
        );
    }
    for (const cell of this.blockedCells)
    {
        if (
            cell.columnIndex >= this.templateWidthInCells
            || cell.rowIndex >= this.templateHeightInCells
        )
        {
            this.invalidate("blockedCells", "Célula fora do modelo de terreno");
        }
        const key = `${cell.columnIndex},${cell.rowIndex}`;
        if (seen.has(key))
        {
            this.invalidate("blockedCells", "Célula bloqueada duplicada");
        }
        seen.add(key);
    }
});
