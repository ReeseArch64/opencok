import type { DataSourceOptions } from "typeorm";

export type PostgresOptions = Pick<
    Extract<DataSourceOptions, { type: "postgres"; }>,
    "host" | "port" | "username" | "password" | "ssl"
>;
