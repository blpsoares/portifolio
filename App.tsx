import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TechStack from './components/TechStack';
import LowCode from './components/LowCode';
import McpSection from './components/McpSection';
import Projects from './components/Projects';
import About from './components/About';
import Footer from './components/Footer';
import NeuralBackground from './components/NeuralBackground';

function App() {
  // Theme management
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true; // Default to dark
  });

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
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 relative">
      {/* Global Animated Background */}
      <NeuralBackground />
      
      {/* Content Layer - Z-Index 10 ensures it sits above background */}
      <div className="relative z-10">
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <main>
          <Hero />
          <TechStack />
          <LowCode />
          <McpSection />
          <Projects />
          <About />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;