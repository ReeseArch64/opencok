import { z } from "zod";
import type { ResponseValue } from "@opencok/contracts/responses/value";

const numeric = z.custom<number>((value) => typeof value === "number");

const key = z.string().refine((value) => Buffer.byteLength(value, "utf8") <= 255);

export const field = {
  null: z.null(),
  bool: z.boolean(),
  byte: z.number().int().min(-128).max(127),
  short: z.number().int().min(-32768).max(32767),
  int: z.number().int().min(-2147483648).max(2147483647),
  long: z.bigint().min(-9223372036854775808n).max(9223372036854775807n),
  float: numeric,
  double: numeric,
  string: z.string().refine((value) => Buffer.byteLength(value, "utf8") <= 32767),
};

export function responseRecord<S extends z.ZodType>(keys: z.ZodType<string, string>, schema: S) {
  return z.preprocess(
    (value) =>
      Object.prototype.toString.call(value) === "[object Object]"
        ? Object.entries(value as Record<string, unknown>)
        : null,
    z
      .array(z.tuple([key.pipe(keys), schema]))
      .max(32767)
      .transform((entries) => Object.fromEntries(entries) as Record<string, z.output<S>>),
  );
}

export const responseValueSchema: z.ZodType<ResponseValue> = z.lazy(() =>
  z.union([
    field.null,
    field.bool,
    numeric,
    field.long,
    field.string,
    z.instanceof(Buffer),
    z.array(responseValueSchema).max(32767),
    responseFieldsSchema,
  ]),
);

export const responseFieldsSchema = responseRecord(key, responseValueSchema);
