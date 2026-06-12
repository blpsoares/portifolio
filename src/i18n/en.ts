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
    badge: "Senior Backend Engineer",
    title1: "Robust Systems.",
    title2: "Applied Intelligence.",
    subtitle_prefix: "Backend Engineer focused on ",
    subtitle_highlight: "Generative AI",
    subtitle_suffix:
      " — I build scalable systems, AI pipelines, and agent orchestration solutions for real business problems.",
    cta: "Some projects",
    tag1: "// Node.js & Bun",
    tag2: "// GenAI & Agents",
    tag3: "// Integrations",
    tag4: "// Low Code",
  },
  agent: {
    title: "bryan.ai — agent session",
    online: "online",
    badge: "local · 0 tokens · $0.00",
    placeholder: "Ask me anything about Bryan…",
    hint: "← talk to the AI",
    thinking: "reasoning",
    toolRunning: "executing…",
    disclaimer: "Deterministic agent, runs 100% in your browser.",
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
      "Ask about Bryan's career, projects and skills — I'll answer instantly.",
    sourceAi: "OpenRouter",
    sourceLocal: "Local · deterministic",
    sourceAiHint: "Answer from a real LLM via OpenRouter",
    sourceLocalHint: "Rule-based engine in your browser — no LLM, no cost",
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
      "Backend Engineer with 5+ years of experience in software development, with the last 2 years focused on ",
    p1_highlight1: "applied Generative AI",
    p1_mid:
      ". I build scalable systems, RAG pipelines, AI agents with tool use, and ",
    p1_highlight2: "multi-agent orchestration",
    p1_end:
      " solutions for real business problems. Experienced in architecting GenAI-powered products in production — from corporate chatbots over 10,000+ document knowledge bases to NLP-to-database query agents. Currently pursuing a Postgraduate degree in Applied AI Engineering.",
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
      "Strategic integration of visual tools for MVPs, automations, and dashboards — reducing time-to-market without compromising architectural quality.",
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
      "MCP usage isn't just a tool — it's the foundation of my productivity. I connect LLMs directly to the project context to eliminate repetitive tasks.",
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
  },
  learning: {
    badge: "Open Source · Study System",
    title: "How I Keep Learning",
    subtitle:
      "An open source web app I built to study consistently — turning content into quizzes and tracking my own progress.",
    p1: "Instead of passive reading, I turn everything I study into active practice. I built learning.blpsoares.dev as my personal study system: I feed in content, it generates questions, and I answer them to reinforce what actually stuck.",
    p2: "The project is open source and fully vibe coded — built with AI assistance from idea to deploy. It's not just a side project; it's part of my daily workflow.",
    visitSite: "Visit site",
    viewSource: "View source",
    readArticle: "Read the article",
    badgeType: "Study Tool",
  },
  vibeProjects: {
    badge: "Vibe Coded · Open Source",
    title: "Open Source Vibe Projects",
    subtitle:
      "Side projects built with AI-assisted development — from idea to deploy, fully vibe coded and open source.",
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
  },
};

export default en;
