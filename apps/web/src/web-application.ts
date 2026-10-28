import index from "./index.html";
import { PingController } from "./ping.controller.ts";

export class WebApplication
{
    public readonly server;

    public constructor(ping = new PingController())
    {
        this.server = Bun.serve({
            hostname: "0.0.0.0",
            port: 5173,
            development: process.env.NODE_ENV !== "production",
            routes: {
                "/": index,
                "/api/ping": { GET: ping.handle },
            },
            fetch()
            {
                return new Response("Not found", { status: 404 });
            },
        });
    }
}
