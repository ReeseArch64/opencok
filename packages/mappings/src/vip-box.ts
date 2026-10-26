import { sfs, type Fields } from "@opencok/messages/sfs";
import { vipBoxSchema } from "@opencok/validations/vip-box";
import { validateFields } from "./validation";
import type { VipBoxNoticeResponse } from "@opencok/contracts/responses/vip-box";
export function vipBoxNotice(row: VipBoxNoticeResponse): Fields {
  return {
    name: sfs.string(row.name),
    itemid: sfs.string(row.itemid),
    itemnum: sfs.string(row.itemnum),
  };
}
export function vipBoxView(
  row: Fields,
  history: readonly VipBoxNoticeResponse[],
  level: number,
): Fields {
  return validateFields(vipBoxSchema, {
    box_vip_list: sfs.array([sfs.object(row)]),
    show_list: sfs.array(history.map((row) => sfs.object(vipBoxNotice(row)))),
    vip_now_level: sfs.int(level),
  });
}
