import { MapleTool } from "./mcp-contracts";
import type { CommandRunner, MapleQuery } from "./mcp-contracts";
import { MapleValidation } from "./mcp-validation";

const commands = {
    [MapleTool.ListServices]: "services",
    [MapleTool.SearchLogs]: "logs",
    [MapleTool.SearchTraces]: "traces",
};

export class MapleCli
{
    public constructor(
        private readonly runner: CommandRunner,
        private readonly container = "opencok-maple-1",
    )
    {
        MapleValidation.container(container);
    }

    public async query(query: MapleQuery): Promise<string>
    {
        const validated = MapleValidation.query(query);
        const command = [
            "docker",
            "exec",
            this.container,
            "maple",
            commands[validated.name],
            "--local",
            "--format=json",
        ];

        for (const [key, value] of Object.entries(validated.arguments))
        {
            if (key === "errors")
            {
                if (value)
                {
                    command.push("--errors");
                }
            }
            else
            {
                command.push(`--${key.replaceAll("_", "-")}=${value}`);
            }
        }

        const output = await this.runner.run(command);

        return JSON.stringify(JSON.parse(output));
    }
}
