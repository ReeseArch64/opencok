import type { Row } from "./rows";

export interface ActivityOperatorsSnapshot
{
    profile?: Row;
    server: Row;
    buildings: readonly Row[];
    target?: Row;
    recall?: Row;
    comeback?: Row;
    country: string;
    groupBuys: readonly Row[];
}
