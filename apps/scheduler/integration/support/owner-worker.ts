import { monitorEventLoopDelay } from "node:perf_hooks";
import { createDatabase } from "@opencok/drizzle";
import { ActivityDeadlineController } from "@opencok/queues/controllers/deadline";
import type { ActivityDeadlineDispatcher } from "@opencok/queues/contracts/deadline";
import { dueActivities, unregisteredActivities } from "@opencok/repositories/timed-activity";
import { fenceRealmTransaction } from "@opencok/repositories/realm-authority";
import { CivilizationScienceDomain } from "@opencok/research/services/civilization";
import { decode, encode } from "@opencok/messages/sfs";
import { createRealmActivityDeadlineDispatcher } from "../../../server/src/composition/activity-deadlines";
import { createRealmResearchDomain } from "../../../server/src/composition/research";
import {
    createRealmTrainingDomain,
    createRealmHospitalDomain,
    createRealmFortificationDomain,
} from "../../../server/src/composition/troops";
import { createRealmEquipmentDomains } from "../../../server/src/composition/equipment";
import { ActivityRecoveryJob } from "../../../server/src/activity-recovery-job";
import { cityHarness } from "../../../server/integration/support/city";

export interface OwnerProcessConfig
{
    kingdomId: number;
    connection: Parameters<typeof createDatabase>[1];
    secret: string;
    seed: boolean;
    now?: number;
    port?: number;
}

export type RecoveryFactory = (options: {
    harness: Awaited<ReturnType<typeof cityHarness>>;
    dispatcher: ActivityDeadlineDispatcher;
    now: () => number;
}) => Pick<ActivityRecoveryJob, "run">;

export async function runOwnerProcess(config: OwnerProcessConfig, recoveryFactory?: RecoveryFactory)
{
    const equipment = createRealmEquipmentDomains();
    const h = await cityHarness(
        [
            createRealmResearchDomain(),
            createRealmTrainingDomain(),
            createRealmHospitalDomain(),
            createRealmFortificationDomain(),
            equipment.equipment,
            equipment.workshop,
            new CivilizationScienceDomain(),
        ],
        false,
        undefined,
        100,
        {
            connection: config.connection,
            kingdomId: config.kingdomId,
            seed: config.seed,
            now: config.now ?? Date.now(),
            queueTypes: [0, 1, 2, 3, 6, 8, 9, 10, 11, 12, 17, 19],
        },
    );
    let clock = config.now;
    let available = true;
    let afterCommitDelayMs = 0;
    const now = () => clock ?? Date.now();
    const syncClock = () => {
        h.clock.now = now();
    };
    const actual = createRealmActivityDeadlineDispatcher(
        h.service,
        h.handlers.domains,
        () => h.authority.assertReady(),
        () => h.db.db.transaction((tx) => fenceRealmTransaction(tx, h.authority)),
    );
    const dispatcher: ActivityDeadlineDispatcher = {
        capabilities: actual.capabilities,
        restore: async (snapshot) => {
            syncClock();
            return actual.restore(snapshot);
        },
        finish: async (snapshot) => {
            syncClock();
            return actual.finish(snapshot);
        },
    };
    const controller = new ActivityDeadlineController({
        kingdomId: config.kingdomId,
        signingSecret: config.secret,
        dispatcher,
        ready: () => available,
        timeoutMs: 5000,
        maxConcurrent: 4,
    });
    const job = recoveryFactory?.({ harness: h, dispatcher, now }) ?? new ActivityRecoveryJob(
        () => h.authority.assertReady(),
        () => [...h.handlers.domains.keys()],
        (types, limit, owner, after) => unregisteredActivities(h.db.db, types, limit, owner, after),
        (types, at, limit, owner, after) => dueActivities(h.db.db, types, at, limit, owner, after),
        (_owner, _operation, _queue, snapshot) => dispatcher.restore(snapshot),
        (_owner, _command, _params, snapshot) => dispatcher.finish(snapshot),
        (event) => process.send?.({ type: "failure", event }),
        now,
    );
    const server = Bun.serve({
        hostname: "127.0.0.1",
        port: config.port ?? 0,
        async fetch(request)
        {
            const response = await controller.handle(request);
            if (response.ok)
            {
                const result = await response.clone().json() as Record<string, unknown>;
                if (result.operation !== "capabilities")
                {
                    process.send?.({ type: "dispatch", ...result, at: performance.now() });
                    if (result.result === "applied" && afterCommitDelayMs)
                    {
                        await Bun.sleep(afterCommitDelayMs);
                    }
                }
            }
            return response;
        },
    });
    const lag = monitorEventLoopDelay({ resolution: 10 });
    lag.enable();
    process.on("message", (raw: unknown) => {
        if (!raw || typeof raw !== "object" || !("id" in raw))
        {
            return;
        }
        const request = raw as Record<string, unknown>;
        const run = async () => {
            syncClock();
            if (request.operation === "clock")
            {
                clock = typeof request.now === "number" ? request.now : undefined;
                return;
            }
            if (request.operation === "control")
            {
                available = request.available !== false;
                afterCommitDelayMs = Number(request.afterCommitDelayMs ?? 0);
                return;
            }
            if (request.operation === "run" || request.operation === "recover")
            {
                await job.run(typeof request.owner === "string" ? request.owner : undefined);
                return;
            }
            if (request.operation === "command" || request.operation === "timed")
            {
                const fields = decode(Buffer.from(String(request.body), "base64"));
                const result = request.operation === "command"
                    ? await h.command(
                        String(request.command),
                        fields,
                        String(request.owner ?? "owner"),
                    )
                    : await h.service.command(
                        String(request.owner ?? "owner"),
                        String(request.command),
                        fields,
                    );
                return Buffer.from(encode(result.body)).toString("base64");
            }
            if (request.operation === "sample")
            {
                return {
                    cpu: process.cpuUsage(),
                    memory: process.memoryUsage(),
                    eventLoopP99Ms: lag.count ? lag.percentile(99) / 1000000 : null,
                };
            }
            throw new Error("Unsupported synthetic owner command");
        };
        void run().then(
            (value) => process.send?.({ type: "reply", id: request.id, value }),
            () => process.send?.({ type: "reply", id: request.id, error: true }),
        );
    });
    process.once("SIGTERM", () => {
        available = false;
        void controller.close().then(async () => {
            server.stop(true);
            lag.disable();
            await h.close();
            process.exit(0);
        });
    });
    process.send?.({
        type: "ready",
        port: server.port,
        epoch: String(h.authority.epoch),
        types: await dispatcher.capabilities(),
    });
}

if (import.meta.main)
{
    try
    {
        await runOwnerProcess(
            JSON.parse(process.env.OPENCOK_SCHEDULER_TEST_CONFIG!) as OwnerProcessConfig,
        );
    }
    catch
    {
        process.send?.({ type: "failed" });
        process.exit(1);
    }
}
