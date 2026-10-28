# Ranking domain

[Issue #689](https://github.com/ReeseArch64/opencok/issues/689) moves existing
permanent boards and published projections into Ranking under
[domain layout policy](../../.github/ARCHITECTURE.md#domain-package-migration-convention).
The realm retains command execution and authoritative state. Reading a published
board does not own its event settlement, funding, entitlements or reward claims.

## Commands and ownership

| Commands                                    | Owned workflow                                           |
| ------------------------------------------- | -------------------------------------------------------- |
| `server.rank`, `kill.rank`, `level.rank`    | Player power, kills and level boards                     |
| `building.rank`, `silver.contribute.rank`   | Castle and material contribution boards                  |
| `alliance.rank`, `kill.al.rank`             | Alliance power and kills boards                          |
| `attributeRank.info`                        | Published attribute board selection                      |
| `paytotal.ranking`, `continuedcost.ranking` | Published payment/consumption view and privacy selection |

`src/contracts` holds query, snapshot, response and runtime ports. `src/rules`
owns candidate selection and limits. `src/services` coordinates these commands;
`src/repositories` owns PostgreSQL snapshots, realm eligibility and privacy reads.
`src/storage` owns bounded publication decoding from the injected Redis command
port. `src/mappings` and `src/validations` preserve native wire representations.
Selective wildcard exports keep pure rules separate from infrastructure imports.
The initial owned slice has 22 source modules (1,677 physical source lines), eight
package test files (1,252 lines), and no generated catalog data. Server retains
command/composition tests and a focused PostgreSQL integration suite.

The realm supplies profile checks, clock, configuration and client feature/version
checks. Alliance science effects and video projection remain with their current
owners and enter through narrow collaborators. The consumption publication loader
still calls `continuedCostRanking.board(() => cache.publishedGlobalRanking(kind))`;
it cannot bypass the existing economic owner's publication path.

## Preserved behavior

Player and alliance reads use PostgreSQL transactions with `repeatable read` and
`read only`. Candidate ordering retains explicit `COLLATE "C"`, null placement,
secondary ties and modality-specific prefetch windows. The response's own ordinal
is determined at the original stage, before presentation filtering. Banned or
missing profiles and alliances do not create a new refill query.

Castle boards retain temporary bans, duplicate castle rows and the last matching
own ordinal; permanent bans remain excluded. Fallback queries retain their
ambiguity errors and original peer ordering. Empty contribution has its existing
wire result. Alliance kills discards the last candidate even for a short result;
science capacity expansion retains the existing floating-point accumulation and
signed integer narrowing. Native strings, omitted fields, `int`/`long`/`double`
choices and field order are unchanged.

Publication adapters preserve all key names, the 100-position MGET and truncation
at the first empty position. Attribute boards retain their 151/30 limits and the
published order. Realm eligibility and profile checks execute in their original
order. Normal-realm SQLSTATE failures retain their existing false result; other
query failures are not silently converted into empty rankings.

## Migration register

| Previous location                                                               | Ranking owner                               |
| ------------------------------------------------------------------------------- | ------------------------------------------- |
| Contracts `ranking`, `alliance-ranking` and three response modules              | `contracts` and `contracts/responses`       |
| Rules `ranking`, `alliance-ranking`                                             | `rules`                                     |
| Repositories `ranking`, `ranking-building`, `ranking-realm`, `alliance-ranking` | `repositories`                              |
| Four ranking workflows embedded in GameService                                  | `services`                                  |
| Database ranking privacy read                                                   | `repositories`                              |
| Mappings and Validations `ranking`, `alliance-ranking`, `published-ranking`     | `mappings` and `validations`                |
| Storage `published-ranking`                                                     | `storage`                                   |
| Focused rule, adapter and publication unit tests                                | `tests`, included in root package discovery |

Application command/composition tests remain in Server. Shared GameService keeps
transport dispatch; Database and Cache retain integration adapters for
callers outside this extraction. Their domain-specific work delegates to the owned
implementation. Migrated standalone horizontal paths are removed after caller
migration; no copied implementation is kept.

W20 retirement remains explicit for `Database.playerRanking`, `allianceRanking`,
`rankingPrivacy`, `normalRankingRealm` and `crossRankingRealm`, and
`Cache.attributeRanking` and `publishedGlobalRanking`. Remove each adapter
only after its remaining aggregate consumers use the owned ports directly.
`GameStore` extends `RankingStore`; `GameServices` extends `RankingPublications`.
Realm eligibility also serves flower, cemetery and global celebrity workflows;
those callers migrate separately and must retain their existing eligibility checks.

Hero, Dragon, Expedition, military awards and event-specific ranking/finality
workflows retain their current owners. This delivery does not complete W12 or the
full [#558](https://github.com/ReeseArch64/opencok/issues/558) inventory, semantic
definitions, process decomposition or performance acceptance.

## Validation and operation

Run `bun run --cwd packages/ranking test`, the Server command tests and the
focused PostgreSQL integration suite alongside root package/architecture tests,
affected type checks, lint, formatting and the Server build. Synthetic SQL adapters
verify generated queries; only disposable PostgreSQL scenarios establish actual
persistence behavior. Native-device rendering and production load are separate
acceptance work.

Deploy or roll back the complete realm artifact with its matching lockfile. No
schema, persisted key, environment variable, process authority or client asset
change is required. Existing PostgreSQL state and Redis publications remain usable.
