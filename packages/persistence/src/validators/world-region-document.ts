import { WorldRegionType } from "../enums/world-region-type";
import { WorldRegionStatus } from "../enums/world-region-status";
import { mongoDocumentProperties } from "./mongo-document-properties";
import { mongoUuidExpression } from "./mongo-uuid-expression";

export const worldRegionDocumentValidator = {
    $jsonSchema: {
        bsonType: "object",
        required: [
            "_id",
            "publicId",
            "createdAt",
            "updatedAt",
            "deletedAt",
            "archivedAt",
            "worldPublicId",
            "activePopulationConfigurationId",
            "displayName",
            "regionType",
            "regionStatus",
            "minimumCellX",
            "minimumCellY",
            "maximumCellX",
            "maximumCellY",
        ],
        additionalProperties: false,
        properties: {
            ...mongoDocumentProperties,
            worldPublicId: { bsonType: "binData" },
            activePopulationConfigurationId: { bsonType: ["objectId", "null"] },
            displayName: { bsonType: "string", minLength: 1, maxLength: 64 },
            regionType: { enum: Object.values(WorldRegionType) },
            regionStatus: { enum: Object.values(WorldRegionStatus) },
            minimumCellX: { bsonType: "int", minimum: 1, maximum: 1200 },
            minimumCellY: { bsonType: "int", minimum: 1, maximum: 1200 },
            maximumCellX: { bsonType: "int", minimum: 1, maximum: 1200 },
            maximumCellY: { bsonType: "int", minimum: 1, maximum: 1200 },
        },
    },
    $expr: {
        $and: [
            mongoUuidExpression("publicId"),
            mongoUuidExpression("worldPublicId"),
            {
                $or: [
                    { $eq: ["$activePopulationConfigurationId", null] },
                    { $eq: ["$regionType", WorldRegionType.ResourceArea] },
                ],
            },
            { $lte: ["$minimumCellX", "$maximumCellX"] },
            { $lte: ["$minimumCellY", "$maximumCellY"] },
            { $lte: [{ $strLenBytes: "$displayName" }, 64] },
            { $gt: [{ $strLenCP: { $trim: { input: "$displayName" } } }, 0] },
        ],
    },
};
