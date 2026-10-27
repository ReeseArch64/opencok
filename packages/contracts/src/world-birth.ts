export interface WorldBirthRules {
  readonly priorities: readonly { readonly id: number; readonly areas: readonly number[] }[];
  readonly limits: readonly number[];
  readonly side: number;
}
export interface WorldBirthState {
  readonly schema: 1;
  version: number;
  priority: number;
  round: number;
  phase: 0 | 1 | 2;
  epoch: string;
  limit: number;
  counts: Record<string, number>;
}
