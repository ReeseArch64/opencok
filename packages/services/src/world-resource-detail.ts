import { decodeLegacyJsonArray } from "@opencok/messages/legacy-json";
import { fields, ProtocolError, Type } from "@opencok/messages/sfs";

export function restoredResourcePlunder(
  source: string | null,
  pointType: number,
): { value?: number }[] {
  if (!Number.isInteger(pointType) || pointType < -2147483648 || pointType > 2147483647)
    {throw new ProtocolError();}

  if (source === null) {return [];}

  if (typeof source !== "string" || source.length > 2048) {throw new ProtocolError();}

  const values = decodeLegacyJsonArray(source);

  if (pointType === 18 || pointType === 19 || values.length !== 1) {return values.map(() => ({}));}

  const entry = fields(values[0]);
  const value = entry.v;

  if (value === undefined) {return [{}];}

  if (value.type !== Type.Int) {throw new ProtocolError();}

  return [{ value: value.value as number }];
}
