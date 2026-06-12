import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, Globe, ChevronDown, Download, Loader2 } from 'lucide-react';
import { useI18n } from '../i18n';
import { useCvDownload } from '../hooks/useCvDownload';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

interface NavLeaf {
  name: string;
  href: string;
}

interface NavGroup {
  name: string;
  children: NavLeaf[];
}

type NavItem = NavLeaf | NavGroup;

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { locale, setLocale, t } = useI18n();
  const { generating, downloadCv } = useCvDownload();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Order mirrors the on-page section order so menu jumps feel natural.
  // Sections that belong together are grouped into dropdowns to keep the bar compact.
  const navItems: NavItem[] = [
    { name: t.nav.profile, href: '#profile' },
    { name: t.nav.about, href: '#about' },
    {
      name: t.nav.expertise,
      children: [
        { name: t.nav.stacks, href: '#stack' },
        { name: t.nav.lowcode, href: '#lowcode' },
        { name: t.nav.mcps, href: '#mcp' },
      ],
    },
    { name: t.nav.projects, href: '#projects' },
    { name: t.nav.career, href: '#career' },
    { name: t.nav.education, href: '#education' },
    {
      name: t.nav.vibe,
      children: [
        { name: t.nav.learning, href: '#learning' },
        { name: t.nav.vibeProjects, href: '#vibe-projects' },
        { name: t.nav.aiUsage, href: '#ai-usage' },
      ],
    },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    // If on a sub-page, navigate home first
    if (window.location.hash.startsWith('#/')) {
      window.location.hash = '';
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'pt' : 'en');
  };

  const linkClass =
    'text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors whitespace-nowrap';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 shadow-sm'
          : 'bg-transparent border-b border-transparent py-6'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <div className="font-bold text-2xl tracking-tighter text-slate-900 dark:text-white flex items-center font-mono">
          &gt;_<span className="text-brand-600 dark:text-brand-500 animate-pulse">.</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {navItems.map((item) =>
            'children' in item ? (
              <div key={item.name} className="relative group">
                <button
                  className={`${linkClass} flex items-center gap-1`}
                  aria-haspopup="true"
                >
                  {item.name}
                  <ChevronDown
                    size={12}
                    className="transition-transform duration-200 group-hover:rotate-180"
                  />
                </button>
                {/* Dropdown panel (pt-3 bridges the gap so hover doesn't drop) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 hidden group-hover:block">
                  <div className="min-w-[180px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg shadow-slate-900/5 py-2">
                    {item.children.map((child) => (
                      <button
                        key={child.href}
                        onClick={() => handleNavClick(child.href)}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors whitespace-nowrap"
                      >
                        {child.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={linkClass}
              >
                {item.name}
              </button>
            ),
          )}
          <button
            onClick={() => downloadCv()}
            disabled={generating}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-all hover:scale-[1.03] active:scale-[0.97] disabled:opacity-70 disabled:cursor-wait shadow-sm shadow-brand-600/20 whitespace-nowrap"
            aria-label={t.footer.downloadCv}
          >
            {generating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            CV
          </button>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
          <button
            onClick={toggleLocale}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-xs font-semibold uppercase tracking-wider"
            aria-label="Toggle Language"
          >
            <Globe size={14} />
            {locale.toUpperCase()}
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleLocale}
            className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold uppercase"
            aria-label="Toggle Language"
          >
            <Globe size={14} />
            {locale.toUpperCase()}
          </button>
           <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-900 dark:text-white p-1"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-6 py-4 shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => downloadCv()}
              disabled={generating}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors disabled:opacity-70 disabled:cursor-wait shadow-sm shadow-brand-600/20"
            >
              {generating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              {t.footer.downloadCv}
            </button>
            {navItems.map((item) =>
              'children' in item ? (
                <div
                  key={item.name}
                  className="py-2 border-b border-slate-100 dark:border-slate-900 last:border-0"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    {item.name}
                  </p>
                  <div className="flex flex-col space-y-2 pl-3 border-l border-slate-200 dark:border-slate-800">
                    {item.children.map((child) => (
                      <button
                        key={child.href}
                        onClick={() => handleNavClick(child.href)}
                        className="text-left text-base font-medium text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
                      >
                        {child.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="text-left text-base font-medium text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 py-2 border-b border-slate-100 dark:border-slate-900 last:border-0"
                >
                  {item.name}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
