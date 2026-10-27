# Configuration migration acceptance

Topic 1 of [the Java migration inventory](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19156446)
is configuration and feature availability. The [denominator audit](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19167067)
left its final reference review pending. This checklist closes that server-side review
for the maintained 12.06.0 client, ordinary kingdoms and UTC configuration. It does
not establish completion of the other 32 topics or a total migration percentage.

The review used the authorized, read-only local `data/reference/server/modules/gameplay`
reference. Java navigation names below identify behavior evidence, not runtime
dependencies. No legacy code, XML assets or player records are distributed with this
implementation. Tests run with independently authored synthetic resources.

| Acceptance area                        | Reference behavior                                                                                                                                                                                      | Maintained implementation and evidence                                                                                                                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Settings                               | `GetSettingXml` returns every declaration as strings, including IDs; an absent catalog gives an empty array.                                                                                            | `resources/rules`, `dtos/bootstrap`; `settings.test.ts`, `login-catalogs.test.ts`.                                                                                                                      |
| Catalog selection                      | `GameConfigLoader` and `GameConfigManager` distinguish ordered declarations, final groups and global indexes. Root records are ignored when groups exist; nested elements contribute direct attributes. | Declared catalogs retain duplicates and missing/blank IDs; group and global views remain separate. `login-catalogs.test.ts`, `general-sales.test.ts`, resource tests.                                   |
| Complete data configuration            | `GetDataConfig`, `GameService.fillDataConfig` and `getGameDataConfigInfo` select records, aliases, required scalars and the player's stamina cap.                                                       | `dtos/configuration`, `controllers/game`; 222 baseline fields, 229 with all seven optional fields. `configuration-contract.test.ts`, `data-config.test.ts`, `data-config-required.test.ts`.             |
| Auxiliary projections                  | General-sale declarations retain literal limits; kingdom skills restore rows, sort tabs, apply selectors and retain separators; pay controls use their own catalog.                                     | `general-sales.test.ts`, `kingdom-skills.test.ts`; missing and malformed declarations follow the documented per-catalog behavior.                                                                       |
| Availability and unlock previews       | `FunctionOnController`, item switches and `UserBuilding.getMaxStar` select client versions, realms and inclusive dates before applicable values are parsed.                                             | `rules/availability`, `rules/features`, `Rules.maxStar`; version, realm, calendar, availability and settings suites cover early exits, parse failures and timed building/queue previews.                |
| Initial and deferred announcements     | Generic realm flags carry version/platform metadata; account flags apply global rules and exact allowlists; subscriptions check platforms; boss services are consulted lazily.                          | `dtos/bootstrap`, `rules/features`, `controllers/game`; `feature-announcements.test.ts`, `login-config.test.ts`.                                                                                        |
| Deferred configuration and preferences | Sharing declarations, saved switches and preferences, world-news initialization, account verification and exception boundaries retain their individual behavior.                                        | `login-config.test.ts`, `configuration-adapters.test.ts`, `world-news-preference.test.ts`; injected SQL/cache transports cover rollback, retries and failures after the default has committed.          |
| Operator metadata                      | `GameService.setServerConfig` exposes configurable chat interval and feed count with defaults 1 and 3.                                                                                                  | The runtime fixes chat interval and feed count at 1 and 3 in code. Effect configuration, controller and SFS output preserve those values; complete-contract tests cover both realms and reconstruction. |

## Frozen protocol contract

`test/fixtures/configuration-wire-contract.json` records the 229 public response field
names and their SFS types, independently inventoried from the reference's output calls.
It contains protocol facts only. It is deliberately separate from the implementation's
projection lists and synthetic input fixture so removing or changing a projection
cannot silently change its expected contract.

`configuration-contract.test.ts` loads complete synthetic XML through the real resource
loader, obtains realm settings through the actual Effect configuration, executes
`login.dataconfig` and round-trips the binary SFS response. It checks exact field sets
and types with optional projections both present and absent, exact Long precision,
request correlation, realm-specific stamina, inclusive time expiry and operator values.
Reconstructing settings, resources and the controller reproduces identical bytes.
This is an in-process reconstruction test, not a live process or database restart.

## Supported runtime policy

Authentication already rejects client versions other than `12.06.0`. Configuration
uses that authenticated process version; request fields cannot choose a different
version, owner or realm. Rule tests exercise other numeric versions to verify gate
behavior, without advertising those client tracks as supported.

Normal realms use online selectors and UTC. Pure rules also cover test selectors,
fixed offsets and alternate world-cup projections. Starting a test/world-cup realm or
enabling cross-realm gameplay is not part of the maintained runtime. Regional daylight
saving and other Java calendar locales are not emulated. Existing parser, catalog,
sorting and SFS size bounds remain enforced.

An absent boss service produces a closed announcement, matching the reference's
absent-service path. Boss lifecycle belongs to gameplay migration; setting a flag
must not fabricate a running service. Account/subscription announcements similarly
do not implement payments or account switching. Construction previews do not authorize
construction mutations. These domain boundaries do not leave configuration handlers
partially implemented.

## Operation and recovery

Keep authorized XML in the configured `GAME_RESOURCES` directory. The server loads
its catalogs at startup; restart after changing resources or environment values.
The runtime metadata values are fixed in code as the legacy SFS Int 1/3 pair.
Changing them requires a code change and rebuild. They advertise client values and
do not change the chat service's independent rate enforcement.

No dependency, schema or data migration is introduced. Rollback restores the prior
application build and its default metadata values. Existing notification initialization
still uses its previously implemented owner-checked transaction and never overwrites
a saved choice. This delivery does not change that write path.

The acceptance above establishes server implementation and synthetic contract coverage.
Native rendering, live PostgreSQL/Redis recovery, service integration, performance and
other client tracks require their own validation and are not inferred from unit tests.

Local validation on 2026-10-24 passed 162 tests across 24 files with 18,733 assertions:
the 16 configuration/availability suites identified above, all environment/resource
unit suites and the package-boundary check. Type checks passed for server, controllers,
contracts and environment. Repository-wide lint, format checks and `git diff --check`
passed. No database, container, private Java runtime or native client was started.
