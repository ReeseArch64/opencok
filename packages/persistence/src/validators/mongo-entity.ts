import type { HydratedDocument, Model } from "mongoose";
import { publicIdValidator } from "./repository";

const managedFields = new Set(["_id", "__v", "createdAt", "updatedAt", "deletedAt", "archivedAt"]);

export function validateMongoInput(
    input: unknown,
    model: Model<unknown>,
    update = false,
): Record<string, unknown>
{
    if (
        input === null || typeof input !== "object" || Array.isArray(input)
        || Object.getPrototypeOf(input) !== Object.prototype
    )
    {
        throw new TypeError("Documento deve ser um objeto simples");
    }
    const entries = Object.entries(input);
    if (update && entries.length === 0)
    {
        throw new TypeError("Informe ao menos um campo");
    }
    for (const [key, value] of entries)
    {
        const path = model.schema.path(key);
        if (managedFields.has(key) || key.includes(".") || key.startsWith("$") || !path)
        {
            throw new TypeError(`Campo não permitido: ${key}`);
        }
        if (key === "publicId")
        {
            throw new TypeError("Identidade é gerada pela persistência");
        }
        if (update && path.options.immutable)
        {
            throw new TypeError(`Campo imutável: ${key}`);
        }
        if (value === undefined)
        {
            throw new TypeError(`Campo indefinido: ${key}`);
        }
        if (path.instance === "UUID" && value !== null)
        {
            publicIdValidator.parse(value);
        }
    }
    return input as Record<string, unknown>;
}

export class MongoEntityValidator<T>
{
    constructor(private readonly model: Model<T>)
    {}
    async parse(input: unknown): Promise<HydratedDocument<T>>
    {
        validateMongoInput(input, this.model as unknown as Model<unknown>);
        const document = new this.model(input);
        await document.validate();
        return document;
    }
}
