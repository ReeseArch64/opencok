# @opencok/persistence

Persistence and data access for OpenCoK, with PostgreSQL entities, MongoDB
schemas, typed repositories, validation, Redis caching, and temporary kingdom
access status. The package runs on Bun and isolates kingdom data by database.

## Usage

Add the package to a workspace application's dependencies:

```json
{
  "dependencies": {
    "@opencok/persistence": "workspace:*"
  }
}
```

Import SQL models from `@opencok/persistence`. Import repository factories,
MongoDB models, types, validators, enums, and cache helpers through their
corresponding subpaths. Databases, migrations, collections, and indexes must
already be prepared before using repositories; connecting does not create them.

### PostgreSQL repositories

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
  console.log(page.items, page.hasMore);
} finally {
  await source.destroy();
}
```

Each repository operation exposes `execute(input)`. Available operations depend
on the entity: `findByPublicId`, `list`, `create`, `update`, and `softDelete`.
Occupancy cells expose reads only; immutable publications expose reads and
creation. Queries return active records. Lists default to 50 items and accept
up to 200. SQL `bigint` quantities use decimal strings.

For SQL transactions, create repositories with the transaction's `EntityManager`
and leave caching disabled.

### MongoDB repositories

```ts
import { connectMongoDB } from "@opencok/persistence/mongoose";
import { kingdomDatabase } from "@opencok/persistence/factories/kingdom-database";
import { createWorldRegionRepositories } from "@opencok/persistence/factories/world-region-repositories";

const kingdomId = 1;
const connection = await connectMongoDB("mongodb://localhost:27017", {
  dbName: kingdomDatabase(kingdomId),
});

try {
  const regions = createWorldRegionRepositories(connection, kingdomId);
  const page = await regions.list.execute({ limit: 20 });
  console.log(page.items);
} finally {
  await connection.close();
}
```

Use the `global` database for kingdom registration in PostgreSQL and the resource
configuration catalog in MongoDB. Kingdom-scoped factories require the matching
`kingdom_<id>` database.

### Redis caching and access status

```ts
import { connectRedis } from "@opencok/persistence/redis";
import { KingdomAccessStatusStore } from "@opencok/persistence/stores/kingdom-access-status";
import { KingdomAccessStatus } from "@opencok/persistence/enums/kingdom-access-status";

const redis = await connectRedis("redis://localhost:6379");
try {
  const statuses = new KingdomAccessStatusStore(redis);
  await statuses.set(1, KingdomAccessStatus.Open);
  console.log(await statuses.get(1));
} finally {
  redis.close();
}
```

Without an explicit URI, `connectRedis()` uses `REDIS_URL` or
`redis://127.0.0.1:6379`. Access status expires after 60 seconds by default;
renew it before expiration. Missing or expired status returns `closed`.

Enable optional repository caching by passing a connected Redis client to a
repository factory:

```ts
const objects = createWorldObjectRepositories(source.manager, kingdomId, {
  cache: { client: redis, ttlSeconds: 30 },
});
const object = await objects.findByPublicId.execute(publicId);
```

Only UUID lookups are cached. Repository writes invalidate their own entity's
entry. Writes outside repositories, external transactions, and trigger effects
on other entities require explicit invalidation after commit through the
corresponding `cache/<entity>` helper, or reads without caching. Use uncached
reads for decisions requiring current database state.

### Characters

`Character` (`characters`, PostgreSQL por reino) representa o personagem, com
`accountPublicId` (UUID da conta global, imutável), `displayName` (até 64 bytes),
`level` (inicialmente 1) e `experience` (total acumulado, string decimal bigint,
inicialmente `"0"`). Herda os identificadores e datas de `BaseEntity`. O banco
`kingdom_<id>` define o reino; não há chave estrangeira entre bancos para a conta.
A existência da conta e a autorização devem ser verificadas pelo serviço consumidor.
Saldos, dispositivos, autenticação e propriedade de cidades têm modelos separados.

Use `createCharacterRepositories(manager, kingdomId, options)` de
`factories/character-repositories` para criar, consultar, listar, atualizar e
excluir logicamente. Aplique a migration `CreateCharacters` antes do uso.
Os repositórios são internos e não estabelecem autorização ou regras de progressão.

### Accounts, Firebase and character provisioning

`Account` lives in PostgreSQL `global`. Its immutable, unique `firebaseUid` links
an OpenCoK account to the configured Firebase project's identity. Passwords and
provider links remain in Firebase. `accountPublicId` in the kingdom refers to
`Account.publicId`, not the Firebase UID. A Farm uses an independent account.
Each account can have one character per kingdom, enforced by a permanent unique
index, including archived or deleted records.

The authentication service must verify the Firebase ID token against the configured
project before calling `createAccountRepositories(manager).findOrCreate.execute({
firebaseUid })`. This package does not verify tokens or expose login endpoints.
Concurrent retries resolve to the same account; removed accounts are not restored.

Use `createCharacterProvisioningRepositories(manager).reserve.execute({ accountId,
kingdomId })` to reserve a stable `characterPublicId`. The global record has foreign
keys to the account and kingdom and a unique `(accountId, kingdomId)` pair. Send the
reserved UUID and the account's public UUID to the authenticated authoritative Realm.
There, `createCharacterRepositories(manager, kingdomId).provision.execute({
characterPublicId, accountPublicId, displayName })` inserts once or returns the same
character without resetting progress. A different UUID for the same owner is rejected.
After the Realm confirms commit, call `complete.execute({ provisioningPublicId,
characterPublicId })` globally. Pending records can be retried with the same UUID
after timeouts or process restarts; completion is idempotent.

Apply `CreateAccountsAndCharacterProvisionings` globally and
`UniqueCharacterAccount` in each kingdom. The latter fails if existing data already
contains multiple characters for one account; it does not discard progress.
Provisioning currently creates the character only. Initial resources/buildings must
be added to the same Realm transaction when their models are introduced. These
internal repositories do not establish ownership authorization, session admission,
automatic pending-job dispatch, or Firebase account merging/deletion policies.

### Cities and character resources

`City` (`cities`, PostgreSQL por reino) liga `characterId` a `worldObjectId`.
Cada vínculo é único e imutável, inclusive após arquivamento ou exclusão lógica.
Posição, ocupação e nível permanecem em `WorldObject`. Uma chave estrangeira
composta e um discriminador interno `castleObjectType`, omitido das consultas
normais e dos inputs, garantem que o objeto seja `castle`; também impedem mudar
seu tipo enquanto ele representa uma cidade. A API dos repositórios de cidade
oferece criação e leitura, sem transferência de propriedade.

`CharacterResources` (`character_resources`) tem um registro por `characterId`,
com `wood`, `food`, `stone`, `iron`, `silver`, `gold` e `crystals`. Os saldos usam
`bigint` não negativo e strings decimais, até `9223372036854775807`. O vínculo com
o personagem é imutável. Os valores padrão são zero; o pacote inicial de jogo
não é concedido por defaults da tabela.

Use `createCityRepositories` e `createCharacterResourcesRepositories` dos módulos
`factories/city-repositories` e `factories/character-resources-repositories`.
Aplique `CreateCitiesAndCharacterResources` em cada banco de reino antes do uso.
Esses modelos ainda não estão integrados ao provisionamento. A criação da cidade,
objeto/ocupação e concessão inicial deverão compartilhar a transação do personagem.
Atualizações dos saldos são internas: débitos, créditos, custos e recibos devem ser
coordenados pela camada de gameplay em transação, com leituras sem cache para
as decisões econômicas.

### Construction persistence

`CityBuilding` (`city_buildings`, PostgreSQL por reino) representa somente Castelo,
Fazenda, Serraria, Pedreira e Mina de Ferro, definidos em `BuildingType`. Cada posição
pertence a uma cidade; posição, cidade e tipo são imutáveis nos models. Há no máximo
um Castelo por cidade, inclusive após exclusão lógica. `level` começa em zero e
`stateVersion` usa string decimal bigint para controle de concorrência pelo consumidor.
As definições não estabelecem posições iniciais nem limites de instâncias dos produtores.

`ConstructionJob` (`construction_jobs`) guarda construção, cidade, personagem,
recibo inicial, UUID/versão da configuração aceita, níveis de origem/destino e instantes
`startedAt`/`completesAt` em `timestamptz`. Cada operação avança um nível. As chaves
compostas impedem associar a fila a outra cidade ou ao recibo de outro personagem.
Há uma fila pendente por construção, mesmo se arquivada/excluída logicamente.
O estado `completed` exige `completedAt >= completesAt` e não pode ser reaberto.
O Scheduler deverá consultar todos os registros `pending`, incluindo os arquivados
ou excluídos logicamente, e completar a fila junto da atualização da construção.
Este lote não define quantidade de filas simultâneas por cidade, aceleração ou cancelamento.

`CommandReceipt` (`command_receipts`) mantém pedido e resposta binários, comando,
personagem e `ownerEpoch`, com unicidade permanente de `(characterId, requestId)`.
`EconomyPosting` (`economy_postings`) identifica cada lançamento por `(receiptId, entry)`
e registra personagem afetado, recurso, motivo, saldo anterior, variação assinada e
saldo posterior. Os saldos são strings bigint não negativas; o banco verifica
`after - before = delta`. Recibos e lançamentos não possuem exclusão lógica e triggers
rejeitam alterações ou exclusões. O epoch registrado não substitui a verificação
transacional da autoridade atual do Realm.

`MutationOutbox` (`mutation_outbox`) preserva os eventos do recibo, identificados por
`(receiptId, eventIndex)` e UUID público estável. `publishedAt = null` indica publicação
pendente. Tentativas e próximo prazo podem mudar; identidade e conteúdo não podem
ser substituídos, nem o registro apagado. A publicação confirmada não pode ser revertida.
Pedidos, respostas e payloads têm limite individual de 1 MiB. Não há expiração
automática dos recibos, lançamentos ou intenções de publicação neste lote.

Aplique `CreateConstructionPersistence` por reino. Os novos models estão disponíveis
no export principal e no `createPostgresDataSource`. O pacote mantém TypeORM nesta
etapa; a adoção de Kysely descrita na arquitetura continua sendo trabalho separado.

`buildingConfigurationModel(connection)` de `models/global/building-configuration`
usa a coleção MongoDB global `building_configurations`. Cada publicação tem UUID,
`schemaVersion = 1`, `configurationVersion`, tipo/nível, limite de instâncias, duração
em segundos, todos os custos como strings bigint explícitas e requisitos limitados
aos cinco tipos selecionados. Produtores exigem recurso correspondente, produção
por hora e capacidade; Castelo exige uma instância e não aceita produção.
Versões são únicas por `(buildingType, level, configurationVersion)`. O schema
rejeita edição/exclusão pelas operações normais do model; acesso direto à coleção
exige as permissões do proprietário e não deve alterar publicações aceitas.
Configurações são documentos originais e precisam de backup e retenção enquanto
referenciadas por operações. Não há projeção nem TTL nesta coleção.

`prepareBuildingCatalog` prepara coleção e índices, também durante `seed`.
Não insere valores históricos: o catálogo antigo do Castelo depende de construções
excluídas deste recorte. Custos, prazos e requisitos precisam ser publicados
explicitamente para as regras de OpenCoK. Publicação não ativa regras automaticamente.

Esses models/schemas ainda não possuem handlers de construção, repositórios próprios,
integração ao provisionamento, ativação de configuração, Scheduler ou publicador.
O consumidor deverá coordenar construção/fila, saldo, lançamento, recibo e outbox
na mesma transação, conferir autorização e epoch, comparar pedidos repetidos e
retornar a resposta gravada. Produção passiva e liquidação de recursos ficam para
um lote posterior.

`bun run test:construction` verifica migrations, restrições, rollback transacional,
retenção e exatidão de valores em bancos temporários PostgreSQL/MongoDB, removidos
ao final. Aceita os mesmos argumentos de conexão de `migrate`.
