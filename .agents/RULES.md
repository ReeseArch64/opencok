# Regras e limites de atuação

Aplicam-se a agentes, ferramentas, scripts, geradores e delegados. Implementar, testar, formatar ou organizar não autoriza ampliar escopo nem alterar conteúdo protegido.

## Escopo e autorização

- Antes de escrever, examine o Git e os caminhos necessários. Altere apenas o pedido, sem refatoração, limpeza, dependências ou reorganização incidentais. Preserve trabalho alheio, inclusive não rastreado e staged; não sobrescreva, reverta, mova ou exclua. Problemas fora do escopo devem ser relatados, não corrigidos.
- Dúvidas sobre destino, propriedade ou autorização: pare e pergunte ao responsável.
- Criar, editar, excluir, mover ou renomear conteúdo protegido exige **pedido explícito e confirmação posterior**, após apresentar caminhos/operações, mudanças/justificativa e efeitos, inclusive arquivos gerados. Aguarde: o pedido inicial ou uma instrução genérica não é confirmação.
- A autorização limita-se ao escopo apresentado; novos caminhos, mudanças e movimentos para dentro/fora de áreas protegidas exigem nova confirmação. Não contorne por links simbólicos, comandos indiretos, geradores ou delegação; executar ferramentas não autoriza suas escritas.

## Conteúdo protegido

Somente leitura por padrão, incluindo arquivos e subpastas:

- `.github/` (inclusive `ARCHITECTURE.md`, `SECURITY.md`, `CONTRIBUTING.md`), `.agents/` (inclusive este arquivo), `docs/` e `infra/`.
- Qualquer `AGENTS.md`; na raiz, `PRODUCT.md`, `CONTEXT.md`, `DESIGN.md`, `GLOSSARY.md` e `RULES.md`, quando existentes.
- Configurações de ferramentas, manifests e lockfiles, inclusive `package.json`, `bun.lock`, TypeScript, lint, formatação e hooks.

Proteção não é instrução de leitura: consultar dispensa autorização de escrita. README raiz e READMEs de aplicações/pacotes são editáveis no escopo; READMEs em pastas protegidas não são exceção. Testes, pilotos e experimentos existentes não autorizam expansão nem remoção automática.

## Destinos e temporários

- `apps/`: aplicações/composição; `packages/`: contratos, regras e componentes reutilizáveis. Testes seguem o componente (`tests/`, `integration/` ou junto ao código somente quando já convencional); testes/fixtures permanentes e mínimos pertencem a ele, não a temporários ou `.github/`. `tests/` raiz destina-se a contratos compartilhados e integração isolada entre componentes exigidos pela tarefa.
- Respeite responsabilidades/autorização de `docs/` e `infra/`. `.agents/` contém somente instruções, habilidades e configurações, nunca trabalho temporário. `.github/` não recebe testes da aplicação, benchmarks, pilotos, relatórios, logs, caches ou builds; automação legítima/teste específico de CI exige autorização e destino apresentados previamente.
- Procure destino existente antes de criar pastas. Não invente estruturas paralelas, aplicações planejadas, áreas genéricas de experimentação, reorganização ou limite artificial de profundidade.
- Scripts exploratórios, reproduções descartáveis, benchmarks, logs e relatórios intermediários usam temporário do sistema exclusivo da tarefa, fora do repositório, sem segredos/entradas privadas. Remova apenas temporários próprios de propriedade conhecida; nunca limpe amplamente ignorados/não rastreados.
- Artefatos normais ficam nos destinos configurados (`dist/`, `coverage/`); verifique efeitos de escrita antes dos comandos. Não versione caches, builds, cobertura, metadados de compilação ou resultados intermediários, nem altere `.gitignore` para esconder arquivos indevidos.

## Formatos, ferramentas e dados

- Este é um repositório de software, não um vault: use formatos adotados pelo componente, sem restrição a Markdown/PDF; prefira Markdown para documentação editável.
- Reutilize ferramentas/dependências; instalar ferramentas, alterar manifests/lockfiles ou substituir tecnologias exige autorização. Evite auxiliares persistentes quando comandos/temporários bastam; imagens, binários e exportações exigem necessidade explícita.
- Execute verificações pertinentes, preferindo as sem escrita. Não enfraqueça regras, exclusões ou testes para passar. Correções automáticas limitam-se a caminhos autorizados; não execute correções/formatação globais que alterem outros arquivos.
- Originais de clientes, arquivos privados do jogo e referências locais são somente leitura; extrações/transformações exigem destino separado autorizado. Não exponha credenciais, chaves, tokens, código privado Elex ou dados de jogadores em código, fixtures, logs, relatórios ou serviços externos. Não force inclusão de ignorados nem use entradas privadas como dependências compartilhadas.
- Limpeza destrutiva, descarte ou reescrita de histórico exigem autorização específica, inclusive `git reset --hard`, `git clean` e restaurações que sobrescrevam trabalho. Testar não autoriza produção, mensagens, cobranças, implantação ou mutações reais: use recursos locais ou testes explicitamente autorizados.

## Referências e entrega

- Use links Markdown relativos internos e verifique destino/seção; não use links Obsidian. Centralize instruções de leitura em `AGENTS.md`, sem cadeias recursivas obrigatórias.
- Não invente URLs, testes ou evidências; distinga execução verificada, falha de ambiente e hipótese.
- Revise diff/Git antes de concluir; relate caminhos, verificações e limitações. Siga o fluxo de commits/entrega somente para mudanças da tarefa; exigências de entrega não ampliam autorização sobre arquivos protegidos.
