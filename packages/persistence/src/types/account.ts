import type { z } from "zod";
import type { accountCreateValidator } from "../validators/account";

export type CreateAccount = z.input<typeof accountCreateValidator>;
