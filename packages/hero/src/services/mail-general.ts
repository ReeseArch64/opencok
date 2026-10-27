import { fields, Type, type Value } from "@opencok/messages/sfs";
import { LegacyJsonError } from "@opencok/messages/legacy-json";

export function removeGeneralSkills(value: Value | undefined, skipNull = true) {
  if (value === undefined) {return;}

  if (value.type !== Type.Array) {throw new LegacyJsonError();}

  for (const general of value.value as Value[]) {
    if (general.type === Type.Null && skipNull) {continue;}

    const object = fields(general);
    delete object.skill;
    delete object.ability;
  }
}
