# DTOs

DTO classes describe create and update inputs only, following the NestJS naming
convention: `Create<Resource>Dto` and `Update<Resource>Dto`, such as `CreateCityDto`.
Only declare DTOs for implemented operations; a city creation endpoint is not
introduced by this convention.

Implemented inputs are `CreateWorldFavoriteDto` and `UpdatePushPreferenceDto`.
Each class has explicit `declare public readonly` plain data properties, without
decorators, constructors, inheritance, methods or static schemas. Required fields
stay required; use `?` only when an input field may be omitted. `declare` avoids
runtime initialization and definite-assignment assertions.

Services use these input types after decoding and validating legacy command
fields. Creating a DTO instance does not validate its data. Zod schemas belong in
[validations](../validations/README.md); transport mapping belongs in
[mappings](../mappings/README.md).

Read queries, deletion selections and response data are contracts rather than
DTOs. Mobile response interfaces use the `Response` suffix and live under
`@opencok/contracts/responses/<domain>`, preserving existing field names,
optionality, signed numeric widths and wire order.
