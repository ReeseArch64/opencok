import { monitorEventLoopDelay } from "node:perf_hooks";
import { createMailWorkerApplication } from "../../src/composition";
import type { MailWorkerConfig } from "../../src/config";

try
{
    const config = JSON.parse(process.env.OPENCOK_MAIL_WORKER_TEST_CONFIG!) as MailWorkerConfig;
    const app = await createMailWorkerApplication(config);
    const address = app.server.address();
    if (!address || typeof address === "string")
    {
        throw new Error("Missing worker address");
    }
    const lag = monitorEventLoopDelay({ resolution: 10 });
    lag.enable();
    process.on("message", (message: unknown) => {
        if (!message || typeof message !== "object" || !("id" in message))
        {
            return;
        }
        process.send?.({
            type: "sample",
            id: message.id,
            cpu: process.cpuUsage(),
            memory: process.memoryUsage(),
            eventLoopP99Ms: lag.count ? lag.percentile(99) / 1000000 : null,
        });
    });
    process.once("SIGTERM", () => {
        void app.close().then(() => {
            lag.disable();
            process.exit(0);
        });
    });
    process.send?.({ type: "ready", port: address.port });
}
catch
{
    process.send?.({ type: "failed" });
    process.exit(1);
}
