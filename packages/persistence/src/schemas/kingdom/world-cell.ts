import { Schema } from "mongoose";
import { integerValidator } from "../../validators/integer";

export const worldCellSchema = new Schema(
    {
        columnIndex: {
            type: Number,
            required: true,
            min: 0,
            max: 1199,
            validate: integerValidator,
        },
        rowIndex: {
            type: Number,
            required: true,
            min: 0,
            max: 1199,
            validate: integerValidator,
        },
    },
    { _id: false, strict: "throw" },
);
