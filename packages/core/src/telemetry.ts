import {
    context,
    diag,
    DiagLogLevel,
    SpanStatusCode,
    trace,
    metrics,
    type Attributes,
    type Span,
} from "@opentelemetry/api";
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import { W3CTraceContextPropagator } from "@opentelemetry/core";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { AlwaysOnSampler, BatchSpanProcessor, TracerProvider } from "@opentelemetry/sdk-trace";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";
import { MeterProvider, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";

export interface TelemetryOptions
{
    endpoint?: string;
    ingestKey?: string;
    environment?: string;
    intervalMs?: number;
    slowOperationMs?: number;
}

export let telemetry: Telemetry | undefined;

export class Telemetry
{
    private readonly traces;
    private readonly logs;
    private readonly meters;
    private readonly manager = new AsyncLocalStorageContextManager().enable();
    private readonly logger;
    private readonly durations;
    private readonly events;
    private readonly active;
    private readonly reportFailure;
    private readonly reportedErrors = new WeakSet<Span>();
    public readonly tracer;
    public readonly slowOperationMs;

    public constructor(service: string, options: TelemetryOptions, report: (event: string) => void)
    {
        const endpoint = options.endpoint!.replace(/\/$/, "");
        const interval = options.intervalMs ?? 1000;
        this.slowOperationMs = options.slowOperationMs ?? 1000;
        const headers: Record<string, string> = options.ingestKey
            ? { Authorization: `Bearer ${options.ingestKey}` }
            : {};
        const resource = resourceFromAttributes({
            "service.name": service,
            "service.namespace": "opencok",
            "deployment.environment.name": options.environment ?? "development",
        });
        const exporter = { headers, timeoutMillis: 2000 };
        let lastFailure = 0;
        const failed = () => {
            if (Date.now() - lastFailure < 5000)
            {
                return;
            }

            lastFailure = Date.now();
            report("telemetry_export_failed");
        };
        this.reportFailure = failed;
        diag.setLogger(
            {
                error: failed,
                warn: failed,
                info()
                {},
                debug()
                {},
                verbose()
                {},
            },
            DiagLogLevel.WARN,
        );
        context.setGlobalContextManager(this.manager);
        this.meters = new MeterProvider({
            resource,
            readers: [
                new PeriodicExportingMetricReader({
                    exporter: new OTLPMetricExporter({
                        ...exporter,
                        url: `${endpoint}/v1/metrics`,
                    }),
                    exportIntervalMillis: interval,
                    exportTimeoutMillis: Math.min(interval, 2000),
                }),
            ],
        });
        this.traces = new TracerProvider({
            resource,
            sampler: new AlwaysOnSampler(),
            spanProcessors: [
                new BatchSpanProcessor({
                    exporter: new OTLPTraceExporter({ ...exporter, url: `${endpoint}/v1/traces` }),
                    scheduledDelayMillis: interval,
                    exportTimeoutMillis: 2500,
                    selfObsMeterProvider: this.meters,
                    maxQueueSize: 8192,
                    maxExportBatchSize: 256,
                }),
            ],
        });
        this.logs = new LoggerProvider({
            resource,
            processors: [
                new BatchLogRecordProcessor({
                    exporter: new OTLPLogExporter({ ...exporter, url: `${endpoint}/v1/logs` }),
                    scheduledDelayMillis: interval,
                    exportTimeoutMillis: 2500,
                    selfObsMeterProvider: this.meters,
                    maxQueueSize: 8192,
                    maxExportBatchSize: 256,
                }),
            ],
        });
        trace.setGlobalTracerProvider(this.traces);
        metrics.setGlobalMeterProvider(this.meters);
        this.tracer = this.traces.getTracer("opencok");
        this.logger = this.logs.getLogger("evlog");
        const meter = this.meters.getMeter("opencok");
        this.durations = meter.createHistogram("opencok.operation.duration", { unit: "ms" });
        this.events = meter.createCounter("opencok.events");
        this.active = meter.createUpDownCounter("opencok.operations.active");
        meter
            .createObservableGauge("process.memory.rss", { unit: "By" })
            .addCallback((result) => result.observe(process.memoryUsage().rss));
        meter
            .createObservableGauge("process.uptime", { unit: "s" })
            .addCallback((result) => result.observe(process.uptime()));
        meter.createObservableCounter("process.cpu.time", { unit: "s" }).addCallback((result) => {
            const usage = process.cpuUsage();
            result.observe(usage.user / 1_000_000, { mode: "user" });
            result.observe(usage.system / 1_000_000, { mode: "system" });
        });
    }

    public emit(record: Record<string, unknown>)
    {
        const attributes = Object.fromEntries(
            Object.entries(record).filter((entry): entry is [string, string | number | boolean] =>
                ["string", "number", "boolean"].includes(typeof entry[1])
            ),
        );
        const level = String(record.level ?? "info");
        this.logger.emit({
            body: String(record.event ?? "event"),
            severityText: level.toUpperCase(),
            severityNumber: level === "error" ? 17 : level === "warn" ? 13 : 9,
            attributes,
            context: context.active(),
        });
        const dimensions: Attributes = { event: String(record.event ?? "event"), level };
        if (typeof record.operation === "string")
        {
            dimensions.operation = record.operation;
        }
        if (record.event === "command_completed" && typeof record.command === "string")
        {
            dimensions.operation = `command.${record.command}`;
        }
        if (typeof record.outcome === "string")
        {
            dimensions.outcome = record.outcome;
        }
        this.events.add(1, dimensions);
        if (
            typeof record.durationMs === "number"
            && [
                "operation_completed",
                "operation_failed",
                "http",
                "command_completed",
                "resource_completed",
                "resource_failed",
            ].includes(String(record.event))
        )
        {
            this.durations.record(record.durationMs, dimensions);
        }
        if (record.outcome === "failure")
        {
            trace.getActiveSpan()?.setStatus({ code: SpanStatusCode.ERROR });
        }
        if (level === "error")
        {
            const span = trace.getActiveSpan();
            span?.setStatus({ code: SpanStatusCode.ERROR });
            if (span && !this.reportedErrors.has(span))
            {
                this.reportedErrors.add(span);
                span.addEvent("exception", {
                    "exception.type": String(record.reason ?? record.event ?? "operation_failed"),
                    "exception.message": `${String(record.operation ?? "service")}:${
                        String(record.event ?? "operation_failed")
                    }`,
                });
            }
        }
    }

    public inFlight(delta: number, operation: string)
    {
        this.active.add(delta, { operation });
    }

    public async flush()
    {
        try
        {
            await Promise.all([
                this.traces.forceFlush(),
                this.logs.forceFlush(),
                this.meters.forceFlush(),
            ]);
        }
        catch (error)
        {
            this.reportFailure();
            throw error;
        }
    }

    public async close()
    {
        try
        {
            const results = await Promise.allSettled([
                this.traces.shutdown(),
                this.logs.shutdown(),
            ]);
            await this.meters.shutdown();
            if (results.some((result) => result.status === "rejected"))
            {
                this.reportFailure();
            }
        }
        finally
        {
            this.manager.disable();
            context.disable();
            trace.disable();
            metrics.disable();
            diag.disable();
            if (telemetry === this)
            {
                telemetry = undefined;
            }
        }
    }
}

export function configureTelemetry(
    service: string,
    options: TelemetryOptions,
    report: (event: string) => void,
)
{
    if (!options.endpoint)
    {
        return undefined;
    }
    if (telemetry)
    {
        throw new Error("Telemetry is already initialized");
    }

    telemetry = new Telemetry(service, options, report);

    return telemetry;
}

export function traceContext()
{
    const span = trace.getActiveSpan()?.spanContext();

    return span ? { traceId: span.traceId, spanId: span.spanId } : {};
}

export const tracePropagation = new W3CTraceContextPropagator();
