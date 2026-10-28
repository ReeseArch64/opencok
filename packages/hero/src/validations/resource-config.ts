import { z } from "zod";
import type { HeroResourceConfigResponse } from "@opencok/hero/contracts/responses/resource-config";
import { field } from "@opencok/messages/validations/response";

export const heroResourceConfigSchema = z.strictObject({
    newHeroVersion: field.string,
    newHeroMd5Android: field.string,
}) satisfies z.ZodType<HeroResourceConfigResponse>;
