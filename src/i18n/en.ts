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
    cta: "AI Assistant",
    close: "Close",
    viewing: "viewing",
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
    items: [
      {
        institution: "UNIPDS",
        degree: "Postgraduate",
        field: "Applied AI Engineering",
        period: "Feb 2026 – Mar 2027",
        logo: "/unipds-logo.jpg",
        current: true,
        status: "In progress",
      },
      {
        institution: "Pontif\u00edcia Universidade Cat\u00f3lica do Paran\u00e1",
        degree: "Technologist",
        field: "Systems Analysis and Development",
        period: "Jul 2022 – Jan 2025",
        logo: "/pucpr-logo.jpg",
        current: false,
        status: "",
      },
    ],
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
    descriptions: [
      "Using low-code integration tools like n8n and Make for fast integrations and MVP creation.",
      "Using low-code frontend tools like Retool and Plasmic for targeted features and MVP delivery.",
      "Using low-code devops tools like Windmill for agile feature deployment.",
    ],
  },
  mcp: {
    badge: "Workflow Intelligence",
    title: "Model Context Protocol (MCP)",
    subtitle:
      "MCP usage isn't just a tool — it's the foundation of my productivity. I connect LLMs directly to the project context to eliminate repetitive tasks.",
    descriptions: [
      "Automated UI testing in the background while I focus on other tasks in parallel, ensuring significant time savings.",
      "Automatic generation of structured technical documentation from source code, enabling agile knowledge sharing with the team.",
      "Data analysis, inconsistency inspection, and execution of complex queries directly from the development environment without the difficulty of inferring context for the AI model.",
    ],
  },
  projects: {
    title: "Projects",
    items: [
      {
        title: "Corporate RAG Chatbot",
        category: "RAG & ENTERPRISE AI",
        description:
          "Architecture and delivery of an internal corporate conversational chatbot using Dialogflow CX integrated with a knowledge base of 10,000+ documents (JSONs, spreadsheets, and PDFs). The system replaced a manual document consultation process with a natural language interface, applying RAG for semantic retrieval of unstructured information.",
      },
      {
        title: "Intelligent Filters — NLP to Database Query Agent",
        category: "AI AGENT · TOOL USE",
        description:
          "Development of an AI agent capable of interpreting free-text user inputs and converting them into structured MongoDB queries. The system understands user intent, applies business logic, and returns filtered results — eliminating the need for manual filter input. Integrated into an internal production product.",
      },
      {
        title: "Document AI Custom Extractor",
        category: "AI & AUTOMATION",
        description:
          "Architecture and implementation of a data extraction pipeline with Google Document AI for an enterprise client. Replaced a 100% manual operational validation process with an automated flow that identifies, extracts, and validates specific fields from unstructured documents with high accuracy. Solution designed for reuse across other clients with the same need.",
      },
      {
        title: "Massive Migration with Node Streams",
        category: "PERFORMANCE & DATA",
        description:
          "Architecture and execution of a migration pipeline for 20,000+ documents from multiple sources (Drive, OneDrive, S3, Local) to DocuSign. Intensive use of Node.js Streams for backpressure control, preventing memory leaks. Observability implementation with Winston for granular recovery on failure — fault tolerance without reprocessing from scratch. Solution built to be reusable across other clients with the same need.",
      },
      {
        title: "Redis Optimization",
        category: "PERFORMANCE",
        description:
          "Strategic cache implementation using Hashsets and Sorted Lists to store results of complex computations. Drastic reduction in latency and database costs for high-concurrency endpoints. Complex queries with response time reduced from ~10s to ~2s (in some cases below 900ms).",
      },
      {
        title: "MongoDB Triggers Versioning",
        category: "DEVOPS & INFRA",
        description:
          "Creation of a proprietary model for secure versioning of MongoDB Atlas Triggers. The system ensures synchronization between application code and database functions, preventing deploy errors and forgotten critical configurations.",
      },
      {
        title: "Intern Training",
        category: "MENTORSHIP",
        description:
          "Development of a practical project focused on technical reasoning for intern training. The environment simulates real backend challenges, promoting mutual learning and raising the team's technical bar.",
      },
    ],
  },
  career: {
    title: "Career",
    current: "Current",
    items: [
      {
        role: "Senior Backend Developer",
        company: "Eletromidia",
        period: "Oct 2025 – Present",
        duration: "8 months",
        type: "Full-time",
        location: "São Paulo · Hybrid",
        current: true,
        bullets: [
          "Built an MCP server on the company's main product API, enabling an LLM agent to process natural language queries via tool use",
          "Research on AI applicability in products, identifying GenAI integration opportunities in internal tools",
          "Created automation projects enabling non-technical stakeholders to bring their ideas to life independently",
          "Architectural support for new projects and refactoring of legacy systems",
          "AI/GenAI reference for the team, supporting other developers in architecture, implementations, and AI usage",
        ],
      },
      {
        role: "Mid-level Backend Developer",
        company: "Eletromidia",
        period: "Aug 2024 – Oct 2025",
        duration: "1 yr 3 mos",
        type: "Full-time",
        location: "São Paulo · Hybrid",
        current: false,
        bullets: [
          "Built Pulsar, an internal CLI for MongoDB migrations between databases in the same cluster or across separate clusters/accounts, with a real-time sync mode that injects metadata into documents for live tracking — replaced a fully manual process of multiple mongodumps and restores",
          "Automation of a manual PDF validation process: used Google Document AI with Custom Extractor to recognize dynamic fields and match them against contract data — final model with 96% accuracy",
          "AI-powered search field: the AI extracts key data from the user's prompt, builds the endpoint body, and makes the final request returning filtered results in the interface, eliminating manual filter input",
          "Full research and presentation of MongoDB edge computing for a company application",
        ],
      },
      {
        role: "Software Developer",
        company: "Alest Consultoria",
        period: "Dec 2023 – Aug 2024",
        duration: "9 months",
        type: "Full-time",
        location: "São Paulo · On-site",
        current: false,
        bullets: [
          "Client meetings and architecture design for each project, translating business pains into technical solutions",
          "Mentored 5 interns through regular 1:1s, guiding career growth and presenting individual development plans (PDIs)",
          "ETLs for massive data migration projects across multiple client environments",
          "Architected a migration pipeline for 30,000+ documents (Drive · OneDrive · S3 · Local → DocuSign) using Node.js Streams with pipeline() for backpressure control and Winston observability for granular failure recovery",
        ],
      },
      {
        role: "Developer Intern",
        company: "Alest Consultoria",
        period: "Jun 2023 – Dec 2023",
        duration: "7 months",
        type: "Internship",
        location: "São Paulo",
        current: false,
        bullets: [
          "Architected and delivered a corporate RAG chatbot (Dialogflow CX) integrated with a knowledge base of 10,000+ documents (JSONs, spreadsheets, and PDFs) — replaced a 100% manual consultation process with a natural language interface",
          "Fine-tuning of OpenAI models (da-vinci) for domain-specific use cases in the first wave of GenAI adoption",
          "Built cross-platform integration workflows using Make.com and N8N to automate project deliveries",
          "Trained other interns on technical topics where I had more expertise",
        ],
      },
      {
        role: "Frontend Developer",
        company: "Next Fusion",
        period: "2021 – Jun 2023",
        duration: "~2 years",
        type: "Co-founder",
        location: "São Paulo",
        current: false,
        bullets: [
          "Delivered ~20 corporate websites and landing pages end-to-end: client meetings, requirements gathering, development, and deploy",
          "Web development agency for various business types and niches, co-founded with a designer partner",
          "Full frontend development with React, HTML/CSS, and WordPress following the UI/UX specs designed by the partner",
          "SEO optimization support for client websites",
          "Meetings and support for traffic agencies to implement tags and key changes in existing projects",
          "Client acquisition through organic traffic (Instagram, conversations, referrals)",
        ],
      },
    ],
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
    fileName: "Bryan_Soares_CV",
    name: "Bryan Soares",
    title: "Software Developer · AI Engineer",
    location: "São Paulo, Brazil",
    phone: "(11) 93045-6696",
    email: "bryanluccas@hotmail.com",
    website: "blpsoares.dev",
    linkedin: "linkedin.com/in/blpsoares",
    github: "github.com/blpsoares",
    summary:
      "Software Developer with 5+ years of experience in software development, with the last 2 years focused on applied Generative AI. I've built RAG pipelines, AI agents, MCP servers for LLM integration, and multi-agent orchestration solutions for real business problems — from corporate chatbots over 10,000+ document knowledge bases to AI-powered smart search in production. Currently pursuing a Postgraduate degree in Applied AI Engineering.",
    sections: {
      experience: "Professional Experience",
      projects: "Open Source & Personal Projects",
      skills: "Technical Skills",
      education: "Education",
      languages: "Languages",
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
        name: "Agentistics — Local Analytics Dashboard for AI Coding Assistants",
        description:
          "Built a local-first analytics dashboard that parses ~/.claude/ sessions to surface token usage, costs (USD/BRL), agent metrics, activity heatmaps, and per-model breakdown. Includes a CLI with TUI mode, OpenTelemetry export, and PDF report generation. Zero cloud, zero telemetry.",
        stack: "TypeScript · Bun · React · Vite · Three.js · OpenTelemetry",
      },
      {
        name: "DuckFlux — Declarative DSL for Multi-Agent Orchestration",
        description:
          "Co-author of a native YAML DSL engine for orchestrating multi-agent AI pipelines. Includes parallel execution, CEL conditionals, state-machine flow control, native MCP support, event-driven steps (emit/wait), and nested sub-workflows. Supports a Go CLI and Bun/Node.js runtimes.",
        stack: "TypeScript · Bun · Go · YAML DSL · MCP · LLM Orchestration",
      },
      {
        name: "Embark — Zero-Config CI/CD Framework for AI-Assisted Monorepos",
        description:
          "Built a monorepo framework that auto-generates GitHub Actions workflows, Dockerfiles (via AI CLIs: Claude, Gemini, Copilot, Codex), and Cloud Run / Netlify / Cloudflare deploy pipelines on every commit. Enforces code quality gates (77% coverage) via pre-push hooks.",
        stack: "TypeScript · Bun · GitHub Actions · Docker · GCP Cloud Run",
      },
      {
        name: "Neural Network — Plan Prediction Model",
        description:
          "Trained a feedforward neural network from scratch as part of the AI Engineering postgraduate program. Used ReLU activation, neuron weight tuning, and epoch counting to predict which subscription plan best fits behavior patterns.",
        stack: "JavaScript · Neural Networks · ReLU · Supervised Learning · Backpropagation",
      },
    ],
    skills: [
      {
        category: "Generative AI & ML",
        items:
          "RAG Pipelines, Multi-Agent Systems, AI Agents with Tool Use, LLM APIs (OpenAI, Claude, Gemini), Prompt Engineering, Fine-tuning, MCP (Model Context Protocol), Dialogflow CX, Document AI, TensorFlow",
      },
      {
        category: "Backend",
        items:
          "Node.js, TypeScript, Bun, Express.js, Elysia, REST APIs, Redis, Docker, Clean Architecture",
      },
      {
        category: "Databases",
        items:
          "MongoDB (Atlas, Triggers, Edge Computing), Firestore, Redis, Vector Databases",
      },
      {
        category: "Cloud & DevOps",
        items:
          "GCP (Cloud Run, Functions, Pub/Sub, Scheduler, API Gateway), Cloudflare, GitHub Actions, CI/CD, Docker",
      },
      {
        category: "Automation",
        items: "N8N, Make, Windmill, Retool",
      },
      {
        category: "Frontend",
        items: "React.js, Vue, HTML/CSS/JS, Tailwind, Figma, WordPress",
      },
    ],
    languages: "Portuguese (Native), English (Basic)",
  },
  footer: {
    rights: "All rights reserved.",
    downloadCv: "Download CV",
  },
};

export default en;
