import type { AgentAction, AgentReply } from './engine';

/**
 * Canned answers for the PRE-FIXED suggestion chips. These are answered
 * instantly, for free, WITHOUT touching the LLM — only free-typed questions
 * hit the real LLM. Each chip maps to a curated topic with a good answer and an
 * optional page action (scroll / download).
 */

type Locale = 'pt' | 'en';

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

interface Topic {
  pt: string;
  en: string;
  action?: AgentAction;
}

const TOPICS = {
  hire: {
    pt: '+5 anos de software, sendo os últimos 2 focados em IA Generativa em produção. Entregou um chatbot corporativo sobre uma base de 10.000+ documentos, construiu um servidor MCP na API principal da Eletromídia e agentes de NLP-to-database em produto real. Diferencial: comunicação de quem vende + profundidade de quem arquiteta. Te levei pra Trajetória.',
    en: "5+ years in software, the last 2 focused on Generative AI in production. Shipped a corporate chatbot over a 10,000+ document knowledge base, built an MCP server on Eletromídia's core API and NLP-to-database agents in a real product. Edge: the communication of someone who sells + the depth of someone who architects. I scrolled you to Career.",
    action: { type: 'scroll', target: 'career' },
  },
  projects: {
    pt: 'Destaques: Chatbot Corporativo (Dialogflow CX sobre 10k docs), Filtros Inteligentes (texto livre → query MongoDB, em produção) e Migração Massiva (30k+ docs com Node Streams). Abri a seção Projetos.',
    en: 'Highlights: Corporate chatbot (Dialogflow CX over 10k docs), Intelligent Filters (free text → MongoDB query, in production) and Massive Migration (30k+ docs with Node Streams). I opened the Projects section.',
    action: { type: 'scroll', target: 'projects' },
  },
  career: {
    pt: 'Trajetória: Eletromídia como Backend Sr (atual) → Pleno na mesma empresa → Alest (Software Dev) → estágio → sócio numa agência de sites. Progressão clara de frontend a engenharia de IA. Abri a Trajetória.',
    en: 'Path: Eletromídia as Senior Backend (current) → Mid at the same company → Alest (Software Dev) → internship → partner at a web agency. A clear climb from frontend to AI engineering. I opened Career.',
    action: { type: 'scroll', target: 'career' },
  },
  current: {
    pt: 'Atualmente: Desenvolvedor Backend Senior na Eletromídia (São Paulo · Híbrido). Referência de IA/GenAI do time, construiu o servidor MCP do produto e lidera pesquisa de aplicabilidade de IA.',
    en: "Currently: Senior Backend Developer at Eletromídia (São Paulo · Hybrid). The team's AI/GenAI reference, built the product's MCP server and leads AI applicability research.",
    action: { type: 'scroll', target: 'career' },
  },
  cv: {
    pt: 'Gerando o CV em PDF e iniciando o download agora, montado na hora, no navegador.',
    en: 'Generating the CV PDF and starting the download now, built on the fly, in the browser.',
    action: { type: 'download_cv' },
  },
  who: {
    pt: "Bryan Soares, AI Engineer e Software Developer de São Paulo. +5 anos de experiência, hoje focado em IA Generativa aplicada: agentes com tool use, MCP e orquestração multi-agente em produção. Abri 'Quem sou'.",
    en: "Bryan Soares, AI Engineer and Software Developer from São Paulo. 5+ years of experience, now focused on applied Generative AI: agents with tool use, MCP and multi-agent orchestration in production. I opened 'Who I am'.",
    action: { type: 'scroll', target: 'about' },
  },
  ai: {
    pt: 'IA aplicada é o core do Bryan: sistemas multi-agente, agentes com tool use e servidores MCP conectando LLMs (OpenAI · Claude · Gemini) a sistemas reais. Na Eletromídia construiu um servidor MCP na API principal. Te levei até a seção de MCP.',
    en: "Applied AI is Bryan's core: multi-agent systems, agents with tool use and MCP servers wiring LLMs (OpenAI · Claude · Gemini) into real systems. At Eletromídia he built an MCP server on the core API. I scrolled you to the MCP section.",
    action: { type: 'scroll', target: 'stack' },
  },
  skills: {
    pt: 'O arsenal é organizado em cinco frentes: Agentes & Orquestração, MCP & Contexto, RAG & Recuperação, Backend & Dados e Infra & Automação — com as metodologias próprias dele (PDD e SDD) no núcleo. Core técnico: Node.js · Bun · TypeScript · MongoDB · Redis. Sim, ele usa Bun como runtime principal. Abri o Arsenal Técnico.',
    en: 'The arsenal is organised into five branches: Agents & Orchestration, MCP & Context, RAG & Retrieval, Backend & Data and Infra & Automation — with his own methodologies (PDD and SDD) at the core. Technical core: Node.js · Bun · TypeScript · MongoDB · Redis. Yes, he uses Bun as his main runtime. I opened the Technical Arsenal.',
    action: { type: 'scroll', target: 'stack' },
  },
  education: {
    pt: 'Pós-Graduação em Engenharia de IA Aplicada (UNIPDS, em andamento) e Tecnólogo em Análise e Desenvolvimento de Sistemas pela PUCPR. Abri a seção de Formação.',
    en: 'Postgraduate in Applied AI Engineering (UNIPDS, in progress) and a Technologist degree in Systems Analysis & Development at PUCPR. I opened the Education section.',
    action: { type: 'scroll', target: 'education' },
  },
  opensource: {
    pt: 'Ele mantém vários projetos open source no ar: Agentistics (servidor MCP com métricas de uso de assistentes de IA), PDD (a metodologia de paridade que ele criou durante um refactor), Embark (deploy zero-config) e o learning.blpsoares.dev. Abri a seção de open source.',
    en: 'He keeps several open-source projects live: Agentistics (an MCP server with usage metrics for AI coding assistants), PDD (the parity methodology he created during a refactor), Embark (zero-config deploys) and learning.blpsoares.dev. I opened the open-source section.',
    action: { type: 'scroll', target: 'open-source' },
  },
  articles: {
    pt: 'Ele escreve sobre o que constrói. Os dois mais recentes são sobre o PDD (como exigir prova de paridade num refactor com IA) e sobre o sistema de estudos que ele montou com o Claude. Abri a lista de artigos.',
    en: 'He writes about what he builds. The two most recent are on PDD (how to demand parity proof in an AI-assisted refactor) and on the study system he built with Claude. I opened the articles list.',
    action: { type: 'scroll', target: 'articles' },
  },
  contact: {
    pt: 'O caminho mais direto é o e-mail bryanluccas@hotmail.com, ou o LinkedIn. Ele está aberto a novas oportunidades. Abri seu e-mail.',
    en: 'The most direct route is bryanluccas@hotmail.com, or LinkedIn. He is open to new opportunities. I opened your mail client.',
    action: { type: 'open_url', url: 'mailto:bryanluccas@hotmail.com' },
  },
  aiusage: {
    pt: 'No dia a dia ele usa copilotos pra acelerar, mas mantém a responsabilidade técnica: automatiza o repetitivo, revisa e otimiza a arquitetura. A IA constrói; ele garante a qualidade. Abri a seção de Automação.',
    en: 'Day to day he uses copilots to go faster but keeps technical ownership: automates the repetitive, reviews and optimizes the architecture. AI builds; he guarantees quality. I opened the Automation section.',
    action: { type: 'scroll', target: 'ai-usage' },
  },
  projectstack: {
    pt: 'Nos projetos a stack gira em torno de Node.js/TypeScript, MongoDB, Redis, Docker e GCP, com camada de IA (OpenAI, Dialogflow CX, Document AI). Abri a seção Projetos.',
    en: 'Across the projects the stack centers on Node.js/TypeScript, MongoDB, Redis, Docker and GCP, with an AI layer (OpenAI, Dialogflow CX, Document AI). I opened the Projects section.',
    action: { type: 'scroll', target: 'projects' },
  },
} satisfies Record<string, Topic>;

type TopicId = keyof typeof TOPICS;

// Every pre-fixed chip (PT + EN), mapped to its topic. Keys are normalized.
const CHIP_TOPICS: Array<[string, TopicId]> = [
  ['Por que contratar o Bryan?', 'hire'],
  ['Por que contratar?', 'hire'],
  ['Qual o diferencial dele?', 'hire'],
  ['Why hire Bryan?', 'hire'],
  ['Why hire him?', 'hire'],
  ["What's his edge?", 'hire'],
  ['Mostre os projetos de IA', 'projects'],
  ['Mostre os projetos', 'projects'],
  ['Projeto de IA mais forte?', 'projects'],
  ['Detalhe o chatbot corporativo', 'projects'],
  ['Show me the AI projects', 'projects'],
  ['Show the projects', 'projects'],
  ['Show the AI projects', 'projects'],
  ['Strongest AI project?', 'projects'],
  ['Detail the corporate chatbot', 'projects'],
  ['Resuma a carreira', 'career'],
  ['Resuma a trajetória', 'career'],
  ['Summarize his career', 'career'],
  ['Summarize his path', 'career'],
  ['Onde ele trabalha hoje?', 'current'],
  ['Where does he work now?', 'current'],
  ['Baixar CV', 'cv'],
  ['Download CV', 'cv'],
  ['Quem é o Bryan?', 'who'],
  ['Who is Bryan?', 'who'],
  ['Foco em IA?', 'ai'],
  ['Experiência com IA?', 'ai'],
  ['AI focus?', 'ai'],
  ['AI experience?', 'ai'],
  ['Que stack ele domina?', 'skills'],
  ['Ele usa Bun?', 'skills'],
  ['What stack does he master?', 'skills'],
  ['Does he use Bun?', 'skills'],
  ['Qual a formação dele?', 'education'],
  ['Está estudando o quê?', 'education'],
  ['Pós em quê?', 'education'],
  ["What's his education?", 'education'],
  ['What is he studying?', 'education'],
  ['Postgrad in what?', 'education'],
  ['Que projetos open source ele tem?', 'opensource'],
  ['What open source projects does he have?', 'opensource'],
  ['O que é o Agentistics?', 'opensource'],
  ['What is Agentistics?', 'opensource'],
  ['O que é o PDD?', 'articles'],
  ['What is PDD?', 'articles'],
  ['Ele escreve artigos?', 'articles'],
  ['Does he write articles?', 'articles'],
  ['Como falo com ele?', 'contact'],
  ['How do I reach him?', 'contact'],
  ['Está aberto a oportunidades?', 'contact'],
  ['Is he open to opportunities?', 'contact'],
  ['Como ele usa IA no dia a dia?', 'aiusage'],
  ['How does he use AI daily?', 'aiusage'],
  ['Que stack usou nos projetos?', 'projectstack'],
  ['Que stack usa?', 'projectstack'],
  ['What stack in these projects?', 'projectstack'],
  ['What stack?', 'projectstack'],
];

const chipMap = new Map<string, TopicId>(CHIP_TOPICS.map(([chip, id]) => [norm(chip), id]));

const toolFor = (action?: AgentAction): AgentReply['tool'] => {
  if (!action) return undefined;
  if (action.type === 'scroll') return { name: 'scroll_to_section', arg: action.target, action };
  if (action.type === 'download_cv') return { name: 'download_cv', arg: '', action };
  if (action.type === 'open_url') return { name: 'open_url', arg: '', action };
  return undefined;
};

/** Returns a canned reply for a pre-fixed chip, or null for free-typed input. */
export function cannedReply(query: string, locale: Locale): AgentReply | null {
  const id = chipMap.get(norm(query));
  if (!id) return null;
  const topic = TOPICS[id];
  return { reasoning: [], tool: toolFor(topic.action), answer: locale === 'pt' ? topic.pt : topic.en };
}
