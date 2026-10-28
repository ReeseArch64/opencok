import { z } from "zod";
import { blankToUndefined, validateEnvironment } from "./validation";

export const postgresUrl = z.url({ protocol: /^postgres(ql)?$/ }).refine((value) => {
    try
    {
        const parsed = new URL(value);

        return !!parsed.hostname && parsed.pathname.length > 1;
    }
    catch
    {
        return false;
    }
});

export const databaseSchema = z
    .object({
        POSTGRES_USER: z.preprocess(blankToUndefined, z.string().min(1).default("postgres")),
        POSTGRES_PASSWORD: z.preprocess(
            (value) => (value === "" ? undefined : value),
            z.string().min(1).optional(),
        ),
        DATABASE_ROLE: z.preprocess(blankToUndefined, z.enum(["global", "kingdom"]).optional()),
        DATABASE_URL: z.preprocess(blankToUndefined, postgresUrl.optional()),
        POSTGRES_ADMIN_URL: z.preprocess(blankToUndefined, postgresUrl.optional()),
    })
    .readonly();

export type DatabaseEnvironment = z.infer<typeof databaseSchema>;

export const parseDatabaseEnvironment = (source: Readonly<Record<string, string | undefined>>) =>
    validateEnvironment(databaseSchema, source);
