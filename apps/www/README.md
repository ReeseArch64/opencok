# OpenCoK www

Landing page e wiki em português, construídas com Astro e servidas como arquivos estáticos pelo Apache. O cliente do jogo continua em `apps/web`.

## Desenvolvimento

Na raiz do monorepo:

```sh
bun install --frozen-lockfile
bun run --cwd apps/www dev
```

Abra `http://localhost:4321`. Os comandos `dev` e `build` preparam automaticamente as imagens a partir de `assets/imgs` e `data/cdn/extracteds`. Esses diretórios locais precisam estar presentes; os originais são somente leitura. A preparação copia apenas as imagens referenciadas, sem publicar os manifestos, logs ou o acervo completo.

## Build e Apache

```sh
bun run --cwd apps/www test
bun run --cwd apps/www build
bun run --cwd apps/www preview
```

A saída fica em `apps/www/dist`. Para servir com Apache:

```sh
 docker build -t opencok-www apps/www
 docker run --rm -p 8080:8080 opencok-www
```

Abra `http://localhost:8080`. A imagem usa a build já preparada, sem precisar dos assets originais no container. O arquivo `apache/www.conf` configura páginas de erro, desativa listagem de diretórios e define cabeçalhos de resposta. Em uma instalação Apache existente, ajuste o caminho do `Directory` para o diretório de publicação e use `dist` como `DocumentRoot`.

O serviço `www` está integrado ao Compose. Depois de gerar o build Astro, inicie apenas o site em desenvolvimento:

```sh
docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up -d --build www
```

O desenvolvimento monta `dist` como somente leitura para refletir novos builds. A produção usa o conteúdo da imagem, com filesystem somente leitura e healthcheck próprio. O acesso direto usa a porta 8080; host público e TLS pertencem à configuração do operador.

## Conteúdo e disponibilidade

- `src/data/catalog.json`: catálogo com fontes locais, categorias e status. `soon` exibe **Em breve**; `available` exibe **Disponível**. Altere para `available` somente após confirmar a habilitação no jogo.
- `src/data/site.mjs`: URLs de Android, iOS e navegador. Valores `null` deixam os botões desabilitados com **Em breve**. O navegador já aponta para `https://web.opencok.com`; preencha os endereços de distribuição Android e iOS quando disponíveis.
- `src/data/guides.mjs`: guias editoriais da wiki.

Após alterar conteúdo ou URLs, gere uma nova build. O catálogo contém 46 tropas, 22 aparências de senhor, 1.236 skins e 3 eventos, inicialmente em breve. Skins usam nomes em português do cliente; aparências de senhor preservam os códigos `gXXX` de `lord_image`. Imagens são prévias estáticas, sem compor animações Spine.

As galerias oferecem busca sem distinção de acentos ou maiúsculas, filtros combinados, estado vazio, carregamento progressivo e URLs compartilháveis com filtros. Sem JavaScript, todas as fichas continuam acessíveis. O site não consulta o estado do servidor: a disponibilidade é editorial.

## Validação

O comando de testes executa Bun e os testes Python do importador. A cobertura inclui busca, filtros, status, unicidade de rotas, existência dos assets, classificação conforme o servidor, deduplicação de variantes, rejeição de divergências e preservação de disponibilidade na reimportação. A build Astro gera as páginas dos catálogos e de cada item. Não há mudanças de gameplay, persistência ou contratos nativos neste aplicativo.

## Classificação de cosméticos

Avatar significa a aparência do senhor, identificada por `lord_image.id` e `lord_image.name`. A relação é validada pelo servidor em `UserProfile` ao alterar `pic`. Ícones `avatar_zhanshi_*` são prévias do guarda-roupa, não aparências do senhor: `AvatarCell.lua` os seleciona pelo item ou pelo nome do cosmético.

O campo `status.type2` é interpretado por `AvatarManager` no servidor e pelas categorias `AvatarType_*` no cliente:

| Tipo na wiki | Códigos  | Conteúdo                    |
| ------------ | -------- | --------------------------- |
| Castelo      | 100      | Aparência do castelo        |
| Asa          | 109      | Asas                        |
| Balão        | 103, 105 | Conversa e balão do castelo |
| Marcha       | 101      | Aparência da marcha         |
| Efeito       | 108      | Efeitos de castelo          |
| Decoração    | 102      | Terreno da cidade           |
| Perfil       | 104, 115 | Brasões e molduras          |

A importação exige correspondência entre o cliente Android v12.06.0 e o catálogo de servidor da mesma versão. As imagens são selecionadas por referências exatas do cliente nos manifestos extraídos. Tipos não mapeados e imagens não encontradas não são classificados por suposição. Onze senhores presentes em `lord_image` ainda não têm imagem estática completa localizada e não entram nesta galeria.

Fontes locais consultadas, somente leitura:

- `data/android/extracted/v12.06.0/assets/local/database.local.xml`: `status`, `goods`, `lord_image`.
- `data/android/extracted/v12.06.0/assets/local/text_pt.ini`: nomes em português.
- `data/android/extracted/v12.06.0/assets/lua_static/game/avatar/AvatarController.lua`, `AvatarViewEx.lua` e `AvatarCell.lua`: tipos e resolução dos ícones.
- `data/resources/v12.06.0/status.xml` e `lord_image.xml`: registros do servidor.
- `data/reference/server/modules/gameplay/src/main/java/com/elex/cok/gameengine/avatar/AvatarManager.java`: interpretação de `type2`.
- `data/reference/server/modules/gameplay/src/main/java/com/elex/cok/puredb/model/UserProfile.java`: validação de `lord_image`.

Para atualizar apenas os cosméticos a partir dessas fontes locais:

```sh
python3 apps/www/scripts/import-cosmetics.py
bun run --cwd apps/www test
bun run --cwd apps/www build
```

O importador preserva tropas, eventos e o status de fichas já conhecidas. Novas fichas começam em breve. Novos tipos precisam de classificação confirmada em `src/data/cosmetic-types.json` antes da importação.
