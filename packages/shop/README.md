# In-game shop

`@opencok/shop` owns the maintained in-game mall and NPC trading workflows.
`apps/server` composes the Services, repositories, realm authority and existing
inventory grant planner. Real-money orders and purchased-entitlement delivery
belong to billing/payments; event exchanges remain separate.

| Responsibility                                  | Entrypoints                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------------- |
| State, repository and planner ports             | `contracts/shops`, `contracts/trade`, `contracts/inventory-grant-planner` |
| Eligibility, prices, counters and offer windows | `rules/shops`                                                             |
| Native offer serialization                      | `mappings/shops`                                                          |
| Mall and NPC trading commands                   | `services/shops`, `services/trade`                                        |
| Atomic persistence adapters                     | `repositories/shops`, `repositories/trade`                                |

`ShopService` handles `mall.info`, `mall.info.type`, `mall.data` and
`shoppingMall.buy`. `TradeService` handles `trade.info`, `trade.exchange` and
`trade.cancel`. Both constructors receive the existing inventory grant planner
as their third argument. The planner remains owned by inventory; this package's
production source has no dependency on the horizontal Services workspace.

The repository adapters retain the current fenced realm transactions, inventory
postings, receipts, outbox, purchase counters and stock semantics. Prices,
eligibility gates, random offer selection, UTC renewal, saved rows and wire fields
are unchanged. Unsupported currencies, equipment and specialized effects retain
their existing rejection behavior.

Shared inventory contracts/rules/mappings and transactional primitives remain in
their existing packages. Versioned `shop_new` and `trade` catalogs still enter
through the existing `Rules` loader; catalog authoring and generic command routing
remain later #558 work. No background process or runtime authority is introduced.

Run `bun run --cwd packages/shop test` and
`bun run --cwd packages/shop check-types`. The root package suite includes these
tests. PostgreSQL and transport composition scenarios remain in
`apps/server/integration`: `shops`, `shop-trade-recovery`, `continued-cost`,
`campaign-producers` and `core`. They exercise duplicate/concurrent commands,
limits, reply loss, rollback, restart, stale authority and two-realm isolation.
Native client tracks other than the maintained v12.06.0 contract are unverified;
synthetic SFS tests do not prove APK interoperability.

[#593](https://github.com/ReeseArch64/opencok/issues/593) records the migration and
retirement of all eight previous horizontal entrypoints after their maintained
consumers moved. See the [migration register](../MIGRATION.md#shop-vertical-slice-593)
for owners and callers. Rebuild the existing realm artifact to deploy; rollback
uses its predecessor against the unchanged database schema and saved state.
