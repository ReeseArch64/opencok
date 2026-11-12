import type { Schema } from "mongoose";

export function immutableConfiguration(schema: Schema): void
{
    schema.pre("save", function()
    {
        if (!this.isNew && this.isModified())
        {
            throw new Error("Publicações são imutáveis; crie uma nova versão");
        }
    });
    schema.pre(
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
            throw new Error("Publicações são imutáveis; crie uma nova versão");
        },
    );
    schema.pre("bulkWrite", function(operations)
    {
        if (operations.some(operation => !("insertOne" in operation)))
        {
            throw new Error("Publicações são imutáveis; crie uma nova versão");
        }
    });
}
