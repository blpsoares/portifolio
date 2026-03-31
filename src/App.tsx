import React, { useState, useEffect } from 'react';
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
import LearningSection from './components/LearningSection';
import VibeProjectsPage from './components/VibeProjectsPage';

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

  useEffect(() => {
    const handleHash = () => {
      setCurrentPage(window.location.hash === '#/vibe-projects' ? 'vibe-projects' : 'home');
      window.scrollTo(0, 0);
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
        <NeuralBackground />

        <div className="relative z-10">
          <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

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
    </I18nProvider>
  );
}

export default App;
