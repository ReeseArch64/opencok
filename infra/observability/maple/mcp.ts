import { MapleCli } from "./mcp-cli";
import { MapleMcpProtocol } from "./mcp-protocol";
import { BoundedCommandRunner } from "./mcp-runner";
import { MapleMcpStdio } from "./mcp-stdio";

try
{
    const cli = new MapleCli(new BoundedCommandRunner(), process.env.MAPLE_CONTAINER);
    const server = new MapleMcpStdio(new MapleMcpProtocol(cli));

    await server.run(process.stdin, process.stdout);
}
catch
{
    process.stderr.write("Local Maple MCP stopped.\n");
    process.exitCode = 1;
}
