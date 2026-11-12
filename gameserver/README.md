# GameServer

Servidor Go para a conexão binária persistente do cliente Flutter e encaminhamento
de consultas do mapa para o [Realm](../apps/realm/README.md). Não requer
banco de dados nesta etapa. Requer Go 1.27.1 (definido no `go.mod`).

Inicie o Realm na raiz em outro terminal:

```sh
bun --no-env-file apps/realm/src/main.ts
```

Na raiz do repositório:

```sh
cd gameserver
go run ./cmd/gameserver
```

Para subir pelo Docker com o gateway, execute na raiz:

```sh
docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up --build
```

O gateway publica `ws://localhost:9933/ws` e encaminha as conexões para
`gameserver:9933` na rede interna. O gameserver não publica portas diretamente
no host. A configuração de desenvolvimento monta o código local; após editar Go,
reinicie o serviço com `docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml restart gameserver`.
Use `curl http://localhost:9933/healthz` para verificar o acesso pelo gateway.

No ambiente de desenvolvimento, o gateway envia traces, métricas e logs
(incluindo acessos) ao Maple por OTLP/HTTP em `http://maple:4318`, com o nome de
serviço `gateway`. Configure `MAPLE_LOCAL_INGEST_KEY` e
`MAPLE_LOCAL_ACCESS_TOKEN` em `docker/.env` (veja `docker/.env.example`). A chave
de ingestão autentica os exportadores; o token de acesso permite consultar os
dados na interface do Maple em `http://localhost:4318`.

Em outro terminal, na raiz:

```sh
cd app
flutter run -d linux --dart-define=GATEWAY_URL=ws://localhost:9933/ws
```

O cliente carrega `GATEWAY_URL` de `app/.env` ao iniciar. Configure a URL completa,
por exemplo `GATEWAY_URL=ws://192.168.1.104:9933/ws`. O argumento
`--dart-define=GATEWAY_URL=...` tem prioridade sobre o `.env`. Para Web, use
`flutter run -d chrome` com o mesmo define. `HUD_PREVIEW=true` continua permitindo
a prévia visual independente da conexão.

Para Android Emulator, use `ws://10.0.2.2:9933/ws` e inicie o servidor com
`go run ./cmd/gameserver -addr 0.0.0.0:9933`. Em um dispositivo físico, use o IP
da máquina na rede local. Android debug permite WS sem TLS; builds de distribuição
devem usar `wss://`. Em páginas HTTPS, use WSS também. Configure esse endereço em `GATEWAY_URL` no `.env` do app ou via `--dart-define`.

Opções do servidor:

```sh
go run ./cmd/gameserver -addr 127.0.0.1:9933 -max-connections 1000 -realm-url http://127.0.0.1:9940
go run ./cmd/gameserver -addr 0.0.0.0:9933 -origins https://game.example.com
curl http://localhost:9933/healthz
```

Sem `-origins`, somente origens de navegador em localhost são permitidas.
Clientes nativos não enviam Origin. O servidor é um bootstrap anônimo para
desenvolvimento: `online_sessions` conta conexões admitidas desta instância,
sem identidade de jogador. Heartbeat de 25 s e timeout de 60 s removem conexões
perdidas. SIGINT/SIGTERM fecham os sockets e encerram o HTTP.

Validação:

```sh
cd gameserver
go test -race ./...
go vet ./...
cd ../app
flutter analyze
flutter test lib test
```

Com o servidor em execução, o teste de integração conecta o cliente Dart real:

```sh
cd app
flutter test test/gameserver_connection_test.dart --dart-define=GAMESERVER_TEST_URL=ws://localhost:9933/ws
```

Consulte [PROTOCOL.md](PROTOCOL.md) para o contrato binário e os limites atuais.
