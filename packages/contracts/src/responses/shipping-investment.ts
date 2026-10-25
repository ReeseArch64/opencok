export interface ShippingInvestmentResponse {
  count: number;
  sum_count: number;
  gold: number;
  gold_reward?: Readonly<Record<string, string>>;
}
