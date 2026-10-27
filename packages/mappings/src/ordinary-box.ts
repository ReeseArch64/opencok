import { sfs, type Fields } from "@opencok/messages/sfs";
import type { OrdinaryBoxPreviewResponse } from "@opencok/contracts/responses/ordinary-box";
import { ordinaryBoxPreviewSchema } from "@opencok/validations/ordinary-box";
import { validateFields } from "./validation";

export function ordinaryBoxPreview(row: OrdinaryBoxPreviewResponse): Fields {
  return validateFields(ordinaryBoxPreviewSchema, {
    reward_info: sfs.array(
      row.reward_info.map((item) =>
        sfs.object({ id: sfs.string(item.id), num: sfs.string(item.num) }),
      ),
    ),
    baodi_num: sfs.int(row.baodi_num),
    special: sfs.int(row.special),
    ...(row.para5 === undefined ? {} : { para5: sfs.int(row.para5) }),
  });
}
