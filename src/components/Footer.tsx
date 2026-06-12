import React, { useState } from "react";
import { Mail, Github, Linkedin, Download, Loader2 } from "lucide-react";
import { useI18n } from "../i18n";

const Footer: React.FC = () => {
	const { t } = useI18n();
	const [generating, setGenerating] = useState(false);

	const handleDownloadCv = async () => {
		if (generating) return;
		try {
			setGenerating(true);
			// Lazy-load the PDF generator so jsPDF stays out of the main bundle
			const { generateCvPdf } = await import("../utils/generateCv");
			generateCvPdf(t);
		} catch (err) {
			console.error("Failed to generate CV", err);
		} finally {
			setGenerating(false);
		}
	};

	return (
		<footer className="py-12 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
			<div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
				<div className="text-center md:text-left">
					<div className="font-bold text-2xl tracking-tighter text-slate-900 dark:text-white font-mono">
						&gt;_<span className="text-brand-600 dark:text-brand-400">.</span>
					</div>
					<p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
						© {new Date().getFullYear()} - Bryan Soares. {t.footer.rights}
					</p>
				</div>

				<div className="flex items-center gap-6">
					<button
						onClick={handleDownloadCv}
						disabled={generating}
						className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait shadow-sm shadow-brand-600/20"
						aria-label={t.footer.downloadCv}
					>
						{generating ? (
							<Loader2 size={16} className="animate-spin" />
						) : (
							<Download size={16} />
						)}
						{t.footer.downloadCv}
					</button>

					<div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />

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
					<a
						href="mailto:bryanluccas@hotmail.com"
						className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
						aria-label="Email"
					>
						<Mail size={20} />
					</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
