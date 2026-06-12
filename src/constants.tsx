import { Project, SkillCategory, MCPItem } from "./types";
import {
	Workflow,
	Layers,
	Zap,
	type LucideIcon,
} from "lucide-react";
import { profile } from "./data/profile";

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

export const SKILLS: SkillCategory[] = profile.techStack.map((g) => ({
	title: g.title,
	skills: g.skills,
}));

const LOW_CODE_ICONS: Record<string, LucideIcon> = {
	workflow: Workflow,
	layers: Layers,
	zap: Zap,
};

export const LOW_CODE_TOOLS = profile.lowCodeTools.map((t) => ({
	category: t.category,
	tools: t.tools,
	// Descriptions in this card default to Portuguese (same as before refactor).
	description: t.description.pt,
	icon: LOW_CODE_ICONS[t.icon],
}));

export const MCP_WORKFLOWS: MCPItem[] = profile.mcpWorkflows.map((m) => ({
	tool: m.tool,
	// Descriptions in this card default to Portuguese (same as before refactor).
	description: m.description.pt,
	icon: m.icon,
}));

export const PROJECTS: Project[] = profile.workProjects.map((p) => ({
	title: p.cardTitle,
	category: p.cardCategory,
	description: p.cardDescription,
	technologies: p.technologies,
}));
