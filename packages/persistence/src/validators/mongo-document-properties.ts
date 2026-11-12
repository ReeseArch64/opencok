export const mongoDocumentProperties = {
    _id: { bsonType: "objectId" },
    publicId: { bsonType: "binData" },
    createdAt: { bsonType: "date" },
    updatedAt: { bsonType: "date" },
    deletedAt: { bsonType: ["date", "null"] },
    archivedAt: { bsonType: ["date", "null"] },
    __v: { bsonType: "int" },
};
