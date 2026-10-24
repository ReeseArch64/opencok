# DTOs

DTOs are standalone classes with explicit `declare public readonly` data properties,
following the NestJS DTO style without decorators. They have no base class,
constructors, methods, static schemas or validation dependencies. Property types
are plain values such as `string`, `number`, `bigint`, arrays and nested data.

```ts
export class MailDeletedDto {
  declare public readonly delete: number;
}
```

`public` makes the transfer contract explicit. `declare` describes a field without
emitting an uninitialized runtime property, so strict property initialization
requires neither `!` assertions nor constructors. `readonly` prevents reassignment
at compile time; it does not freeze values at runtime. Required fields stay required.
Use `?` only for optional data, such as
`declare public readonly battleWin?: number` in `PublicStatisticsDto`.

Keep private state and static helpers in implementation classes that need them,
with explicit `private` and `static` modifiers there. They are not transferred
instance data and do not belong in these DTOs. DTOs have no private members,
static schemas/factories or behavior. Validate external data with the schemas
rather than relying on `new Dto()` to initialize or validate an object.

Zod schemas live in the [validations package](../validations/README.md) and import
DTO classes only as types. Schemas use `satisfies z.ZodType<Dto>` to check their
output against the independent class declaration. Validation is called explicitly
at the application or mapping boundary.

The [mappings package](../mappings/README.md) owns existing mobile response
projections and SFS serialization. It preserves the protocol's type tags, numeric
widths and field order. DTOs do not depend on those mappings or the SFS codec.
