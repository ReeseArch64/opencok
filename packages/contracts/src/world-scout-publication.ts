import type { Row } from "./rows";
export interface WorldScoutMailSnapshot {
  kingdomId: number;
  realm: number;
  mail?: Row;
}
export type WorldScoutMailReader = (
  recipient: string,
  mailUid: string,
) => Promise<WorldScoutMailSnapshot>;
