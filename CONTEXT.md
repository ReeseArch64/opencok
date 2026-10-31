# OpenCoK Technical Context

## Objective and baseline

Build a reproducible, self-hosted Clash of Kings-compatible platform whose gameplay, configuration and saved progress remain independent of the original online service. The initial configuration prepares two isolated kingdoms sharing global identity/services; local development starts one active realm server.

Recognized client tracks are `v5.36.0`, `v6.12.20`, `v9.27.0` and `v12.06.0`. Each release needs evidence for its client/resource/protocol/schema/rule combination; recognition and successful startup do not establish support.

The current implementation is a TypeScript monorepo with Bun tooling and transactional server-owned gameplay. Production runtime remains undecided. Technical work must identify affected versions, state owners, expected behavior and observable acceptance criteria.

## Access and progression

- Preserve internal identity across authentication/provider linking, character creation, reconnect and client updates. Enforce at most two characters per account per kingdom; grant each character's initial package once without resetting existing progress.
- Bootstrap level 1, a basic level-1 city, 100,000 wood, 100,000 food and 1,000 gold; stone/iron/silver/crystals start at zero. Acceleration options do not silently grant upgrades or extra currency.
- Model Hua Mulan as infantry combat, three branching talent trees, target level cap 99 and talents of one or ten levels. Maximum percentage bonuses range from 50% to 500%; preserve stated basic attributes/striking distance and normal fragment/point costs. Portrait framing and rarity changes must not alter saved ownership, levels, talents or assignments; other heroes display white rarity without a Legendary ribbon.
- Keep login, city and core gameplay usable when optional services fail; expose bounded waits and truthful unavailable/pending states.

## Durable gameplay requirements

- Persist costs, deadlines, versions and completion identities for construction, ordinary research, training/healing/fortifications, forging and workshop queues. Resume bounded work after restart; workshop deliveries and waiting-list advancement stay atomic.
- Settle production at effect/rate changes before applying new VIP/talent/equipment/temporary bonuses. Preserve partial accumulation, collection caps and already earned balances.
- Deduplicate quest, sign-in, activity and ranking grants against actual eligibility and reward periods. Keep uncertain claims recoverable; apply experience/bonus order and level caps deterministically.
- Version exchange offers, accepted tokens, daily refresh limits and allowance consumption. Preserve unresolved historical exchanges rather than inventing replacements.
- Validate placement policy and available space before charging or moving cities. Preserve existing realms/cities when historical placement rules lack evidence.
- Shared gathering uses owned troops/companions, march limits, remaining resources and recoverable per-party cargo. Joining/leaving cannot reduce another party's earnings; return rewards and pinned random outcomes commit once. Preserve prior trips, allowances and intentionally unavailable offers.
- Scouting preview is read-only/free. Departure atomically reserves the selected army/companions and stated cost; reports respect discoverability/protection and recipient ownership. Unavailable targets fail explicitly; retries cannot invent battles/loot or duplicate charges/reports.
- Spending rankings count committed expenditure at full numeric width, excluding previews, income and unverified totals. Preserve stable tie order, realm visibility and post-finality eligibility; mailed prizes remain idempotent.

## Media and client continuity

Profile customization targets static images and GIFs with explicit limits/eligibility. JPEG/PNG handling exists; GIF processing and the complete lifecycle remain planned. A successful replacement normally enforces a three-day interval, removes the prior image and retains a private receipt without blocking browsing/play.

Maintain the validated Android experience while improving signed, recoverable updates. Completion requires installed, usable artifacts with preserved identity/progress. Lua/native distribution is planned; Flutter/Dart has no replacement deadline, and browser gameplay remains an independent experiment.

## Operations and evaluation

Make configuration/dependencies explicit and startup reproducible. Preserve progress across retries, disconnects, restarts and maintenance; distinguish prepared, committed and delivered effects. Operational health must expose unfinished work, backlog, latency and recovery without substituting logs for durable economic history.

Prioritize active-client stability, optional-dependency isolation, responsiveness/recovery, media completion and understandable operations. For each change, establish reproduction, affected contracts, invariants, failure/recovery behavior and measurable acceptance. Distinguish proposed, accepted, implemented and verified work; local containers/source tests do not establish deployment capacity, native rendering or release readiness.

Evaluate authorized scope, security/privacy, correctness/state integrity, compatibility/recovery, utility, simplicity, integration, measured performance and convenience in that order. Preserve valid data during migration/rollback/restore. Unknown behavior requires evidence rather than permissive defaults or fabricated success.

The target is independently operated communities, without assumptions of public multi-tenant hosting, worldwide scale, universal client support, contributor cloud accounts or third-party distribution rights.
