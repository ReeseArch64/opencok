export interface RewardPreviewResponse {
  readonly type: number;
  readonly value:
    | number
    | { readonly id: string; readonly num: number }
    | { readonly isCurrentCivilization: boolean; readonly value: number };
}
