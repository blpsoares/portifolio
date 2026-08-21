import {
  buildCv,
  buildCareerItems,
  buildProjectItems,
  buildEducationItems,
  buildSkillBranches,
} from "../data/profile";
import { buildArticles } from "../data/articles";

const en = {
  nav: {
    profile: "Profile",
    about: "About",
    stacks: "Stacks",
    projects: "Projects",
    career: "Career",
    education: "Education",
    openSource: "Open Source",
    articles: "Articles",
    aiUsage: "How I work with AI",
  },
  hero: {
    thesis1: "AI is not magic.",
    thesis2: "It's engineering.",
    // Condensed from the philosophy in the "AI & Automation" section: in the
    // hero it has to fit two lines, so it keeps the opening and the close.
    subtitle_suffix:
      "Copilots accelerate, but technical responsibility remains. AI helps build; I review, optimize, and ensure quality.",
    cta: "See the projects",
  },
  agent: {
    title: "bryan.ai · agent session",
    online: "online",
    badge: "local · 0 tokens · $0.00",
    placeholder: "Ask me anything about Bryan…",
    toolRunning: "executing…",
    toolDone: "done",
    feedbackAsk: "Helpful?",
    feedbackYes: "Yes, helpful",
    feedbackNo: "Not helpful",
    feedbackThanks: "Thanks for the feedback.",
    disclaimer: "Suggestions answer instantly; free-typed questions use AI. Conversations are logged to improve the assistant.",
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
    // Localized labels for clickable grounding citations ([[section:<id>]]).
    // Keys are the whitelisted section ids; the chip text is prefixed with "↳".
    citationLabels: {
      profile: "Profile",
      about: "About",
      stack: "Tech stack",
      projects: "Projects",
      career: "Career",
      education: "Education",
      "open-source": "Open source projects",
      "ai-usage": "AI usage",
    } as Record<string, string>,
    contextSuggestions: {
      profile: ["Why hire Bryan?", "Summarize his career", "Download CV"],
      about: ["Who is Bryan?", "What's his edge?", "AI focus?"],
      stack: ["What stack does he master?", "Does he use Bun?", "AI experience?"],
      projects: ["Detail the corporate chatbot", "What stack in these projects?", "Strongest AI project?"],
      career: ["Where does he work now?", "Summarize his path", "Why hire him?"],
      education: ["What's his education?", "What is he studying?", "Postgrad in what?"],
      "open-source": ["What is Agentistics?", "What is PDD?", "Show the AI projects"],
      "ai-usage": ["How does he use AI daily?", "Why hire Bryan?", "Summarize his career"],
    } as Record<string, string[]>,
  },
  whoiam: {
    title: "Who I am",
    p1_start:
      "AI Engineer and Sr Software Developer with 5 years in the JS ecosystem, the last 2.5 focused on ",
    p1_highlight1: "applied Generative AI",
    p1_mid:
      ". I build scalable systems, AI agents with tool use, and ",
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
    title: "Technical Arsenal",
    subtitle:
      "Five branches around one core: the areas I work in, and what I reach for inside each one.",
    centerLabel: "Core",
    centerTitle: "AI-Assisted Engineering",
    coreSubtitle:
      "My own methodologies for AI-assisted development \u2014 PDD, SDD and spec-driven workflows.",
    coreTags: [
      "Parity-Driven Development (PDD)",
      "Spec-Driven Development (SDD)",
      "Spec-driven workflows",
      "AI as a development pair",
      "AI-assisted refactor with parity proof",
    ],
    branches: buildSkillBranches("en"),
    hoverHint: "hover me",
    pickHint: "Pick an area to see the tools inside it.",
    closedHint: "Hover the core to open the areas. Click it again to fold them back.",
    shippedLabel: "shipped",
  },
  projects: {
    title: "Projects",
    subtitle: "Work shipped to production, with the outcome each one unlocked.",
    impactLabel: "Outcome",
    items: buildProjectItems("en"),
  },
  career: {
    title: "Career",
    current: "Current",
    items: buildCareerItems("en"),
  },
  about: {
    eyebrow: "PHILOSOPHY",
    subtitle: "How I think about using AI in day-to-day engineering.",
    title: "AI & Automation",
    philosophy:
      "Copilots accelerate, but technical responsibility remains. I believe in automation that eliminates the repetitive, allowing full focus on architecture and bottleneck resolution. AI helps build; I review, optimize, and ensure quality.",
  },
  openSource: {
    badge: "Open Source",
    title: "Open Source Projects",
    subtitle:
      "Tools I built and maintain in the open, from first commit to deploy. All of them are live \u2014 click any preview to visit.",
    viewAll: "View all",
    visitSite: "Visit site",
    backHome: "Back home",
    pageTitle: "All open source projects",
    pageSubtitle:
      "Everything listed here is open source and running in production. Click any preview to visit the live site.",
    errorLoading: "Failed to load projects. Please try again later.",
    liveLabel: "live",
  },
  articles: {
    navTitle: "Articles",
    title: "Articles",
    subtitle:
      "What I learned building things, written out in full. I publish on LinkedIn and mirror it here.",
    pageSubtitle:
      "Writing about what I have been building and the decisions behind it. Published on LinkedIn, listed here in order.",
    backHome: "Back home",
    readOn: "Read on LinkedIn",
    readingTime: "{n} min read",
    featured: "Featured",
    viewAll: "View all articles",
    empty: "No articles published yet.",
    items: buildArticles("en"),
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
    tagline: "AI Engineer & Sr Software Developer. Scalable systems, AI pipelines and agents in production.",
    quickLinks: "Quick Links",
    connect: "Connect",
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
