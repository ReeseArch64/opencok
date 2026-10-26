import { sfs, type Fields } from "@opencok/messages/sfs";
import { rechargeFeedbackSchema } from "@opencok/validations/recharge-feedback";
import { validateFields } from "./validation";
export function rechargeFeedbackView(
  tables: readonly Fields[],
  qualified: readonly boolean[],
): Fields {
  if (tables.length !== qualified.length)
    throw new Error("Mismatched recharge feedback projection");
  return validateFields(rechargeFeedbackSchema, {
    daily_tab: sfs.array(tables.map((row) => sfs.object(row))),
    daily_bool: sfs.array(qualified.map((value) => sfs.bool(value))),
  });
}
