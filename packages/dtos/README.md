# DTOs

DTOs are standalone classes with explicitly declared `readonly` data properties,
following the NestJS DTO style without decorators. They have no base class,
constructors, methods, static schemas or validation dependencies. Property types
are plain values such as `string`, `number`, `bigint`, arrays and nested data.

```ts
export class MailDeletedDto {
  readonly delete!: number;
}
```

The definite assignment assertion supports the workspace's strict TypeScript
configuration without adding initialization logic. `readonly` is a compile-time
constraint, as in ordinary TypeScript DTOs.

Zod schemas live in the [validations package](../validations/README.md) and import
DTO classes only as types. Schemas use `satisfies z.ZodType<Dto>` to check their
output against the independent class declaration. Validation is called explicitly
at the application or mapping boundary.

The [mappings package](../mappings/README.md) owns existing mobile response
projections and SFS serialization. It preserves the protocol's type tags, numeric
widths and field order. DTOs do not depend on those mappings or the SFS codec.
