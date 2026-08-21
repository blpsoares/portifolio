import { Project } from "./types";
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

export const PROJECTS: Project[] = profile.workProjects.map((p) => ({
	title: p.cardTitle,
	category: p.cardCategory,
	description: p.cardDescription,
	technologies: p.technologies,
}));
