import React from "react";
import { Project, SkillCategory, MCPItem } from "./types";
import {
	Terminal,
	FileText,
	Database,
	Workflow,
	Layers,
	Zap,
} from "lucide-react";

export const PROFILE = {
	name: "Backend Engineer",
	role: "Arquitetura Limpa & Escalabilidade",
	tagline:
		"Construindo sistemas robustos com Node.js, automação inteligente e fluxos assistidos por IA.",
	philosophy:
		"Copilotos aceleram, mas a responsabilidade técnica permanece. Acredito na automação que elimina o repetitivo, permitindo foco total na arquitetura e na correção de gargalos. A IA ajuda a construir; eu reviso, otimizo e garanto a qualidade.",
	identity:
		"Focado em performance, adotei o Bun como runtime principal para explorar novos limites de velocidade e simplicidade, sem abrir mão da robustez do ecossistema TypeScript.",
};

export const SKILLS: SkillCategory[] = [
	{
		title: "Backend Core",
		skills: [
			"Node.js",
			"TypeScript",
			"Express.js",
			"Elysia",
			"Firebase",
			"MongoDB",
			"Clean Architecture",
		],
	},
	{
		title: "Stack Moderna",
		skills: ["Bun", "Redis", "Docker", "Zod", "TypeBox", "Serverless"],
	},
	{
		title: "Inteligência Artificial",
		skills: [
			"Multi-agentes",
			"Gemini",
			"Claude",
			"OpenAI",
			"Google AI Studio",
			"Lovable",
			"Bolt.new",
			"GH Copilot",
			"Document AI",
			"MCP",
		],
	},
	{
		title: "Infra & DevOps",
		skills: [
			"GitHub Actions",
			"GCP",
			"Cloudflare",
			"Atlas Triggers",
			"CI/CD Pipelines",
			"Docker Compose",
		],
	},
];

export const LOW_CODE_TOOLS = [
	{
		category: "Integração Backend",
		tools: "n8n, Make",
		description:
			"Uso de ferramentas de integração low code como n8n e Make para integrações rápidas e criação de MVPs.",
		icon: Workflow,
	},
	{
		category: "Frontend Ágil",
		tools: "Retool, Plasmic",
		description:
			"Uso de ferramentas low code front end como Retool e Plasmic para features pontuais e entregas de MVPs.",
		icon: Layers,
	},
	{
		category: "DevOps & Scripts",
		tools: "Windmill",
		description:
			"Uso de ferramentas low devops como Windmill para deploy de funcionalidades de forma ágil.",
		icon: Zap,
	},
];

export const MCP_WORKFLOWS: MCPItem[] = [
	{
		tool: "Playwright via MCP",
		description:
			"Execução de testes automatizados de interface em segundo plano enquanto desenvolvo novas funcionalidades, garantindo feedback imediato sem troca de contexto.",
		icon: "terminal",
	},
	{
		tool: "Notion via MCP",
		description:
			"Geração automática de documentações técnicas estruturadas a partir do código fonte, facilitando o compartilhamento de conhecimento ágil com a equipe.",
		icon: "file",
	},
	{
		tool: "MongoDB via MCP",
		description:
			"Análise de dados, inspeção de inconsistências e execução de queries complexas diretamente do ambiente de desenvolvimento, eliminando a fricção de ferramentas externas.",
		icon: "database",
	},
];

export const PROJECTS: Project[] = [
	{
		title: "Document AI Custom Extractor",
		category: "IA & Automação",
		description:
			"Implementação de um pipeline de extração de dados utilizando Document AI. Substituí um processo manual de validação operacional por um fluxo automatizado que identifica, extrai e valida campos específicos de documentos não estruturados com alta precisão.",
		technologies: ["Node.js", "Google Document AI", "TypeScript"],
	},
	{
		title: "Filtros Inteligentes",
		category: "IA Generativa & Features",
		description:
			"Desenvolvimento de um agente capaz de interpretar inputs de texto livre do usuário e convertê-los em queries estruturadas de banco de dados. O sistema entende a intenção, aplica a lógica de negócio e retorna os resultados filtrados sem necessidade de preencher filtros manualmente.",
		technologies: ["MongoDB", "OpenAI", "Windmill"],
	},
	{
		title: "Migração Massiva com Node Streams",
		category: "Performance & Data",
		description:
			"Arquitetura para migração de mais de 20k documentos de múltiplas origens (Drive, OneDrive, S3, Local) para Docusign. Utilização intensiva de Streams para controle de backpressure, evitando memory leaks e garantindo a integridade dos metadados durante a transferência.",
		technologies: ["Node.js Streams", "API Integrations", "File Systems"],
	},
	{
		title: "Otimização com Redis",
		category: "Performance",
		description:
			"Implementação estratégica de cache utilizando Hashsets e Sorted Lists para armazenar resultados de computações complexas. Redução drástica na latência e custos de banco de dados em endpoints de alta concorrência.",
		technologies: ["Redis", "Caching Strategy", "Backend Optimization"],
	},
	{
		title: "Versionamento de Triggers MongoDB",
		category: "DevOps & Infra",
		description:
			"Criação de um modelo proprietário para versionamento seguro de MongoDB Atlas Triggers. O sistema garante a sincronia entre o código da aplicação e as functions do banco, prevenindo erros de deploy e esquecimento de configurações críticas.",
		technologies: ["MongoDB Atlas", "Serverless Functions", "CI/CD"],
	},
	{
		title: "Ensino para Estagiários",
		category: "Mentoria",
		description:
			"Desenvolvimento de um projeto prático focado em raciocínio técnico para treinamento de estagiários. O ambiente simula desafios reais de backend, promovendo aprendizado mútuo e elevação da barra técnica do time.",
		technologies: ["NodeJS Streams", "Code Review", "Best Practices"],
	},
];
