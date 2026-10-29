import { Effect } from "effect";

export function realmBackground(diagnosticLogin: boolean)
{
    return <A, E, R>(job: Effect.Effect<A, E, R>) =>
        diagnosticLogin ? Effect.void : job.pipe(Effect.forkScoped, Effect.asVoid);
}
