import { monitorEventLoopDelay } from "node:perf_hooks";
import { createSchedulerResources } from "../../src/composition";
import type { SchedulerConfig } from "../../src/config";

try
{
    const config = JSON.parse(process.env.OPENCOK_SCHEDULER_TEST_CONFIG!) as {
        scheduler: SchedulerConfig;
        automatic: boolean;
    };
    const resources = createSchedulerResources(config.scheduler);
    await resources.checkPermissions();
    const lag = monitorEventLoopDelay({ resolution: 10 });
    lag.enable();
    process.on("message", (raw: unknown) => {
        if (!raw || typeof raw !== "object" || !("id" in raw))
        {
            return;
        }
        const request = raw as Record<string, unknown>;
        const run = async () => {
            if (request.operation === "run")
            {
                await resources.service.run();
                return resources.service.status();
            }
            if (request.operation === "status")
            {
                return resources.service.status();
            }
            if (request.operation === "sample")
            {
                return {
                    cpu: process.cpuUsage(),
                    memory: process.memoryUsage(),
                    eventLoopP99Ms: lag.count ? lag.percentile(99) / 1000000 : null,
                    pool: resources.poolState(),
                };
            }
            throw new Error("Unsupported synthetic scheduler command");
        };
        void run().then(
            (value) => process.send?.({ type: "reply", id: request.id, value }),
            () => process.send?.({ type: "reply", id: request.id, error: true }),
        );
    });
    process.once("SIGTERM", () => {
        void resources.close().then(() => {
            lag.disable();
            process.exit(0);
        });
    });
    process.send?.({ type: "ready" });
    if (config.automatic)
    {
        void resources.service.start();
    }
}
catch
{
    process.send?.({ type: "failed" });
    process.exit(1);
}
