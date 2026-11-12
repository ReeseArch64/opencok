import { ResourceSpawnJobStatus as Status } from "../enums/resource-spawn-job-status";
import { mongoDocumentProperties } from "./mongo-document-properties";
import { mongoUuidExpression } from "./mongo-uuid-expression";

export const worldResourceSpawnJobDocumentValidator = {
    $jsonSchema: {
        bsonType: "object",
        additionalProperties: false,
        required: [
            "_id",
            "publicId",
            "createdAt",
            "updatedAt",
            "deletedAt",
            "archivedAt",
            "worldRegionId",
            "sourceDepositPublicId",
            "configurationPublicId",
            "eligibleAt",
            "jobStatus",
            "attemptCount",
            "claimedAt",
            "claimExpiresAt",
            "completedAt",
            "spawnedWorldObjectPublicId",
            "lastError",
        ],
        properties: {
            ...mongoDocumentProperties,
            worldRegionId: { bsonType: "objectId" },
            sourceDepositPublicId: { bsonType: ["binData", "null"] },
            configurationPublicId: { bsonType: "binData" },
            eligibleAt: { bsonType: "date" },
            jobStatus: { enum: Object.values(Status) },
            attemptCount: { bsonType: "int", minimum: 0 },
            claimedAt: { bsonType: ["date", "null"] },
            claimExpiresAt: { bsonType: ["date", "null"] },
            completedAt: { bsonType: ["date", "null"] },
            spawnedWorldObjectPublicId: { bsonType: ["binData", "null"] },
            lastError: { bsonType: ["string", "null"], maxLength: 2000 },
        },
    },
    $expr: {
        $and: [
            mongoUuidExpression("publicId"),
            mongoUuidExpression("configurationPublicId"),
            mongoUuidExpression("sourceDepositPublicId", true),
            mongoUuidExpression("spawnedWorldObjectPublicId", true),
            {
                $cond: [
                    { $eq: ["$jobStatus", Status.Processing] },
                    {
                        $and: [
                            { $ne: ["$claimedAt", null] },
                            { $ne: ["$claimExpiresAt", null] },
                            { $gt: ["$claimExpiresAt", "$claimedAt"] },
                            { $gte: ["$claimedAt", "$eligibleAt"] },
                            { $gt: ["$attemptCount", 0] },
                        ],
                    },
                    { $eq: ["$claimExpiresAt", null] },
                ],
            },
            {
                $cond: [
                    { $eq: ["$jobStatus", Status.Completed] },
                    {
                        $and: [
                            { $ne: ["$completedAt", null] },
                            { $gte: ["$completedAt", "$eligibleAt"] },
                            { $ne: ["$spawnedWorldObjectPublicId", null] },
                            { $gt: ["$attemptCount", 0] },
                        ],
                    },
                    {
                        $and: [
                            { $eq: ["$completedAt", null] },
                            { $eq: ["$spawnedWorldObjectPublicId", null] },
                        ],
                    },
                ],
            },
            {
                $cond: [
                    { $eq: ["$jobStatus", Status.Failed] },
                    {
                        $and: [
                            { $gt: ["$attemptCount", 0] },
                            {
                                $gt: [
                                    {
                                        $strLenCP: {
                                            $trim: {
                                                input: {
                                                    $ifNull: ["$lastError", ""],
                                                },
                                            },
                                        },
                                    },
                                    0,
                                ],
                            },
                        ],
                    },
                    true,
                ],
            },
        ],
    },
};
