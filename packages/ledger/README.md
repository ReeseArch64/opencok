# Ledger primitives

`posting` validates economic posting identity and signed-64 balance limits.
`contracts/mutation` owns the shared mutation command, result, posting and outbox
event messages after [#613](https://github.com/ReeseArch64/opencok/issues/613).
These types are byte-identical to their former shared-contract declarations; all
maintained consumers use the new owner and the old source is retired.

Ledger has no dependency on horizontal contracts, domain Services or persistence.
It does not execute transactions or become a network balance service. The existing
realm mutation executor still persists receipts, postings and outbox events and
controls fencing/rollback. Economy and other domains consume these small shared
primitives while keeping their actual economic rules and writes in their owners.

The existing signed-boundary test now lives in `tests/posting.test.ts`, unchanged,
and runs in the root package suite. Use `bun run --cwd packages/ledger test` and
`check-types`. Cross-component PostgreSQL verification remains in server integration.
No schema, output format, saved value or runtime behavior changes with this type
ownership correction; rollback uses the previous artifacts against unchanged data.
