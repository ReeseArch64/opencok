import { sfs, type Fields } from "@opencok/messages/sfs";
import type { ActivityOperatorResponse } from "@opencok/contracts/responses/activity-operators";
import { activityOperatorsSchema } from "@opencok/validations/activity-operators";
import { validateFields } from "./validation";

export function activityOperatorsView(rows: readonly ActivityOperatorResponse[]): Fields {
  return validateFields(activityOperatorsSchema, {
    activityList: sfs.array(
      rows.map((row) => sfs.object({ id: sfs.int(row.id), endTime: sfs.long(row.endTime) })),
    ),
  });
}
