import { z } from "zod";
import { Type, type Value } from "../sfs.ts";

function tagged<T extends Type, S extends z.ZodType>(type: T, value: S)
{
    return z.strictObject({ type: z.literal(type), value });
}

const integer = (minimum: number, maximum: number) => z.number().int().min(minimum).max(maximum);

const floating = z.custom<number>((value) => typeof value === "number");

const long = z.bigint().min(-9223372036854775808n).max(9223372036854775807n);

const string = z.string().refine((value) => Buffer.byteLength(value, "utf8") <= 32767);

const key = z.string().refine((value) => Buffer.byteLength(value, "utf8") <= 255);

export function wireRecord<S extends z.ZodType>(keys: z.ZodType<string, string>, schema: S)
{
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

export const wire = {
    null: tagged(Type.Null, z.null()),
    bool: tagged(Type.Bool, z.boolean()),
    byte: tagged(Type.Byte, integer(-128, 127)),
    short: tagged(Type.Short, integer(-32768, 32767)),
    int: tagged(Type.Int, integer(-2147483648, 2147483647)),
    long: tagged(Type.Long, long),
    float: tagged(Type.Float, floating),
    double: tagged(Type.Double, floating),
    string: tagged(Type.String, string),
    object: <S extends z.ZodType>(schema: S) => tagged(Type.Object, schema),
    array: <S extends z.ZodType>(schema: S) => tagged(Type.Array, z.array(schema).max(32767)),
};

export const wireValue: z.ZodType<Value> = z.lazy(() =>
    z.discriminatedUnion("type", [
        wire.null,
        wire.bool,
        wire.byte,
        wire.short,
        wire.int,
        wire.long,
        wire.float,
        wire.double,
        wire.string,
        tagged(
            Type.Bytes,
            z.instanceof(Buffer).refine((value) => value.length <= 4 * 1024 * 1024),
        ),
        tagged(Type.BoolArray, z.array(z.boolean()).max(32767)),
        tagged(Type.ShortArray, z.array(integer(-32768, 32767)).max(32767)),
        tagged(Type.IntArray, z.array(integer(-2147483648, 2147483647)).max(32767)),
        tagged(Type.LongArray, z.array(long).max(32767)),
        tagged(Type.FloatArray, z.array(floating).max(32767)),
        tagged(Type.DoubleArray, z.array(floating).max(32767)),
        tagged(Type.StringArray, z.array(string).max(32767)),
        wire.array(wireValue),
        wire.object(wireFields),
    ])
);

export const wireFields = wireRecord(key, wireValue);
