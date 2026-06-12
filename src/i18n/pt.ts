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
    badge: "Senior Backend Engineer",
    title1: "Sistemas Robustos.",
    title2: "Intelig\u00eancia Aplicada.",
    subtitle_prefix: "Backend Engineer com foco em ",
    subtitle_highlight: "Generative AI",
    subtitle_suffix:
      " \u2014 construo sistemas escal\u00e1veis, pipelines de IA e solu\u00e7\u00f5es de orquestra\u00e7\u00e3o de agentes para problemas reais de neg\u00f3cio.",
    cta: "Alguns projetos",
    tag1: "// Node.js & Bun",
    tag2: "// GenAI & Agents",
    tag3: "// Integrations",
    tag4: "// Low Code",
  },
  agent: {
    title: "bryan.ai — agent session",
    online: "online",
    badge: "local · 0 tokens · $0.00",
    placeholder: "Pergunte algo sobre o Bryan…",
    hint: "← converse com a IA",
    thinking: "raciocinando",
    toolRunning: "executando…",
    disclaimer: "Agente determinístico, roda 100% no seu navegador.",
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
    cta: "Assistente IA",
    close: "Fechar",
    viewing: "vendo",
    welcomeTitle: "Como posso ajudar?",
    welcomeText:
      "Pergunte sobre a carreira, projetos e skills do Bryan — eu respondo na hora.",
    sourceAi: "OpenRouter",
    sourceLocal: "local",
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
      "Backend Engineer com +5 anos de experi\u00eancia em desenvolvimento de software, com os \u00faltimos 2 anos focados em ",
    p1_highlight1: "IA Generativa aplicada",
    p1_mid:
      ". Construo sistemas escal\u00e1veis, pipelines RAG, agentes de IA com tool use e solu\u00e7\u00f5es de ",
    p1_highlight2: "orquestra\u00e7\u00e3o multi-agente",
    p1_end:
      " para problemas reais de neg\u00f3cio. Experi\u00eancia em arquitetar produtos com GenAI em produ\u00e7\u00e3o \u2014 de chatbots corporativos sobre bases de 10.000+ documentos a agentes de NLP-to-database. Atualmente cursando P\u00f3s-Gradua\u00e7\u00e3o em Engenharia de IA Aplicada.",
    p2: "Minha diferen\u00e7a n\u00e3o \u00e9 s\u00f3 t\u00e9cnica: tenho a comunica\u00e7\u00e3o de quem vende e a profundidade de quem constr\u00f3i. Prefiro arquitetar sistemas que durem do que entregar features que precisem ser reescritas.",
    cta: "Ver projetos",
  },
  education: {
    title: "Forma\u00e7\u00e3o Acad\u00eamica",
    items: [
      {
        institution: "UNIPDS",
        degree: "P\u00f3s-Gradua\u00e7\u00e3o",
        field: "Engenharia de IA Aplicada",
        period: "fev 2026 \u2013 mar 2027",
        logo: "/unipds-logo.jpg",
        current: true,
        status: "Em andamento",
      },
      {
        institution: "Pontif\u00edcia Universidade Cat\u00f3lica do Paran\u00e1",
        degree: "Tecn\u00f3logo",
        field: "An\u00e1lise e Desenvolvimento de Sistemas",
        period: "jul 2022 \u2013 jan 2025",
        logo: "/pucpr-logo.jpg",
        current: false,
        status: "",
      },
    ],
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
    descriptions: [
      "Uso de ferramentas de integra\u00e7\u00e3o low code como n8n e Make para integra\u00e7\u00f5es r\u00e1pidas e cria\u00e7\u00e3o de MVPs.",
      "Uso de ferramentas low code front end como Retool e Plasmic para features pontuais e entregas de MVPs.",
      "Uso de ferramentas low devops como Windmill para deploy de funcionalidades de forma \u00e1gil.",
    ],
  },
  mcp: {
    badge: "Workflow Intelligence",
    title: "Model Context Protocol (MCP)",
    subtitle:
      "O uso de MCPs n\u00e3o \u00e9 apenas uma ferramenta, \u00e9 a base da minha produtividade. Conecto LLMs diretamente ao contexto do projeto para eliminar tarefas repetitivas.",
    descriptions: [
      "Execu\u00e7\u00e3o de testes automatizados de interface em segundo plano enquanto consigo focar em outras tarefas em paralelo, garantindo um ganho de tempo significativo.",
      "Gera\u00e7\u00e3o autom\u00e1tica de documenta\u00e7\u00f5es t\u00e9cnicas estruturadas a partir do c\u00f3digo fonte, facilitando o compartilhamento de conhecimento \u00e1gil com a equipe.",
      "An\u00e1lise de dados, inspe\u00e7\u00e3o de inconsist\u00eancias e execu\u00e7\u00e3o de queries complexas diretamente do ambiente de desenvolvimento sem a dificuldade de inferir o contexto para o modelo de IA.",
    ],
  },
  projects: {
    title: "Projetos",
    items: [
      {
        title: "Chatbot RAG Corporativo",
        category: "RAG & ENTERPRISE AI",
        description:
          "Arquitetura e entrega de um chatbot conversacional corporativo interno utilizando Dialogflow CX integrado a uma base de conhecimento de 10.000+ documentos (JSONs, planilhas e PDFs). O sistema substituiu um processo manual de consulta de documentos por uma interface de linguagem natural, aplicando RAG para recupera\u00e7\u00e3o sem\u00e2ntica de informa\u00e7\u00f5es n\u00e3o estruturadas.",
      },
      {
        title: "Filtros Inteligentes — Agente NLP para Queries",
        category: "AI AGENT \u00b7 TOOL USE",
        description:
          "Desenvolvimento de um agente de IA capaz de interpretar entradas de texto livre do usu\u00e1rio e convert\u00ea-las em queries estruturadas de MongoDB. O sistema entende a inten\u00e7\u00e3o do usu\u00e1rio, aplica a l\u00f3gica de neg\u00f3cio e retorna os resultados filtrados \u2014 eliminando a necessidade de preenchimento manual de filtros. Integrado a produto interno em produ\u00e7\u00e3o.",
      },
      {
        title: "Extrator Customizado com Document AI",
        category: "IA & AUTOMA\u00c7\u00c3O",
        description:
          "Arquitetura e implementa\u00e7\u00e3o de um pipeline de extra\u00e7\u00e3o de dados com Google Document AI para um cliente enterprise. Substituiu um processo 100% manual de valida\u00e7\u00e3o operacional por um fluxo automatizado que identifica, extrai e valida campos espec\u00edficos de documentos n\u00e3o estruturados com alta precis\u00e3o. Solu\u00e7\u00e3o projetada para reuso em outros clientes com a mesma necessidade.",
      },
      {
        title: "Migra\u00e7\u00e3o Massiva com Node Streams",
        category: "PERFORMANCE & DATA",
        description:
          "Arquitetura e execu\u00e7\u00e3o de pipeline de migra\u00e7\u00e3o de 20.000+ documentos de m\u00faltiplas origens (Drive, OneDrive, S3, Local) para DocuSign. Utiliza\u00e7\u00e3o intensiva de Node.js Streams para controle de backpressure, evitando memory leaks. Implementa\u00e7\u00e3o de observabilidade com Winston para retomada granular em caso de falha \u2014 toler\u00e2ncia a falhas sem reprocessamento do in\u00edcio. Solu\u00e7\u00e3o constru\u00edda para ser reutiliz\u00e1vel em outros clientes com a mesma necessidade.",
      },
      {
        title: "Otimiza\u00e7\u00e3o com Redis",
        category: "PERFORMANCE",
        description:
          "Implementa\u00e7\u00e3o estrat\u00e9gica de cache utilizando Hashsets e Sorted Lists para armazenar resultados de computa\u00e7\u00f5es complexas. Redu\u00e7\u00e3o dr\u00e1stica na lat\u00eancia e custos de banco de dados em endpoints de alta concorr\u00eancia. Queries complexas com tempo de resposta reduzido de ~10s para ~2s (em alguns casos abaixo de 900ms).",
      },
      {
        title: "Versionamento de Triggers MongoDB",
        category: "DEVOPS & INFRA",
        description:
          "Cria\u00e7\u00e3o de um modelo propriet\u00e1rio para versionamento seguro de MongoDB Atlas Triggers. O sistema garante a sincronia entre o c\u00f3digo da aplica\u00e7\u00e3o e as functions do banco, prevenindo erros de deploy e esquecimento de configura\u00e7\u00f5es cr\u00edticas.",
      },
      {
        title: "Ensino para Estagi\u00e1rios",
        category: "MENTORIA",
        description:
          "Desenvolvimento de um projeto pr\u00e1tico focado em racioc\u00ednio t\u00e9cnico para treinamento de estagi\u00e1rios. O ambiente simula desafios reais de backend, promovendo aprendizado m\u00fatuo e eleva\u00e7\u00e3o da barra t\u00e9cnica do time.",
      },
    ],
  },
  career: {
    title: "Trajet\u00f3ria",
    current: "Atual",
    items: [
      {
        role: "Desenvolvedor Backend Senior",
        company: "Eletromidia",
        period: "out 2025 \u2013 Presente",
        duration: "8 meses",
        type: "Tempo integral",
        location: "S\u00e3o Paulo \u00b7 H\u00edbrido",
        current: true,
        bullets: [
          "Constru\u00ed um servidor MCP na API principal do produto da empresa, permitindo um agente LLM processar queries em linguagem natural via tool use",
          "Pesquisa de aplicabilidade de IA em produtos, identificando oportunidades de integra\u00e7\u00e3o GenAI em ferramentas internas",
          "Criei projetos de automa\u00e7\u00e3o permitindo stakeholders n\u00e3o-t\u00e9cnicos transformarem ideias em realidade de forma independente",
          "Suporte arquitetural para novos projetos e refatora\u00e7\u00e3o de sistemas legados",
          "Refer\u00eancia de IA/GenAI do time, apoiando outros devs em arquitetura, implementa\u00e7\u00f5es e uso de IA",
        ],
      },
      {
        role: "Desenvolvedor Backend Pleno",
        company: "Eletromidia",
        period: "ago 2024 \u2013 out 2025",
        duration: "1 ano 3 meses",
        type: "Tempo integral",
        location: "S\u00e3o Paulo \u00b7 H\u00edbrido",
        current: false,
        bullets: [
          "Criei o Pulsar, CLI interna para migra\u00e7\u00f5es MongoDB entre bancos no mesmo cluster ou entre clusters separados, com modo de sync em tempo real que injeta metadados nos documentos para tracking ao vivo \u2014 substituiu processo totalmente manual de m\u00faltiplos mongodumps e restores",
          "Automatizei processo manual de valida\u00e7\u00e3o de PDFs: uso do Google Document AI com Custom Extractor para reconhecer campos din\u00e2micos e validar contra dados de contrato \u2014 modelo final com 96% de acur\u00e1cia",
          "Campo de busca com IA: a IA extrai dados-chave do prompt do usu\u00e1rio, monta o body do endpoint e faz a request final retornando resultados filtrados na interface, eliminando input manual de filtros",
          "Pesquisa completa e apresenta\u00e7\u00e3o sobre MongoDB edge computing para uma aplica\u00e7\u00e3o da empresa",
        ],
      },
      {
        role: "Desenvolvedor de Software",
        company: "Alest Consultoria",
        period: "dez 2023 \u2013 ago 2024",
        duration: "9 meses",
        type: "Tempo integral",
        location: "S\u00e3o Paulo \u00b7 Presencial",
        current: false,
        bullets: [
          "Reuni\u00f5es com clientes e desenho das arquiteturas a serem utilizadas em cada projeto, traduzindo dores de neg\u00f3cio em solu\u00e7\u00f5es t\u00e9cnicas",
          "Mentorei 5 estagi\u00e1rios atrav\u00e9s de 1:1s regulares, orientando crescimento de carreira e apresentando planos de desenvolvimento individual (PDIs)",
          "ETLs para projetos massivos de migra\u00e7\u00e3o de dados em m\u00faltiplos ambientes de clientes",
          "Arquitetei pipeline de migra\u00e7\u00e3o de 30.000+ documentos (Drive \u00b7 OneDrive \u00b7 S3 \u00b7 Local \u2192 DocuSign) com Node.js Streams e pipeline() para controle de backpressure e observabilidade com Winston para recupera\u00e7\u00e3o granular em falhas",
        ],
      },
      {
        role: "Desenvolvedor Estagi\u00e1rio",
        company: "Alest Consultoria",
        period: "jun 2023 \u2013 dez 2023",
        duration: "7 meses",
        type: "Est\u00e1gio",
        location: "S\u00e3o Paulo",
        current: false,
        bullets: [
          "Arquitetei e entreguei chatbot RAG corporativo (Dialogflow CX) integrado a base de conhecimento com 10.000+ documentos (JSONs, planilhas e PDFs) \u2014 substituiu processo 100% manual de consulta por interface em linguagem natural",
          "Fine-tuning de modelos da OpenAI (da-vinci) para casos de uso espec\u00edficos de dom\u00ednio na primeira onda de ado\u00e7\u00e3o GenAI",
          "Constru\u00ed workflows de integra\u00e7\u00e3o entre plataformas usando Make.com e N8N para automa\u00e7\u00e3o de entregas de projetos",
          "Treinei outros estagi\u00e1rios em t\u00f3picos t\u00e9cnicos em que eu tinha mais dom\u00ednio",
        ],
      },
      {
        role: "Desenvolvedor Frontend",
        company: "Next Fusion",
        period: "2021 \u2013 jun 2023",
        duration: "~2 anos",
        type: "S\u00f3cio",
        location: "S\u00e3o Paulo",
        current: false,
        bullets: [
          "Entreguei ~20 sites institucionais e landing pages de ponta a ponta: reuni\u00f5es com clientes, levantamento de requisitos, desenvolvimento e deploy",
          "Ag\u00eancia de desenvolvimento de websites para diversos nichos e tipos de com\u00e9rcio, fundada com um s\u00f3cio designer",
          "Desenvolvimento completo do frontend com React, HTML/CSS e WordPress seguindo as especifica\u00e7\u00f5es de UI/UX do s\u00f3cio designer",
          "Suporte para otimiza\u00e7\u00e3o de SEO nos sites",
          "Reuni\u00f5es e suporte para ag\u00eancias de tr\u00e1fego para implementa\u00e7\u00e3o de tags e altera\u00e7\u00f5es chave em projetos existentes",
          "Capta\u00e7\u00e3o de clientes a partir de tr\u00e1fego org\u00e2nico (Instagram, conversas, indica\u00e7\u00f5es)",
        ],
      },
    ],
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
      "Um app web open source que constru\u00ed para estudar de forma consistente \u2014 transformando conte\u00fado em quizzes e acompanhando meu pr\u00f3prio progresso.",
    p1: "Em vez de leitura passiva, transformo tudo que estudo em pr\u00e1tica ativa. Constru\u00ed o learning.blpsoares.dev como meu sistema pessoal de estudos: insiro conte\u00fado, ele gera perguntas, e eu respondo para refor\u00e7ar o que realmente ficou.",
    p2: "O projeto \u00e9 open source e totalmente vibe coded \u2014 desenvolvido com assist\u00eancia de IA da ideia ao deploy. N\u00e3o \u00e9 apenas um side project; faz parte do meu fluxo di\u00e1rio.",
    visitSite: "Visitar site",
    viewSource: "Ver c\u00f3digo",
    readArticle: "Ler o artigo",
    badgeType: "Ferramenta de Estudo",
  },
  vibeProjects: {
    badge: "Vibe Coded \u00b7 Open Source",
    title: "Projetos Open Source Vibe Coded",
    subtitle:
      "Side projects constru\u00eddos com desenvolvimento assistido por IA \u2014 da ideia ao deploy, totalmente vibe coded e open source.",
    viewAll: "Ver todos",
    visitSite: "Visitar site",
    backHome: "Voltar ao in\u00edcio",
    pageTitle: "Todos os Projetos Vibe Coded",
    pageSubtitle:
      "Todos os projetos listados aqui foram constru\u00eddos com desenvolvimento assistido por IA e s\u00e3o open source. Clique em qualquer preview para visitar o site ao vivo.",
    errorLoading: "Falha ao carregar projetos. Tente novamente mais tarde.",
  },
  cv: {
    fileName: "Bryan_Soares_CV",
    name: "Bryan Soares",
    title: "Software Developer · AI Engineer",
    location: "São Paulo, Brasil",
    phone: "(11) 93045-6696",
    email: "bryanluccas@hotmail.com",
    website: "blpsoares.dev",
    linkedin: "linkedin.com/in/blpsoares",
    github: "github.com/blpsoares",
    summary:
      "Desenvolvedor de Software com +5 anos de experiência em desenvolvimento de software, sendo os últimos 2 anos focado em IA Generativa aplicada. Construí pipelines RAG, agentes de IA, servidores MCP para integração com LLMs e soluções de orquestração multi-agente para problemas reais de negócio, como chatbots corporativos sobre bases de 10.000+ documentos e buscas inteligentes com IA em produção. Atualmente cursando Pós-graduação em Engenharia de IA Aplicada.",
    sections: {
      experience: "Experiência Profissional",
      projects: "Projetos Open Source & Pessoais",
      skills: "Habilidades Técnicas",
      education: "Formação Acadêmica",
      languages: "Idiomas",
    },
    techLabel: "Tech",
    tech: [
      "Node.js, TypeScript, MCP, Gemini, Anthropic, OpenAI, GitHub Copilot, MongoDB, Docker, N8N, Windmill, Cloudflare",
      "Node.js, TypeScript, MongoDB, Document AI, OpenAI, Windmill, Docker",
      "Node.js, TypeScript, GCP, Docker, Node Streams, Winston, APIs",
      "Node.js, Dialogflow CX, RAG, OpenAI, GCP, Make, N8N, Pub/Sub, Cloud Functions",
      "React, JavaScript, HTML/CSS, WordPress, Figma",
    ],
    projects: [
      {
        name: "Agentistics — Dashboard de Analytics Local para Assistentes de Código com IA",
        description:
          "Construí um dashboard de analytics local-first que parseia sessões ~/.claude/ para exibir uso de tokens, custos (USD/BRL), métricas de agentes, heatmaps de atividade e breakdown por modelo. Inclui CLI com modo TUI, export OpenTelemetry e geração de relatórios PDF. Zero cloud, zero telemetria.",
        stack: "TypeScript · Bun · React · Vite · Three.js · OpenTelemetry",
      },
      {
        name: "DuckFlux — DSL Declarativa para Orquestração Multi-Agente",
        description:
          "Co-autor de uma engine DSL nativa em YAML para orquestração de pipelines de IA multi-agente. Inclui execução paralela, condicionais CEL, controle de fluxo por máquina de estados, suporte nativo a MCP, steps event-driven (emit/wait) e sub-workflows aninhados. Suporta Go CLI e runtimes Bun/Node.js.",
        stack: "TypeScript · Bun · Go · YAML DSL · MCP · LLM Orchestration",
      },
      {
        name: "Embark — Framework CI/CD Zero-Config para Monorepos Assistidos por IA",
        description:
          "Construí um framework monorepo que auto-gera workflows GitHub Actions, Dockerfiles (via CLIs de IA: Claude, Gemini, Copilot, Codex) e pipelines de deploy Cloud Run / Netlify / Cloudflare a cada commit. Enforça gates de qualidade de código (77% de cobertura) via pre-push hooks.",
        stack: "TypeScript · Bun · GitHub Actions · Docker · GCP Cloud Run",
      },
      {
        name: "Rede Neural — Modelo de Predição de Planos",
        description:
          "Treinei uma rede neural feedforward do zero como parte da pós-graduação em Engenharia de IA. Usei ativação ReLU, ajuste de pesos de neurônios e contagem de epochs para predizer qual plano de assinatura melhor se adequa a padrões de comportamento.",
        stack: "JavaScript · Neural Networks · ReLU · Supervised Learning · Backpropagation",
      },
    ],
    skills: [
      {
        category: "IA Generativa & ML",
        items:
          "Pipelines RAG, Sistemas Multi-Agente, Agentes de IA com Tool Use, APIs de LLM (OpenAI, Claude, Gemini), Prompt Engineering, Fine-tuning, MCP (Model Context Protocol), Dialogflow CX, Document AI, TensorFlow",
      },
      {
        category: "Backend",
        items:
          "Node.js, TypeScript, Bun, Express.js, Elysia, REST APIs, Redis, Docker, Clean Architecture",
      },
      {
        category: "Bancos de Dados",
        items:
          "MongoDB (Atlas, Triggers, Edge Computing), Firestore, Redis, Bancos Vetoriais",
      },
      {
        category: "Cloud & DevOps",
        items:
          "GCP (Cloud Run, Functions, Pub/Sub, Scheduler, API Gateway), Cloudflare, GitHub Actions, CI/CD, Docker",
      },
      {
        category: "Automação",
        items: "N8N, Make, Windmill, Retool",
      },
      {
        category: "Frontend",
        items: "React.js, Vue, HTML/CSS/JS, Tailwind, Figma, WordPress",
      },
    ],
    languages: "Português (Nativo), Inglês (Básico)",
  },
  footer: {
    rights: "Todos os direitos reservados.",
    downloadCv: "Download CV",
  },
};

export default pt;
