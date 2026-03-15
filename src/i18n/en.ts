const en = {
  nav: {
    profile: "Profile",
    about: "About",
    stacks: "Stacks",
    lowcode: "Low Code",
    mcps: "MCPs",
    projects: "Projects",
    career: "Career",
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
  whoiam: {
    title: "Who I am",
    p1_start:
      "I build robust backend systems and ",
    p1_highlight1: "generative AI",
    p1_mid:
      " solutions that solve real business problems. With 5 years of software engineering experience and 3 years focused on ",
    p1_highlight2: "applied GenAI",
    p1_end:
      ", I've worked on everything from implementing RAG pipelines and agents with tool use to leading architectural decisions directly with clients — even when I was still an intern.",
    p2: "My edge isn't just technical: I have the communication skills of someone who sells and the depth of someone who builds. I'd rather architect systems that last than ship features that need to be rewritten.",
    cta: "View projects",
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
    items: [
      {
        role: "Senior Backend Developer",
        company: "Eletromidia",
        period: "Oct 2025 – Present",
        duration: "6 months",
        type: "Full-time",
        location: "São Paulo · Hybrid",
        current: true,
      },
      {
        role: "Mid-level Backend Developer",
        company: "Eletromidia",
        period: "Aug 2024 – Oct 2025",
        duration: "1 yr 3 mos",
        type: "Full-time",
        location: "São Paulo · Hybrid",
        current: false,
      },
      {
        role: "Software Developer",
        company: "Alest Consultoria",
        period: "Dec 2023 – Aug 2024",
        duration: "9 months",
        type: "Full-time",
        location: "São Paulo · On-site",
        current: false,
      },
      {
        role: "Developer Intern",
        company: "Alest Consultoria",
        period: "Jun 2023 – Dec 2023",
        duration: "7 months",
        type: "Internship",
        location: "São Paulo",
        current: false,
      },
      {
        role: "Frontend Developer",
        company: "Next Fusion",
        period: "Jan 2023 – Jun 2023",
        duration: "6 months",
        type: "Freelance",
        location: "São Paulo · Remote",
        current: false,
      },
    ],
  },
  about: {
    title: "Vibe Coding & Automation",
    philosophy:
      "Copilots accelerate, but technical responsibility remains. I believe in automation that eliminates the repetitive, allowing full focus on architecture and bottleneck resolution. AI helps build; I review, optimize, and ensure quality.",
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
  footer: {
    rights: "All rights reserved.",
    downloadCv: "Download CV",
  },
};

export default en;
