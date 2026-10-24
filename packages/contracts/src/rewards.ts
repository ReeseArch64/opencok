export type RewardPreview =
  | { kind: "count"; type: number; value: number }
  | { kind: "item"; type: 7 | 14; id: string; count: number }
  | { kind: "prestige"; type: 31; currentCivilization: boolean; value: number };

export type RewardRandom = (exclusiveBound: number) => number;
