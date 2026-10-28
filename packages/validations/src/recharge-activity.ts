import { z } from "zod";
import type { RechargeActivityLoginResponse } from "@opencok/contracts/responses/recharge-activity";
import { field } from "./response";

export const rechargeActivityLoginSchema = z.strictObject({
    new_sercum_little_time: field.long.optional(),
    newSerCumRechargeTotal: field.long,
    newSerCumVersion: field.string,
    newSerCumServerList: field.string,
}) satisfies z.ZodType<RechargeActivityLoginResponse>;
