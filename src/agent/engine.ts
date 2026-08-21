import type { Translations, Locale } from '../i18n';

/**
 * Bryan.AI — a fully deterministic, client-side agent.
 *
 * There is NO LLM call here. Everything runs in the browser: intent matching,
 * "reasoning", tool selection and the answers themselves are computed from the
 * CV data that already lives in the i18n layer. That is the whole trick — it
 * looks and behaves like an autonomous agent (streaming, thinking, tool use
 * that actually drives the page) while costing nothing and being impossible to
 * abuse as a free LLM proxy.
 */

export type AgentAction =
  | { type: 'scroll'; target: string }
  | { type: 'download_cv'; locale?: 'pt' | 'en' }
  | { type: 'open_url'; url: string }
  | { type: 'open_page'; page: string }
  | { type: 'set_theme'; theme: 'dark' | 'light' }
  | { type: 'set_language'; locale: 'pt' | 'en' }
  | { type: 'none' };

export interface ToolCall {
  /** function-style name shown in the UI, e.g. scroll_to_section */
  name: string;
  /** argument shown in the UI, e.g. "projects" */
  arg: string;
  /** what the host component should actually run */
  action: AgentAction;
}

export interface AgentReply {
  reasoning: string[];
  tool?: ToolCall;
  answer: string;
}

interface Intent {
  id: string;
  /** keywords in both languages; matched accent-insensitively, on word boundaries */
  kw: string[];
  /** `query` is already normalized (lowercase, accent-stripped) */
  reply: (t: Translations, locale: Locale, query: string) => AgentReply;
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();

/** tiny bilingual helper */
const L = (locale: Locale, pt: string, en: string) => (locale === 'pt' ? pt : en);

const intents: Intent[] = [
  {
    id: 'meta',
    kw: [
      'como voce foi feito', 'como fez isso', 'como ele fez', 'que ia', 'qual ia',
      'qual modelo', 'voce e real', 'voce e uma ia', 'eh ia de verdade', 'chatgpt',
      'gpt', 'claude', 'how were you built', 'how did he', 'are you real',
      'which ai', 'what model', 'is this real', 'real ai', 'powered by',
    ],
    reply: (_t, locale) => ({
      reasoning: [
        L(locale, 'detectando meta-pergunta sobre minha arquitetura', 'detecting meta-question about my architecture'),
        L(locale, 'decidindo ser honesto (sempre)', 'deciding to be honest (always)'),
      ],
      answer: L(
        locale,
        'Boa pergunta. 😏 Não sou um wrapper de LLM — sou um agente determinístico que roda 100% no seu navegador, escrito à mão pelo Bryan. Zero chamadas de API, zero custo, impossível de abusar como chat grátis. E mesmo assim eu interpreto sua intenção, escolho ferramentas e controlo este site de verdade. Esse é exatamente o ponto: o portfólio não fala sobre engenharia de IA — ele é uma.',
        "Good question. 😏 I'm not an LLM wrapper — I'm a deterministic agent running 100% in your browser, hand-built by Bryan. Zero API calls, zero cost, impossible to abuse as a free chat. And I still parse your intent, pick tools and actually drive this site. That's the point: the portfolio doesn't talk about AI engineering — it is one.",
      ),
    }),
  },
  {
    id: 'hire',
    kw: [
      'por que contratar', 'porque contratar', 'contratar', 'vale a pena', 'diferencial',
      'vaga', 'capaz', 'serve', 'perfil', 'fit', 'senior', 'senioridade', 'recomenda',
      'why hire', 'should i hire', 'why bryan', 'why should', 'value', 'stand out', 'edge',
      'good fit', 'capable', 'right person', 'seniority',
    ],
    reply: (t, locale) => ({
      reasoning: [
        L(locale, 'recuperando proposta de valor do CV', 'retrieving value proposition from CV'),
        L(locale, 'cruzando com histórico de carreira', 'cross-referencing career history'),
        L(locale, 'selecionando ferramenta: scroll_to_section', 'selecting tool: scroll_to_section'),
      ],
      tool: { name: 'scroll_to_section', arg: 'career', action: { type: 'scroll', target: 'career' } },
      answer: L(
        locale,
        '+5 anos de software, sendo os últimos 2 focados em IA Generativa em produção. Entregou um chatbot corporativo sobre uma base de 10.000+ documentos, construiu um servidor MCP na API principal da Eletromídia e agentes de NLP-to-database usados em produto real. O diferencial: comunicação de quem vende + profundidade de quem arquiteta. Te levei pra Trajetória — dá uma olhada nos números.',
        '5+ years in software, the last 2 focused on Generative AI in production. Shipped a corporate chatbot over a 10,000+ document knowledge base, built an MCP server on Eletromídia\'s core API and NLP-to-database agents used in a real product. The edge: the communication of someone who sells + the depth of someone who architects. I scrolled you to Career — check the numbers.',
      ),
    }),
  },
  {
    id: 'projects',
    kw: [
      'projeto', 'projetos', 'mostre', 'mostrar', 'mostra', 'portfolio', 'portfolio de projetos',
      'case', 'cases', 'relevante', 'relevantes', 'importante', 'destaque', 'destaques',
      'entregou', 'entregas', 'entregue', 'realizou', 'construiu', 'fez', 'ja fez',
      'principais', 'resultados', 'sucesso', 'melhor trabalho', 'o que ele fez',
      'project', 'projects', 'show me', 'show projects', 'work', 'built', 'delivered',
      'shipped', 'achievements', 'highlights', 'relevant', 'impact', 'accomplished',
    ],
    reply: (t, locale) => ({
      reasoning: [
        L(locale, 'consultando índice de projetos (7 entradas)', 'querying project index (7 entries)'),
        L(locale, 'priorizando projetos de IA', 'prioritizing AI projects'),
        L(locale, 'executando navegação', 'executing navigation'),
      ],
      tool: { name: 'scroll_to_section', arg: 'projects', action: { type: 'scroll', target: 'projects' } },
      answer: L(
        locale,
        `Destaques: "${t.projects.items[0].title}" (Dialogflow CX sobre 10k docs), "${t.projects.items[1].title}" (texto livre → query MongoDB, em produção) e "${t.projects.items[3].title}" (30k+ docs com Node Streams e backpressure). Acabei de te levar até a seção Projetos.`,
        `Highlights: "${t.projects.items[0].title}" (Dialogflow CX over 10k docs), "${t.projects.items[1].title}" (free text → MongoDB query, in production) and "${t.projects.items[3].title}" (30k+ docs with Node Streams and backpressure). I just took you to the Projects section.`,
      ),
    }),
  },
  {
    id: 'ai',
    kw: [
      'ia', 'inteligencia artificial', 'genai', 'rag', 'agente', 'agentes', 'llm',
      'mcp', 'tool use', 'multi-agent', 'ai', 'artificial intelligence', 'agent', 'pipeline',
    ],
    reply: (t, locale) => ({
      reasoning: [
        L(locale, 'classificando intenção: foco em IA', 'classifying intent: AI focus'),
        L(locale, 'recuperando experiência GenAI', 'retrieving GenAI experience'),
      ],
      tool: { name: 'scroll_to_section', arg: 'stack', action: { type: 'scroll', target: 'stack' } },
      answer: L(
        locale,
        'IA aplicada é o core do Bryan: sistemas multi-agente, agentes com tool use e servidores MCP conectando LLMs (OpenAI · Claude · Gemini) a sistemas reais. Na Eletromídia ele construiu um servidor MCP na API principal pra um agente processar queries em linguagem natural. Te levei até a seção de MCP.',
        "Applied AI is Bryan's core: multi-agent systems, agents with tool use and MCP servers wiring LLMs (OpenAI · Claude · Gemini) into real systems. At Eletromídia he built an MCP server on the core API so an agent could process natural-language queries. I scrolled you to the MCP section.",
      ),
    }),
  },
  {
    id: 'career',
    kw: [
      'carreira', 'trajetoria', 'experiencia', 'experiencias', 'historico', 'empresas',
      'trabalhou', 'trabalha', 'trabalhando', 'anos de experiencia', 'quantos anos',
      'cargo', 'cargos', 'emprego', 'empregos', 'profissional', 'resume', 'resuma',
      'career', 'experience', 'history', 'companies', 'worked', 'works', 'background',
      'years of experience', 'summarize',
    ],
    reply: (t, locale) => ({
      reasoning: [
        L(locale, 'lendo linha do tempo de carreira', 'reading career timeline'),
        L(locale, 'resumindo 5 posições', 'summarizing 5 positions'),
      ],
      tool: { name: 'scroll_to_section', arg: 'career', action: { type: 'scroll', target: 'career' } },
      answer: L(
        locale,
        `Trajetória: ${t.career.items[0].company} como ${t.career.items[0].role} (atual) → Pleno na mesma empresa → ${t.career.items[2].company} (Software Dev) → estágio → sócio numa agência de sites. Uma progressão clara de frontend a engenharia de IA. Abri a Trajetória completa pra você.`,
        `Path: ${t.career.items[0].company} as ${t.career.items[0].role} (current) → Mid-level at the same company → ${t.career.items[2].company} (Software Dev) → internship → partner at a web agency. A clear climb from frontend to AI engineering. I opened the full Career timeline for you.`,
      ),
    }),
  },
  {
    id: 'current',
    kw: [
      'atual', 'onde trabalha', 'trabalha agora', 'emprego atual', 'eletromidia', 'eletromídia',
      'current', 'where does he work', 'right now', 'currently',
    ],
    reply: (t, locale) => ({
      reasoning: [L(locale, 'buscando posição marcada como atual', 'finding position flagged as current')],
      tool: { name: 'scroll_to_section', arg: 'career', action: { type: 'scroll', target: 'career' } },
      answer: L(
        locale,
        `Atualmente: ${t.career.items[0].role} na ${t.career.items[0].company} (${t.career.items[0].location}). Referência de IA/GenAI do time, construiu o servidor MCP do produto e lidera pesquisa de aplicabilidade de IA.`,
        `Currently: ${t.career.items[0].role} at ${t.career.items[0].company} (${t.career.items[0].location}). The team's AI/GenAI reference, built the product's MCP server and leads AI applicability research.`,
      ),
    }),
  },
  {
    id: 'skills',
    kw: [
      'skill', 'skills', 'habilidade', 'habilidades', 'stack', 'stacks', 'tecnologia',
      'tecnologias', 'ferramentas', 'domina', 'sabe', 'conhece', 'manja', 'usa',
      'arsenal', 'kubernetes', 'docker', 'typescript', 'node', 'bun', 'react',
      'tech', 'technologies', 'tools', 'languages', 'linguagens', 'knows', 'proficient',
    ],
    reply: (t, locale) => ({
      reasoning: [
        L(locale, 'agregando stack técnica', 'aggregating tech stack'),
        L(locale, 'executando navegação para arsenal', 'navigating to arsenal'),
      ],
      tool: { name: 'scroll_to_section', arg: 'stack', action: { type: 'scroll', target: 'stack' } },
      answer: L(
        locale,
        'O arsenal se organiza em cinco frentes em volta das metodologias próprias dele (PDD e SDD): Agentes & Orquestração, MCP & Contexto, RAG & Recuperação, Backend & Dados e Infra & Automação. Core técnico: Node.js · Bun · TypeScript · MongoDB · Redis · GCP · Cloudflare. Te mostrei o Arsenal Técnico completo.',
        'The arsenal is organised into five branches around his own methodologies (PDD and SDD): Agents & Orchestration, MCP & Context, RAG & Retrieval, Backend & Data, and Infra & Automation. Technical core: Node.js · Bun · TypeScript · MongoDB · Redis · GCP · Cloudflare. I showed you the full Technical Arsenal.',
      ),
    }),
  },
  {
    id: 'education',
    kw: [
      'formacao', 'educacao', 'faculdade', 'pos', 'pos-graduacao', 'graduacao', 'estudou',
      'estudando', 'estuda', 'estudo', 'curso', 'cursando', 'diploma', 'universidade',
      'education', 'degree', 'university', 'college', 'studied', 'studying', 'academic',
    ],
    reply: (t, locale) => ({
      reasoning: [L(locale, 'consultando registros acadêmicos', 'querying academic records')],
      tool: { name: 'scroll_to_section', arg: 'education', action: { type: 'scroll', target: 'education' } },
      answer: L(
        locale,
        `${t.education.items[0].degree} em ${t.education.items[0].field} (${t.education.items[0].institution}, em andamento) e Tecnólogo em Análise e Desenvolvimento de Sistemas pela PUCPR. Abri a seção de Formação.`,
        `${t.education.items[0].degree} in ${t.education.items[0].field} (${t.education.items[0].institution}, in progress) and a Technologist degree in Systems Analysis & Development at PUCPR. I opened the Education section.`,
      ),
    }),
  },
  {
    id: 'cv',
    kw: [
      'cv', 'curriculo', 'currículo', 'baixar', 'download', 'resume', 'pdf',
    ],
    reply: (_t, locale, query) => {
      // Understand an explicitly requested language ("cv em ptbr", "resume in english")
      const wantsPt = /(ptbr|pt-br|pt br|portugu|brasil|brazil|\bpt\b)/.test(query);
      const wantsEn = /(ingles|english|\beng\b|\ben\b)/.test(query);
      const target: 'pt' | 'en' | undefined = wantsPt ? 'pt' : wantsEn ? 'en' : undefined;
      const langLabel =
        target === 'pt'
          ? L(locale, 'português', 'Portuguese')
          : target === 'en'
            ? L(locale, 'inglês', 'English')
            : '';
      return {
        reasoning: [
          L(locale, 'localizando gerador de PDF', 'locating PDF generator'),
          target
            ? L(locale, `idioma solicitado: ${langLabel}`, `requested language: ${langLabel}`)
            : L(locale, 'usando idioma da página', 'using page language'),
          L(locale, 'invocando ferramenta: download_cv', 'invoking tool: download_cv'),
        ],
        tool: { name: 'download_cv', arg: target ?? '', action: { type: 'download_cv', locale: target } },
        answer: target
          ? L(
              locale,
              `Entendido — gerando o CV em ${langLabel} e baixando agora (montado na hora, no navegador).`,
              `Got it — generating the CV in ${langLabel} and downloading now (built on the fly, in the browser).`,
            )
          : L(
              locale,
              'Gerando o CV em PDF e iniciando o download agora. Ele é montado na hora, no navegador, a partir dos mesmos dados que eu uso.',
              'Generating the CV PDF and starting the download now. It is built on the fly, in the browser, from the same data I use.',
            ),
      };
    },
  },
  {
    id: 'contact',
    kw: [
      'contato', 'falar', 'falo', 'email', 'e-mail', 'linkedin', 'github', 'chamar',
      'contratar agora', 'conversar', 'entrar em contato', 'como falo',
      'contact', 'reach', 'get in touch', 'hire now', 'connect', 'talk to',
    ],
    reply: (t, locale) => ({
      reasoning: [
        L(locale, 'recuperando canais de contato', 'retrieving contact channels'),
        L(locale, 'abrindo LinkedIn', 'opening LinkedIn'),
      ],
      tool: { name: 'scroll_to_section', arg: 'contact', action: { type: 'scroll', target: 'contact' } },
      answer: L(
        locale,
        `Pode falar direto: ${t.cv.email} · ${t.cv.phone}. LinkedIn: ${t.cv.linkedin} · GitHub: ${t.cv.github}. Abri o LinkedIn dele numa nova aba.`,
        `Reach out directly: ${t.cv.email} · ${t.cv.phone}. LinkedIn: ${t.cv.linkedin} · GitHub: ${t.cv.github}. I opened his LinkedIn in a new tab.`,
      ),
    }),
  },
  {
    id: 'who',
    kw: [
      'quem e', 'quem eh', 'quem voce', 'sobre', 'me fale', 'who is', 'who are', 'about bryan', 'tell me about',
    ],
    reply: (_t, locale) => ({
      reasoning: [L(locale, 'gerando resumo executivo', 'generating executive summary')],
      tool: { name: 'scroll_to_section', arg: 'about', action: { type: 'scroll', target: 'about' } },
      answer: L(
        locale,
        'Bryan Soares — Software Developer & AI Engineer de São Paulo. Backend Engineer com +5 anos, hoje focado em IA Generativa aplicada: agentes com tool use, MCP e orquestração multi-agente em produção. Abri a seção "Quem sou".',
        'Bryan Soares — Software Developer & AI Engineer from São Paulo. Backend Engineer with 5+ years, now focused on applied Generative AI: agents with tool use, MCP and multi-agent orchestration in production. I opened the "Who I am" section.',
      ),
    }),
  },
];

const fallback = (locale: Locale): AgentReply => ({
  reasoning: [
    L(locale, 'nenhuma intenção forte detectada', 'no strong intent detected'),
    L(locale, 'oferecendo capacidades', 'offering capabilities'),
  ],
  answer: L(
    locale,
    'Posso te contar sobre a carreira do Bryan, os projetos de IA, a stack técnica, a formação, ou gerar o CV em PDF na hora. Pergunta algo tipo "por que contratar o Bryan?" ou "mostre os projetos de IA".',
    'I can tell you about Bryan\'s career, his AI projects, the tech stack, education, or generate the CV PDF on the spot. Try something like "why hire Bryan?" or "show me the AI projects".',
  ),
});

/**
 * Whole-word containment.
 *
 * Plain `includes` was matching keywords inside unrelated words: `ia` fires on
 * "experiência" and "Eletromídia", `ai` fires on "mais" and on the "ai" of
 * "AI Engineer" in a question that has nothing to do with the AI section. That
 * is how "tenho uma vaga de AI Engineer, o Bryan é capaz?" ended up answered
 * with the MCP blurb. Keywords with spaces are matched as phrases, still on
 * word boundaries.
 */
const containsWord = (haystack: string, needle: string): boolean => {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:^|[^\\p{L}\\p{N}])${escaped}(?:[^\\p{L}\\p{N}]|$)`, 'u').test(haystack);
};

/**
 * Below this, the rule engine does not pretend to know the answer.
 *
 * A single two-letter hit used to be enough to win, so the engine would answer
 * confidently — and scroll the page — on evidence that meant nothing. Roughly
 * one solid keyword (or two short ones) is the floor for acting.
 */
const MIN_CONFIDENCE = 4;

export function matchIntent(query: string, t: Translations, locale: Locale): AgentReply {
  const q = norm(query);
  if (!q) return fallback(locale);

  let best: Intent | null = null;
  let bestScore = 0;

  for (const intent of intents) {
    let score = 0;
    for (const k of intent.kw) {
      const kw = norm(k);
      if (containsWord(q, kw)) score += kw.length; // longer matches weigh more
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }

  return best && bestScore >= MIN_CONFIDENCE ? best.reply(t, locale, q) : fallback(locale);
}
