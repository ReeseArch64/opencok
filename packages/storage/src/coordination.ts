import zk, { type Client } from "node-zookeeper-client";
import { DependencyError } from "@opencok/errors/dependency";
import { bounded } from "./timeout.ts";

export interface CoordinationConfig
{
    zookeeper: string;
    timeoutMs: number;
    zkPath: string;
    kingdomId: number;
}

export class Coordination
{
    private readonly client: Client;
    private registered = false;
    private expired = false;

    constructor(readonly config: CoordinationConfig)
    {
        this.client = zk.createClient(config.zookeeper, {
            sessionTimeout: 15000,
            spinDelay: 1000,
            retries: 0,
        });
        this.client.on("expired", () => {
            this.expired = true;
            this.registered = false;
        });
        this.client.on("authenticationFailed", () => {
            this.expired = true;
            this.registered = false;
        });

        this.client.on("error", () => {});
    }

    get ready()
    {
        return this.registered && !this.expired
            && this.client.getState() === zk.State.SYNC_CONNECTED;
    }

    async start()
    {
        try
        {
            await bounded(
                new Promise<void>((resolve) => {
                    this.client.once("connected", resolve);
                    this.client.connect();
                }),
                this.config.timeoutMs,
                "zookeeper",
            );
            await bounded(
                new Promise<void>((resolve, reject) => {
                    this.client.mkdirp(
                        "/opencok-experiment",
                        (error) => error ? reject(new DependencyError("zookeeper")) : resolve(),
                    );
                }),
                this.config.timeoutMs,
                "zookeeper",
            );
            await bounded(
                new Promise<void>((resolve, reject) => {
                    this.client.create(
                        this.config.zkPath,
                        Buffer.from(
                            JSON.stringify({ runtime: "bun", kingdom: this.config.kingdomId }),
                        ),
                        zk.CreateMode.EPHEMERAL,
                        (
                            error,
                        ) => (error
                            ? reject(new DependencyError("zookeeper ownership"))
                            : resolve()),
                    );
                }),
                this.config.timeoutMs,
                "zookeeper",
            );
            this.registered = true;
        }
        catch
        {
            this.client.close();

            throw new DependencyError("zookeeper");
        }
    }

    close()
    {
        this.registered = false;
        this.client.close();
    }
}
