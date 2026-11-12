# GameServer

Go server that maintains the Flutter client WebSocket connection and forwards map
queries to the Realm.

## Usage

Start the Realm from the repository root:

```sh
bun --no-env-file apps/realm/src/main.ts
```

In another terminal, from the repository root:

```sh
cd gameserver
go run ./cmd/gameserver -realm-url http://127.0.0.1:9940
```

Connect the client to `ws://localhost:9933/ws`. To accept connections from other
machines, add `-addr 0.0.0.0:9933`. The binary contract is documented in
[PROTOCOL.md](PROTOCOL.md).
