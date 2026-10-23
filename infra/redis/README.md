# Redis for the local TypeScript stack

Redis is internal at `redis:6379/0`; it has no published host port. The local
passwordless configuration is scoped to the private Docker bridge. The server
uses realm-scoped session leases; the API performs dependency health checks and
no longer writes legacy discovery counters or account-reactivation marks.

[redis.conf](redis.conf) defines RDB plus AOF persistence on `redis-data`, a
384 MiB maximum below the 512 MiB container limit, `noeviction`, bounded operation
handling in consumers and disabled command slowlogs to avoid recording device or
session values. Memory exhaustion fails writes explicitly; it does not silently
evict live leases. PostgreSQL remains authoritative for game state.

```sh
docker compose --profile dev exec -T redis redis-cli ping
docker compose --profile dev exec -T redis redis-cli INFO memory
docker compose --profile dev exec -T redis redis-cli INFO persistence
```

Routine recreation preserves the volume. Do not flush shared databases or remove
volumes to repair startup. The stack test uses a separate project/volume and
covers Redis failure/recovery without touching imported data. See the
[stack guide](../compose/README.md).
