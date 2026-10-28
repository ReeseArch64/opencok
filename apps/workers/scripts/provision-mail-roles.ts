import { Pool } from "pg";
import { provisionMailWorkerRoles } from "./mail-role-provisioning";

function required(name: string): string
{
    const value = process.env[name];
    if (!value)
    {
        throw new Error("Missing mail worker provisioning configuration");
    }

    return value;
}

async function main(): Promise<void>
{
    const kingdom = new Pool({
        connectionString: required("MAIL_PROVISION_KINGDOM_ADMIN_URL"),
        max: 1,
        connectionTimeoutMillis: 5000,
        statement_timeout: 10000,
    });
    const global = new Pool({
        connectionString: required("MAIL_PROVISION_GLOBAL_ADMIN_URL"),
        max: 1,
        connectionTimeoutMillis: 5000,
        statement_timeout: 10000,
    });
    try
    {
        await provisionMailWorkerRoles({
            kingdom,
            global,
            kingdomId: Number(required("KINGDOM_ID")),
            kingdomRole: required("MAIL_PROVISION_KINGDOM_ROLE"),
            globalRole: required("MAIL_PROVISION_GLOBAL_ROLE"),
            password: required("MAIL_PROVISION_PASSWORD"),
        });
        process.stdout.write(
            "Mail worker roles provisioned; verify restricted runtime readiness before cutover.\n",
        );
    }
    finally
    {
        await Promise.all([kingdom.end(), global.end()]);
    }
}

main().catch(() => {
    process.stderr.write(
        "Mail worker provisioning failed; inspect operator configuration and role state.\n",
    );
    process.exitCode = 1;
});
