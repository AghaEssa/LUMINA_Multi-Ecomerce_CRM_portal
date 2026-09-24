"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/common/Icons";

type ThemeToggleProps = {
  variant?: "icon" | "dropdown-row";
  className?: string;
};

export function ThemeToggle({ variant = "icon", className = "" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("lumina_theme") as "light" | "dark" | null;
    if (savedTheme === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("lumina_theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) {
    if (variant === "dropdown-row") {
      return (
        <div className="w-full flex items-center justify-between rounded-xl px-3 py-2 opacity-50">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-5 w-14 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
        </div>
      );
    }
    return (
      <div className="h-9 w-9 rounded-full bg-slate-800/20 dark:bg-slate-700/20 border border-slate-700/30" />
    );
  }

  if (variant === "dropdown-row") {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left ${className}`}
        aria-label="Toggle Theme"
      >
        <span className="flex items-center gap-2">
          {theme === "dark" ? (
            <Icon name="Moon" className="h-4 w-4 text-amber-400" />
          ) : (
            <Icon name="Sun" className="h-4 w-4 text-amber-500" />
          )}
          <span>Appearance</span>
        </span>
        <div className="flex items-center gap-1 rounded-full bg-slate-200 dark:bg-slate-800 p-0.5 border border-slate-300 dark:border-slate-700/80">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold transition-all duration-200 ${
              theme === "light"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Light
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold transition-all duration-200 ${
              theme === "dark"
                ? "bg-ocean-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Dark
          </span>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm ${className}`}
      aria-label="Toggle color theme"
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
    >
      {theme === "dark" ? (
        <Icon name="Sun" className="h-4 w-4 text-amber-400" />
      ) : (
        <Icon name="Moon" className="h-4 w-4 text-slate-700" />
      )}
    </button>
  );
}

