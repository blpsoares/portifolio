import React from "react";
import { Mail, Github, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
	return (
		<footer className="py-12 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
			<div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
				<div className="text-center md:text-left">
					<div className="font-bold text-2xl tracking-tighter text-slate-900 dark:text-white font-mono">
						&gt;_<span className="text-brand-600 dark:text-brand-400">.</span>
					</div>
					<p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
						© {new Date().getFullYear()} - Bryan Soares. Todos os direitos
						reservados.
					</p>
				</div>

				<div className="flex items-center gap-6">
					<a
						href="mailto:bryanluccas@hotmail.com"
						className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
						aria-label="Email"
					>
						<Mail size={20} />
					</a>
					<a
						href="https://github.com/blpsoares"
						target="_blank"
						rel="noopener noreferrer"
						className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
						aria-label="GitHub Profile"
					>
						<Github size={20} />
					</a>
					<a
						href="https://linkedin.com/in/blpsoares"
						target="_blank"
						rel="noopener noreferrer"
						className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
						aria-label="LinkedIn Profile"
					>
						<Linkedin size={20} />
					</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
