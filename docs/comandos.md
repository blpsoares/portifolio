# Comandos — portfólio blpsoares.dev

Todos verificados nesta máquina. Rodar de `packages/portifolio`.

## Antes de tudo: a variável de conta

Sua sessão do `wrangler` enxerga **duas contas**, e ele não consegue escolher
sozinho em modo não-interativo. Sem isso, quase todo comando abaixo falha com
*"More than one account available"*.

```bash
export CLOUDFLARE_ACCOUNT_ID=6752d7f0e8a8291aa3b3da7d069c8fb7
```

Para não repetir, jogue no seu `~/.bashrc` ou `~/.zshrc`.

---

## O único passo ainda pendente

Ligar o Analytics Engine. **Não tem comando** — é um toggle no painel, e foi ele
que fez o primeiro deploy falhar quando tentei amarrar o binding antes:

**Workers & Pages → Analytics Engine → habilitar**

Depois, o binding (ou me chame que eu rodo):

```bash
TOKEN=$(grep -oP '(?<=^oauth_token = ")[^"]+' ~/.config/.wrangler/config/default.toml)
curl -X PATCH -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/blpsoares" \
  -d '{"deployment_configs":{"production":{"analytics_engine_datasets":{"ANALYTICS":{"dataset":"braia_chat"}}}}}'
```

O resto já está configurado e no ar.

---

## Ler o chat

```bash
bun run chat:log              # resumo 7 dias: turnos, 👍/👎, aprovação, latência
bun run chat:log bad          # respostas com 👎, por extenso — comece por aqui
bun run chat:log unknown      # perguntas que o motor de regras não soube responder
bun run chat:log last 30      # os 30 turnos mais recentes
bun run chat:log sql "SELECT COUNT(*) AS total FROM chat_turns"
```

`--local` no fim lê o banco de desenvolvimento em vez do de produção.

A rotina que vale: `bad` te dá o que corrigir, `unknown` te dá o que falta o site
responder.

---

## Desenvolvimento

```bash
bun run dev          # Vite em :3001 — rápido, mas SEM /api (o chat cai no motor local)
bun run preview:ai   # build + wrangler pages dev em :8788 — site real, com functions e D1
```

A diferença importa: o Vite não serve `functions/`, então pelo `dev` o cérebro da
nuvem nunca é acionado e você avalia só o piso. Foi o que te confundiu antes.

Túnel para acessar de fora (o `allowedHosts` do Vite já está liberado):

```bash
cloudflared tunnel --url http://localhost:3001
```

---

## Deploy

O deploy dispara sozinho quando o **ponteiro do submódulo** muda no monorepo pai.
Mergear o PR no repo do portfólio **não basta** — o workflow vive em `embark-me`.

```bash
# 1. no submódulo, depois do merge
cd packages/portifolio && git checkout main && git pull --ff-only

# 2. no monorepo pai, sobe o ponteiro
cd ../.. && git add packages/portifolio
git commit -m "chore(portifolio): atualiza submódulo"
git push origin main
```

Acompanhar (atenção ao `-R`: sem ele o `gh` resolve para o upstream `opvibes/embark`
e devolve 404):

```bash
gh run list -R blpsoares/embark-me --workflow=portifolio.yml --limit 3
gh run view <id> -R blpsoares/embark-me --log-failed
```

Redisparar sem commit novo:

```bash
gh workflow run portifolio.yml -R blpsoares/embark-me --ref main
```

---

## Inspecionar produção

```bash
# deployments do site
wrangler pages deployment list --project-name=blpsoares

# logs ao vivo do cron de modelos
wrangler tail portfolio-models-cron

# qual lista de modelos o chat está usando agora
wrangler kv key get active --namespace-id 71dec2950510429cb460b9add886b012 --remote

# bindings de produção
TOKEN=$(grep -oP '(?<=^oauth_token = ")[^"]+' ~/.config/.wrangler/config/default.toml)
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/blpsoares" \
  | python3 -c "import json,sys; c=json.load(sys.stdin)['result']['deployment_configs']['production']; print({k:list((c.get(k) or {}).keys()) for k in ('d1_databases','kv_namespaces','analytics_engine_datasets','env_vars')})"
```

---

## Manutenção

**Expurgo dos 90 dias.** Texto livre de visitante é dado pessoal sob a LGPD e não
há expurgo automático:

```bash
echo "DELETE FROM chat_turns WHERE created_at < (unixepoch() - 90*86400) * 1000;" > /tmp/purge.sql
wrangler d1 execute bryan-chat --remote --file=/tmp/purge.sql
```

**Republicar o cron** (depois de mexer em `worker-cron/index.ts`):

```bash
cd worker-cron && wrangler deploy
```

**Forçar rotação de modelos agora**, sem esperar as 6h — útil se o chat começar a
cair para o motor local de novo:

```bash
cd worker-cron && wrangler dev --test-scheduled
# noutro terminal:
curl "http://localhost:8787/__scheduled?cron=0+*/6+*+*+*"
```

---

## Referência

| Recurso | Identificador |
|---|---|
| Conta | `6752d7f0e8a8291aa3b3da7d069c8fb7` |
| Projeto Pages | `blpsoares` |
| D1 | `bryan-chat` · `0b33836c-5cf2-4eba-a600-ba390cf1fe2f` |
| KV MODELS | `71dec2950510429cb460b9add886b012` |
| KV RATE_LIMIT | `a7688636d3484e96beb7f6e5386c9e0c` |
| Worker do cron | `portfolio-models-cron` (a cada 6h) |
| Repo do site | `blpsoares/portifolio` |
| Repo do deploy | `blpsoares/embark-me` |
