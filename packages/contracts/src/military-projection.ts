import type { Row } from "./rows";
import type { Fields } from "@opencok/messages/sfs";

export interface MilitaryProjection
{
    wounded(row: Row): Fields;
    fortification(row: Row): Fields;
    snapshot(armies: readonly Row[], hospital: readonly Row[], forts: readonly Row[]): Fields;
}
