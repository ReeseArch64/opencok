export abstract class CommandDomain
{
    public abstract readonly commands: readonly string[];

    public handles(command: string): boolean
    {
        return this.commands.includes(command);
    }
}
