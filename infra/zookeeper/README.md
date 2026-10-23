# Realm coordination

The local ZooKeeper service is private at `zookeeper:2181`, without a published
host port. [zoo.cfg](zoo.cfg) explicitly configures sessions, client limits,
snapshot retention and the `ruok`/`srvr` health commands. The small entrypoint
copies the read-only input into `/conf` before the pinned image performs its
normal ownership setup, preserving compatibility with existing data volumes. The container heap is
256 MiB within a 512 MiB limit.

The TypeScript server registers an ephemeral owner under its configured realm
namespace and stops accepting commands when coordination is unavailable. The
current slice performs read-only game operations. PostgreSQL epoch fencing is
still required before enabling authoritative mutations.

Data, transaction logs and logs retain separate named volumes. Existing volumes
are preserved on recreation. Redis 6.2.24 and ZooKeeper 3.4.14 remain pinned to the
versions exercised by the source compatibility experiment; upgrading them is a
separate validation step.

```sh
docker compose --profile dev exec -T zookeeper sh -c 'printf srvr | nc -w 2 127.0.0.1 2181'
```

The [stack integration test](../../tests/stack/compose.test.ts) validates startup
and the real SFS login path with synthetic state. See the
[stack guide](../compose/README.md) for deployment and recovery.
