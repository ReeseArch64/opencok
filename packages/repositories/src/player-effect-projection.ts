import { is, sql, type SQL } from "drizzle-orm";
import { PgColumn, type PgSelect } from "drizzle-orm/pg-core";
import type { Row } from "@opencok/contracts/rows";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

type EffectQuery = Pick<PgSelect, "as"> & PromiseLike<Row[]>;

export async function readPlayerEffectProjection<T extends Record<string, EffectQuery | undefined>>(
    tx: Pick<DatabaseClient<"kingdom">, "select">,
    queries: T,
    combined: boolean,
): Promise<{ [K in keyof T]: T[K] extends EffectQuery ? Awaited<T[K]> : Row[]; }>
{
    const result: Record<string, Row[]> = {};

    if (!combined)
    {
        for (const [name, query] of Object.entries(queries))
        {
            result[name] = query ? await query : [];
        }
    }
    else
    {
        const selection: Record<string, SQL<Row[]>> = {};

        for (const [name, query] of Object.entries(queries))
        {
            if (!query)
            {
                result[name] = [];
                continue;
            }

            const source = query.as("effect_rows");
            const columns = Object.entries(source._.selectedFields).map(([key, value]) => {
                if (!is(value, PgColumn))
                {
                    throw new Error("Invalid player effect projection column");
                }

                return { key, column: value };
            });
            const values = columns.map(({ column }) =>
                column.getSQLType() === "bytea"
                    ? sql`encode(${column}, 'hex')`
                    : column.dataType === "bigint"
                    ? sql`${column}::text`
                    : sql`${column}`
            );
            selection[name] = sql<Row[]>`(select coalesce(json_agg(json_build_array(${
                sql.join(values, sql`, `)
            })), '[]'::json) from ${source})`
                .mapWith((rows: unknown[][]) =>
                    rows.map((row) =>
                        Object.fromEntries(columns.map(({ key, column }, index) => {
                            const value = row[index];

                            return [
                                key,
                                value === null ? null : column.mapFromDriverValue(
                                    column.getSQLType() === "bytea"
                                        ? Buffer.from(String(value), "hex")
                                        : value,
                                ),
                            ];
                        })) as Row
                    )
                );
        }

        Object.assign(
            result,
            (await tx.select(selection).from(sql`(values (1)) as effect_snapshot(seed)`))[0],
        );
    }

    return result as { [K in keyof T]: T[K] extends EffectQuery ? Awaited<T[K]> : Row[]; };
}
