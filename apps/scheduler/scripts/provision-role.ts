import { Pool } from "pg";
import { provisionSchedulerRole } from "./scheduler-role-provisioning";

function required(name: string): string
{
    const value = process.env[name];
    if (!value)
    {
        throw new Error("Missing scheduler provisioning configuration");
    }

    return value;
}

async function main(): Promise<void>
{
    const kingdom = new Pool({
        connectionString: required("SCHEDULER_PROVISION_ADMIN_URL"),
        max: 1,
        connectionTimeoutMillis: 5000,
        statement_timeout: 10000,
    });
    try
    {
        await provisionSchedulerRole({
            kingdom,
            kingdomId: Number(required("KINGDOM_ID")),
            role: required("SCHEDULER_PROVISION_ROLE"),
            password: required("SCHEDULER_PROVISION_PASSWORD"),
        });
        process.stdout.write(
            "Scheduler role provisioned; verify restricted runtime readiness before cutover.\n",
        );
    }
    finally
    {
        await kingdom.end();
    }
}

main().catch(() => {
    process.stderr.write(
        "Scheduler provisioning failed; inspect operator configuration and role state.\n",
    );
    process.exitCode = 1;
});
