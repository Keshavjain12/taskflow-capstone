import { useEffect, useState } from "react";

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage.getItem("taskflow-theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", isDark);
    window.localStorage.setItem("taskflow-theme", isDark ? "dark" : "light");
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((v) => !v) };
}
