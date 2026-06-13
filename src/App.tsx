import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { I18nProvider } from './i18n';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhoIAm from './components/WhoIAm';
import TechStack from './components/TechStack';
import LowCode from './components/LowCode';
import McpSection from './components/McpSection';
import Projects from './components/Projects';
import Education from './components/Education';
import Career from './components/Career';
import VibeProjects from './components/VibeProjects';
import About from './components/About';
import Footer from './components/Footer';
import NeuralBackground from './components/NeuralBackground';
import AmbientBackground from './components/AmbientBackground';
import AgentDock from './components/AgentDock';
import LearningSection from './components/LearningSection';
import VibeProjectsPage from './components/VibeProjectsPage';
// ===== TRACK A — Command Palette (⌘K) =====
import CommandPalette from './components/cmdk/CommandPalette';
import { useCommandPalette } from './hooks/useCommandPalette';

// ===== TRACK B — View Transitions API =====
// This TS DOM lib already types `document.startViewTransition`, but it is not
// universally implemented at runtime, so we still feature-detect before use.
// A minimal local shape keeps us decoupled if the lib ever lacks it (no `any`).
interface StartViewTransitionCapable {
  startViewTransition?: (callback: () => void) => unknown;
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true;
  });

  const [currentPage, setCurrentPage] = useState(() => {
    return window.location.hash === '#/vibe-projects' ? 'vibe-projects' : 'home';
  });

  // ===== TRACK A — Command Palette open/close state (⌘K / Ctrl+K) =====
  const palette = useCommandPalette();

  useEffect(() => {
    const handleHash = () => {
      const nextPage = window.location.hash === '#/vibe-projects' ? 'vibe-projects' : 'home';
      // ===== TRACK B — cross-fade the page swap via the View Transitions API =====
      const commit = () => {
        setCurrentPage(nextPage);
        window.scrollTo(0, 0); // preserved in EVERY path
      };
      const doc = document as Document & StartViewTransitionCapable;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (typeof doc.startViewTransition === 'function' && !prefersReduced) {
        // flushSync makes React 19 commit synchronously inside the callback so
        // the transition snapshots the new DOM (concurrent renders would miss it).
        doc.startViewTransition(() => flushSync(commit));
      } else {
        // Unsupported or reduced motion: instant, direct swap.
        commit();
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <I18nProvider>
      <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 relative">
        <AmbientBackground />
        <NeuralBackground />

        <div className="relative z-10">
          <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

          {/* ===== TRACK B — page-root carries the view-transition-name for the cross-fade ===== */}
          <div style={{ viewTransitionName: 'page-root' } as React.CSSProperties}>
            {currentPage === 'vibe-projects' ? (
              <>
                <main>
                  <VibeProjectsPage />
                </main>
                <Footer />
              </>
            ) : (
              <>
                <main>
                  <Hero />
                  <WhoIAm />
                  <TechStack />
                  <LowCode />
                  <McpSection />
                  <Projects />
                  <Career />
                  <Education />
                  <LearningSection />
                  <VibeProjects />
                  <About />
                </main>
                <Footer />
              </>
            )}
          </div>
        </div>

        <AgentDock />

        {/* ===== TRACK A — global Command Palette (⌘K / Ctrl+K) ===== */}
        <CommandPalette
          isOpen={palette.isOpen}
          close={palette.close}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      </div>
    </I18nProvider>
  );
}

export default App;
