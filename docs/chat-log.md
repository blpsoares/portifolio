# Log de conversas do bra.ia

## Estado

| Passo | Situação |
|---|---|
| Banco D1 `bryan-chat` criado | ✅ feito (conta Zlucason1, id `0b33836c-5cf2-4eba-a600-ba390cf1fe2f`) |
| Schema aplicado em produção | ✅ feito |
| Schema aplicado no banco local | ✅ feito |
| Binding `CHAT_LOG` no Pages | ⬜ **falta — só pelo painel** |
| Deploy do código novo | ⬜ falta |

Enquanto o binding não existir, o log fica desligado e o site funciona normal.

## Falta: amarrar o binding ao Pages

No painel: **Workers & Pages → seu projeto → Settings → Bindings → D1 database**

| Campo | Valor |
|---|---|
| Variable name | `CHAT_LOG` |
| D1 database | `bryan-chat` |

O nome da variável tem que ser exatamente `CHAT_LOG` — é o que as functions
procuram. Não há comando de CLI para isso; o `wrangler` não gerencia bindings de
Pages.

### Por que o config local se chama `wrangler.d1.toml`

Não é `wrangler.toml` de propósito. O deploy roda
`wrangler pages deploy dist --project-name=blpsoares`, e um config no formato
Pages na raiz do projeto muda como esse comando resolve o projeto e o diretório
de saída — ou seja, poderia quebrar o deploy. Com o nome atual o wrangler não
carrega o arquivo sozinho, e ele é passado com `-c` só onde é necessário.

Comandos de produção não precisam dele (`--remote` resolve o banco pelo nome).
Só o modo local precisa:

```bash
wrangler d1 execute bryan-chat --local -c wrangler.d1.toml --file=./migrations/0001_chat_logs.sql
```

## Como visualizar

### Pelo terminal (recomendado)

```bash
bun run chat:log            # resumo dos últimos 7 dias
bun run chat:log bad        # as respostas que levaram 👎, por extenso
bun run chat:log unknown    # perguntas que o motor de regras não soube responder
bun run chat:log last 30    # os 30 turnos mais recentes
bun run chat:log sql "SELECT ..."   # qualquer query
```

Acrescente `--local` para ler o banco de desenvolvimento em vez do de produção.

O `summary` imprime algo assim:

```
── ÚLTIMOS 7 DIAS ──────────────────────────────────────────
┌─────────┬────────┬────┬────┬───────────┬───────────────┐
│ cérebro │ turnos │ 👍 │ 👎 │ aprovação │ latência (ms) │
├─────────┼────────┼────┼────┼───────────┼───────────────┤
│ local   │ 3      │ 0  │ 1  │ 0%        │ 118           │
│ cloud   │ 1      │ 1  │ 0  │ 100%      │ 2400          │
└─────────┴────────┴────┴────┴───────────┴───────────────┘
```

### Pelo painel da Cloudflare

**Workers & Pages → D1 → bryan-chat → Console.** Dá para rodar SQL no navegador.
Serve para uma consulta rápida, mas ler a coluna `answer` numa tabela HTML é
ruim — por isso o script acima existe.

## Consultas úteis

**Taxa de aprovação por cérebro** — onde o chat está falhando:

```sql
SELECT source,
       COUNT(*)                                  AS turnos,
       SUM(rating = 1)                           AS positivos,
       SUM(rating = -1)                          AS negativos,
       ROUND(AVG(latency_ms))                    AS latencia_media
  FROM chat_turns
 WHERE created_at > (unixepoch() - 7*86400) * 1000
 GROUP BY source;
```

**As respostas ruins, para leitura** — o material mais valioso:

```sql
SELECT created_at, source, fallback_reason, section, question, answer
  FROM chat_turns
 WHERE rating = -1
 ORDER BY created_at DESC
 LIMIT 50;
```

**Quanto o cérebro da nuvem está caindo, e por quê:**

```sql
SELECT fallback_reason, COUNT(*) AS n
  FROM chat_turns
 WHERE source != 'cloud' AND fallback_reason IS NOT NULL
 GROUP BY fallback_reason
 ORDER BY n DESC;
```

**Perguntas que o motor de regras respondeu sem confiança** — candidatas a
virar intent nova ou a exigir que a nuvem responda:

```sql
SELECT question, COUNT(*) AS n
  FROM chat_turns
 WHERE source = 'local' AND tool_name IS NULL
 GROUP BY LOWER(question)
 ORDER BY n DESC
 LIMIT 30;
```

**O que as pessoas perguntam em cada seção** — diz onde a página não está
respondendo sozinha:

```sql
SELECT section, COUNT(*) AS n
  FROM chat_turns
 GROUP BY section
 ORDER BY n DESC;
```

## Retenção

Não há expurgo automático. Texto livre de visitante é dado pessoal sob a LGPD,
então vale rodar isto periodicamente (dá para pendurar no cron Worker que já
existe em `worker-cron/`):

```sql
DELETE FROM chat_turns WHERE created_at < (unixepoch() - 90*86400) * 1000;
```

## O que NÃO é gravado

Sem IP, sem user-agent, sem cookie de identificação. O `session_id` é um UUID
aleatório do `localStorage` do visitante, que serve só para agrupar os turnos de
uma conversa e para autorizar o 👍/👎 (você só pode avaliar o que o seu próprio
navegador perguntou). Ele não identifica ninguém e o visitante pode zerá-lo
limpando o site nas configurações do navegador.

O aviso está no rodapé do chat, em PT e EN.
