import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('theme', theme);
    
    // Apply theme to document
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Set CSS custom properties for enhanced theming
    if (theme === 'dark') {
      root.style.setProperty('--bg-primary', '#000000');
      root.style.setProperty('--bg-secondary', '#111111');
      root.style.setProperty('--bg-tertiary', '#1a1a1a');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#e5e5e5');
      root.style.setProperty('--text-muted', '#a3a3a3');
      root.style.setProperty('--border-primary', '#333333');
      root.style.setProperty('--border-secondary', '#404040');
      root.style.setProperty('--accent-primary', '#10b981');
      root.style.setProperty('--accent-secondary', '#059669');
      root.style.setProperty('--shadow-primary', '0 4px 6px -1px rgba(0, 0, 0, 0.8)');
      root.style.setProperty('--shadow-secondary', '0 10px 15px -3px rgba(0, 0, 0, 0.9)');
      root.style.setProperty('--gradient-primary', 'linear-gradient(135deg, #000000 0%, #111111 50%, #1a1a1a 100%)');
      root.style.setProperty('--gradient-accent', 'linear-gradient(135deg, #10b981 0%, #059669 100%)');
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f9fafb');
      root.style.setProperty('--bg-tertiary', '#f3f4f6');
      root.style.setProperty('--text-primary', '#111827');
      root.style.setProperty('--text-secondary', '#374151');
      root.style.setProperty('--text-muted', '#6b7280');
      root.style.setProperty('--border-primary', '#e5e7eb');
      root.style.setProperty('--border-secondary', '#d1d5db');
      root.style.setProperty('--accent-primary', '#10b981');
      root.style.setProperty('--accent-secondary', '#059669');
      root.style.setProperty('--shadow-primary', '0 4px 6px -1px rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--shadow-secondary', '0 10px 15px -3px rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--gradient-primary', 'linear-gradient(135deg, #ffffff 0%, #f9fafb 50%, #f3f4f6 100%)');
      root.style.setProperty('--gradient-accent', 'linear-gradient(135deg, #10b981 0%, #059669 100%)');
    }
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};