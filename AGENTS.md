# Guia para Agentes de IA

Orienta contribuições ao OpenCoK, uma plataforma de jogo auto-hospedada, respeitando o escopo autorizado e os dados de jogadores e operadores.

## Contexto e fontes

Centralize a leitura neste guia, sem cadeias recursivas obrigatórias. Reutilize contexto já lido; releia após mudanças ou para conferir orientações. Procure títulos e leia apenas seções relevantes de documentos extensos. Se uma fonte necessária estiver ausente ou inacessível, informe; não presuma seu conteúdo.

| Fonte                                   | Quando e para quê                                                                                                                   |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| [Regras de atuação](.agents/RULES.md)   | Antes de escrever: escopo, caminhos protegidos, confirmação de autorização e destinos.                                              |
| [Segurança](.github/SECURITY.md)        | Acesso a dados, segredos, transmissões, incidentes e relatos privados.                                                              |
| [Contribuição](.github/CONTRIBUTING.md) | Git/GitHub, padrões, testes, revisão e entrega em toda tarefa de contribuição.                                                      |
| [Produto](PRODUCT.md)                   | Objetivos, escopo e comportamento de jogadores/operadores.                                                                          |
| [Arquitetura](.github/ARCHITECTURE.md)  | Serviços, responsabilidades, infraestrutura e compatibilidade; antes de criar, mover ou reorganizar e antes de trabalho no cliente. |
| [Glossário](GLOSSARY.md)                | Vocabulário, nomes, contratos e apresentação de código.                                                                             |
| [ADRs](docs/decisions/README.md)        | Consultar decisões aceitas antes de mudar tecnologia.                                                                               |

Mantenha justificativas em ADRs, desenho na arquitetura, decisões de produto em `PRODUCT.md` e procedimentos no guia de contribuição; não duplique definições aqui. Use links Markdown relativos, não links Obsidian.

## Execução e entrega

- Examine Git e código relevante antes de editar; preserve alterações existentes, inclusive staged e não rastreadas. Mantenha o foco no pedido e padrões existentes antes de acrescentar dependências ou abstrações. Confirme alterações protegidas conforme as regras.
- Use `generate-tests` para cada implementação e cubra as camadas exigidas no guia. Execute `bun run lint`, `bun run format:check`, testes e verificações de tipos pertinentes. Corrija violações próprias sem enfraquecer verificações; registre bloqueios e justificativas de inaplicabilidade.
- Ao concluir uma implementação, use `code-review` contra a issue e critérios de aceite antes da PR, nos eixos Standards e Spec; resolva bloqueios e repita após mudanças, conforme o guia.
- Revise diff/Git, documente premissas e novas dependências no local apropriado e relate alterações, validações e limitações. Siga o fluxo de commits, branches, stacks e PRs; não amplie autorização para cumprir a entrega.

## Dados e entradas privadas

Ignorados são entradas locais, não dependências compartilhadas; nunca force inclusão de arquivos privados, artefatos do cliente ou chaves. Mantenha originais mobile somente leitura e extraia, altere ou empacote em destino separado autorizado. Consulte apenas dados necessários; exclua credenciais, chaves, tokens, código privado Elex e dados de jogadores de código, logs e relatórios. Diante de exposição, interrompa e avise sem reproduzir o valor, seguindo a política de segurança.
