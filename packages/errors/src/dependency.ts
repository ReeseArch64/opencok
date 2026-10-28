export class DependencyError extends Error
{
    constructor(readonly dependency: string)
    {
        super(`${dependency} unavailable`);
    }
}
