import {
  buildCv,
  buildCareerItems,
  buildProjectItems,
  buildEducationItems,
  buildLowCodeDescriptions,
  buildMcpDescriptions,
} from "../data/profile";

const pt = {
  nav: {
    profile: "Perfil",
    about: "Sobre",
    expertise: "Habilidades",
    stacks: "Stacks",
    lowcode: "Low Code",
    mcps: "MCPs",
    projects: "Projetos",
    career: "Trajet\u00f3ria",
    education: "Forma\u00e7\u00e3o",
    vibe: "Vibe Coding",
    learning: "Aprendizado",
    vibeProjects: "Vibe Projects",
    aiUsage: "Automa\u00e7\u00e3o",
  },
  hero: {
    badge: "AI Engineer \u00b7 Software Developer",
    title1: "Sistemas Robustos.",
    title2: "Intelig\u00eancia Aplicada.",
    subtitle_prefix: "",
    subtitle_highlight: "AI Engineer e Software Developer.",
    subtitle_suffix:
      " Construo sistemas escal\u00e1veis, pipelines de IA e orquestra\u00e7\u00e3o de agentes para problemas reais de neg\u00f3cio.",
    cta: "Alguns projetos",
    tag1: "// Node.js & Bun",
    tag2: "// GenAI & Agents",
    tag3: "// Integrations",
    tag4: "// Low Code",
  },
  agent: {
    title: "bryan.ai · agent session",
    online: "online",
    badge: "local · 0 tokens · $0.00",
    placeholder: "Pergunte algo sobre o Bryan…",
    hint: "← converse com a IA",
    thinking: "raciocinando",
    toolRunning: "executando…",
    toolDone: "concluído",
    disclaimer: "Sugestões respondem na hora; perguntas livres usam IA.",
    limitReached:
      "Limite de uso da IA atingido. Tente de novo em instantes, ou use as sugestões abaixo.",
    inputBlocked: "IA indisponível no momento, use as sugestões",
    suggestions: [
      "Por que contratar o Bryan?",
      "Mostre os projetos de IA",
      "Resuma a carreira",
      "Baixar CV",
    ],
    boot: [
      "inicializando agente…",
      "carregando base de conhecimento (CV · 5 anos de exp)",
      "indexando 7 projetos · 5 cargos",
      "ferramentas prontas: scroll · highlight · download_cv · contato",
      "agente online.",
    ],
    cta: "bra.ia",
    close: "Fechar",
    viewing: "vendo",
    welcomeTitle: "Como posso ajudar?",
    welcomeText:
      "Pergunte sobre a carreira, projetos e skills do Bryan, eu respondo na hora.",
    sourceAi: "OpenRouter",
    sourceLocal: "Local · determinístico",
    sourceAiHint: "Resposta de um LLM real via OpenRouter",
    sourceLocalHint: "Motor de regras no navegador, sem LLM, sem custo",
    unavailable:
      "O assistente está indisponível no momento. Tente novamente em instantes.",
    contextSuggestions: {
      profile: ["Por que contratar o Bryan?", "Resuma a carreira", "Baixar CV"],
      about: ["Quem é o Bryan?", "Qual o diferencial dele?", "Foco em IA?"],
      stack: ["Que stack ele domina?", "Ele usa Bun?", "Experiência com IA?"],
      lowcode: ["Que ferramentas low-code?", "Como acelera entregas?", "Mostre os projetos"],
      mcp: ["O que é MCP pra ele?", "Onde usou MCP?", "Mostre os projetos de IA"],
      projects: ["Detalhe o chatbot RAG", "Que stack usou nos projetos?", "Projeto de IA mais forte?"],
      career: ["Onde ele trabalha hoje?", "Resuma a trajetória", "Por que contratar?"],
      education: ["Qual a formação dele?", "Está estudando o quê?", "Pós em quê?"],
      learning: ["Como ele se mantém aprendendo?", "Mostre os projetos", "Foco em IA?"],
      "vibe-projects": ["O que é vibe coding?", "Mostre os projetos de IA", "Que stack usa?"],
      "ai-usage": ["Como ele usa IA no dia a dia?", "Por que contratar o Bryan?", "Resuma a carreira"],
    } as Record<string, string[]>,
  },
  whoiam: {
    title: "Quem sou",
    p1_start:
      "AI Engineer e Software Developer com +5 anos de experi\u00eancia em desenvolvimento de software, com os \u00faltimos 2 anos focados em ",
    p1_highlight1: "IA Generativa aplicada",
    p1_mid:
      ". Construo sistemas escal\u00e1veis, pipelines RAG, agentes de IA com tool use e solu\u00e7\u00f5es de ",
    p1_highlight2: "orquestra\u00e7\u00e3o multi-agente",
    p1_end:
      " para problemas reais de neg\u00f3cio. Experi\u00eancia em arquitetar produtos com GenAI em produ\u00e7\u00e3o, de chatbots corporativos sobre bases de 10.000+ documentos a agentes de NLP-to-database. Atualmente cursando P\u00f3s-Gradua\u00e7\u00e3o em Engenharia de IA Aplicada.",
    p2: "Minha diferen\u00e7a n\u00e3o \u00e9 s\u00f3 t\u00e9cnica: tenho a comunica\u00e7\u00e3o de quem vende e a profundidade de quem constr\u00f3i. Prefiro arquitetar sistemas que durem do que entregar features que precisem ser reescritas.",
    cta: "Ver projetos",
  },
  education: {
    title: "Forma\u00e7\u00e3o Acad\u00eamica",
    items: buildEducationItems("pt"),
  },
  techstack: {
    title: "Arsenal Tecnol\u00f3gico",
    subtitle:
      "Ferramentas selecionadas para performance, seguran\u00e7a e velocidade de desenvolvimento.",
    categories: {
      "Backend Core": "Backend Core",
      "Stack Moderna": "Stack Moderna",
      "Intelig\u00eancia Artificial": "Intelig\u00eancia Artificial",
      "Infra & DevOps": "Infra & DevOps",
    },
    performanceBadge: "Performance First",
    performanceTitle: "Runtime & Performance",
    performanceText:
      "Focado em performance, adotei o Bun como runtime principal para explorar novos limites de velocidade e simplicidade, sem abrir m\u00e3o da robustez do ecossistema TypeScript.",
    performanceBunHighlight: "Bun",
    performanceSuffix:
      " como runtime principal pela efici\u00eancia em benchmarks e pela experi\u00eancia de desenvolvimento unificada.",
  },
  lowcode: {
    badge: "Speed & Agility",
    title: "Low Code & Acelera\u00e7\u00e3o",
    subtitle:
      "Integra\u00e7\u00e3o estrat\u00e9gica de ferramentas visuais para MVPs, automa\u00e7\u00f5es e dashboards, reduzindo o time-to-market sem comprometer a qualidade arquitetural.",
    categories: {
      "Integra\u00e7\u00e3o Backend": "Integra\u00e7\u00e3o Backend",
      "Frontend \u00c1gil": "Frontend \u00c1gil",
      "DevOps & Scripts": "DevOps & Scripts",
    },
    descriptions: buildLowCodeDescriptions("pt"),
  },
  mcp: {
    badge: "Workflow Intelligence",
    title: "Model Context Protocol (MCP)",
    subtitle:
      "O uso de MCPs n\u00e3o \u00e9 apenas uma ferramenta, \u00e9 a base da minha produtividade. Conecto LLMs diretamente ao contexto do projeto para eliminar tarefas repetitivas.",
    descriptions: buildMcpDescriptions("pt"),
  },
  projects: {
    title: "Projetos",
    items: buildProjectItems("pt"),
  },
  career: {
    title: "Trajet\u00f3ria",
    current: "Atual",
    items: buildCareerItems("pt"),
  },
  about: {
    title: "Vibe Coding & Automa\u00e7\u00e3o",
    philosophy:
      "Copilotos aceleram, mas a responsabilidade t\u00e9cnica permanece. Acredito na automa\u00e7\u00e3o que elimina o repetitivo, permitindo foco total na arquitetura e na corre\u00e7\u00e3o de gargalos. A IA ajuda a construir; eu reviso, otimizo e garanto a qualidade.",
  },
  learning: {
    badge: "Open Source \u00b7 Sistema de Estudos",
    title: "Como me mantenho aprendendo",
    subtitle:
      "Um app web open source que constru\u00ed para estudar de forma consistente, transformando conte\u00fado em quizzes e acompanhando meu pr\u00f3prio progresso.",
    p1: "Em vez de leitura passiva, transformo tudo que estudo em pr\u00e1tica ativa. Constru\u00ed o learning.blpsoares.dev como meu sistema pessoal de estudos: insiro conte\u00fado, ele gera perguntas, e eu respondo para refor\u00e7ar o que realmente ficou.",
    p2: "O projeto \u00e9 open source e totalmente vibe coded, desenvolvido com assist\u00eancia de IA da ideia ao deploy. N\u00e3o \u00e9 apenas um side project; faz parte do meu fluxo di\u00e1rio.",
    visitSite: "Visitar site",
    viewSource: "Ver c\u00f3digo",
    readArticle: "Ler o artigo",
    badgeType: "Ferramenta de Estudo",
  },
  vibeProjects: {
    badge: "Vibe Coded \u00b7 Open Source",
    title: "Projetos Open Source Vibe Coded",
    subtitle:
      "Side projects constru\u00eddos com desenvolvimento assistido por IA, da ideia ao deploy, totalmente vibe coded e open source.",
    viewAll: "Ver todos",
    visitSite: "Visitar site",
    backHome: "Voltar ao in\u00edcio",
    pageTitle: "Todos os Projetos Vibe Coded",
    pageSubtitle:
      "Todos os projetos listados aqui foram constru\u00eddos com desenvolvimento assistido por IA e s\u00e3o open source. Clique em qualquer preview para visitar o site ao vivo.",
    errorLoading: "Falha ao carregar projetos. Tente novamente mais tarde.",
  },
  cv: {
    ...buildCv("pt"),
    // Static UI labels — not profile data, stay per-locale here.
    sections: {
      experience: "Experiência Profissional",
      projects: "Projetos Open Source & Pessoais",
      skills: "Habilidades Técnicas",
      education: "Formação Acadêmica",
      languages: "Idiomas",
    },
    techLabel: "Tech",
  },
  footer: {
    rights: "Todos os direitos reservados.",
    downloadCv: "Download CV",
  },
};

export default pt;
