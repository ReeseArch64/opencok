# Global accounts

`account` owns account discovery reads and global character provisioning under
[#607](https://github.com/ReeseArch64/opencok/issues/607), part of #558 W06/W20.
The API composes `AccountStore`, `ProvisioningService` and `ProvisioningController`.
Pure contracts and the create-input DTO have independent source entrypoints.
The package does not import horizontal Services, Controllers or repositories.

## Ownership and protocol

- `contracts/account` defines the discovery reader and legacy string-valued rows.
- `contracts/provisioning` defines the reservation/activation store port.
- `dtos/create-character.dto` describes the public create input.
- `services/provisioning` verifies input and identity, reserves globally, requests
  realm creation and activates the linkage after a validated realm receipt.
- `controllers/provisioning` delegates that use case through constructor injection.
- `repositories/account` owns the global pool lifecycle and discovery queries.
- `repositories/provisioning` owns transactional reservations and activation.

The shared signed account/realm messages, response contracts, validation schemas
and canonical hash remain in `contracts`, `validations`, `mappings` and `rules`.
Both owners use those same implementations. Identity cryptography stays in
`identity`; HTTP/signing adapters stay in `connection`; PHP discovery transport
stays in `api`. Realm character seed generation and writes belong to `player` after #609. Account code neither
seeds a city nor writes a realm database.

All maintained callers use these domain paths. The former horizontal account,
reservation, Service, Controller, DTO and account-reader paths are removed;
there are no compatibility re-exports back into this domain. The remaining horizontal provisioning aggregates were retired when realm
creation moved to `player` in #609.

## Preserved behavior

Discovery chooses ordinary or bound mappings explicitly, filters active values
0/null, orders UIDs before retaining the last row at each identical timestamp,
then sorts timestamps descending. Its string fields and bigint precision remain
unchanged. This legacy collision behavior is intentional compatibility, not a new
account selection policy.

Creation preserves identity locking, the two-realm character limit, device locks,
UID generation, durable reservation replay, receipt/hash checks and atomic global
activation. A realm failure or malformed receipt returns pending; activation
failures propagate for later reconciliation. A ready reservation never seeds the
realm again. Starter grants remain realm-owned and unchanged. No schema, saved
row, client ID, endpoint, configuration or process-authority change is required.
Rollback uses the previous API/realm artifacts against the same persisted state.

## Verification

Run `bun run --cwd packages/account test`, `check-types` and `test:integration`.
Integration requires Docker and uses disposable PostgreSQL 17.11 with synthetic
data. It checks legacy discovery filters/ties/precision, binding selection,
pending versus activated visibility, idempotent activation and restart persistence.
The existing server provisioning integration verifies complete global/realm
creation, retries, authority replacement, restart and composed SFS gameplay.
Cross-owner transport/signature tests remain in server tests, and discovery-wire
tests remain in API tests. Synthetic v12.06.0 coverage does not prove physical
client compatibility or other release tracks.
