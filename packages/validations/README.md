# Validations

Zod schemas validate plain response data independently from the interfaces in
`@opencok/contracts/responses`. Each schema is exported from the matching domain
subpath and uses `satisfies z.ZodType<ResourceResponse>` to check its output type.
Response interfaces are type-only imports and contain no validation behavior.

For example, `mailDeletedSchema` validates `{ delete: number }` with signed
32-bit bounds. Call `mailDeletedSchema.parse(data)` explicitly at the boundary.

Fixed payloads use strict object schemas, explicit optional fields and unions for
response variants. Shared scalar schemas in `response.ts` preserve exact bigint
longs, legacy floating values and UTF-8 bounds. `responseRecord` validates dynamic
entries and retains literal `__proto__` and `constructor` keys without assigning
prototypes.

Transport-specific SFS validation lives separately in `sfs.ts`. The
[mappings package](../mappings/README.md) applies transport and response validation
at the serialization boundary. Image validation remains under `image`.

Run `bun run --cwd packages/validations test` for validation tests and
`bun run test:packages` for validation, mapping, controller, rule and resource tests.

`city-parameters.ts` contains `progressionBoolean`, the shared native boolean
parameter parser used by training, fortifications and dragon-tower purchases after
#645. It retains the former `services/training` parser's fallback and error behavior.
Domain-specific military response schemas now belong to `troops/validations/military`.
