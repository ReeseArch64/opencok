import type { Row } from "./rows";

export interface ActivityDirectorySnapshot
{
    profile?: Row;
    activities: readonly Row[];
}
