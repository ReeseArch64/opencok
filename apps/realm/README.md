# @opencok/realm

Development Realm in TypeScript/Bun that serves queries against an immutable map.

## Usage

From the repository root:

```sh
bun --no-env-file apps/realm/src/main.ts
```

The service listens at `http://localhost:9940`. Connect the GameServer using
`-realm-url http://127.0.0.1:9940`. The client accesses the Realm through the GameServer.
