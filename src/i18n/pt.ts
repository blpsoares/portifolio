const pt = {
  nav: {
    profile: "Perfil",
    about: "Sobre",
    stacks: "Stacks",
    lowcode: "Low Code",
    mcps: "MCPs",
    projects: "Projetos",
    career: "Trajet\u00f3ria",
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
  whoiam: {
    title: "Quem sou",
    p1_start:
      "Desenvolvo sistemas backend robustos e solu\u00e7\u00f5es de ",
    p1_highlight1: "IA generativa",
    p1_mid:
      " que resolvem problemas reais de neg\u00f3cio. Com 5 anos de experi\u00eancia em engenharia de software e 3 anos focados em ",
    p1_highlight2: "GenAI aplicada",
    p1_end:
      ", j\u00e1 atuei desde a implementa\u00e7\u00e3o de pipelines RAG e agentes com tool use at\u00e9 a condu\u00e7\u00e3o de decis\u00f5es arquiteturais diretamente com clientes \u2014 mesmo quando ainda era estagi\u00e1rio.",
    p2: "Minha diferen\u00e7a n\u00e3o \u00e9 s\u00f3 t\u00e9cnica: tenho a comunica\u00e7\u00e3o de quem vende e a profundidade de quem constr\u00f3i. Prefiro arquitetar sistemas que durem do que entregar features que precisem ser reescritas.",
    cta: "Ver projetos",
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
    items: [
      {
        role: "Desenvolvedor Backend Senior",
        company: "Eletromidia",
        period: "out 2025 \u2013 Presente",
        duration: "6 meses",
        type: "Tempo integral",
        location: "S\u00e3o Paulo \u00b7 H\u00edbrido",
        current: true,
      },
      {
        role: "Desenvolvedor Backend Pleno",
        company: "Eletromidia",
        period: "ago 2024 \u2013 out 2025",
        duration: "1 ano 3 meses",
        type: "Tempo integral",
        location: "S\u00e3o Paulo \u00b7 H\u00edbrido",
        current: false,
      },
      {
        role: "Desenvolvedor de Software",
        company: "Alest Consultoria",
        period: "dez 2023 \u2013 ago 2024",
        duration: "9 meses",
        type: "Tempo integral",
        location: "S\u00e3o Paulo \u00b7 Presencial",
        current: false,
      },
      {
        role: "Desenvolvedor Estagi\u00e1rio",
        company: "Alest Consultoria",
        period: "jun 2023 \u2013 dez 2023",
        duration: "7 meses",
        type: "Est\u00e1gio",
        location: "S\u00e3o Paulo",
        current: false,
      },
      {
        role: "Desenvolvedor Frontend",
        company: "Next Fusion",
        period: "jan 2023 \u2013 jun 2023",
        duration: "6 meses",
        type: "Freelance",
        location: "S\u00e3o Paulo \u00b7 Remoto",
        current: false,
      },
    ],
  },
  about: {
    title: "Vibe Coding & Automa\u00e7\u00e3o",
    philosophy:
      "Copilotos aceleram, mas a responsabilidade t\u00e9cnica permanece. Acredito na automa\u00e7\u00e3o que elimina o repetitivo, permitindo foco total na arquitetura e na corre\u00e7\u00e3o de gargalos. A IA ajuda a construir; eu reviso, otimizo e garanto a qualidade.",
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
  footer: {
    rights: "Todos os direitos reservados.",
    downloadCv: "Download CV",
  },
};

export default pt;
