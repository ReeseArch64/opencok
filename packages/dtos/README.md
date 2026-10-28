# DTOs

DTO classes describe create and update inputs only, following the NestJS naming
convention: `Create<Resource>Dto` and `Update<Resource>Dto`, such as `CreateCityDto`.
Only declare DTOs for implemented operations; a city creation endpoint is not
introduced by this convention.

`CreateWorldFavoriteDto` remains here. `UpdatePushPreferenceDto` moved to
[player/dtos](../player/src/dtos/update-push-preference.dto.ts) with its implemented
workflow in #603; its former horizontal path is retired.
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

The account creation input now lives at
`@opencok/account/dtos/create-character.dto`; the former `provisioning` alias and
horizontal class are retired with all callers migrated in #607.
