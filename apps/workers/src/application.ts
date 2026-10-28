import { createServer, type Server } from "node:http";
import type { MailIntegrationWorker } from "@opencok/mail/services/integration-worker";

export interface MailWorkerApplicationOptions
{
    worker: MailIntegrationWorker;
    check(): Promise<void>;
    closeResources(): Promise<void>;
    host: string;
    port: number;
}

export class MailWorkerApplication
{
    public readonly server: Server;
    private stopping = false;
    private closing: Promise<void> | undefined;

    public constructor(private readonly options: MailWorkerApplicationOptions)
    {
        this.server = createServer({
            requestTimeout: 5000,
            headersTimeout: 5000,
            keepAliveTimeout: 1000,
            connectionsCheckingInterval: 1000,
        }, (request, response) => {
            const live = !this.stopping;
            const ready = live && this.options.worker.isReady();
            const path = request.url;

            if (request.method !== "GET" || !["/health/live", "/health/ready"].includes(path ?? ""))
            {
                response.writeHead(404).end();

                return;
            }

            response.writeHead((path === "/health/live" ? live : ready) ? 200 : 503, {
                "content-type": "application/json",
                "cache-control": "no-store",
            }).end(JSON.stringify({ live, ready, queues: this.options.worker.status() }));
        });
    }

    public async start(): Promise<void>
    {
        await this.options.check();
        await new Promise<void>((resolve, reject) => {
            this.server.once("error", reject);
            this.server.listen(this.options.port, this.options.host, () => {
                this.server.off("error", reject);
                resolve();
            });
        });
        void this.options.worker.start();
    }

    public close(): Promise<void>
    {
        return this.closing ??= this.stop();
    }

    private async stop(): Promise<void>
    {
        this.stopping = true;

        try
        {
            await this.options.worker.close();

            if (this.server.listening)
            {
                await new Promise<void>((resolve, reject) => {
                    this.server.close((error) => error ? reject(error) : resolve());
                    this.server.closeAllConnections();
                });
            }
        }
        finally
        {
            await this.options.closeResources();
        }
    }
}
