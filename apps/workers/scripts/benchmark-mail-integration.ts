import { runMailIntegrationBenchmark } from "./benchmark-mail-scenario";

const mode = process.argv[3];
if (!process.argv[2] || (mode !== "local" && mode !== "isolated"))
{
    throw new Error(
        "Usage: benchmark-mail-integration.ts /tmp/report.json local|isolated [5..20 commands] [0..500 Chat delay ms]",
    );
}
await runMailIntegrationBenchmark({
    output: process.argv[2],
    mode,
    count: Number(process.argv[4] ?? 10),
    delayMs: Number(process.argv[5] ?? 150),
});
