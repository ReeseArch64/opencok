# Mail contracts

This workspace initially owns only the existing `AvatarSystemMail` declaration,
relocated unchanged to `src/contracts/system-mail.ts` in
[#653](https://github.com/ReeseArch64/opencok/issues/653). Tasks needs this leaf
contract for daily rollover mail without depending on broad shared Contracts.
The historical interface name is retained. There are no runtime side effects,
mail delivery implementation, database schema or new external dependencies here.
Avatar/postbox workflow migration remains tracked by #552/#553 and #558 W11.

## Compatibility and retirement

`contracts/src/files.ts` imports and re-exports the same declaration, and embeds it
in its avatar contracts. Mail owns retirement of that facade under #558 W20.
Migrate these 22 direct external consumers, verify the remaining avatar public
exports and then remove the alias:

- Contracts: `comeback`, `expedition-treasury`, `nickname-alliance`, `paid-gifts`
  (an import type expression), `reconnect`, `regional-recall`, `totem`.
- Hero Services: `hero-ranking-rewards`, `hero-score`.
- Mappings: `avatar-mail`.
- Player contracts: `nickname-persistence`.
- Repositories: `system-mail`.
- Rules: `avatar-mail`, `avatar-version`.
- Services: `continued-cost-rewards`, `egg-activity`, `expedition-stage-rewards`,
  `gold-eggs`, `local-campaign`, `red-packets`, `totem`, `treasure-excavation`.

Tasks consumes the owned declaration directly. The old and new declarations are
structurally identical, including bytes, bigint time, optional item flag and literal
alternatives. Mail/Contracts/API/realm type checks and existing PostgreSQL rollover
mail tests verify the boundary. No independent Mail test runner is needed for a
single behavior-free declaration. No player-data migration or new process is added.
