/**
 * Reader for the bra.ia conversation log.
 *
 *   bun run chat:log            → health summary of the last 7 days
 *   bun run chat:log bad        → the answers people marked 👎, in full
 *   bun run chat:log unknown    → questions the rule engine could not place
 *   bun run chat:log last [n]   → the n most recent turns
 *   bun run chat:log sql "..."  → any query you want
 *
 * Add `--local` to read the local dev database instead of production.
 *
 * This exists because the alternative is the D1 console in the Cloudflare
 * dashboard, and reading a wide answer column in an HTML table is miserable.
 */

import { spawnSync } from 'node:child_process';

const DB = 'bryan-chat';

type Row = Record<string, string | number | null>;

const args = process.argv.slice(2);
const local = args.includes('--local');
const positional = args.filter((a) => a !== '--local');
const command = positional[0] ?? 'summary';

/** Runs a query through wrangler and returns the rows. */
function query(sql: string): Row[] {
  // `--remote` resolves the database by name against the account and needs no
  // config. `--local` has no account to ask, so it needs the binding — from a
  // file deliberately not named `wrangler.toml`, which would otherwise change
  // how `wrangler pages deploy` behaves in CI.
  const res = spawnSync(
    'wrangler',
    [
      'd1',
      'execute',
      DB,
      local ? '--local' : '--remote',
      ...(local ? ['-c', 'wrangler.d1.toml'] : []),
      '--json',
      '--command',
      sql,
    ],
    { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 },
  );

  if (res.status !== 0) {
    const err = `${res.stderr ?? ''}`.trim();
    if (/not logged in|auth token|authentication|10000/i.test(err)) {
      console.error('\nNão autenticado. Rode:  wrangler login\n');
    } else if (err.includes('not found') || err.includes("Couldn't find")) {
      console.error(
        `\nBanco "${DB}" não encontrado. Crie com:\n` +
          `  wrangler d1 create ${DB}\n` +
          `  wrangler d1 execute ${DB} --remote --file=./migrations/0001_chat_logs.sql\n`,
      );
    } else {
      console.error(err || 'wrangler falhou sem mensagem');
    }
    process.exit(1);
  }

  try {
    // `--json` prints an array of statement results; we only ever send one.
    const parsed = JSON.parse(res.stdout) as Array<{ results?: Row[] }>;
    return parsed[0]?.results ?? [];
  } catch {
    console.error('Não consegui interpretar a resposta do wrangler:\n', res.stdout.slice(0, 500));
    process.exit(1);
  }
}

const when = (ms: unknown): string =>
  typeof ms === 'number' ? new Date(ms).toLocaleString('pt-BR') : '—';

const rule = (label = '') =>
  console.log(`\n${label ? `── ${label} ` : ''}${'─'.repeat(Math.max(0, 72 - label.length))}`);

/** Health check: is the chat working, and which brain is failing? */
function summary(): void {
  const rows = query(`
    SELECT source,
           COUNT(*)               AS turnos,
           SUM(rating = 1)        AS bom,
           SUM(rating = -1)       AS ruim,
           SUM(rating IS NULL)    AS sem_voto,
           ROUND(AVG(latency_ms)) AS latencia_ms
      FROM chat_turns
     WHERE created_at > (unixepoch() - 7*86400) * 1000
     GROUP BY source
     ORDER BY turnos DESC`);

  if (rows.length === 0) {
    console.log('\nNenhuma conversa registrada nos últimos 7 dias.');
    return;
  }

  rule('ÚLTIMOS 7 DIAS');
  console.table(
    rows.map((r) => {
      const bom = Number(r.bom ?? 0);
      const ruim = Number(r.ruim ?? 0);
      const votos = bom + ruim;
      return {
        cérebro: r.source,
        turnos: r.turnos,
        '👍': bom,
        '👎': ruim,
        aprovação: votos ? `${Math.round((bom / votos) * 100)}%` : '—',
        'latência (ms)': r.latencia_ms ?? '—',
      };
    }),
  );

  const fb = query(`
    SELECT fallback_reason AS motivo, COUNT(*) AS n
      FROM chat_turns
     WHERE source != 'cloud' AND fallback_reason IS NOT NULL
       AND created_at > (unixepoch() - 7*86400) * 1000
     GROUP BY fallback_reason ORDER BY n DESC`);
  if (fb.length) {
    rule('POR QUE A NUVEM NÃO RESPONDEU');
    console.table(fb);
  }

  const sec = query(`
    SELECT COALESCE(section, '—') AS secao, COUNT(*) AS n
      FROM chat_turns
     WHERE created_at > (unixepoch() - 7*86400) * 1000
     GROUP BY section ORDER BY n DESC LIMIT 10`);
  if (sec.length) {
    rule('ONDE PERGUNTAM');
    console.table(sec);
  }
}

/** The turns worth reading: the ones a visitor said were bad. */
function bad(): void {
  const rows = query(`
    SELECT created_at, source, fallback_reason, section, question, answer
      FROM chat_turns
     WHERE rating = -1
     ORDER BY created_at DESC LIMIT 40`);

  if (rows.length === 0) {
    console.log('\nNenhuma resposta marcada como ruim. 🎉');
    return;
  }

  rule(`RESPOSTAS RUINS (${rows.length})`);
  for (const r of rows) {
    console.log(
      `\n${when(r.created_at)}  ·  ${r.source}` +
        `${r.fallback_reason ? `  ·  fallback: ${r.fallback_reason}` : ''}` +
        `${r.section ? `  ·  seção: ${r.section}` : ''}`,
    );
    console.log(`  P: ${r.question}`);
    console.log(`  R: ${String(r.answer ?? '').replace(/\n/g, '\n     ')}`);
  }
}

/**
 * Questions the rule engine answered with no action at all — meaning it fell
 * through to the generic "I didn't understand" reply. Each one is a real
 * question the site cannot answer yet.
 */
function unknown(): void {
  const rows = query(`
    SELECT question, COUNT(*) AS vezes, MAX(created_at) AS ultima
      FROM chat_turns
     WHERE source = 'local' AND tool_name IS NULL
     GROUP BY LOWER(question)
     ORDER BY vezes DESC, ultima DESC LIMIT 40`);

  if (rows.length === 0) {
    console.log('\nO motor de regras entendeu tudo que chegou nele.');
    return;
  }

  rule(`PERGUNTAS SEM RESPOSTA (${rows.length})`);
  console.table(rows.map((r) => ({ pergunta: r.question, vezes: r.vezes, última: when(r.ultima) })));
}

function last(): void {
  const n = Math.min(parseInt(positional[1] ?? '20', 10) || 20, 200);
  const rows = query(`
    SELECT created_at, source, rating, question, answer
      FROM chat_turns ORDER BY created_at DESC LIMIT ${n}`);

  if (rows.length === 0) {
    console.log('\nNenhuma conversa registrada ainda.');
    return;
  }

  rule(`ÚLTIMOS ${rows.length} TURNOS`);
  for (const r of rows) {
    const verdict = r.rating === 1 ? '👍' : r.rating === -1 ? '👎' : '  ';
    console.log(`\n${verdict} ${when(r.created_at)}  ·  ${r.source}`);
    console.log(`   P: ${r.question}`);
    console.log(`   R: ${String(r.answer ?? '').slice(0, 300)}`);
  }
}

switch (command) {
  case 'summary':
    summary();
    break;
  case 'bad':
    bad();
    break;
  case 'unknown':
    unknown();
    break;
  case 'last':
    last();
    break;
  case 'sql': {
    const sql = positional.slice(1).join(' ');
    if (!sql) {
      console.error('Uso: bun run chat:log sql "SELECT ..."');
      process.exit(1);
    }
    console.table(query(sql));
    break;
  }
  default:
    console.error(
      `Comando desconhecido: ${command}\n` +
        'Use: summary | bad | unknown | last [n] | sql "SELECT ..."',
    );
    process.exit(1);
}
