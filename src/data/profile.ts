/**
 * SINGLE SOURCE OF TRUTH for all of Bryan Soares' profile / CV data.
 *
 * Everything visible on the site, in the generated CV PDF, and in the AI
 * assistant's knowledge derives from this file. Edit data HERE — the i18n
 * locale files (`src/i18n/pt.ts`, `src/i18n/en.ts`), `src/constants.tsx`, and
 * `functions/api/_context.ts` all build their values from this module.
 *
 * IMPORTANT: this file must stay PURE DATA — no React/browser imports — because
 * it is also imported by Cloudflare Pages Functions (`functions/api/_context.ts`)
 * which are bundled separately from the Vite app.
 */

export type Locale = 'pt' | 'en';

/** A piece of text that differs between Portuguese and English. */
export interface I18nText {
  pt: string;
  en: string;
}

/** Resolve a bilingual text to a single locale. */
export const pick = (t: I18nText, l: Locale): string => t[l];

// ---------------------------------------------------------------------------
// Personal / contact
// ---------------------------------------------------------------------------
export interface Personal {
  name: string;
  title: I18nText;
  location: I18nText;
  phone: string;
  email: string;
  website: string;
  linkedin: string;
  github: string;
}

// ---------------------------------------------------------------------------
// Experience (feeds t.career.items + the CV PDF experience section)
// ---------------------------------------------------------------------------
export interface Experience {
  role: I18nText;
  company: string;
  period: I18nText;
  duration: I18nText;
  type: I18nText;
  location: I18nText;
  current: boolean;
  bullets: I18nText[];
  /** Tech line shown under this role in the CV PDF (cv.tech[i]). */
  cvTech: string;
}

// ---------------------------------------------------------------------------
// On-page work projects (feeds PROJECTS + t.projects.items)
// ---------------------------------------------------------------------------
export interface WorkProject {
  /** On-page localized title (t.projects.items[i].title). */
  title: I18nText;
  /** On-page localized category (t.projects.items[i].category). */
  category: I18nText;
  /** On-page localized description (t.projects.items[i].description). */
  description: I18nText;
  /** PROJECTS card fields in constants.tsx (locale-neutral defaults). */
  cardTitle: string;
  cardCategory: string;
  cardDescription: string;
  technologies: string[];
  /** The one number the project is remembered by, surfaced on the card so the
   *  outcome is legible without reading the whole paragraph. Site-only. */
  impact?: I18nText;
}

// ---------------------------------------------------------------------------
// CV PDF projects (feeds cv.projects) — distinct from on-page work projects
// ---------------------------------------------------------------------------
export interface CvProject {
  name: I18nText;
  description: I18nText;
  stack: string;
}

// ---------------------------------------------------------------------------
// Education (feeds t.education.items)
// ---------------------------------------------------------------------------
export interface Education {
  institution: string;
  degree: I18nText;
  field: I18nText;
  period: I18nText;
  logo: string;
  current: boolean;
  status: I18nText;
}

// ---------------------------------------------------------------------------
// CV PDF skill groups (feeds cv.skills) — distinct from on-page Tech Arsenal
// ---------------------------------------------------------------------------
export interface CvSkill {
  category: I18nText;
  items: I18nText;
}

// ---------------------------------------------------------------------------
// On-page Tech Arsenal (feeds SKILLS in constants.tsx)
// ---------------------------------------------------------------------------
/**
 * The arsenal is modelled as a brain with branches: one central node, a handful
 * of domains hanging off it, and inside each domain the tools grouped by what
 * they are FOR. A flat tag list made a daily driver and a tool touched once
 * read as equally important, and gave no shape to the knowledge.
 */
export interface SkillCluster {
  /** What this group of tools is for, e.g. "Retrieval", "Runtime". */
  label: I18nText;
  items: string[];
  /**
   * Marks a group as shipped work rather than know-how. Rendered with its own
   * accent so the difference is read from the layout, not from a footnote.
   */
  highlight?: boolean;
}

export interface SkillBranch {
  /** Stable key, used for React keys and the i18n lookup. */
  id: string;
  title: I18nText;
  /** Short label that has to fit inside a node of the graph. */
  short: I18nText;
  blurb: I18nText;
  /** Icon name resolved to a lucide-react component in the component. */
  icon: 'brain' | 'plug' | 'search' | 'server' | 'cloud';
  clusters: SkillCluster[];
}

export interface Profile {
  personal: Personal;
  summary: I18nText;
  experience: Experience[];
  workProjects: WorkProject[];
  cvProjects: CvProject[];
  education: Education[];
  cvSkills: CvSkill[];
  skillBranches: SkillBranch[];
  languages: I18nText;
}

export const profile: Profile = {
  personal: {
    name: 'Bryan Soares',
    title: { pt: 'AI Engineer · Sr Software Developer', en: 'AI Engineer · Sr Software Developer' },
    location: { pt: 'São Paulo, Brasil', en: 'São Paulo, Brazil' },
    phone: '(11) 93045-6696',
    email: 'bryanluccas@hotmail.com',
    website: 'blpsoares.dev',
    linkedin: 'linkedin.com/in/blpsoares',
    github: 'github.com/blpsoares',
  },

  summary: {
    pt: 'AI Engineer e Sr Software Developer com 5 anos no ecossistema JS (Node.js, Bun, TypeScript, React), sendo os últimos 2,5 anos focado em IA. Na Eletromídia automatizei validação de PDFs com Document AI (96% de acurácia) e criei busca NLP que monta queries de filtro no banco via structured output. Construí o Agentistics, um servidor MCP com métricas de uso de AI coding assistants e tracking centralizado de times, e sou co-autor do DuckFlux, DSL declarativa para orquestração multi-agente. Atualmente cursando Pós-graduação em Engenharia de IA Aplicada.',
    en: "AI Engineer and Sr Software Developer with 5 years in the JS ecosystem (Node.js, Bun, TypeScript, React), the last 2.5 focused on AI. At Eletromidia I automated PDF validation with Document AI (96% accuracy) and built an NLP search that assembles database filter queries via structured output. I built Agentistics, an MCP server with usage metrics and centralized tracking for AI coding assistants across teams, and I co-authored DuckFlux, a declarative DSL for multi-agent orchestration. Currently pursuing a Postgraduate degree in Applied AI Engineering.",
  },

  experience: [
    {
      role: { pt: 'Desenvolvedor Backend Senior', en: 'Senior Backend Developer' },
      company: 'Eletromidia',
      period: { pt: 'out 2025 a Presente', en: 'Oct 2025 to Present' },
      duration: { pt: '10 meses', en: '10 months' },
      type: { pt: 'Tempo integral', en: 'Full-time' },
      location: { pt: 'São Paulo · Híbrido', en: 'São Paulo · Hybrid' },
      current: true,
      bullets: [
        {
          pt: 'Refatorei o sistema de Propostas (PHP legado para Bun/TypeScript), projeto travado há 2 anos por complexidade e falta de braço. MVP em 1 mês com desenvolvimento assistido por IA. Apresentado na convenção anual da empresa pelo CTO',
          en: 'Refactored the Proposals system (legacy PHP to Bun/TypeScript), a project stalled for 2 years due to complexity and lack of headcount. MVP in 1 month with AI-assisted development. Presented at the company annual convention by the CTO',
        },
        {
          pt: 'Criei o PDD (Parity-Driven Development) durante o refactor, uma metodologia que visa resolver a paridade e agora virou parte do fluxo da migração de refactors',
          en: 'Created PDD (Parity-Driven Development) during the refactor, a methodology to solve parity that is now part of the team refactor migration flow',
        },
        {
          pt: 'Referência de IA do time, envolvido em decisões de arquitetura e apoiando outros devs na adoção',
          en: "AI reference for the team, involved in architecture decisions and supporting other devs in adoption",
        },
        {
          pt: 'Sustentação do produto principal: debug, correções, criação de interfaces e suporte a outros times',
          en: 'Support for the main product: debugging, fixes, interface development, and support to other teams',
        },
        {
          pt: 'Deploy interno do Embark (open source próprio) para publicação de projetos de áreas não-técnicas',
          en: 'Internal rollout of Embark (my own open source project) for publishing projects from non-technical areas',
        },
      ],
      cvTech:
        'Bun, TypeScript, Node.js, MCP, Gemini, Anthropic, OpenAI, GitHub Copilot, MongoDB, Docker, N8N, Windmill, Cloudflare',
    },
    {
      role: { pt: 'Desenvolvedor Backend Pleno', en: 'Mid-level Backend Developer' },
      company: 'Eletromidia',
      period: { pt: 'ago 2024 a out 2025', en: 'Aug 2024 to Oct 2025' },
      duration: { pt: '1 ano 3 meses', en: '1 yr 3 mos' },
      type: { pt: 'Tempo integral', en: 'Full-time' },
      location: { pt: 'São Paulo · Híbrido', en: 'São Paulo · Hybrid' },
      current: false,
      bullets: [
        {
          pt: 'Criei o Pulsar, CLI interna para migrações MongoDB entre clusters. Tem TUI, modo cold dump e modo hot sync com watch para manter bases sincronizadas em tempo real (útil para staging). Substituiu processo manual de mongodump/restore e nos deu uma base confiável para ambiente de staging',
          en: 'Built Pulsar, an internal CLI for MongoDB migrations across clusters. It has a TUI, a cold dump mode and a hot sync mode with watch to keep databases synchronized in real time (useful for staging). It replaced a manual mongodump/restore process and gave us a reliable staging environment',
        },
        {
          pt: 'Automatizei validação de PDFs de contrato com Google Document AI e Custom Extractor, modelo com 96% de acurácia',
          en: 'Automated contract PDF validation with Google Document AI and a Custom Extractor, model with 96% accuracy',
        },
        {
          pt: 'Busca por linguagem natural: structured output da OpenAI converte a entrada do usuário em queries de filtro no MongoDB',
          en: "Natural language search: OpenAI's structured output converts the user's input into MongoDB filter queries",
        },
      ],
      cvTech: 'Node.js, TypeScript, MongoDB, Document AI, OpenAI, Windmill, Docker',
    },
    {
      role: { pt: 'Desenvolvedor de Software', en: 'Software Developer' },
      company: 'Alest Consultoria',
      period: { pt: 'dez 2023 a ago 2024', en: 'Dec 2023 to Aug 2024' },
      duration: { pt: '9 meses', en: '9 months' },
      type: { pt: 'Tempo integral', en: 'Full-time' },
      location: { pt: 'São Paulo · Presencial', en: 'São Paulo · On-site' },
      current: false,
      bullets: [
        {
          pt: 'Reuniões diretas com clientes para desenhar arquiteturas de cada projeto, traduzindo problema de negócio em solução técnica',
          en: 'Direct client meetings to design each project\'s architecture, translating business problems into technical solutions',
        },
        {
          pt: 'Pipeline de migração de 30.000+ documentos (Drive, OneDrive, S3, local → DocuSign) com Node.js Streams para controle de backpressure (referência de migrações dentro da empresa)',
          en: 'Migration pipeline for 30,000+ documents (Drive, OneDrive, S3, local → DocuSign) using Node.js Streams for backpressure control (became the reference for migrations within the company)',
        },
        {
          pt: 'Mentorei 5 estagiários com 1:1s regulares',
          en: 'Mentored 5 interns with regular 1:1s',
        },
      ],
      cvTech: 'Node.js, TypeScript, GCP, Docker, Node.js Streams, Backpressure, APIs',
    },
    {
      role: { pt: 'Desenvolvedor Estagiário', en: 'Developer Intern' },
      company: 'Alest Consultoria',
      period: { pt: 'jun 2023 a dez 2023', en: 'Jun 2023 to Dec 2023' },
      duration: { pt: '7 meses', en: '7 months' },
      type: { pt: 'Estágio', en: 'Internship' },
      location: { pt: 'São Paulo', en: 'São Paulo' },
      current: false,
      bullets: [
        {
          pt: 'Implementei chatbot corporativo com Dialogflow CX integrado a base de conhecimento interna, usado para consultas em linguagem natural pelos colaboradores',
          en: 'Implemented a corporate chatbot with Dialogflow CX integrated with the internal knowledge base, used by employees for natural language queries',
        },
        {
          pt: 'Integrações entre plataformas com Make e N8N (Monday + DocuSign, Monday + HubSpot, entre outras)',
          en: 'Cross-platform integrations with Make and N8N (Monday + DocuSign, Monday + HubSpot, among others)',
        },
      ],
      cvTech: 'Node.js, Dialogflow CX, OpenAI, GCP, N8N, Pub/Sub, Cloud Functions',
    },
    {
      role: { pt: 'Desenvolvedor Frontend', en: 'Frontend Developer' },
      company: 'Next Fusion',
      period: { pt: '2021 a jun 2023', en: '2021 to Jun 2023' },
      duration: { pt: '~2 anos', en: '~2 years' },
      type: { pt: 'Sócio', en: 'Co-founder' },
      location: { pt: 'São Paulo', en: 'São Paulo' },
      current: false,
      bullets: [
        {
          pt: 'Agência de desenvolvimento web fundada com um sócio designer. ~20 sites institucionais e landing pages entregues de ponta a ponta: levantamento de requisitos, desenvolvimento (React, WordPress) e deploy',
          en: 'Web development agency founded with a designer partner. ~20 corporate websites and landing pages delivered end-to-end: requirements gathering, development (React, WordPress), and deploy',
        },
      ],
      cvTech: 'React, JavaScript, HTML/CSS, WordPress, Figma',
    },
  ],

  workProjects: [
    {
      title: { pt: 'Chatbot Corporativo com Dialogflow CX', en: 'Corporate Chatbot with Dialogflow CX' },
      category: { pt: 'IA CONVERSACIONAL', en: 'CONVERSATIONAL AI' },
      description: {
        pt: 'Arquitetura e entrega de um chatbot conversacional corporativo interno utilizando Dialogflow CX integrado a uma base de conhecimento de 10.000+ documentos (JSONs, planilhas e PDFs). O sistema substituiu um processo manual de consulta de documentos por uma interface de linguagem natural. A recuperação ficou a cargo da base de conhecimento gerenciada do Dialogflow; meu trabalho foi o desenho conversacional, o tratamento das fontes e a integração com os sistemas internos.',
        en: 'Architecture and delivery of an internal corporate conversational chatbot using Dialogflow CX integrated with a knowledge base of 10,000+ documents (JSONs, spreadsheets, and PDFs). The system replaced a manual document consultation process with a natural language interface. Retrieval was handled by the managed Dialogflow knowledge base; my work was the conversational design, the source preparation and the integration with internal systems.',
      },
      cardTitle: 'Chatbot Corporativo com Dialogflow CX',
      cardCategory: 'IA CONVERSACIONAL',
      cardDescription:
        'Arquitetura e entrega de um chatbot conversacional corporativo interno utilizando Dialogflow CX integrado a uma base de conhecimento de 10.000+ documentos (JSONs, planilhas e PDFs). O sistema substituiu um processo manual de consulta de documentos por uma interface de linguagem natural. A recuperação ficou a cargo da base de conhecimento gerenciada do Dialogflow; meu trabalho foi o desenho conversacional, o tratamento das fontes e a integração com os sistemas internos.',
      technologies: ['Dialogflow CX', 'Knowledge Base', 'Node.js', 'TypeScript', 'GCP', 'NLP'],
      impact: { pt: '10.000+ documentos consultáveis por linguagem natural', en: '10,000+ documents queryable in natural language' },
    },
    {
      title: {
        pt: 'Filtros Inteligentes: Agente NLP para Queries',
        en: 'Intelligent Filters: NLP to Database Query Agent',
      },
      category: { pt: 'AI AGENT · TOOL USE', en: 'AI AGENT · TOOL USE' },
      description: {
        pt: 'Desenvolvimento de um agente de IA capaz de interpretar entradas de texto livre do usuário e convertê-las em queries estruturadas de MongoDB. O sistema entende a intenção do usuário, aplica a lógica de negócio e retorna os resultados filtrados, eliminando a necessidade de preenchimento manual de filtros. Integrado a produto interno em produção.',
        en: 'Development of an AI agent capable of interpreting free-text user inputs and converting them into structured MongoDB queries. The system understands user intent, applies business logic, and returns filtered results, eliminating the need for manual filter input. Integrated into an internal production product.',
      },
      cardTitle: 'Intelligent Filters: NLP to Database Query Agent',
      cardCategory: 'AI AGENT · TOOL USE',
      cardDescription:
        'Desenvolvimento de um agente de IA capaz de interpretar entradas de texto livre do usuário e convertê-las em queries estruturadas de MongoDB. O sistema entende a intenção do usuário, aplica a lógica de negócio e retorna os resultados filtrados, eliminando a necessidade de preenchimento manual de filtros. Integrado a produto interno em produção.',
      technologies: ['OpenAI', 'MongoDB', 'Node.js', 'TypeScript', 'Windmill', 'AI Agent'],
      impact: { pt: 'Busca livre vira query no banco', en: 'Free text becomes a database query' },
    },
    {
      title: { pt: 'Extrator Customizado com Document AI', en: 'Document AI Custom Extractor' },
      category: { pt: 'IA & AUTOMAÇÃO', en: 'AI & AUTOMATION' },
      description: {
        pt: 'Arquitetura e implementação de um pipeline de extração de dados com Google Document AI para um produto interno da Eletromídia. Substituiu um processo 100% manual de validação operacional por um fluxo automatizado que identifica, extrai e valida campos específicos de documentos não estruturados com alta precisão. Solução projetada para reuso em outros fluxos com a mesma necessidade.',
        en: 'Architecture and implementation of a data extraction pipeline with Google Document AI for an internal Eletromidia product. Replaced a 100% manual operational validation process with an automated flow that identifies, extracts, and validates specific fields from unstructured documents with high accuracy. Solution designed for reuse across other flows with the same need.',
      },
      cardTitle: 'Document AI Custom Extractor',
      cardCategory: 'IA & Automação',
      cardDescription:
        'Arquitetura e implementação de um pipeline de extração de dados com Google Document AI para um produto interno da Eletromídia. Substituiu um processo 100% manual de validação operacional por um fluxo automatizado que identifica, extrai e valida campos específicos de documentos não estruturados com alta precisão. Solução projetada para reuso em outros fluxos com a mesma necessidade.',
      technologies: ['Node.js', 'Google Document AI', 'TypeScript'],
      impact: { pt: '96% de acurácia na extração', en: '96% extraction accuracy' },
    },
    {
      title: { pt: 'Migração Massiva com Node Streams', en: 'Massive Migration with Node Streams' },
      category: { pt: 'PERFORMANCE & DATA', en: 'PERFORMANCE & DATA' },
      description: {
        pt: 'Arquitetura e execução de pipeline de migração de 30.000+ documentos de múltiplas origens (Drive, OneDrive, S3, Local) para DocuSign. Utilização intensiva de Node.js Streams para controle de backpressure, evitando memory leaks. Implementação de observabilidade estruturada para retomada granular em caso de falha, tolerância a falhas sem reprocessamento do início. Solução construída para ser reutilizável em outros fluxos com a mesma necessidade.',
        en: 'Architecture and execution of a migration pipeline for 30,000+ documents from multiple sources (Drive, OneDrive, S3, Local) to DocuSign. Intensive use of Node.js Streams for backpressure control, preventing memory leaks. Structured observability for granular recovery on failure, fault tolerance without reprocessing from scratch. Solution built to be reusable across other flows with the same need.',
      },
      cardTitle: 'Migração Massiva com Node Streams',
      cardCategory: 'Performance & Data',
      cardDescription:
        'Arquitetura e execução de pipeline de migração de 30.000+ documentos de múltiplas origens (Drive, OneDrive, S3, Local) para DocuSign. Utilização intensiva de Node.js Streams para controle de backpressure, evitando memory leaks. Implementação de observabilidade estruturada para retomada granular em caso de falha, tolerância a falhas sem reprocessamento do início. Solução construída para ser reutilizável em outros fluxos com a mesma necessidade.',
      technologies: ['Node.js Streams', 'Backpressure', 'API Integrations', 'File Systems'],
      impact: { pt: '30.000+ documentos migrados', en: '30,000+ documents migrated' },
    },
    {
      title: { pt: 'Otimização com Redis', en: 'Redis Optimization' },
      category: { pt: 'PERFORMANCE', en: 'PERFORMANCE' },
      description: {
        pt: 'Implementação estratégica de cache utilizando Hashsets e Sorted Lists para armazenar resultados de computações complexas. Redução drástica na latência e custos de banco de dados em endpoints de alta concorrência. Queries complexas com tempo de resposta reduzido de ~10s para ~2s (em alguns casos abaixo de 900ms).',
        en: 'Strategic cache implementation using Hashsets and Sorted Lists to store results of complex computations. Drastic reduction in latency and database costs for high-concurrency endpoints. Complex queries with response time reduced from ~10s to ~2s (in some cases below 900ms).',
      },
      cardTitle: 'Otimização com Redis',
      cardCategory: 'Performance',
      cardDescription:
        'Implementação estratégica de cache utilizando Hashsets e Sorted Lists para armazenar resultados de computações complexas. Redução drástica na latência e custos de banco de dados em endpoints de alta concorrência. Queries complexas com tempo de resposta reduzido de ~10s para ~2s (em alguns casos abaixo de 900ms).',
      technologies: ['Redis', 'Caching Strategy', 'Backend Optimization'],
      impact: { pt: 'Latência de ~10s para ~2s', en: 'Latency from ~10s to ~2s' },
    },
    {
      title: { pt: 'Versionamento de Triggers MongoDB', en: 'MongoDB Triggers Versioning' },
      category: { pt: 'DEVOPS & INFRA', en: 'DEVOPS & INFRA' },
      description: {
        pt: 'Criação de um modelo proprietário para versionamento seguro de MongoDB Atlas Triggers. O sistema garante a sincronia entre o código da aplicação e as functions do banco, prevenindo erros de deploy e esquecimento de configurações críticas.',
        en: 'Creation of a proprietary model for secure versioning of MongoDB Atlas Triggers. The system ensures synchronization between application code and database functions, preventing deploy errors and forgotten critical configurations.',
      },
      cardTitle: 'Versionamento de Triggers MongoDB',
      cardCategory: 'DevOps & Infra',
      cardDescription:
        'Criação de um modelo proprietário para versionamento seguro de MongoDB Atlas Triggers. O sistema garante a sincronia entre o código da aplicação e as functions do banco, prevenindo erros de deploy e esquecimento de configurações críticas.',
      technologies: ['MongoDB Atlas', 'Serverless Functions', 'CI/CD'],
      impact: { pt: 'Zero deploy fora de sincronia', en: 'Zero out-of-sync deploys' },
    },
    {
      title: { pt: 'Ensino para Estagiários', en: 'Intern Training' },
      category: { pt: 'MENTORIA', en: 'MENTORSHIP' },
      description: {
        pt: 'Desenvolvimento de um projeto prático focado em raciocínio técnico para treinamento de estagiários. O ambiente simula desafios reais de backend, promovendo aprendizado mútuo e elevação da barra técnica do time.',
        en: "Development of a practical project focused on technical reasoning for intern training. The environment simulates real backend challenges, promoting mutual learning and raising the team's technical bar.",
      },
      cardTitle: 'Ensino para Estagiários',
      cardCategory: 'Mentoria',
      cardDescription:
        'Desenvolvimento de um projeto prático focado em raciocínio técnico para treinamento de estagiários. O ambiente simula desafios reais de backend, promovendo aprendizado mútuo e elevação da barra técnica do time.',
      technologies: ['NodeJS Streams', 'Code Review', 'Best Practices'],
      impact: { pt: 'Barra técnica do time elevada', en: "Raised the team's technical bar" },
    },
  ],

  cvProjects: [
    {
      name: {
        pt: 'Agentistics: Dashboard de Analytics Local para Assistentes de Código com IA',
        en: 'Agentistics: Local Analytics Dashboard for AI Coding Assistants',
      },
      description: {
        pt: 'Construí um dashboard de analytics local-first que parseia sessões ~/.claude/ para exibir uso de tokens, custos (USD/BRL), métricas de agentes, heatmaps de atividade e breakdown por modelo. Inclui CLI com modo TUI, export OpenTelemetry e geração de relatórios PDF. Zero cloud, zero telemetria.',
        en: 'Built a local-first analytics dashboard that parses ~/.claude/ sessions to surface token usage, costs (USD/BRL), agent metrics, activity heatmaps, and per-model breakdown. Includes a CLI with TUI mode, OpenTelemetry export, and PDF report generation. Zero cloud, zero telemetry.',
      },
      stack: 'TypeScript · Bun · React · Vite · Three.js · OpenTelemetry',
    },
    {
      name: {
        pt: 'DuckFlux: DSL Declarativa para Orquestração Multi-Agente',
        en: 'DuckFlux: Declarative DSL for Multi-Agent Orchestration',
      },
      description: {
        pt: 'Co-autor de uma engine DSL nativa em YAML para orquestração de pipelines de IA multi-agente. Inclui execução paralela, condicionais CEL, controle de fluxo por máquina de estados, suporte nativo a MCP, steps event-driven (emit/wait) e sub-workflows aninhados. Suporta Go CLI e runtimes Bun/Node.js.',
        en: 'Co-author of a native YAML DSL engine for orchestrating multi-agent AI pipelines. Includes parallel execution, CEL conditionals, state-machine flow control, native MCP support, event-driven steps (emit/wait), and nested sub-workflows. Supports a Go CLI and Bun/Node.js runtimes.',
      },
      stack: 'TypeScript · Bun · Go · YAML DSL · MCP · LLM Orchestration',
    },
    {
      name: {
        pt: 'Embark: Framework CI/CD Zero-Config para Monorepos Assistidos por IA',
        en: 'Embark: Zero-Config CI/CD Framework for AI-Assisted Monorepos',
      },
      description: {
        pt: 'Construí um framework monorepo que auto-gera workflows GitHub Actions, Dockerfiles (via CLIs de IA: Claude, Gemini, Copilot, Codex) e pipelines de deploy Cloud Run / Netlify / Cloudflare a cada commit. Enforça gates de qualidade de código (77% de cobertura) via pre-push hooks.',
        en: 'Built a monorepo framework that auto-generates GitHub Actions workflows, Dockerfiles (via AI CLIs: Claude, Gemini, Copilot, Codex), and Cloud Run / Netlify / Cloudflare deploy pipelines on every commit. Enforces code quality gates (77% coverage) via pre-push hooks.',
      },
      stack: 'TypeScript · Bun · GitHub Actions · Docker · GCP Cloud Run',
    },
    {
      name: {
        pt: 'Rede Neural: Modelo de Predição de Planos',
        en: 'Neural Network: Plan Prediction Model',
      },
      description: {
        pt: 'Treinei uma rede neural feedforward do zero como parte da pós-graduação em Engenharia de IA. Usei ativação ReLU, ajuste de pesos de neurônios e contagem de epochs para predizer qual plano de assinatura melhor se adequa a padrões de comportamento.',
        en: 'Trained a feedforward neural network from scratch as part of the AI Engineering postgraduate program. Used ReLU activation, neuron weight tuning, and epoch counting to predict which subscription plan best fits behavior patterns.',
      },
      stack: 'JavaScript · Neural Networks · ReLU · Supervised Learning · Backpropagation',
    },
  ],

  education: [
    {
      institution: 'UNIPDS',
      degree: { pt: 'Pós-Graduação', en: 'Postgraduate' },
      field: { pt: 'Engenharia de IA Aplicada', en: 'Applied AI Engineering' },
      period: { pt: 'fev 2026 a mar 2027', en: 'Feb 2026 to Mar 2027' },
      logo: '/unipds-logo.jpg',
      current: true,
      status: { pt: 'Em andamento', en: 'In progress' },
    },
    {
      institution: 'Pontifícia Universidade Católica do Paraná',
      degree: { pt: 'Tecnólogo', en: 'Technologist' },
      field: {
        pt: 'Análise e Desenvolvimento de Sistemas',
        en: 'Systems Analysis and Development',
      },
      period: { pt: 'jul 2022 a jan 2025', en: 'Jul 2022 to Jan 2025' },
      logo: '/pucpr-logo.jpg',
      current: false,
      status: { pt: '', en: '' },
    },
  ],

  cvSkills: [
    {
      category: { pt: 'IA Generativa & ML', en: 'Generative AI & ML' },
      items: {
        pt: 'Agentes de IA com Tool Use, Orquestração Multi-Agente, MCP (Model Context Protocol), Structured Output, Prompt Engineering, Avaliação de LLM (evals, LLM-as-judge), RAG e estratégias de recuperação, Dialogflow CX, Document AI',
        en: 'AI Agents with Tool Use, Multi-Agent Orchestration, MCP (Model Context Protocol), Structured Output, Prompt Engineering, LLM evaluation (evals, LLM-as-judge), RAG and retrieval strategies, Dialogflow CX, Document AI',
      },
    },
    {
      category: { pt: 'Backend', en: 'Backend' },
      items: {
        pt: 'Node.js, Bun, TypeScript, Elysia, Zod, MongoDB, Redis, Node.js Streams, Backpressure, Estratégias de cache',
        en: 'Node.js, Bun, TypeScript, Elysia, Zod, MongoDB, Redis, Node.js Streams, Backpressure, Estratégias de cache',
      },
    },
    {
      category: { pt: 'Bancos de Dados', en: 'Databases' },
      items: {
        pt: 'MongoDB (Atlas, Triggers, Edge Computing), Firestore, Redis, Bancos Vetoriais',
        en: 'MongoDB (Atlas, Triggers, Edge Computing), Firestore, Redis, Vector Databases',
      },
    },
    {
      category: { pt: 'Cloud & DevOps', en: 'Cloud & DevOps' },
      items: {
        pt: 'GCP (Cloud Run, Functions, Pub/Sub, Scheduler, API Gateway), Cloudflare, GitHub Actions, CI/CD, Docker',
        en: 'GCP (Cloud Run, Functions, Pub/Sub, Scheduler, API Gateway), Cloudflare, GitHub Actions, CI/CD, Docker',
      },
    },
    {
      category: { pt: 'Automação', en: 'Automation' },
      items: { pt: 'N8N, Windmill, Webhooks, Atlas Triggers', en: 'N8N, Windmill, Webhooks, Atlas Triggers' },
    },
    {
      category: { pt: 'Frontend', en: 'Frontend' },
      items: {
        pt: 'React.js, Vue, HTML/CSS/JS, Tailwind, Figma, WordPress',
        en: 'React.js, Vue, HTML/CSS/JS, Tailwind, Figma, WordPress',
      },
    },
  ],

  skillBranches: [
    {
      id: 'agents',
      title: { pt: 'Agentes & Orquestração', en: 'Agents & Orchestration' },
      short: { pt: 'Agentes', en: 'Agents' },
      blurb: {
        pt: 'Modelo de linguagem resolvendo problema de negócio: com ferramenta na mão, saída previsível e limite claro do que pode fazer.',
        en: 'Language models solving business problems: with tools in hand, predictable output and a clear boundary on what they may do.',
      },
      icon: 'brain',
      clusters: [
        {
          label: { pt: 'Padrões de agente', en: 'Agent patterns' },
          items: [
            'Tool use / function calling',
            'Planner-executor',
            'Orquestração multi-agente',
            'Handoff entre agentes',
            'Guardrails',
            'Retry e fallback',
          ],
        },
        {
          label: { pt: 'Controle de saída', en: 'Output control' },
          items: [
            'System prompt design',
            'Chain-of-thought',
            'ReAct',
            'Structured output (JSON Schema)',
            'Gestão de janela de contexto',
            'Orçamento de tokens',
          ],
        },
        {
          label: { pt: 'Pipelines de extração', en: 'Extraction pipelines' },
          items: [
            'NLP → structured output → query tipada',
            'Document AI + Custom Extractor',
            'Validação com contrato Zod',
            'Extração de campos dinâmicos de PDF',
          ],
        },
        {
          label: { pt: 'Avaliação', en: 'Evaluation' },
          items: [
            'Evals',
            'LLM-as-judge',
            'Detecção de alucinação',
            'Tracing de chamadas',
            'Custo por token',
          ],
        },
      ],
    },
    {
      id: 'mcp',
      title: { pt: 'MCP & Contexto', en: 'MCP & Context' },
      short: { pt: 'MCP', en: 'MCP' },
      blurb: {
        pt: 'Model Context Protocol é como eu ligo o modelo ao sistema real. Quando o servidor que eu preciso não existe, eu construo.',
        en: 'Model Context Protocol is how I wire a model into the real system. When the server I need does not exist, I build it.',
      },
      icon: 'plug',
      clusters: [
        {
          label: { pt: 'Construção de servidor', en: 'Server building' },
          items: [
            'Servidores MCP próprios',
            'Definição de tools & schemas',
            'Resources e prompts',
            'Transport stdio e HTTP',
            'Exposição segura de capacidades',
          ],
        },
        {
          label: { pt: 'No fluxo de trabalho', en: 'In the workflow' },
          items: [
            'LLM conectado ao sistema real',
            'Contexto versionado',
            'Métricas de uso por time',
            'Tracking centralizado de agentes',
          ],
        },
      ],
    },
    {
      id: 'rag',
      title: { pt: 'RAG & Busca Semântica', en: 'RAG & Semantic Search' },
      short: { pt: 'RAG', en: 'RAG' },
      blurb: {
        pt: 'Como um modelo encontra a informação certa antes de responder — do chunking à avaliação da resposta.',
        en: 'How a model finds the right information before answering — from chunking to evaluating the answer.',
      },
      icon: 'search',
      clusters: [
        {
          label: { pt: 'Aplicações entregues', en: 'Shipped applications' },
          items: [
            'Chatbot corporativo sobre 10k+ docs',
            'Busca NLP com filtro inteligente',
            'Extração de documentos (96% acurácia)',
          ],
          highlight: true,
        },
        {
          label: { pt: 'Arquiteturas & indexação', en: 'Architectures & indexing' },
          items: [
            'Naive RAG → Advanced RAG → Modular RAG',
            'Chunking (fixo, semântico, recursivo)',
            'Embeddings',
            'Vector store',
            'Filtro por metadado',
          ],
        },
        {
          label: { pt: 'Estratégias de busca', en: 'Retrieval strategies' },
          items: [
            'Busca densa',
            'BM25',
            'Busca híbrida',
            'HyDE',
            'Query rewriting & expansion',
            'Re-ranking',
          ],
        },
        {
          label: { pt: 'Qualidade da resposta', en: 'Answer quality' },
          items: [
            'Faithfulness',
            'Context recall & precision',
            'Compressão de contexto',
            'Citação de fonte',
          ],
        },
      ],
    },
    {
      id: 'backend',
      title: { pt: 'Backend & Dados', en: 'Backend & Data' },
      short: { pt: 'Backend', en: 'Backend' },
      blurb: {
        pt: 'API tipada, domínio isolado, e código que o time consegue mexer depois que eu saio.',
        en: 'Typed APIs, isolated domain, and code the team can still work on after I leave.',
      },
      icon: 'server',
      clusters: [
        {
          label: { pt: 'Problemas resolvidos', en: 'Problems solved' },
          items: [
            'Refactor legado PHP → Bun/TS em 1 mês',
            'Migração de 30k+ docs com streaming',
            'Cache Redis: latência 10s → 2s',
            'CLI de migração MongoDB (Pulsar)',
            'Deploy zero-config para áreas não-técnicas (Embark)',
          ],
          highlight: true,
        },
        {
          label: { pt: 'Stack', en: 'Stack' },
          items: ['Node.js', 'Bun', 'TypeScript', 'MongoDB', 'Redis', 'Zod', 'Elysia'],
        },
        {
          label: { pt: 'Patterns de volume', en: 'Volume patterns' },
          items: [
            'Node.js Streams',
            'Backpressure',
            'Aggregation pipeline',
            'Processamento em lote',
            'Migração em massa',
            'Paginação por cursor',
            'Cache-aside com TTL',
          ],
        },
      ],
    },
    {
      id: 'infra',
      title: { pt: 'Infra & Automação', en: 'Infra & Automation' },
      short: { pt: 'Infra', en: 'Infra' },
      blurb: {
        pt: 'Pipeline que testa e publica sozinho, automação que tira trabalho manual do caminho.',
        en: 'A pipeline that tests and ships on its own, and automation that takes manual work out of the way.',
      },
      icon: 'cloud',
      clusters: [
        {
          label: { pt: 'Cloud & deploy', en: 'Cloud & deploy' },
          items: ['GCP', 'Cloud Run', 'Cloudflare Workers & Pages', 'GitHub Actions', 'Docker'],
        },
        {
          label: { pt: 'Automação', en: 'Automation' },
          items: ['n8n', 'Windmill', 'Webhooks', 'Atlas Triggers'],
        },
        {
          label: { pt: 'Open source', en: 'Open source' },
          items: [
            'Agentistics (analytics para AI coding)',
            'DuckFlux (orquestração multi-agente)',
            'Embark (CI/CD zero-config)',
          ],
          highlight: true,
        },
      ],
    },
  ],

  languages: {
    pt: 'Português (Nativo), Inglês (Básico)',
    en: 'Portuguese (Native), English (Basic)',
  },
};

// ---------------------------------------------------------------------------
// Locale-aware builders — used by the i18n locale files to derive their
// `cv`, `career.items`, `projects.items`, `education.items`, and the low-code
// / MCP description arrays from the single source of truth above.
// ---------------------------------------------------------------------------

export const buildCv = (l: Locale) => ({
  fileName: 'Bryan_Soares_CV',
  name: profile.personal.name,
  title: pick(profile.personal.title, l),
  location: pick(profile.personal.location, l),
  phone: profile.personal.phone,
  email: profile.personal.email,
  website: profile.personal.website,
  linkedin: profile.personal.linkedin,
  github: profile.personal.github,
  summary: pick(profile.summary, l),
  tech: profile.experience.map((e) => e.cvTech),
  projects: profile.cvProjects.map((p) => ({
    name: pick(p.name, l),
    description: pick(p.description, l),
    stack: p.stack,
  })),
  skills: profile.cvSkills.map((s) => ({
    category: pick(s.category, l),
    items: pick(s.items, l),
  })),
  languages: pick(profile.languages, l),
});

export const buildCareerItems = (l: Locale) =>
  profile.experience.map((e) => ({
    role: pick(e.role, l),
    company: e.company,
    period: pick(e.period, l),
    duration: pick(e.duration, l),
    type: pick(e.type, l),
    location: pick(e.location, l),
    current: e.current,
    bullets: e.bullets.map((b) => pick(b, l)),
  }));

export const buildProjectItems = (l: Locale) =>
  profile.workProjects.map((p) => ({
    title: pick(p.title, l),
    category: pick(p.category, l),
    description: pick(p.description, l),
    impact: p.impact ? pick(p.impact, l) : undefined,
  }));

export const buildEducationItems = (l: Locale) =>
  profile.education.map((e) => ({
    institution: e.institution,
    degree: pick(e.degree, l),
    field: pick(e.field, l),
    period: pick(e.period, l),
    logo: e.logo,
    current: e.current,
    status: pick(e.status, l),
  }));

export const buildSkillBranches = (l: Locale) =>
  profile.skillBranches.map((b) => ({
    id: b.id,
    title: pick(b.title, l),
    short: pick(b.short, l),
    blurb: pick(b.blurb, l),
    icon: b.icon,
    clusters: b.clusters.map((c) => ({
      label: pick(c.label, l),
      items: c.items,
      highlight: !!c.highlight,
    })),
  }));
