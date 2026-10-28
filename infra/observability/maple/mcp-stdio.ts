import { once } from "node:events";
import type { Writable } from "node:stream";
import { mcpLimits } from "./mcp-contracts";
import type { McpResponse } from "./mcp-contracts";
import { MapleMcpProtocol } from "./mcp-protocol";

export class MapleMcpStdio
{
    public constructor(private readonly protocol: MapleMcpProtocol)
    {}

    public async run(input: AsyncIterable<Uint8Array>, output: Writable): Promise<void>
    {
        let pending = Buffer.alloc(0);
        let oversized = false;

        const respond = async (response: McpResponse | undefined) => {
            if (response && !output.write(`${JSON.stringify(response)}\n`))
            {
                await once(output, "drain");
            }
        };

        for await (const chunk of input)
        {
            let start = 0;

            while (start < chunk.length)
            {
                const newline = chunk.indexOf(10, start);
                const end = newline === -1 ? chunk.length : newline;
                const part = chunk.subarray(start, end);

                if (!oversized)
                {
                    if (pending.length + part.length > mcpLimits.inputBytes)
                    {
                        oversized = true;
                        pending = Buffer.alloc(0);
                    }
                    else
                    {
                        pending = Buffer.concat([pending, part]);
                    }
                }

                if (newline !== -1)
                {
                    await respond(
                        oversized
                            ? this.protocol.error(-32600, "Request too large")
                            : await this.protocol.handle(pending.toString("utf8")),
                    );
                    pending = Buffer.alloc(0);
                    oversized = false;
                }

                start = end + 1;
            }
        }

        if (oversized || pending.length > 0)
        {
            await respond(this.protocol.error(-32700, "Incomplete request"));
        }
    }
}
