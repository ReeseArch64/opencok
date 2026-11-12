import { mongoDocumentProperties } from "./mongo-document-properties";
import { mongoUuidExpression } from "./mongo-uuid-expression";

const ruleIds = {
    $map: {
        input: "$resourceRules",
        as: "rule",
        in: {
            $convert: {
                input: "$$rule.configurationPublicId",
                to: "string",
                format: "uuid",
                onError: null,
                onNull: null,
            },
        },
    },
};

export const worldPopulationConfigurationDocumentValidator = {
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
            "configurationVersion",
            "maximumActiveDeposits",
            "populationCheckIntervalSeconds",
            "resourceRules",
        ],
        properties: {
            ...mongoDocumentProperties,
            worldRegionId: { bsonType: "objectId" },
            configurationVersion: {
                bsonType: "int",
                minimum: 1,
                maximum: 2147483647,
            },
            maximumActiveDeposits: {
                bsonType: "int",
                minimum: 1,
                maximum: 1440000,
            },
            populationCheckIntervalSeconds: {
                bsonType: "int",
                minimum: 1,
                maximum: 2147483647,
            },
            resourceRules: {
                bsonType: "array",
                minItems: 1,
                maxItems: 60,
                items: {
                    bsonType: "object",
                    additionalProperties: false,
                    required: ["configurationPublicId", "targetActiveDeposits"],
                    properties: {
                        configurationPublicId: { bsonType: "binData" },
                        targetActiveDeposits: {
                            bsonType: "int",
                            minimum: 1,
                            maximum: 1440000,
                        },
                    },
                },
            },
        },
    },
    $expr: {
        $and: [
            mongoUuidExpression("publicId"),
            { $not: [{ $in: [null, ruleIds] }] },
            {
                $eq: [
                    { $size: ruleIds },
                    { $size: { $setUnion: [ruleIds, []] } },
                ],
            },
            {
                $lte: [
                    { $sum: "$resourceRules.targetActiveDeposits" },
                    "$maximumActiveDeposits",
                ],
            },
        ],
    },
};
