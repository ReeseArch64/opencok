# @opencok/persistence

Persistence for OpenCoK with PostgreSQL, MongoDB, typed repositories and Redis caching.
Each kingdom stores its data in the `kingdom_<id>` database.

## Usage

From the consuming workspace:

```sh
bun add '@opencok/persistence@workspace:*'
```

Prepare the databases and apply migrations before using the repositories.
Run this PostgreSQL query example with Bun:

```ts
import { createPostgresDataSource } from "@opencok/persistence/factories/postgres-data-source";
import { kingdomDatabase } from "@opencok/persistence/factories/kingdom-database";
import { createWorldObjectRepositories } from "@opencok/persistence/factories/world-object-repositories";

const kingdomId = 1;
const source = createPostgresDataSource(kingdomDatabase(kingdomId), {
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
});

await source.initialize();
try {
  const objects = createWorldObjectRepositories(source.manager, kingdomId);
  const page = await objects.list.execute({ offset: 0, limit: 20 });
  console.log(page.items);
} finally {
  await source.destroy();
}
```
