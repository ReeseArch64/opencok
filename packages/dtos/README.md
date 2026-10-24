# DTOs

DTOs are exported concrete classes named `<Name>Dto`, following the class-based
NestJS convention. Each class extends `createZodDto(schema)` and exposes its Zod
schema through a static `schema` property. Construction accepts unknown data and
validates every field before returning an instance. Types are inferred from the
schema instead of duplicating property declarations and validation rules.

The package uses the workspace Zod catalog dependency. It does not require the
NestJS runtime, decorators, `class-validator` or `class-transformer`. Service
composition remains in Effect as described in the
[architecture](../../.github/ARCHITECTURE.md#implemented-api-and-realm-package-boundaries).

The existing lowercase functions remain compatibility adapters. They project
domain snapshots into public SFS fields and construct the corresponding DTO
class. Their `Fields` or `Value` return types preserve existing callers that
compose and extend responses. Use the exported class when instance identity or
schema-inferred field types are needed. The `gold` function remains a currency
calculation rather than a DTO.

Schemas use strict objects for fixed public fields and explicit optional fields
or unions for legacy response variants. Dynamic configuration and permission
maps use `wireRecord`, which validates each entry and preserves literal keys
such as `__proto__` and `constructor`. Nested DTO instances are accepted where
an SFS object is expected. Gameplay decisions and snapshot normalization remain
in their existing adapters and rules; the DTO validates the projected wire data.

Shared `wire` schemas validate SFS type tags, signed integer widths, exact bigint
longs, UTF-8 string bounds and collection bounds without coercing input. Float
and double schemas retain the protocol's supported NaN and infinity values.
Construction preserves the source field order recursively, including nested
maps, so validation does not reorder the encoded SFS bytes. DTO properties remain
mutable for existing response composition and correlation fields; schemas can
be applied again after mutation when needed.

`bun run --cwd packages/dtos test` covers class construction, schema rejection,
numeric boundaries, nested validation and byte compatibility. Run the existing
`apps/server` tests for command and mobile response compatibility, and
`bun run test:packages` for package boundaries.
