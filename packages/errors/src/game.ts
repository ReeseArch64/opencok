export class GameError extends Error {
  constructor(
    readonly code: string,
    readonly reason?:
      | "building_shape"
      | "building_rule"
      | "role_rule"
      | "cost_rule"
      | "config_integer"
      | "config_long"
      | "stamina_rule"
      | "boss_members_rule"
      | "icon_date_rule"
      | "general_sale_rule"
      | "account_rule"
      | "player_summary"
      | "queue_kind"
      | "world_state",
  ) {
    super(code);
  }
}
