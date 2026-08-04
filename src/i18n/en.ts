import {
  buildCv,
  buildCareerItems,
  buildProjectItems,
  buildEducationItems,
  buildLowCodeDescriptions,
  buildMcpDescriptions,
} from "../data/profile";

const en = {
  nav: {
    profile: "Profile",
    about: "About",
    expertise: "Expertise",
    stacks: "Stacks",
    lowcode: "Low Code",
    mcps: "MCPs",
    projects: "Projects",
    career: "Career",
    education: "Education",
    vibe: "Vibe Coding",
    learning: "Learning",
    vibeProjects: "Vibe Projects",
    aiUsage: "Automation",
  },
  hero: {
    badge: "AI Engineer · Sr Software Developer",
    title1: "AI is not magic.",
    title2: "It's Engineering.",
    subtitle_prefix: "",
    subtitle_highlight: "AI Engineer and Sr Software Developer.",
    subtitle_suffix:
      " I build scalable systems, AI pipelines and agent-orchestration solutions for real business problems.",
    cta: "Some projects",
    tag1: "// Node.js & Bun",
    tag2: "// GenAI & Agents",
    tag3: "// Integrations",
    tag4: "// Low Code",
  },
  agent: {
    title: "bryan.ai · agent session",
    online: "online",
    badge: "local · 0 tokens · $0.00",
    placeholder: "Ask me anything about Bryan…",
    hint: "← talk to the AI",
    thinking: "reasoning",
    toolRunning: "executing…",
    toolDone: "done",
    disclaimer: "Suggestions answer instantly; free-typed questions use AI.",
    suggestions: [
      "Why hire Bryan?",
      "Show me the AI projects",
      "Summarize his career",
      "Download CV",
    ],
    boot: [
      "initializing agent…",
      "loading knowledge base (CV · 5y exp)",
      "indexing 7 projects · 5 roles",
      "tools ready: scroll · highlight · download_cv · contact",
      "agent online.",
    ],
    cta: "bra.ia",
    close: "Close",
    viewing: "viewing",
    welcomeTitle: "How can I help?",
    welcomeText:
      "Ask about Bryan's career, projects and skills, I'll answer instantly.",
    sourceAi: "Cloud",
    sourceAiHint: "Answer from a cloud LLM via OpenRouter",
    sourceLocal: "Local · deterministic",
    sourceLocalHint: "Rule-based engine in your browser, no LLM, no cost",
    sourceWebllm: "Local · your browser",
    sourceWebllmHint:
      "A real LLM running on your GPU via WebGPU. No token ever leaves your device.",
    // "Local mode" (WebLLM) copy: one-time offer, download and status.
    local: {
      offerTitle: "Want me to run inside your browser?",
      offerText:
        "I picked {model} for your machine: ~{mb} once{eta}. After that I answer from your own GPU, no cloud and no usage limits. Feel free to keep browsing while it downloads.",
      accept: "Go ahead",
      decline: "Not now",
      privacy: "Nothing you ask leaves your device",
      loadingTitle: "Loading local model…",
      loadingHint: "Runs in the background, so the chat keeps working normally meanwhile.",
      openChat: "Open the chat →",
      errorText:
        "I couldn't load the model in your browser. It may be the connection or available video memory.",
      retry: "Try again",
      badgeReady: "online · 100% local",
      badgeLoading: "loading local model · {pct}%",
      settings: {
        title: "Local models",
        subtitle:
          "AI models that run in your browser, on your GPU. They download once and stay saved here.",
        active: "in use",
        downloaded: "downloaded",
        recommended: "recommended",
        noDownload: "no new download",
        download: "Download",
        downloading: "Downloading",
        use: "Use",
        turnOff: "Uninstall all and turn off",
        isOff: "No local model installed. The chat answers with rules.",
        uninstall: "Uninstall",
        confirmUninstall: "Erase",
        cancel: "Cancel",
        installed: "{n} model(s) installed · {mb} on disk",
        noneInstalled: "No model installed in this browser",
        persisted: "Saved permanently in this browser.",
        notPersisted: "Saved in this browser. Chrome can only discard it if the disk runs out of space.",
        tradeoffs: {
          "Llama-3.2-3B-Instruct-q4f16_1-MLC":
            "The most capable: longer answers, better reasoning, more natural language. In exchange it is the heaviest download and wants a dedicated GPU.",
          "Qwen2.5-1.5B-Instruct-q4f16_1-MLC":
            "The balance: half the 3B's download and it runs on a decent integrated GPU. Good answers, a bit shorter and more direct.",
          "SmolLM2-360M-Instruct-q4f16_1-MLC":
            "The lightest: downloads in seconds and runs on almost anything. Fine for the basics, but it slips more often.",
        } as Record<string, string>,
      },
    },
    unavailable: "The assistant is unavailable right now, please try again shortly.",
    // Localized labels for clickable grounding citations ([[section:<id>]]).
    // Keys are the whitelisted section ids; the chip text is prefixed with "↳".
    citationLabels: {
      profile: "Profile",
      about: "About",
      stack: "Tech stack",
      lowcode: "Low-code",
      mcp: "MCP",
      projects: "Projects",
      career: "Career",
      education: "Education",
      learning: "Learning",
      "ai-usage": "AI usage",
    } as Record<string, string>,
    contextSuggestions: {
      profile: ["Why hire Bryan?", "Summarize his career", "Download CV"],
      about: ["Who is Bryan?", "What's his edge?", "AI focus?"],
      stack: ["What stack does he master?", "Does he use Bun?", "AI experience?"],
      lowcode: ["Which low-code tools?", "How does he ship faster?", "Show the projects"],
      mcp: ["What is MCP to him?", "Where did he use MCP?", "Show the AI projects"],
      projects: ["Detail the RAG chatbot", "What stack in these projects?", "Strongest AI project?"],
      career: ["Where does he work now?", "Summarize his path", "Why hire him?"],
      education: ["What's his education?", "What is he studying?", "Postgrad in what?"],
      learning: ["How does he keep learning?", "Show the projects", "AI focus?"],
      "vibe-projects": ["What is vibe coding?", "Show the AI projects", "What stack?"],
      "ai-usage": ["How does he use AI daily?", "Why hire Bryan?", "Summarize his career"],
    } as Record<string, string[]>,
  },
  whoiam: {
    title: "Who I am",
    p1_start:
      "AI Engineer and Sr Software Developer with 5 years in the JS ecosystem, the last 2.5 focused on ",
    p1_highlight1: "applied Generative AI",
    p1_mid:
      ". I build scalable systems, RAG pipelines, AI agents with tool use, and ",
    p1_highlight2: "multi-agent orchestration",
    p1_end:
      " solutions for real business problems. Experienced in architecting GenAI-powered products in production, from corporate chatbots over 10,000+ document knowledge bases to NLP-to-database query agents. Currently pursuing a Postgraduate degree in Applied AI Engineering.",
    p2: "My edge isn't just technical: I have the communication skills of someone who sells and the depth of someone who builds. I'd rather architect systems that last than ship features that need to be rewritten.",
    cta: "View projects",
  },
  education: {
    title: "Education",
    items: buildEducationItems("en"),
  },
  techstack: {
    title: "Tech Stack",
    subtitle:
      "Tools selected for performance, security, and development speed.",
    categories: {
      "Backend Core": "Backend Core",
      "Stack Moderna": "Modern Stack",
      "Inteligência Artificial": "Artificial Intelligence",
      "Infra & DevOps": "Infra & DevOps",
    },
    performanceBadge: "Performance First",
    performanceTitle: "Runtime & Performance",
    performanceText:
      "Focused on performance, I adopted Bun as my primary runtime to push new limits of speed and simplicity without sacrificing the robustness of the TypeScript ecosystem.",
    performanceBunHighlight: "Bun",
    performanceSuffix:
      " as my primary runtime for its benchmark efficiency and unified development experience.",
  },
  lowcode: {
    badge: "Speed & Agility",
    title: "Low Code & Acceleration",
    subtitle:
      "Strategic integration of visual tools for MVPs, automations, and dashboards, reducing time-to-market without compromising architectural quality.",
    categories: {
      "Integração Backend": "Backend Integration",
      "Frontend Ágil": "Agile Frontend",
      "DevOps & Scripts": "DevOps & Scripts",
    },
    descriptions: buildLowCodeDescriptions("en"),
  },
  mcp: {
    badge: "Workflow Intelligence",
    title: "Model Context Protocol (MCP)",
    subtitle:
      "MCP usage isn't just a tool, it's the foundation of my productivity. I connect LLMs directly to the project context to eliminate repetitive tasks.",
    descriptions: buildMcpDescriptions("en"),
  },
  projects: {
    title: "Projects",
    items: buildProjectItems("en"),
  },
  career: {
    title: "Career",
    current: "Current",
    items: buildCareerItems("en"),
  },
  about: {
    title: "Vibe Coding & Automation",
    philosophy:
      "Copilots accelerate, but technical responsibility remains. I believe in automation that eliminates the repetitive, allowing full focus on architecture and bottleneck resolution. AI helps build; I review, optimize, and ensure quality.",
    toolsTitle: "AI & Automation Stack",
    principles: [
      { title: "Ship faster", body: "AI handles the boilerplate. I focus on architecture, edge cases, and the parts that actually matter." },
      { title: "Stay in control", body: "Every output gets reviewed, tested, and owned. Copilots are tools, not replacements for judgment." },
      { title: "Automate the boring", body: "If a task is repetitive and deterministic, it should be automated. Time is better spent solving real problems." },
    ],
  },
  learning: {
    badge: "Open Source · Study System",
    title: "How I Keep Learning",
    subtitle:
      "An open source web app I built to study consistently, turning content into quizzes and tracking my own progress.",
    p1: "Instead of passive reading, I turn everything I study into active practice. I built learning.blpsoares.dev as my personal study system: I feed in content, it generates questions, and I answer them to reinforce what actually stuck.",
    p2: "The project is open source and fully vibe coded, built with AI assistance from idea to deploy. It's not just a side project; it's part of my daily workflow.",
    visitSite: "Visit site",
    viewSource: "View source",
    readArticle: "Read the article",
    badgeType: "Study Tool",
  },
  vibeProjects: {
    badge: "Vibe Coded · Open Source",
    title: "Open Source Vibe Projects",
    subtitle:
      "Side projects built with AI-assisted development, from idea to deploy, fully vibe coded and open source.",
    viewAll: "View all",
    visitSite: "Visit site",
    backHome: "Back to home",
    pageTitle: "All Vibe Coded Projects",
    pageSubtitle:
      "Every project listed here was built with AI-assisted development and is open source. Click on any preview to visit the live site.",
    errorLoading: "Failed to load projects. Please try again later.",
  },
  cv: {
    ...buildCv("en"),
    // Static UI labels — not profile data, stay per-locale here.
    sections: {
      experience: "Professional Experience",
      projects: "Open Source & Personal Projects",
      skills: "Technical Skills",
      education: "Education",
      languages: "Languages",
    },
    techLabel: "Tech",
  },
  footer: {
    rights: "All rights reserved.",
    downloadCv: "Download CV",
    tagline: "Full-stack engineer & automation enthusiast.",
    quickLinks: "Quick Links",
    connect: "Connect",
    builtWith: "Built with",
  },
  cmdk: {
    title: "Command Palette",
    trigger: "Quick command",
    placeholder: "Search sections and actions…",
    empty: "No results found.",
    groupNavigation: "Go to",
    groupActions: "Action",
    downloadCvEn: "Download CV (EN)",
    downloadCvPt: "Download CV (PT)",
    themeDark: "Switch to dark theme",
    themeLight: "Switch to light theme",
    languageEn: "Switch language to English",
    languagePt: "Switch language to Portuguese",
    openChat: "Open AI chat",
    openLinkedin: "Open LinkedIn",
    openGithub: "Open GitHub",
    hintNavigate: "Navigate",
    hintSelect: "Select",
    hintClose: "Close",
  },
};

export default en;
