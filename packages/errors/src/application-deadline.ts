export class ApplicationDeadlineError extends Error
{
    public constructor()
    {
        super("Application deadline exceeded");
        this.name = "ApplicationDeadlineError";
    }
}
