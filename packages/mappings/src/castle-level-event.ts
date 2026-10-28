import { num, text, type Row } from "@opencok/contracts/rows";
import { sfs, Type, type Fields } from "@opencok/messages/sfs";
import { castleLevelStateSchema } from "@opencok/validations/castle-level-event";
import { validateFields } from "@opencok/messages/validations/fields";

export function castleLevelState(row: Row): Fields
{
    return validateFields(castleLevelStateSchema, {
        uid: sfs.string(text(row, "uid")),
        level: sfs.int(num(row, "level")),
        lvReward: sfs.int(num(row, "lv_reward")),
        share_reward: {
            type: Type.IntArray,
            value: Array.from({ length: 7 }, (_, i) => num(row, `share_reward_${i}`)),
        },
    });
}
