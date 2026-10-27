import { Type, type Fields, type Value } from "@opencok/messages/sfs";
import { wireFields, wireValue } from "@opencok/validations/sfs";

function dataValue(value: Value): unknown {
  if (value.type === Type.Object) {return dataFields(value.value as Fields);}

  if (value.type === Type.Array) {return (value.value as Value[]).map(dataValue);}

  return value.value;
}

function dataFields(fields: Fields): Record<string, unknown> {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, dataValue(value)]));
}

export function validateFields(schema: { parse(data: unknown): unknown }, fields: Fields): Fields {
  wireFields.parse(fields);
  schema.parse(dataFields(fields));

  return fields;
}

export function validateValue(schema: { parse(data: unknown): unknown }, value: Value): Value {
  wireValue.parse(value);
  schema.parse(dataValue(value));

  return value;
}
