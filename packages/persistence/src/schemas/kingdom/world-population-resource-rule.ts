import { Schema } from "mongoose";
import { integerValidator } from "../../validators/integer";

export const worldPopulationResourceRuleSchema = new Schema(
    {
        configurationPublicId: {
            type: Schema.Types.UUID,
            required: true,
            immutable: true,
        },
        targetActiveDeposits: {
            type: Number,
            required: true,
            min: 1,
            max: 1440000,
            validate: integerValidator,
            immutable: true,
        },
    },
    { _id: false, strict: "throw" },
);
