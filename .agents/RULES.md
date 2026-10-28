# Regras e limites de atuação

Permissões de implementação, teste, formatação ou organização não autorizam modificar conteúdo protegido nem ampliar o escopo da tarefa. Estas regras se aplicam também a ferramentas, scripts, geradores e agentes delegados.

## Escopo

- Antes de escrever, examine o estado do Git e identifique os caminhos necessários à tarefa.
- Altere somente o necessário para atender ao pedido. Não faça refatorações, limpezas, atualizações de dependências ou reorganizações incidentais.
- Preserve alterações existentes, inclusive arquivos não rastreados e mudanças já preparadas para commit. Não sobrescreva, reverta, mova nem exclua trabalho alheio.
- Se encontrar problemas fora do escopo, relate-os. Detectar um problema não autoriza corrigi-lo.
- Em caso de dúvida sobre destino, propriedade ou autorização de escrita, pare e pergunte ao responsável pelo projeto.

## Proteções

Somente leitura por padrão, incluindo arquivos e subpastas:

- `.github/`: automações, governança e configurações do GitHub.
- `.agents/`: regras, habilidades e configurações dos agentes, incluindo este arquivo.
- `docs/`: decisões e documentação de projeto.
- `infra/`: infraestrutura e implantação.
- Qualquer `AGENTS.md` no repositório.
- Na raiz: `PRODUCT.md`, `ARCHITECTURE.md`, `CONTEXT.md`, `CONTRIBUTING.md`, `DESIGN.md`, `GLOSSARY.md`, `RULES.md` e `SECURITY.md`, quando existentes.
- Configurações de ferramentas, manifests de dependências e lockfiles, incluindo `package.json`, `bun.lock`, configurações de TypeScript, lint, formatação e hooks.

Esses caminhos identificam proteções, não instruções de leitura. Consultar não exige autorização de escrita. O `README.md` raiz e READMEs de aplicações e pacotes são editáveis no escopo da tarefa; README dentro de pasta protegida não é exceção.

Arquivos de testes, pilotos ou experimentos já existentes em pastas protegidas não autorizam novos arquivos semelhantes, expansão desses diretórios ou remoção automática do conteúdo existente.

## Autorização

Criar, editar, excluir, mover ou renomear conteúdo protegido exige **pedido explícito e confirmação posterior do responsável pelo projeto**, após a IA apresentar:

1. Os caminhos afetados e as operações pretendidas.
2. As mudanças propostas e por que são necessárias.
3. Os efeitos esperados, inclusive arquivos gerados por comandos.

Aguarde a confirmação antes de escrever. O pedido inicial não é confirmação. Não presuma autorização por pedidos genéricos como “implemente”, “corrija os testes”, “organize” ou “formate”.

A autorização vale somente para o escopo apresentado. Novos caminhos ou mudanças adicionais exigem nova confirmação. Mover conteúdo para dentro ou fora de pastas protegidas também exige esse procedimento.

Não contorne a proteção por links simbólicos, comandos indiretos, geradores ou delegação. Uma autorização para executar ferramentas não autoriza suas escritas em conteúdo protegido.

## Diretórios e destinos

- `apps/`: aplicações e sua composição.
- `packages/`: contratos, regras e componentes reutilizáveis.
- Testes de uma aplicação ou pacote: use a estrutura já adotada pelo componente, como `tests/` ou `integration/`. Testes próximos ao código só quando esse for o padrão local.
- `tests/` na raiz: contratos compartilhados e cenários isolados de integração entre componentes, quando necessários ao pedido.
- `docs/` e `infra/`: mantenha suas responsabilidades e respeite a autorização de escrita.
- `.agents/`: somente instruções, habilidades e configurações dos agentes. Não é área de trabalho temporária.
- `.github/`: não é área de testes da aplicação, benchmarks, pilotos de ferramentas, relatórios, logs, caches ou builds. Uma alteração legítima de automação ou teste específico de CI exige autorização e destino apresentados previamente.

Antes de criar uma pasta, procure um destino existente adequado. Não crie estruturas paralelas, aplicações planejadas ou diretórios genéricos de experimentação por iniciativa própria. Não imponha uma reorganização ou limite artificial de profundidade ao código existente.

## Arquivos temporários e gerados

- Use um diretório temporário do sistema, exclusivo da tarefa e fora do repositório, para scripts exploratórios, reproduções descartáveis, benchmarks, logs e relatórios intermediários. Não copie segredos ou entradas privadas para esse local.
- Artefatos normais das ferramentas devem ficar nos destinos já configurados, como `dist/` e `coverage/`. Verifique os efeitos de escrita antes de executar comandos.
- Testes permanentes e fixtures mínimas pertencem ao componente testado, não ao diretório temporário nem à `.github/`.
- Não versione caches, builds, cobertura, metadados de compilação ou resultados intermediários. Não altere `.gitignore` para esconder arquivos criados indevidamente.
- Ao concluir, remova apenas os temporários criados pela própria tarefa e cuja propriedade seja conhecida. Nunca faça limpeza ampla de arquivos ignorados ou não rastreados.

## Formatos e ferramentas

Este é um repositório de software, não um vault. Código, testes e configurações podem usar os formatos já adotados pelo componente; não se aplica uma lista limitada a Markdown e PDF.

- Priorize Markdown para documentação editável.
- Reutilize ferramentas e dependências existentes. Não instale novas ferramentas, altere manifests ou lockfiles nem substitua tecnologias sem autorização para esses caminhos.
- Não crie arquivos auxiliares persistentes quando um comando ou um arquivo temporário resolver a necessidade.
- Não gere nem adicione imagens, binários ou exportações sem necessidade explícita da tarefa.
- Execute verificações pertinentes. Não reduza regras, exclusões de validação ou exigências de testes para obter aprovação.
- Prefira verificações sem escrita. Aplique correções automáticas somente nos caminhos autorizados; não execute formatação ou correção global que possa alterar outros arquivos.

## Entradas privadas e operações destrutivas

- Mantenha entradas originais de clientes, arquivos privados do jogo e referências locais somente para leitura. Extrações e transformações exigem destino separado e autorizado.
- Não exponha credenciais, chaves, tokens, código privado da Elex ou dados de jogadores em código, fixtures, logs, relatórios ou serviços externos.
- Não force a inclusão de arquivos ignorados nem trate entradas locais privadas como dependências compartilhadas.
- Não execute limpeza destrutiva, descarte de alterações ou reescrita de histórico sem autorização específica. Isso inclui `git reset --hard`, `git clean` e restaurações que sobrescrevam trabalho existente.
- Testes não autorizam acesso a produção, envio de mensagens, cobranças, implantação ou mutação de dados reais. Use recursos locais ou ambientes de teste explicitamente autorizados.

## Referências e entrega

- Use links Markdown relativos para referências internas; confira a existência do destino e da seção. Não use links de Obsidian.
- Não invente URLs, resultados de testes ou evidências. Diferencie verificação executada, falha de ambiente e hipótese.
- Centralize as instruções de leitura no `AGENTS.md`; não crie cadeias recursivas de leitura obrigatória entre documentos.
- Antes de concluir, revise o diff e o estado do Git. Relate os caminhos alterados, as verificações executadas e as limitações pendentes.
- Siga o fluxo de contribuição para commits e entrega, incluindo apenas mudanças da tarefa. Uma exigência de entrega não amplia a autorização para modificar arquivos protegidos.
