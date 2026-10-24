# Mappings

This package owns mobile response projections and SFS serialization previously
colocated with DTO declarations. Existing lowercase functions such as
`mailDeleted`, `worldSearch` and `publicProfileBase` retain their argument lists
and `Fields` or `Value` results under `@opencok/mappings/<domain>`.

Response interfaces live in `@opencok/contracts/responses/<domain>`. The
[validations package](../validations/README.md) supplies independent Zod schemas.
Mappings check SFS tags and widths, read the plain payload and apply its response
schema before returning a response. Validation leaves the original SFS fields
and their order intact, preserving encoded bytes and mutable command response
composition. Create/update DTOs remain input data in the [DTO package](../dtos/README.md).

Snapshot normalization and existing compatibility rules remain in the projection
functions. Mappings do not introduce persistence or application dependencies.
`gold` remains a currency projection helper rather than an input DTO.

Run `bun run test:packages` for mapping and boundary tests and the `apps/server`
test suite for command compatibility coverage. Native client validation remains
outside these synthetic suites.
