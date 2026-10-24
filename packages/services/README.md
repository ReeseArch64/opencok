# Application Services

`GameService` and `WorldService` own realm command workflows. They coordinate
rules, mapping and persistence through the existing contracts. Supporting realm
projections and workflows live alongside these Services.

The realm composition root injects these Services into `GameController` and
`WorldController` in `@opencok/controllers`. Controllers delegate operations and
preserve command results, correlation fields and errors. Constructor injection
follows the NestJS organizational pattern without adding framework decorators
or changing Effect resource lifecycle.

Create/update inputs use `Create<Resource>Dto` and `Update<Resource>Dto` from
`@opencok/dtos`. Read queries and response shapes use `@opencok/contracts`.
Services never import Controllers or applications.
