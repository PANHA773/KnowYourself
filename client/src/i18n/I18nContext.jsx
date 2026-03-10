import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "./translations.js";

const I18nContext = createContext(null);

const LANG_KEY = "ky_lang";
const SUPPORTED = ["en", "km"];

function interpolate(text, vars) {
  if (!vars) return text;
  return String(text).replace(/\{(\w+)\}/g, (m, k) => {
    if (Object.prototype.hasOwnProperty.call(vars, k)) return String(vars[k]);
    return m;
  });
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem(LANG_KEY);
    if (SUPPORTED.includes(saved)) return saved;
    return "en";
  });

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang === "km" ? "km" : "en";
  }, [lang]);

  const value = useMemo(() => {
    return {
      lang,
      setLang(next) {
        if (SUPPORTED.includes(next)) setLang(next);
      },
      t(key, vars) {
        const dict = translations[lang] || translations.en;
        const fallback = translations.en || {};
        const raw = dict[key] ?? fallback[key] ?? key;
        const withDefaults = { year: new Date().getFullYear(), ...(vars || {}) };
        return interpolate(raw, withDefaults);
      }
    };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
