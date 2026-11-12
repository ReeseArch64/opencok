import { randomUUID } from "node:crypto";
import { Schema } from "mongoose";

export const mongoDocumentFields = {
    publicId: {
        type: Schema.Types.UUID,
        required: true,
        default: randomUUID,
        immutable: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        immutable: true,
    },
    updatedAt: { type: Date, required: true, default: Date.now },
    deletedAt: { type: Date, default: null },
    archivedAt: { type: Date, default: null },
};
