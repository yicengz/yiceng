"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  themes,
  DEFAULT_THEME,
  type ThemeKey,
  type ThemeDefinition,
} from "./themes";

interface ThemeContextValue {
  themeKey: ThemeKey;
  theme: ThemeDefinition;
  setTheme: (key: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "yiceng-theme";

function applyTheme(def: ThemeDefinition) {
  const root = document.documentElement;
  root.setAttribute("data-theme", def.key);

  Object.entries(def.cssVars).forEach(([prop, value]) => {
    root.style.setProperty(prop, value);
  });

  root.style.setProperty(
    "--font-body",
    def.fontStack === "serif" ? "var(--font-serif)" : "var(--font-sans)"
  );
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeKey, setThemeKey] = useState<ThemeKey>(DEFAULT_THEME);

  // Read from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeKey | null;
    if (stored && themes[stored]) {
      setThemeKey(stored);
      applyTheme(themes[stored]);
    }

    // Remove no-transition class after first paint
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("no-transition");
    });
  }, []);

  // Apply CSS variables whenever themeKey changes
  useEffect(() => {
    applyTheme(themes[themeKey]);
    localStorage.setItem(STORAGE_KEY, themeKey);
  }, [themeKey]);

  const setTheme = useCallback((key: ThemeKey) => {
    setThemeKey(key);
  }, []);

  return (
    <ThemeContext.Provider
      value={{ themeKey, theme: themes[themeKey], setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
