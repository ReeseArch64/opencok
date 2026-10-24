# Validations

Zod schemas validate plain DTO data independently from the classes in
`@opencok/dtos`. Each schema is exported from the matching domain subpath and uses
`satisfies z.ZodType<Dto>` to check its output type. DTO classes are type-only
imports; they do not expose or invoke schemas.

For example, `mailDeletedSchema` validates `{ delete: number }` with signed
32-bit bounds. `mailDeletedSchema.parse(data)` validates data explicitly; creating
`new MailDeletedDto()` performs no validation.

Fixed payloads use strict object schemas, explicit optional fields and unions for
response variants. Shared scalar schemas in `dto.ts` preserve exact bigint longs,
legacy floating values and UTF-8 bounds. `dtoRecord` validates dynamic entries and
retains literal `__proto__` and `constructor` keys without assigning prototypes.

Transport-specific SFS validation lives separately in `sfs.ts`. The
[mappings package](../mappings/README.md) applies transport and DTO validation at
the serialization boundary. Image validation remains under the existing `image`
subpath.

Run `bun run --cwd packages/validations test` for DTO validation tests and
`bun run test:packages` for validation, mapping and package boundary checks.
