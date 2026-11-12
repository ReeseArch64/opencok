import { z } from "zod";
import { publicIdValidator } from "./repository";
import { postgresIntegerMaximum } from "../constants/persistence";

const displayName = z.string().trim().min(1).refine(
    value => Buffer.byteLength(value) <= 64,
    "Nome deve conter até 64 bytes",
);
const level = z.int().min(1).max(postgresIntegerMaximum);
const experience = z.string().regex(/^(0|[1-9][0-9]*)$/).refine(
    value => BigInt(value) <= 9223372036854775807n,
    "Experiência fora do intervalo bigint",
);
export const characterCreateValidator = z.strictObject({
    accountPublicId: publicIdValidator,
    displayName,
    level: level.default(1),
    experience: experience.default("0"),
});
export const characterUpdateValidator = z.strictObject({
    displayName: displayName.optional(),
    level: level.optional(),
    experience: experience.optional(),
}).refine(
    value =>
        Object.keys(value).length > 0
        && Object.values(value).every(field => field !== undefined),
    "Informe ao menos um campo",
);
