# Realm: primeiro mapa

Reino de desenvolvimento em TypeScript/Bun. Mantém um mapa imutável de consulta;
sem banco, personagens, propriedade de cidades ou alterações de progresso.

Na raiz do projeto, execute em terminais separados:

```sh
bun --no-env-file apps/realm/src/main.ts
```

```sh
cd gameserver
go run ./cmd/gameserver -realm-url http://127.0.0.1:9940
```

```sh
cd app
flutter run -d linux --dart-define=GATEWAY_URL=ws://localhost:9933/ws
```

No jogo, abra o mapa pelo botão do HUD. O Flutter consulta a região da câmera,
substitui os objetos da prévia pelos objetos recebidos e refaz a consulta após
reconectar. `HUD_PREVIEW=true` mantém a prévia local independente do servidor.
O endereço do Realm é interno: o Flutter conecta apenas ao GameServer.

O reino `1` possui 1200 × 1200 células, com coordenadas inteiras de `1` a `1200`.
Os limites das consultas são inclusivos; cada consulta cobre até 64 × 64 células.
Objetos são retornados quando seu espaço ocupado intersecta a região, mesmo que
sua âncora esteja fora dela. A resposta inclui as células bloqueadas pelo terreno;
a ocupação por objetos é representada separadamente por posição, largura e altura.

Objetos de demonstração, sem vínculo com jogadores:

| ID  | Tipo            | Posição  | Ocupação |
| --- | --------------- | -------- | -------- |
| 1   | Castelo nível 1 | 570, 570 | 2 × 2    |
| 2   | Madeira nível 1 | 567, 570 | 1 × 1    |
| 3   | Comida nível 1  | 573, 570 | 1 × 1    |

`src/modules/world/terrain.json` contém somente as coordenadas bloqueadas do
modelo numérico de terreno de `app/assets/world_map/kingdom_layout.json`.
Água, elevações, cenário e a reserva central bloqueiam o terreno; lama permanece
livre. Essa é a política inicial do protótipo, sem regras de nascimento ou
teletransporte. O teste compara a definição com o layout do cliente para detectar
mudanças sem atualização correspondente.

O Realm oferece `GET /healthz` e `POST /map/query` com o pacote binário documentado
em [PROTOCOL.md](../../gameserver/PROTOCOL.md). O HTTP não tem autenticação nesta
etapa e deve ficar restrito à rede interna. A consulta é pública no bootstrap
anônimo; nenhuma mensagem modifica o mapa.

Validação, na raiz:

```sh
bun --no-env-file test packages/contracts/src apps/realm/tests
bun --no-env-file packages/contracts/scripts/generate.ts --check
```

Dentro de `apps/realm` e de `packages/contracts`, execute `bun run check-types`.
Com Realm e GameServer ativos, o teste Dart verifica a integração completa:

```sh
cd app
flutter test test/gameserver_connection_test.dart --dart-define=GAMESERVER_TEST_URL=ws://localhost:9933/ws
```

A próxima etapa é vincular uma cidade a um personagem e persistir a ocupação com
restrições contra sobreposição; os objetos desta etapa são recriados a cada início.
