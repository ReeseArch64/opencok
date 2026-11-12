import type { z } from "zod";
import type { cityCreateValidator } from "../validators/city";

export type CreateCity = z.input<typeof cityCreateValidator>;
