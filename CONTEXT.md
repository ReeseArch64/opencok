# Contexto técnico do OpenCoK

Antes de recomendar, planejar ou executar, identifique o problema, as versões afetadas, os responsáveis pelo estado e o resultado verificável. O contexto é o projeto e sua evolução técnica, não a vida pessoal dos contribuidores. Não presuma recursos, implantação, suporte ou autorização.

## O que é o projeto

OpenCoK é uma plataforma auto-hospedada, reproduzível e compatível com Clash of Kings para operar, estudar e personalizar reinos privados. Integra backend de jogo, serviços web, persistência, infraestrutura, ferramentas operacionais e clientes, sem depender do serviço online original ou de procedimentos ocultos.

Não é um snapshot imutável de servidor nem uma reprodução da infraestrutura comercial do publicador. O operador controla implantação e dados; o backend mantém a autoridade sobre regras e progresso. Compatibilidade exige evidência por conjunto de cliente, recursos, protocolo, esquema e regras, não apenas inicialização bem-sucedida.

A configuração padrão prepara dois reinos com estado isolado e serviços globais compartilhados; o Compose de desenvolvimento inicia atualmente um servidor de reino ativo. Reconhecer as versões `v5.36.0`, `v6.12.20`, `v9.27.0` e `v12.06.0` não comprova suporte a todas elas.

## Base técnica e limites de responsabilidade

- **Código:** monorepo TypeScript; Bun é a ferramenta de desenvolvimento. O runtime de produção permanece em aberto, com o mandato anterior de Node.js suspenso. Imagens locais não comprovam prontidão de produção.
- **Organização:** `apps/` compõe processos e configuração; `packages/` concentra capacidades reutilizáveis e domínios; `infra/` mantém implantação e entrada de rede. Pacotes não importam aplicações. A migração para pacotes donos de domínio é incremental, preservando contratos públicos e registrando a retirada de fachadas.
- **Autoridade:** o servidor do reino é dono do estado de jogo, economia e combate. API, Chat, Scheduler e workers têm responsabilidades delimitadas, não autorização genérica para escrever gameplay. Scheduler descobre vencimentos e solicita transições ao dono; workers executam apenas integrações e projeções autorizadas.
- **Persistência:** PostgreSQL é a autoridade transacional; MongoDB atende documentos e projeções; Redis atende cache, sessões e coordenação efêmera, nunca como único registro durável do progresso. Objetos privados usam interface S3; MinIO é a base local, distinta da distribuição de releases.
- **Clientes:** o APK Elex autorizado permanece transitório. Novos adaptadores preservam identidade, progresso e contratos; atualização Lua/nativa é planejada, Flutter/Dart é avaliação sem prazo de substituição e o cliente web continua experimental.

Esses limites orientam mudanças; detalhes, inventário e topologia pertencem à arquitetura. Diretórios existentes, serviços planejados e ADRs aceitos não comprovam implementação, implantação ou verificação concluídas.

## O que deve ser tecnicamente

- **Reproduzível:** configuração explícita, dependências identificadas, versões rastreáveis e início do ambiente sem reparos manuais não documentados. Entradas privadas não podem virar dependências compartilhadas ocultas.
- **Modular e compreensível:** domínios e contratos com donos claros; composição nas aplicações, regras fora do transporte e dependências explícitas. Preferir padrões existentes a novas camadas ou abstrações sem necessidade demonstrada.
- **Consistente e recuperável:** progresso preservado em retries, desconexões, reinícios e recriação de serviços. Custos, concessões, recibos e eventos devem respeitar as transações e invariantes do dono, sem duplicar bens ou inventar sucesso.
- **Seguro por limite:** autenticação, validação e autorização no servidor; isolamento entre reinos e ambientes; menor privilégio; credenciais fora de clientes, código e evidências. Dados pessoais e privados não são fixtures de depuração.
- **Resiliente:** esperas, filas, recuperação e processamento limitados. Dependências opcionais degradam de modo explícito, sem paralisar login ou gameplay essencial. Mais réplicas não substituem exclusão de escritores obsoletos nem transferência segura de autoridade.
- **Observável e operável:** distinguir preparação, commit e entrega; medir latência, recursos, backlog e recuperação sem expor payloads ou identidades privadas. Logs operacionais não substituem estado autoritativo ou auditoria econômica durável.
- **Validável e evolutivo:** mudanças com testes e evidências proporcionais ao risco, compatibilidade por versão e caminhos de migração, rollback e restauração. Testes sintéticos não comprovam renderização no cliente nativo.

## Entendimento e avaliação

1. Delimite objetivo, escopo, comportamento esperado e critérios de aceite. Identifique clientes, serviços, domínios, dados e integrações afetados.
2. Separe requisito de produto, contrato existente, decisão técnica e evidência de execução. Confira o status das decisões pertinentes: proposta não é decisão aceita; aceitação não é implementação concluída.
3. Verifique no código e nas evidências o que funciona hoje. Não promova metas de produção, capacidade estimada, presença de dependências ou documentação de intenção a fatos operacionais.
4. Avalie efeitos sobre autorização, concorrência, persistência, economia, protocolo e recuperação antes de conveniência de implementação. Não substitua comportamento desconhecido por defaults permissivos ou respostas de falso sucesso.
5. Defina como reproduzir, testar, observar, implantar e reverter a mudança, preservando dados válidos. Lacunas relevantes exigem investigação ou esclarecimento antes da etapa que depender delas.

## Ordem de avaliação e prioridades

**Escopo autorizado e decisões vigentes → segurança e privacidade → correção e integridade do estado → compatibilidade e recuperação → utilidade real → simplicidade e manutenibilidade → integração → performance medida → conveniência.** Ganhos posteriores não justificam violar invariantes ou restrições anteriores.

As prioridades são estabilizar clientes ativos, remover dependências externas bloqueantes, melhorar desempenho e recuperação, completar mídia e tornar a operação compreensível. Não transformar otimizações, mudanças de stack ou reescritas de cliente em pré-requisitos sem decisão explícita. Capacidade de produção, alta disponibilidade e metas de recuperação precisam de medição e testes, não de promessas derivadas do desenho.

## Interpretação, conflitos e fontes

Diante de conflito, apresente o requisito ou contrato afetado, a evidência disponível e alternativas compatíveis. Não altere decisões ou registros para justificar uma implementação; mudanças de direção exigem o processo e a autorização correspondentes. Diferencie incompatibilidade comprovada, hipótese e ausência de evidência.

Este documento sintetiza orientação técnica, sem substituir fontes ou criar decisões de tecnologia. [Produto](PRODUCT.md) define objetivos e limites; [arquitetura](.github/ARCHITECTURE.md), desenho e responsabilidades; [ADRs](docs/decisions/README.md), decisões e status; [contribuição](.github/CONTRIBUTING.md), testes, revisão e entrega; [regras](.agents/RULES.md) e [segurança](.github/SECURITY.md), autorização e proteção de dados. O [guia de agentes](AGENTS.md) centraliza quando consultar cada fonte, sem exigir leitura recursiva.

O projeto não pressupõe hospedagem pública multi-tenant, escala global, compatibilidade universal, dependência de contas de nuvem dos contribuidores ou direitos sobre material de terceiros. Componentes substitutos devem ser de autoria independente ou autorizada, com origem e licença documentadas.
