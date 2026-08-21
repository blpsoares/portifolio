import { describe, it, expect } from 'bun:test';
import { onRequestPost as log } from '../log';
import { onRequestPost as feedback } from '../feedback';

/** Minimal in-memory stand-in for the D1 binding. */
const makeDb = () => {
  const rows: Record<string, unknown>[] = [];
  return {
    rows,
    prepare(sql: string) {
      let args: unknown[] = [];
      return {
        bind(...a: unknown[]) { args = a; return this; },
        async run() {
          if (sql.startsWith('INSERT')) {
            rows.push({ id: args[0], session_id: args[2], question: args[6], answer: args[7], source: args[4] });
          } else {
            const r = rows.find((x) => x.id === args[2] && x.session_id === args[3]);
            if (r) r.rating = args[0];
          }
          return { success: true };
        },
      };
    },
  };
};

const post = (url: string, body: unknown, session = 'sess-1') =>
  new Request(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Session-Id': session }, body: JSON.stringify(body) });

describe('chat log', () => {
  it('grava turno e aceita feedback do dono da sessão', async () => {
    const CHAT_LOG = makeDb();
    const r1 = await log({ request: post('https://blpsoares.dev/api/log', {
      question: 'o bryan eh capaz?', answer: 'sim, porque...', source: 'local', locale: 'pt', latencyMs: 120,
    }), env: { CHAT_LOG } as never });
    const { ok, id } = await r1.json() as { ok: boolean; id: string };
    expect(ok).toBe(true);
    expect(CHAT_LOG.rows).toHaveLength(1);

    const r2 = await feedback({ request: post('https://blpsoares.dev/api/feedback', { id, rating: -1 }), env: { CHAT_LOG } as never });
    expect((await r2.json() as { ok: boolean }).ok).toBe(true);
    expect(CHAT_LOG.rows[0].rating).toBe(-1);
  });

  it('outra sessão não consegue avaliar o turno alheio', async () => {
    const CHAT_LOG = makeDb();
    const r1 = await log({ request: post('https://blpsoares.dev/api/log', { question: 'q', answer: 'a', source: 'cloud', locale: 'pt' }), env: { CHAT_LOG } as never });
    const { id } = await r1.json() as { id: string };
    await feedback({ request: post('https://blpsoares.dev/api/feedback', { id, rating: 1 }, 'intruso'), env: { CHAT_LOG } as never });
    expect(CHAT_LOG.rows[0].rating).toBeUndefined();
  });

  it('sem binding, o log fica desligado sem quebrar', async () => {
    const r = await log({ request: post('https://blpsoares.dev/api/log', { question: 'q', answer: 'a' }), env: {} as never });
    expect((await r.json() as { reason: string }).reason).toBe('disabled');
  });

  it('rejeita rating e id inválidos', async () => {
    const CHAT_LOG = makeDb();
    const bad = await feedback({ request: post('https://blpsoares.dev/api/feedback', { id: 'nao-e-uuid', rating: 1 }), env: { CHAT_LOG } as never });
    expect(bad.status).toBe(400);
    const r1 = await log({ request: post('https://blpsoares.dev/api/log', { question: 'q', answer: 'a' }), env: { CHAT_LOG } as never });
    const { id } = await r1.json() as { id: string };
    const bad2 = await feedback({ request: post('https://blpsoares.dev/api/feedback', { id, rating: 99 }), env: { CHAT_LOG } as never });
    expect(bad2.status).toBe(400);
  });

  it('bloqueia origem de fora', async () => {
    const req = new Request('https://blpsoares.dev/api/log', { method: 'POST', headers: { Origin: 'https://evil.com', 'Content-Type': 'application/json' }, body: '{}' });
    const r = await log({ request: req, env: { CHAT_LOG: makeDb() } as never });
    expect(r.status).toBe(403);
  });
});
