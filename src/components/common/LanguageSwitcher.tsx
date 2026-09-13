"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Icon } from "@/components/common/Icons";
import { useLanguage, LanguageCode } from "@/context/LanguageContext";

export type LanguageOption = {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  shortLabel: string;
  dir?: "ltr" | "rtl";
};

export const LANGUAGES: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    shortLabel: "En",
    dir: "ltr",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    shortLabel: "Hi",
    dir: "ltr",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    shortLabel: "Ar",
    dir: "rtl",
  },
];

export function LanguageSwitcher({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) {
  const { lang: currentCode, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLang = LANGUAGES.find((l) => l.code === currentCode) || LANGUAGES[0];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLanguage = useCallback(
    (targetLang: LanguageOption) => {
      setIsOpen(false);
      setLanguage(targetLang.code);
    },
    [setLanguage]
  );

  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-2 w-full pt-2 border-t border-white/10">
        <span className="text-xs font-semibold text-ocean-200 uppercase tracking-wider px-1">
          Select Language / भाषा चुनें
        </span>
        <div className="grid grid-cols-3 gap-2">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang.code === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                  isSelected
                    ? "bg-amber-400 text-ocean-950 border-amber-300 shadow-md font-bold"
                    : "bg-white/10 text-white border-white/10 hover:bg-white/20"
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Selector Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="text-sm leading-none">{selectedLang.flag}</span>
        <span>{selectedLang.shortLabel}</span>
        <Icon
          name="ChevronDown"
          className={`h-3.5 w-3.5 text-white/80 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-slate-900 py-1.5 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Language / भाषा
            </p>
          </div>

          <div className="py-1">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLang.code === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-left transition ${
                    isSelected
                      ? "bg-ocean-50 dark:bg-ocean-950/50 text-ocean-700 dark:text-ocean-300 font-bold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </div>
                  {isSelected && (
                    <Icon name="Check" className="h-4 w-4 text-ocean-600 dark:text-ocean-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
