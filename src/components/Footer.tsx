import React from "react";
<<<<<<< Updated upstream
import { Mail, Github, Linkedin, Download, Loader2 } from "lucide-react";
=======
import { Mail, Github, Linkedin, Heart } from "lucide-react";
>>>>>>> Stashed changes
import { useI18n } from "../i18n";
import { useCvDownload } from "../hooks/useCvDownload";

const Footer: React.FC = () => {
<<<<<<< Updated upstream
	const { t } = useI18n();
	const { generating, downloadCv } = useCvDownload();
=======
  const { t } = useI18n();
  const year = new Date().getFullYear();
>>>>>>> Stashed changes

  const navLinks = [
    { name: t.nav.profile, href: "#profile" },
    { name: t.nav.stacks, href: "#stack" },
    { name: t.nav.projects, href: "#projects" },
    { name: t.nav.career, href: "#career" },
    { name: t.nav.lowcode, href: "#lowcode" },
    { name: t.nav.aiUsage, href: "#ai-usage" },
  ];

<<<<<<< Updated upstream
				<div className="flex items-center gap-6">
					<button
						onClick={() => downloadCv()}
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
=======
  const handleNavClick = (href: string) => {
    if (window.location.hash.startsWith("#/")) {
      window.location.hash = "";
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
      {/* Top gradient accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-40" />

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="font-bold text-2xl tracking-tighter text-slate-900 dark:text-white font-mono">
            &gt;_<span className="text-brand-600 dark:text-brand-400">.</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
            {t.footer.tagline}
          </p>
          <a
            href="mailto:bryanluccas@hotmail.com"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            <Mail size={14} />
            bryanluccas@hotmail.com
          </a>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {t.footer.quickLinks}
          </p>
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-left text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors w-fit"
              >
                {link.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Connect */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {t.footer.connect}
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="https://github.com/blpsoares"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              aria-label="GitHub Profile"
            >
              <Github size={16} />
              github.com/blpsoares
            </a>
            <a
              href="https://linkedin.com/in/blpsoares"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin size={16} />
              linkedin.com/in/blpsoares
            </a>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-400 dark:text-slate-600">
          <span>© {year} Bryan Soares. {t.footer.rights}</span>
          <span className="flex items-center gap-1">
            {t.footer.builtWith}
            <Heart size={11} className="text-brand-400 fill-brand-400 mx-0.5" />
            React · Tailwind · Vibe Coding
          </span>
        </div>
      </div>
    </footer>
  );
>>>>>>> Stashed changes
};

export default Footer;
