import type { Row } from "./rows";

export interface ExpeditionPhaseStore
{
    reconcile(
        period: Row,
        resolve: (state: { manifest?: Row; admission?: Row; }, now: bigint) => Row,
    ): Promise<Row>;
}

export interface ExpeditionActivitySnapshot
{
    profile: Row;
    state: import("./new-expedition").ExpeditionState;
}

export interface ExpeditionActivityReader
{
    read(owner: string): Promise<ExpeditionActivitySnapshot>;
}
