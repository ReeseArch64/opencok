# Messages

`messages` owns SFS framing, binary/Java/legacy codecs and the shared protocol
validation primitives moved in #617 under #558. Domain-specific response shapes,
schemas and mapping decisions stay with their domain owners; this package does
not depend on horizontal contracts, mappings or validations.

## Validation boundaries

- `contracts/response-value` defines recursive plain response values.
- `validations/response` owns scalar response fields and bounded dynamic records.
- `validations/sfs` owns tagged wire values, typed arrays and recursive fields.
- `validations/fields` checks wire representation and the supplied domain schema,
  returning the original field/value object without rewriting tags or key order.

The old `contracts/responses/value`, `validations/response`, `validations/sfs`
and `mappings/validation` modules are retired after every maintained consumer moves.
Zod uses the existing workspace catalog version; no codec entrypoint imports these
validators implicitly. Import a validation entrypoint when schema checks are needed.

Signed integer/bigint bounds, UTF-8 byte lengths, array/record/buffer limits,
NaN/infinity/signed-zero behavior and literal prototype keys remain unchanged.
Validation still runs before the supplied domain schema. No gameplay schema,
wire-format identifier, saved state or process authority changes.

## Verification and rollback

`bun run --cwd packages/messages test` runs the owned boundary suite. Its four
tests pass with 69 identical assertions before and after extraction. Existing
schema/mapping tests retain their seven tests and 43 assertions, including exact
encoded byte order and input identity. Root package tests include this suite.
The moved modules and all caller bodies retain identical emitted runtime code
after import paths are excluded from comparison.

Rollback uses the previous application artifacts against unchanged saved data.
No deployment, physical-client coverage or performance gain is established by
this ownership move. Remaining domain mappings and schemas still require their
own migration and compatibility verification under #558.
