# Protocolo binário OpenCoK v1

WebSocket `/ws`, subprotocolo obrigatório `opencok.binary.v1`. Cada mensagem é um
frame binário com versão `u8 = 1`, opcode `u8` e payload. Inteiros multibyte usam
big-endian. Texto, versões desconhecidas, opcodes desconhecidos e payloads
malformados encerram a conexão com erro de protocolo.

## Bootstrap

| Opcode | Direção | Payload |
| --- | --- | --- |
| 1 Hello | cliente → servidor | vazio |
| 2 Welcome | servidor → cliente | sessão: 16 bytes aleatórios; heartbeat: u32 ms; timeout: u32 ms |
| 3 Ping | servidor → cliente | vazio |
| 4 Pong | cliente → servidor | vazio |

Hello tem exatamente 2 bytes; Welcome, 26. A sessão é anônima e não identifica um
jogador. O cliente envia Hello após negociar o subprotocolo; o servidor admite a
conexão ao enviar Welcome. O servidor envia Ping a cada 25 s e exige Pong dentro
do timeout de 60 s. Pongs espontâneos são inválidos. Consultas de mapa não renovam
o prazo do heartbeat. O bootstrap usa codecs manuais e a fixture
[testdata/bootstrap.json](testdata/bootstrap.json).

## Consulta do mapa

O contrato canônico está em [world.ts](../packages/contracts/src/world.ts), com
schemas Zod. O gerador próprio [generate.ts](../packages/contracts/scripts/generate.ts)
exporta codecs Go e Dart para um subconjunto pequeno: inteiros não negativos de
32 bits, strings UTF-8, arrays limitados e objetos de campos obrigatórios.
TypeScript usa os mesmos schemas para codificar, decodificar e validar.

Todos os campos numéricos do payload são `u32`; strings são comprimento `u32` em
bytes seguido de UTF-8; arrays são quantidade `u32` seguida de seus itens. Campos
seguem a ordem declarada abaixo. O tamanho máximo de um pacote de mapa é 65.536
bytes. O cliente continua limitado a frames de 64 bytes no bootstrap e nas
consultas. Respostas são limitadas antes de sua decodificação no Go e Dart.

| Opcode | Direção | Campos em ordem |
| --- | --- | --- |
| 16 MapQuery | cliente → servidor → Realm | requestId, kingdomId, minX, minY, maxX, maxY |
| 17 MapRegion | Realm → servidor → cliente | requestId, status, kingdomId, name, columns, rows, objects, blocked |

- `MapQuery` tem exatamente 26 bytes. IDs são u32; coordenadas vão de 1 a 1200.
  Coordenada zero, limites invertidos, região maior que 64 × 64 ou reino diferente
  de 1 produzem status 1. Valores acima do limite do schema são malformados.
- `status`: 0 sucesso; 1 região/reino inválido; 2 Realm indisponível. Só use os
  objetos e metadados do mapa em respostas de sucesso.
- `name`: até 64 bytes UTF-8. `columns` e `rows`: 1200 no reino de desenvolvimento.
- `objects`: até 256 itens com campos `id, kind, x, y, width, height, level`.
  Tipos ativos: 1 castelo, 2 madeira, 3 comida; código 4 reservado. A posição é a célula
  mínima do retângulo ocupado; largura/altura são medidas em células, não pixels.
- `blocked`: até 4096 itens com campos `x, y`, indicando terreno bloqueado. Objetos
  ocupados são representados separadamente. Células livres são implícitas.

`requestId` correlaciona respostas, sem significado de identidade ou autorização.
Flutter limita consultas pendentes a 16 e aguarda até 5 s. Go limita consultas por
socket a uma reserva de 8, renovada a 8/s, e faz uma chamada HTTP por vez por
socket, com timeout de 3 s, sem redirecionamentos e sem retry automático. Falha
no Realm retorna status 2 e mantém a conexão utilizável. Heartbeat e respostas
compartilham um mutex de escrita.

O HTTP interno usa `POST /map/query` com o mesmo frame binário e corpo limitado.
Este primeiro fluxo é somente leitura e anônimo; não estabelece autenticação,
colocação persistida de cidades nem autoridade de jogador.

Após alterar schemas, execute na raiz:

```sh
bun --no-env-file packages/contracts/scripts/generate.ts
bun --no-env-file packages/contracts/scripts/generate.ts --check
```

O gerador também atualiza [testdata/world.json](testdata/world.json), consumido
pelos testes de TypeScript, Go e Dart. Não edite codecs gerados à mão. Go e Dart
são necessários para formatar o código gerado. Os limites estruturais são
validados nos três consumidores; regras de região e terreno pertencem ao Realm.
