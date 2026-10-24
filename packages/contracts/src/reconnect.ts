import type { Row } from "./rows.ts";

export interface ReconnectBaseState {
  profile: Row | undefined;
  armies: readonly Row[];
}
