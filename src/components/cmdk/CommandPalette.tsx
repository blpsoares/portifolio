import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Search,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  Download,
  Moon,
  Sun,
  Globe,
  MessageSquare,
  Github,
  Linkedin,
  Navigation,
} from 'lucide-react';
import { useI18n } from '../../i18n';
import { useCvDownload } from '../../hooks/useCvDownload';
import { openAgentDock } from '../../agent/dockControls';
import { profile } from '../../data/profile';

interface CommandPaletteProps {
  isOpen: boolean;
  close: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

type CommandGroup = 'navigation' | 'actions';

interface CommandItem {
  id: string;
  label: string;
  group: CommandGroup;
  icon: React.ReactNode;
  /** Extra keywords to widen fuzzy matches. */
  keywords?: string;
  perform: () => void;
}

/** Tiny subsequence fuzzy match: every char of `query` appears in order in `text`. */
const fuzzyMatch = (text: string, query: string): boolean => {
  if (!query) return true;
  const haystack = text.toLowerCase();
  const needle = query.toLowerCase();
  let i = 0;
  for (let j = 0; j < haystack.length && i < needle.length; j += 1) {
    if (haystack[j] === needle[i]) i += 1;
  }
  return i === needle.length;
};

const scrollToSection = (id: string): void => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const withProtocol = (url: string): string => (/^https?:\/\//.test(url) ? url : `https://${url}`);

/**
 * Command Palette (⌘K / Ctrl+K). Fuzzy-filterable list of navigation jumps and
 * actions. No external libraries — framer-motion for the overlay and native
 * keyboard handling. Fully keyboard navigable, focus-trapped, and restores
 * focus to the previously active element on close. Under reduced motion the
 * show/hide is instant (no spring/scale).
 */
const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  close,
  isDarkMode,
  toggleTheme,
}) => {
  const { t, locale, setLocale } = useI18n();
  const { downloadCv } = useCvDownload();
  const reduce = useReducedMotion();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const cmd = t.cmdk;

  // Run an action then dismiss the palette.
  const run = useCallback(
    (action: () => void) => {
      action();
      close();
    },
    [close],
  );

  const items = useMemo<CommandItem[]>(() => {
    const nav = (id: string, label: string, keywords?: string): CommandItem => ({
      id: `nav:${id}`,
      label,
      group: 'navigation',
      icon: <Navigation size={16} aria-hidden="true" />,
      keywords,
      perform: () => run(() => scrollToSection(id)),
    });

    return [
      // Navigation — every section id.
      nav('profile', t.nav.profile),
      nav('about', t.nav.about),
      nav('stack', t.nav.stacks),
      nav('lowcode', t.nav.lowcode),
      nav('mcp', t.nav.mcps),
      nav('projects', t.nav.projects),
      nav('career', t.nav.career),
      nav('education', t.nav.education),
      nav('learning', t.nav.learning),
      nav('ai-usage', t.nav.aiUsage),
      // Actions.
      {
        id: 'action:cv-en',
        label: cmd.downloadCvEn,
        group: 'actions',
        icon: <Download size={16} aria-hidden="true" />,
        keywords: 'cv resume curriculum download english',
        perform: () => run(() => void downloadCv('en')),
      },
      {
        id: 'action:cv-pt',
        label: cmd.downloadCvPt,
        group: 'actions',
        icon: <Download size={16} aria-hidden="true" />,
        keywords: 'cv resume curriculo download portugues portuguese',
        perform: () => run(() => void downloadCv('pt')),
      },
      {
        id: 'action:theme',
        label: isDarkMode ? cmd.themeLight : cmd.themeDark,
        group: 'actions',
        icon: isDarkMode ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />,
        keywords: 'theme dark light mode tema',
        perform: () => run(toggleTheme),
      },
      {
        id: 'action:lang',
        label: locale === 'en' ? cmd.languagePt : cmd.languageEn,
        group: 'actions',
        icon: <Globe size={16} aria-hidden="true" />,
        keywords: 'language idioma locale english portugues',
        perform: () => run(() => setLocale(locale === 'en' ? 'pt' : 'en')),
      },
      {
        id: 'action:chat',
        label: cmd.openChat,
        group: 'actions',
        icon: <MessageSquare size={16} aria-hidden="true" />,
        keywords: 'chat ai agent assistant braia bra.ia',
        perform: () => run(openAgentDock),
      },
      {
        id: 'action:linkedin',
        label: cmd.openLinkedin,
        group: 'actions',
        icon: <Linkedin size={16} aria-hidden="true" />,
        keywords: 'linkedin social contact',
        perform: () =>
          run(() => window.open(withProtocol(profile.personal.linkedin), '_blank', 'noopener,noreferrer')),
      },
      {
        id: 'action:github',
        label: cmd.openGithub,
        group: 'actions',
        icon: <Github size={16} aria-hidden="true" />,
        keywords: 'github code repos source',
        perform: () =>
          run(() => window.open(withProtocol(profile.personal.github), '_blank', 'noopener,noreferrer')),
      },
    ];
  }, [t, cmd, locale, isDarkMode, downloadCv, setLocale, toggleTheme, run]);

  const filtered = useMemo(
    () => items.filter((item) => fuzzyMatch(`${item.label} ${item.keywords ?? ''}`, query)),
    [items, query],
  );

  // Reset state each time the palette opens, and capture the trigger to restore focus.
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = (document.activeElement as HTMLElement) ?? null;
      setQuery('');
      setActiveIndex(0);
      // Autofocus the input after the element mounts/paints.
      const id = window.requestAnimationFrame(() => inputRef.current?.focus());
      return () => window.cancelAnimationFrame(id);
    }
    // Restore focus to whatever opened the palette.
    triggerRef.current?.focus?.();
    return undefined;
  }, [isOpen]);

  // Keep the active index within the filtered range.
  useEffect(() => {
    setActiveIndex((prev) => Math.min(prev, Math.max(filtered.length - 1, 0)));
  }, [filtered.length]);

  // Scroll the active option into view as the user navigates.
  useEffect(() => {
    if (!isOpen) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, isOpen]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (filtered.length ? (prev + 1) % filtered.length : 0));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (filtered.length ? (prev - 1 + filtered.length) % filtered.length : 0));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      filtered[activeIndex]?.perform();
      return;
    }
    if (e.key === 'Tab') {
      // Minimal focus trap: the input is the only focusable control, so keep focus on it.
      e.preventDefault();
      inputRef.current?.focus();
    }
  };

  const overlayMotion = reduce
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      };

  const panelMotion = reduce
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, scale: 0.97, y: -8 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.98, y: -4 },
        transition: { type: 'spring' as const, stiffness: 320, damping: 28 },
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          {...overlayMotion}
          className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[18vh] bg-slate-950/40 backdrop-blur-sm"
          onMouseDown={(e) => {
            // Close when clicking the backdrop (but not the panel).
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            {...panelMotion}
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={cmd.title}
            onKeyDown={onKeyDown}
            className="w-full max-w-xl overflow-hidden rounded-2xl glass gradient-border shadow-2xl shadow-slate-900/30"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-slate-200/70 dark:border-slate-700/60 px-4">
              <Search size={18} className="text-slate-400 dark:text-slate-500 shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                role="combobox"
                aria-expanded="true"
                aria-controls="cmdk-list"
                aria-autocomplete="list"
                aria-activedescendant={filtered[activeIndex]?.id}
                placeholder={cmd.placeholder}
                className="w-full bg-transparent py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            {/* Results */}
            <ul
              ref={listRef}
              id="cmdk-list"
              role="listbox"
              aria-label={cmd.title}
              className="max-h-[50vh] overflow-y-auto p-2 hide-scrollbar"
            >
              {filtered.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  {cmd.empty}
                </li>
              ) : (
                filtered.map((item, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <li
                      key={item.id}
                      id={item.id}
                      role="option"
                      aria-selected={isActive}
                      data-index={index}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => item.perform()}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        isActive
                          ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className={isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}>
                        {item.icon}
                      </span>
                      <span className="flex-1 truncate">{item.label}</span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {item.group === 'navigation' ? cmd.groupNavigation : cmd.groupActions}
                      </span>
                    </li>
                  );
                })
              )}
            </ul>

            {/* Footer hints */}
            <div className="flex items-center gap-4 border-t border-slate-200/70 dark:border-slate-700/60 px-4 py-2.5 text-[11px] text-slate-400 dark:text-slate-500">
              <span className="inline-flex items-center gap-1">
                <ArrowUp size={12} aria-hidden="true" />
                <ArrowDown size={12} aria-hidden="true" />
                {cmd.hintNavigate}
              </span>
              <span className="inline-flex items-center gap-1">
                <CornerDownLeft size={12} aria-hidden="true" />
                {cmd.hintSelect}
              </span>
              <span className="ml-auto inline-flex items-center gap-1">
                <kbd className="rounded border border-slate-300/70 dark:border-slate-600/70 px-1.5 py-0.5 font-mono">
                  Esc
                </kbd>
                {cmd.hintClose}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
