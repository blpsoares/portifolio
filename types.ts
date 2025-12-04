export interface Project {
  title: string;
  category: string;
  description: string;
  technologies: string[];
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface MCPItem {
  tool: string;
  description: string;
  icon: 'terminal' | 'file' | 'database';
}

export interface NavItem {
  label: string;
  href: string;
}
