import { z } from "zod";
import { repositoryConfig } from "../config/repositories";
import { postgresIntegerMaximum } from "../constants/persistence";

export const publicIdValidator = z.uuid().transform(value => value.toLowerCase());
export const internalIdValidator = z.int().min(1).max(postgresIntegerMaximum);
export const pageQueryValidator = z.strictObject({
    offset: z.int().min(0).max(postgresIntegerMaximum).default(0),
    limit: z.int().min(1).max(repositoryConfig.maximumPageLimit).default(
        repositoryConfig.defaultPageLimit,
    ),
});
export const cacheTtlValidator = z.int().min(1).max(postgresIntegerMaximum);
