import { invalid } from "@opencok/mappings/reconnect-values";

import { validateFields } from "@opencok/mappings/validation";
import { reconnectGeneralsSchema } from "@opencok/hero/validations/reconnect-generals";

import { sfs, type Fields } from "@opencok/messages/sfs";
import type { OwnGeneralSnapshot } from "@opencok/hero/contracts/reconnect-generals";
import { generalInfo } from "@opencok/hero/mappings/profile-generals";

function serializeReconnectGenerals(generals: readonly OwnGeneralSnapshot[]): Fields {
  if (generals.length > 32767) {return invalid();}

  return {
    userGenerals: sfs.array(
      generals.map((general) =>
        sfs.object({
          ...generalInfo(general),
          abilityIndex: sfs.int(general.abilityIndex),
        }),
      ),
    ),
  };
}

export function reconnectGenerals(...args: Parameters<typeof serializeReconnectGenerals>): Fields {
  return validateFields(reconnectGeneralsSchema, serializeReconnectGenerals(...args));
}
