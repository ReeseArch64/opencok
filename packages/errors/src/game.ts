export class GameError extends Error {
  constructor(
    readonly code: string,
    readonly reason?:
      | "building_shape"
      | "building_rule"
      | "role_rule"
      | "cost_rule"
      | "queue_kind"
      | "world_state",
  ) {
    super(code);
  }
}
