const en = {
  nav: {
    profile: "Profile",
    about: "About",
    stacks: "Stacks",
    lowcode: "Low Code",
    mcps: "MCPs",
    projects: "Projects",
    vibeProjects: "Vibe Projects",
    education: "Education",
    career: "Career",
    aiUsage: "Vibe Coding",
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
      "Backend Engineer with ~8 years of experience in software development and 3+ years focused on ",
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
    items: [
      {
        role: "Senior Backend Developer",
        company: "Eletromidia",
        period: "Oct 2025 – Present",
        duration: "6 months",
        type: "Full-time",
        location: "São Paulo · Hybrid",
        current: true,
        bullets: [
          "Creation of automation projects and projects that allow non-technical people to bring vibe-coded ideas to life",
          "Support on architecture for new projects and refactoring of existing ones",
          "Technical support for the team: questions, code reviews, and guidance",
          "Research on AI applicability in projects",
          "Task management and parallel execution using GitHub Issues + GitHub Copilot for independent implementation (without developers)",
          "Strategic Redis cache implementation (Hashsets + Sorted Lists) reducing endpoint latency from ~10s to ~900ms",
          "Developed an intern training project simulating real backend challenges (mainly memory bottlenecks), raising the team's technical bar",
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
          "Development of MongoDB migration and real-time sync projects (within the same cluster and across separate clusters/accounts), ensuring fresh data for the company's use cases",
          "Automation of a manual PDF validation process: used Document AI with Custom Extractor to recognize dynamic fields and match them against database/contract data — final model with 96% accuracy",
          "Development of new features and investigation of simple to complex bugs in legacy code",
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
          "Client meetings and architecture design for each project",
          "1:1s with interns to understand their expectations and guide their career growth within the company",
          "Presentation of professional development plans (PDIs) with career goals",
          "ETLs for massive data migration projects",
          "Architected a migration pipeline for 20,000+ documents (Drive · OneDrive · S3 · Local → DocuSign) using Node.js Streams with backpressure control and Winston observability",
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
          "Direct client meetings to develop the right technical questions when clients presented their pain points",
          "Automation of simpler project delivery tasks using Make.com",
          "Architected and delivered a corporate RAG chatbot (Dialogflow CX) integrated with a knowledge base of 10,000+ documents (JSONs, spreadsheets, and PDFs) — replaced a 100% manual consultation process",
          "Fine-tuning of OpenAI models (da-vinci) in the early days of the OpenAI boom",
        ],
      },
      {
        role: "Frontend Developer",
        company: "Next Fusion",
        period: "2018 – Jun 2023",
        duration: "~5 years",
        type: "Co-founder",
        location: "São Paulo",
        current: false,
        bullets: [
          "Web development agency for various business types and niches, co-founded with a designer partner",
          "Full frontend development following the UI/UX designed by the partner",
          "Website development using WordPress",
          "SEO optimization support for client websites",
          "Meetings and support for traffic agencies to implement tags and key changes in existing projects",
          "Client acquisition through organic traffic (Instagram, conversations, referrals)",
          "Client meetings to capture project ideas and requirements",
        ],
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
