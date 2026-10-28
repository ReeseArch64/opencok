import type { Row } from "@opencok/contracts/rows";

export interface GeneralWorldSnapshot
{
    moved: boolean;
    generals: readonly Row[];
    statuses: readonly Row[];
    equipment: readonly Row[];
    offices: readonly Row[];
}
