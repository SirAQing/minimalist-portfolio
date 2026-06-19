import { useState, useEffect } from 'react';
import { Moon, Sun, Globe } from 'lucide-react';

export const HeaderActions = () => {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState<'en' | 'zh'>('en');

  useEffect(() => {
    // Theme logic
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    // Language logic
    const savedLang = localStorage.getItem('lang') as 'en' | 'zh';
    if (savedLang) {
      setLang(savedLang);
      document.documentElement.lang = savedLang;
    } else {
      setLang('en');
      document.documentElement.lang = 'en';
      localStorage.setItem('lang', 'en');
    }
    
    // Dispatch event so other components can listen to language change
    window.dispatchEvent(new Event('languageChange'));
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'zh' : 'en';
    setLang(newLang);
    document.documentElement.lang = newLang;
    localStorage.setItem('lang', newLang);
    // Dispatch custom event for language change
    window.dispatchEvent(new CustomEvent('languageChange', { detail: newLang }));
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
      {/* Language Switcher */}
      <button
        onClick={toggleLang}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-pill shadow-sm border border-border-subtle text-text-primary hover:text-accent transition-colors text-xs font-medium"
        aria-label="Toggle language"
      >
        <Globe size={14} />
        <span>{lang === 'en' ? 'EN' : '中'}</span>
      </button>

      {/* Theme Switcher */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-bg-pill shadow-sm border border-border-subtle text-text-primary hover:text-accent transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </div>
  );
};
