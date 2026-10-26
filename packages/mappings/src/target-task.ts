import { sfs, type Fields } from "@opencok/messages/sfs";
import { targetTaskSchema } from "@opencok/validations/target-task";
import { validateFields } from "./validation";
export function targetTaskView(
  rows: readonly Fields[],
  exchange: string,
  days: number,
  day: number | undefined,
  received: boolean,
): Fields {
  return validateFields(targetTaskSchema, {
    targetList: sfs.array(rows.map((row) => sfs.object(row))),
    exchangeid: sfs.string(exchange),
    day_sum: sfs.int(days),
    ...(day === undefined ? {} : { day_now: sfs.int(day) }),
    receive_mode: sfs.bool(received),
  });
}
