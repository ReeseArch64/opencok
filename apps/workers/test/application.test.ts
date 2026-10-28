import { expect, test } from "bun:test";
import { connect } from "node:net";
import { once } from "node:events";
import { MailIntegrationWorker } from "@opencok/mail/services/integration-worker";
import { MailWorkerApplication } from "../src/application";

test("worker readiness and shutdown drain admitted work while closing incomplete health connections", async () => {
    const entered = Promise.withResolvers<void>();
    const delivered = Promise.withResolvers<number>();
    let closed = 0;
    let checked = 0;
    const worker = new MailIntegrationWorker({
        gift: {
            deliver: () => {
                entered.resolve();
                return delivered.promise;
            },
            backlog: async () => ({ pending: 0, limited: false, oldestAt: null }),
        },
        report: () => {},
    });
    const app = new MailWorkerApplication({
        worker,
        check: async () => {
            checked++;
        },
        closeResources: async () => {
            closed++;
        },
        host: "127.0.0.1",
        port: 0,
    });
    await app.start();
    await entered.promise;
    const address = app.server.address();
    if (!address || typeof address === "string")
    {
        throw new Error("Missing worker health port");
    }
    const origin = `http://127.0.0.1:${address.port}`;
    const connection = connect(address.port, "127.0.0.1");
    try
    {
        await once(connection, "connect");
        connection.write("GET /health/live HTTP/1.1\r\nHost: localhost\r\n");
        expect((await fetch(`${origin}/health/live`)).status).toBe(200);
        expect((await fetch(`${origin}/health/ready`)).status).toBe(503);
        expect((await fetch(`${origin}/unknown`)).status).toBe(404);
        const closing = app.close();
        expect((await fetch(`${origin}/health/live`)).status).toBe(503);
        expect(closed).toBe(0);
        delivered.resolve(0);
        await closing;
        await app.close();
        expect(checked).toBe(1);
        expect(closed).toBe(1);
        expect(app.server.listening).toBe(false);
    }
    finally
    {
        connection.destroy();
        delivered.resolve(0);
        await app.close();
    }
});
