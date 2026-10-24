export class RewardPreviewDto {
  declare public readonly type: number;
  declare public readonly value:
    | number
    | { readonly id: string; readonly num: number }
    | { readonly isCurrentCivilization: boolean; readonly value: number };
}
