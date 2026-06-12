import type { AgentAction, AgentReply } from './engine';

/**
 * Canned answers for the PRE-FIXED suggestion chips. These are answered
 * instantly, for free, WITHOUT calling OpenRouter — only free-typed questions
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
    pt: '+5 anos de software, sendo os últimos 2 focados em IA Generativa em produção. Levou um chatbot RAG sobre 10.000+ documentos, construiu um servidor MCP na API principal da Eletromídia e agentes de NLP-to-database em produto real. Diferencial: comunicação de quem vende + profundidade de quem arquiteta. Te levei pra Trajetória.',
    en: "5+ years in software, the last 2 focused on Generative AI in production. Shipped a RAG chatbot over 10,000+ docs, built an MCP server on Eletromídia's core API and NLP-to-database agents in a real product. Edge: the communication of someone who sells + the depth of someone who architects. I scrolled you to Career.",
    action: { type: 'scroll', target: 'career' },
  },
  projects: {
    pt: 'Destaques: Chatbot RAG Corporativo (Dialogflow CX + RAG sobre 10k docs), Filtros Inteligentes (texto livre → query MongoDB, em produção) e Migração Massiva (20k+ docs com Node Streams). Abri a seção Projetos.',
    en: 'Highlights: Corporate RAG chatbot (Dialogflow CX + RAG over 10k docs), Intelligent Filters (free text → MongoDB query, in production) and Massive Migration (20k+ docs with Node Streams). I opened the Projects section.',
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
    pt: 'Gerando o CV em PDF e iniciando o download agora — montado na hora, no navegador.',
    en: 'Generating the CV PDF and starting the download now — built on the fly, in the browser.',
    action: { type: 'download_cv' },
  },
  who: {
    pt: "Bryan Soares — Software Developer & AI Engineer de São Paulo. Backend Engineer com +5 anos, hoje focado em IA Generativa aplicada: RAG, agentes, MCP e orquestração multi-agente em produção. Abri 'Quem sou'.",
    en: "Bryan Soares — Software Developer & AI Engineer from São Paulo. Backend Engineer with 5+ years, now focused on applied Generative AI: RAG, agents, MCP and multi-agent orchestration in production. I opened 'Who I am'.",
    action: { type: 'scroll', target: 'about' },
  },
  ai: {
    pt: 'IA aplicada é o core do Bryan: pipelines RAG, sistemas multi-agente, agentes com tool use e servidores MCP conectando LLMs (OpenAI · Claude · Gemini) a sistemas reais. Na Eletromídia construiu um servidor MCP na API principal. Te levei até a seção de MCP.',
    en: "Applied AI is Bryan's core: RAG pipelines, multi-agent systems, agents with tool use and MCP servers wiring LLMs (OpenAI · Claude · Gemini) into real systems. At Eletromídia he built an MCP server on the core API. I scrolled you to the MCP section.",
    action: { type: 'scroll', target: 'mcp' },
  },
  skills: {
    pt: 'Core: Node.js · TypeScript · Bun · MongoDB · Redis · Docker · Clean Architecture. IA: RAG, multi-agente, MCP, APIs de LLM, Document AI, Dialogflow CX. Sim, ele usa Bun como runtime principal. Abri o Arsenal Tecnológico.',
    en: 'Core: Node.js · TypeScript · Bun · MongoDB · Redis · Docker · Clean Architecture. AI: RAG, multi-agent, MCP, LLM APIs, Document AI, Dialogflow CX. Yes, he uses Bun as his main runtime. I opened the Tech Arsenal.',
    action: { type: 'scroll', target: 'stack' },
  },
  education: {
    pt: 'Pós-Graduação em Engenharia de IA Aplicada (UNIPDS, em andamento) e Tecnólogo em Análise e Desenvolvimento de Sistemas pela PUCPR. Abri a seção de Formação.',
    en: 'Postgraduate in Applied AI Engineering (UNIPDS, in progress) and a Technologist degree in Systems Analysis & Development at PUCPR. I opened the Education section.',
    action: { type: 'scroll', target: 'education' },
  },
  lowcode: {
    pt: 'Ele usa low-code estrategicamente pra acelerar: n8n e Make (integrações/MVPs), Retool e Plasmic (frontend ágil) e Windmill (deploy de scripts). Reduz time-to-market sem abrir mão da arquitetura. Abri a seção Low Code.',
    en: 'He uses low-code strategically to ship faster: n8n and Make (integrations/MVPs), Retool and Plasmic (agile frontend) and Windmill (script deploys). Cuts time-to-market without sacrificing architecture. I opened the Low Code section.',
    action: { type: 'scroll', target: 'lowcode' },
  },
  mcp: {
    pt: 'MCP (Model Context Protocol) é a base da produtividade dele: conecta LLMs ao contexto do projeto (Playwright, Notion, MongoDB via MCP). Na Eletromídia construiu um servidor MCP na API principal do produto. Abri a seção de MCP.',
    en: "MCP (Model Context Protocol) is core to his productivity: it connects LLMs to project context (Playwright, Notion, MongoDB via MCP). At Eletromídia he built an MCP server on the product's core API. I opened the MCP section.",
    action: { type: 'scroll', target: 'mcp' },
  },
  vibe: {
    pt: 'Vibe coding = desenvolver com assistência de IA da ideia ao deploy. O Bryan tem vários side projects open-source vibe coded (Agentistics, DuckFlux, Embark). Abri a seção Vibe Coding.',
    en: 'Vibe coding = building with AI assistance from idea to deploy. Bryan has several open-source vibe-coded side projects (Agentistics, DuckFlux, Embark). I opened the Vibe Coding section.',
    action: { type: 'scroll', target: 'vibe-projects' },
  },
  learning: {
    pt: 'Ele transforma tudo que estuda em prática ativa: construiu o learning.blpsoares.dev, que gera quizzes do conteúdo e acompanha o progresso. Open source e parte do fluxo diário. Abri a seção Aprendizado.',
    en: 'He turns everything he studies into active practice: he built learning.blpsoares.dev, which generates quizzes from content and tracks progress. Open-source and part of his daily flow. I opened the Learning section.',
    action: { type: 'scroll', target: 'learning' },
  },
  aiusage: {
    pt: 'No dia a dia ele usa copilotos pra acelerar, mas mantém a responsabilidade técnica: automatiza o repetitivo, revisa e otimiza a arquitetura. A IA constrói; ele garante a qualidade. Abri a seção de Automação.',
    en: 'Day to day he uses copilots to go faster but keeps technical ownership: automates the repetitive, reviews and optimizes the architecture. AI builds; he guarantees quality. I opened the Automation section.',
    action: { type: 'scroll', target: 'ai-usage' },
  },
  projectstack: {
    pt: 'Nos projetos a stack gira em torno de Node.js/TypeScript, MongoDB, Redis, Docker e GCP, com camada de IA (OpenAI, Dialogflow CX, Document AI, RAG). Abri a seção Projetos.',
    en: 'Across the projects the stack centers on Node.js/TypeScript, MongoDB, Redis, Docker and GCP, with an AI layer (OpenAI, Dialogflow CX, Document AI, RAG). I opened the Projects section.',
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
  ['Detalhe o chatbot RAG', 'projects'],
  ['Show me the AI projects', 'projects'],
  ['Show the projects', 'projects'],
  ['Show the AI projects', 'projects'],
  ['Strongest AI project?', 'projects'],
  ['Detail the RAG chatbot', 'projects'],
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
  ['Que ferramentas low-code?', 'lowcode'],
  ['Como acelera entregas?', 'lowcode'],
  ['Which low-code tools?', 'lowcode'],
  ['How does he ship faster?', 'lowcode'],
  ['O que é MCP pra ele?', 'mcp'],
  ['Onde usou MCP?', 'mcp'],
  ['What is MCP to him?', 'mcp'],
  ['Where did he use MCP?', 'mcp'],
  ['O que é vibe coding?', 'vibe'],
  ['What is vibe coding?', 'vibe'],
  ['Como ele se mantém aprendendo?', 'learning'],
  ['How does he keep learning?', 'learning'],
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
