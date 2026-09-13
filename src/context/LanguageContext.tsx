"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translateText } from "@/lib/translations";

export type LanguageCode = "en" | "hi" | "ar";

interface LanguageContextType {
  lang: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLanguage: () => {},
  t: (text: string) => text,
});

function setGoogleTranslateCookie(langCode: string) {
  try {
    const val = langCode === "en" ? "/en/en" : `/en/${langCode}`;
    const expires = new Date(Date.now() + 30 * 864e5).toUTCString();
    
    document.cookie = `googtrans=${val}; expires=${expires}; path=/`;
    document.cookie = `googtrans=${val}; expires=${expires}; path=/; domain=${window.location.hostname}`;
    if (window.location.hostname === "localhost") {
      document.cookie = `googtrans=${val}; expires=${expires}; path=/; domain=`;
    }
  } catch (e) {
    console.error("Failed to set googtrans cookie", e);
  }
}

function triggerGoogleTranslateSelect(langCode: string) {
  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
      select.dispatchEvent(new Event("input"));
      clearInterval(interval);
    } else if (attempts > 15) {
      clearInterval(interval);
    }
  }, 150);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>("en");

  // Sync initial language from localStorage or cookie on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("lumina_lang") as LanguageCode | null;
      if (savedLang && ["en", "hi", "ar"].includes(savedLang)) {
        setLangState(savedLang);
        applyLanguage(savedLang, false);
      } else {
        const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
        if (match) {
          const val = decodeURIComponent(match[1]);
          const code = val.split("/").pop() as LanguageCode;
          if (code && ["en", "hi", "ar"].includes(code)) {
            setLangState(code);
            applyLanguage(code, false);
          }
        }
      }
    } catch (e) {
      console.error("Error reading saved language", e);
    }
  }, []);

  const applyLanguage = (code: LanguageCode, triggerReloadIfFallback: boolean = true) => {
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = code;
    setGoogleTranslateCookie(code);
    triggerGoogleTranslateSelect(code);

    if (triggerReloadIfFallback) {
      // Small delay to check if Google Translate executed; if not, reload page so cookie takes effect
      setTimeout(() => {
        const select = document.querySelector(".goog-te-combo");
        if (!select) {
          window.location.reload();
        }
      }, 500);
    }
  };

  const setLanguage = useCallback((code: LanguageCode) => {
    setLangState(code);
    try {
      localStorage.setItem("lumina_lang", code);
    } catch (e) {}
    applyLanguage(code, true);
  }, []);

  const t = useCallback(
    (text: string) => {
      return translateText(text, lang);
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
