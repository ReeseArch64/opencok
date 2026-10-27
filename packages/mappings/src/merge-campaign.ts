import { sfs, type Fields } from "@opencok/messages/sfs";
import { mergeEffectIds, type MergeEffect } from "@opencok/rules/merge-campaign";
export function mergeEffectBoard(effects: readonly MergeEffect[]): Fields {
  if (
    effects.length > 4 ||
    new Set(effects.map((effect) => effect.id)).size !== effects.length ||
    effects.some(
      (effect) =>
        !mergeEffectIds.some((id) => id === effect.id) ||
        !Number.isSafeInteger(effect.value) ||
        effect.value < 0 ||
        effect.value > 2147483647 ||
        !Number.isSafeInteger(effect.end) ||
        effect.end <= 0,
    )
  )
    throw new Error("Invalid merge effect board");
  return {
    status: sfs.array(
      effects.map((effect) =>
        sfs.object({
          effNum: sfs.int(effect.id),
          effVal: sfs.int(effect.value),
          stateId: sfs.int(effect.id),
          endTime: sfs.long(effect.end),
        }),
      ),
    ),
    clear: sfs.array(mergeEffectIds.map((id) => sfs.string(String(id)))),
  };
}
