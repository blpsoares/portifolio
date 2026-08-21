import {
  buildCv,
  buildCareerItems,
  buildProjectItems,
  buildEducationItems,
  buildSkillBranches,
} from "../data/profile";
import { buildArticles } from "../data/articles";

const pt = {
  nav: {
    profile: "Perfil",
    about: "Sobre",
    stacks: "Stacks",
    projects: "Projetos",
    career: "Trajet\u00f3ria",
    education: "Forma\u00e7\u00e3o",
    openSource: "Open Source",
    articles: "Artigos",
    aiUsage: "Como eu trabalho com IA",
  },
  hero: {
    thesis1: "IA n\u00e3o \u00e9 m\u00e1gica.",
    thesis2: "\u00c9 engenharia.",
    // Condensado da filosofia que vive na se\u00e7\u00e3o "IA & Automa\u00e7\u00e3o": no hero
    // ele precisa caber em duas linhas, ent\u00e3o fica a abertura e o fecho.
    subtitle_suffix:
      "Copilotos aceleram, mas a responsabilidade t\u00e9cnica permanece. A IA ajuda a construir; eu reviso, otimizo e garanto a qualidade.",
    cta: "Ver os projetos",
  },
  agent: {
    title: "bryan.ai · agent session",
    online: "online",
    badge: "local · 0 tokens · $0.00",
    placeholder: "Pergunte algo sobre o Bryan…",
    toolRunning: "executando…",
    toolDone: "concluído",
    feedbackAsk: "Ajudou?",
    feedbackYes: "Sim, ajudou",
    feedbackNo: "Não ajudou",
    feedbackThanks: "Valeu pelo retorno.",
    disclaimer: "Sugestões respondem na hora; perguntas livres usam IA. As conversas são registradas para melhorar o assistente.",
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
    sourceAi: "Nuvem",
    sourceAiHint: "Resposta de um LLM na nuvem via OpenRouter",
    sourceLocal: "Local · determinístico",
    sourceLocalHint: "Motor de regras no navegador, sem LLM, sem custo",
    sourceWebllm: "Local · seu navegador",
    sourceWebllmHint:
      "LLM real rodando na sua GPU via WebGPU. Nenhum token sai do seu dispositivo.",
    // Copy do "modo local" (WebLLM): oferta única, download e status.
    local: {
      offerTitle: "Quer que eu rode dentro do seu navegador?",
      offerText:
        "Escolhi o {model} pro seu computador: ~{mb} uma única vez{eta}. Depois disso eu respondo na sua própria GPU, sem nuvem e sem limite. Pode continuar navegando enquanto baixa.",
      accept: "Pode baixar",
      decline: "Agora não",
      privacy: "Nenhuma pergunta sua sai do dispositivo",
      loadingTitle: "Carregando modelo local…",
      loadingHint:
        "Roda em segundo plano, o chat continua funcionando normalmente enquanto isso.",
      openChat: "Abrir conversa →",
      errorText:
        "Não consegui carregar o modelo aqui no seu navegador. Pode ser a conexão ou memória de vídeo.",
      retry: "Tentar de novo",
      badgeReady: "online · 100% local",
      badgeLoading: "carregando modelo local · {pct}%",
      settings: {
        title: "Modelos locais",
        subtitle:
          "Modelos de IA que rodam no seu navegador, na sua GPU. Baixam uma vez e ficam salvos aqui.",
        active: "em uso",
        downloaded: "já baixado",
        recommended: "recomendado",
        noDownload: "sem novo download",
        download: "Baixar",
        downloading: "Baixando",
        use: "Usar",
        turnOff: "Desinstalar todos e desativar",
        isOff: "Nenhum modelo local instalado. O chat responde por regras.",
        uninstall: "Desinstalar",
        confirmUninstall: "Apagar",
        cancel: "Cancelar",
        installed: "{n} modelo(s) instalado(s) · {mb} em disco",
        noneInstalled: "Nenhum modelo instalado neste navegador",
        persisted: "Salvo de forma permanente neste navegador.",
        notPersisted:
          "Salvo neste navegador. O Chrome só pode descartar se o disco ficar sem espaço.",
        tradeoffs: {
          "Llama-3.2-3B-Instruct-q4f16_1-MLC":
            "O mais capaz: respostas mais longas, melhor raciocínio e português mais natural. Em compensação é o download mais pesado e exige uma GPU dedicada.",
          "Qwen2.5-1.5B-Instruct-q4f16_1-MLC":
            "O equilíbrio: metade do download do 3B e roda em placa integrada decente. Respostas boas, um pouco mais curtas e diretas.",
          "SmolLM2-360M-Instruct-q4f16_1-MLC":
            "O mais leve: baixa em segundos e roda em quase tudo. Serve pro básico, mas erra mais e o português é fraco.",
        } as Record<string, string>,
      },
    },
    // Localized labels for clickable grounding citations ([[section:<id>]]).
    // Keys are the whitelisted section ids; the chip text is prefixed with "↳".
    citationLabels: {
      profile: "Perfil",
      about: "Sobre",
      stack: "Stack técnica",
      projects: "Projetos",
      career: "Carreira",
      education: "Formação",
      "open-source": "Projetos open source",
      "ai-usage": "Uso de IA",
    } as Record<string, string>,
    contextSuggestions: {
      profile: ["Por que contratar o Bryan?", "Resuma a carreira", "Baixar CV"],
      about: ["Quem é o Bryan?", "Qual o diferencial dele?", "Foco em IA?"],
      stack: ["Que stack ele domina?", "Ele usa Bun?", "Experiência com IA?"],
      projects: ["Detalhe o chatbot corporativo", "Que stack usou nos projetos?", "Projeto de IA mais forte?"],
      career: ["Onde ele trabalha hoje?", "Resuma a trajetória", "Por que contratar?"],
      education: ["Qual a formação dele?", "Está estudando o quê?", "Pós em quê?"],
      "open-source": ["O que é o Agentistics?", "O que é o PDD?", "Mostre os projetos de IA"],
      "ai-usage": ["Como ele usa IA no dia a dia?", "Por que contratar o Bryan?", "Resuma a carreira"],
    } as Record<string, string[]>,
  },
  whoiam: {
    title: "Quem sou",
    p1_start:
      "AI Engineer e Sr Software Developer com 5 anos no ecossistema JS, sendo os \u00faltimos 2,5 focados em ",
    p1_highlight1: "IA Generativa aplicada",
    p1_mid:
      ". Construo sistemas escal\u00e1veis, agentes de IA com tool use e solu\u00e7\u00f5es de ",
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
    title: "Arsenal T\u00e9cnico",
    subtitle:
      "Cinco frentes em volta de um n\u00facleo: as \u00e1reas onde eu opero, e o que eu uso dentro de cada uma.",
    centerLabel: "N\u00facleo",
    centerTitle: "AI-Assisted Engineering",
    coreSubtitle:
      "Metodologias pr\u00f3prias para desenvolvimento assistido por IA \u2014 PDD, SDD e spec-driven workflows.",
    coreTags: [
      "Parity-Driven Development (PDD)",
      "Spec-Driven Development (SDD)",
      "Spec-driven workflows",
      "IA como par de desenvolvimento",
      "Refactor assistido com prova de paridade",
    ],
    branches: buildSkillBranches("pt"),
    hoverHint: "passe o mouse",
    pickHint: "Clique em uma das \u00e1reas para ver as ferramentas dela.",
    closedHint: "Passe o mouse sobre o n\u00facleo para abrir as \u00e1reas. Clique nele de novo para fechar.",
    shippedLabel: "entregue",
  },
  projects: {
    title: "Projetos",
    subtitle:
      "Trabalho entregue em produ\u00e7\u00e3o, com o resultado que cada um destravou.",
    impactLabel: "Resultado",
    items: buildProjectItems("pt"),
  },
  career: {
    title: "Trajet\u00f3ria",
    current: "Atual",
    items: buildCareerItems("pt"),
  },
  about: {
    eyebrow: "FILOSOFIA",
    subtitle:
      "Como eu penso o uso de IA no dia a dia de engenharia.",
    title: "IA & Automação",
    philosophy:
      "Copilotos aceleram, mas a responsabilidade técnica permanece. Acredito na automação que elimina o repetitivo, permitindo foco total na arquitetura e na correção de gargalos. A IA ajuda a construir; eu reviso, otimizo e garanto a qualidade.",
  },
  openSource: {
    badge: "Open Source",
    title: "Projetos Open Source",
    subtitle:
      "Ferramentas que constru\u00ed e mantenho no aberto, do primeiro commit ao deploy. Todas est\u00e3o no ar \u2014 clique em qualquer preview para visitar.",
    viewAll: "Ver todos",
    visitSite: "Visitar site",
    backHome: "Voltar ao in\u00edcio",
    pageTitle: "Todos os projetos open source",
    pageSubtitle:
      "Tudo listado aqui \u00e9 open source e est\u00e1 em produ\u00e7\u00e3o. Clique em qualquer preview para visitar o site ao vivo.",
    errorLoading: "Falha ao carregar projetos. Tente novamente mais tarde.",
    liveLabel: "no ar",
  },
  articles: {
    navTitle: "Artigos",
    title: "Artigos",
    subtitle:
      "O que eu aprendi construindo, escrito por extenso. Publico no LinkedIn e espelho aqui.",
    pageSubtitle:
      "Textos sobre o que eu venho construindo e as decis\u00f5es por tr\u00e1s. Publicados no LinkedIn, listados aqui em ordem.",
    backHome: "Voltar ao in\u00edcio",
    readOn: "Ler no LinkedIn",
    readingTime: "{n} min de leitura",
    featured: "Destaque",
    viewAll: "Ver todos os artigos",
    empty: "Nenhum artigo publicado ainda.",
    items: buildArticles("pt"),
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
    tagline: "AI Engineer e Sr Software Developer. Sistemas escaláveis, pipelines de IA e agentes em produção.",
    quickLinks: "Links Rápidos",
    connect: "Contato",
  },
  cmdk: {
    title: "Paleta de Comandos",
    trigger: "Comando rápido",
    placeholder: "Buscar seções e ações…",
    empty: "Nenhum resultado encontrado.",
    groupNavigation: "Ir para",
    groupActions: "Ação",
    downloadCvEn: "Baixar CV (EN)",
    downloadCvPt: "Baixar CV (PT)",
    themeDark: "Mudar para tema escuro",
    themeLight: "Mudar para tema claro",
    languageEn: "Mudar idioma para Inglês",
    languagePt: "Mudar idioma para Português",
    openChat: "Abrir chat com IA",
    openLinkedin: "Abrir LinkedIn",
    openGithub: "Abrir GitHub",
    hintNavigate: "Navegar",
    hintSelect: "Selecionar",
    hintClose: "Fechar",
  },
};

export default pt;
