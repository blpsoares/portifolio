import { describe, it, expect } from 'bun:test';
import { matchIntent } from '../engine';
import pt from '../../i18n/pt';

/**
 * Routing regression suite for the rule engine.
 *
 * The engine is the floor: it answers whenever the cloud brain and the
 * in-browser model are both unavailable, which on a portfolio means a real
 * visitor on a bad connection. Every entry here is a question a recruiter
 * actually types, checked against the section it should land on — because the
 * failure mode is not "no answer", it is a confident answer about the wrong
 * thing, which is worse.
 */

type Expected = string | null;

const route = (q: string): Expected => {
  const r = matchIntent(q, pt as never, 'pt');
  if (!r.tool) return null; // fell through to the generic offer
  return r.tool.arg || r.tool.name;
};

/** [pergunta, seção esperada]  — null significa "deve admitir que não sabe" */
const CASES: Array<[string, Expected]> = [
  // — o que ele fez —
  ['o que ele ja fez de relevante?', 'projects'],
  ['o que ele já entregou?', 'projects'],
  ['quais os principais projetos dele?', 'projects'],
  ['me mostra os projetos', 'projects'],
  ['qual o trabalho mais importante que ele fez?', 'projects'],
  ['tem algum case de sucesso?', 'projects'],

  // — contratação / fit —
  ['por que eu deveria contratar ele?', 'career'],
  ['tenho uma vaga de AI Engineer, o bryan eh capaz?', 'career'],
  ['ele tem perfil senior?', 'career'],
  ['qual o diferencial dele?', 'career'],

  // — carreira —
  ['resume a trajetoria dele', 'career'],
  ['onde ele ja trabalhou?', 'career'],
  ['quantos anos de experiencia ele tem?', 'career'],
  ['onde ele trabalha hoje?', 'career'],

  // — skills —
  ['que tecnologias ele domina?', 'stack'],
  ['ele sabe kubernetes?', 'stack'],
  ['qual a stack dele?', 'stack'],

  // — IA —
  ['ele trabalha com agentes de IA?', 'stack'],
  ['o que ele sabe de LLM?', 'stack'],

  // — formação —
  ['qual a formacao dele?', 'education'],
  ['ele esta estudando o que?', 'education'],

  // — contato / CV —
  ['me manda o cv em pdf', 'download_cv'],
  ['como falo com ele?', 'contact'],
  ['qual o email dele?', 'contact'],

  // — quem é —
  ['quem e o bryan?', 'about'],

  // — deve NÃO fingir que sabe —
  ['salve', null],
  ['oi tudo bem?', null],
  ['qual a capital da franca?', null],
  ['me conta uma piada', null],
];

describe('roteamento do motor de regras', () => {
  for (const [question, expected] of CASES) {
    it(`"${question}" → ${expected ?? 'fallback honesto'}`, () => {
      expect(route(question)).toBe(expected);
    });
  }
});

describe('não casa keyword dentro de outra palavra', () => {
  it('"ia" dentro de "experiencia" não vira intent de IA', () => {
    // Antes: `includes('ia')` casava em "experiênc-IA" e mandava para IA.
    const r = matchIntent('qual a experiencia dele?', pt as never, 'pt');
    expect(r.tool?.arg).toBe('career');
  });

  it('"ai" dentro de "AI Engineer" não sequestra pergunta de vaga', () => {
    const r = matchIntent('tenho uma vaga de AI Engineer', pt as never, 'pt');
    expect(r.tool?.arg).toBe('career');
  });
});
