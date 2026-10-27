import { string } from "@opencok/mappings/reconnect-march-values";
import { long } from "@opencok/mappings/reconnect-march-values";
import { integer } from "@opencok/mappings/reconnect-march-values";
import { validateFields } from "@opencok/mappings/validation";
import { reconnectMarchGeneralSchema } from "@opencok/hero/validations/reconnect-march-general";
import type { Row } from "@opencok/contracts/rows";
import type { SavedMarchArmy } from "@opencok/messages/world-resource-army";

import { sfs, Type, type Fields } from "@opencok/messages/sfs";

import { javaHashMapOrder } from "@opencok/rules/java-hash-map-order";

function serializereconnectMarchGeneral(
  general: NonNullable<SavedMarchArmy["general"]>,
  skills: readonly Row[],
  now: bigint,
): Fields {
  const result: Fields = {
    userId: sfs.string(string(general.owner)),
    generalId: sfs.string(String(integer(general.id))),
    level: sfs.int(integer(general.level)),
  };
  const index = new Map(
    skills
      .filter((row) => row.uid === general.owner && integer(row.newGeneralId) === general.id)
      .map((row) => [string(row.skillId), row]),
  );
  const active = javaHashMapOrder(index.keys()).filter((id) => {
    const row = index.get(id)!;

    return integer(row.stat) === 3 && now <= long(row.actTime);
  });

  if (active.length) {result.skillList = { type: Type.StringArray, value: active };}

  return result;
}

export function reconnectMarchGeneral(
  ...args: Parameters<typeof serializereconnectMarchGeneral>
): Fields {
  return validateFields(reconnectMarchGeneralSchema, serializereconnectMarchGeneral(...args));
}
