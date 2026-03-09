"use client";

import { useI18n } from "./I18nProvider";

const LABELS: Record<string, string> = {
  en: "EN",
  hi: "HI",
  mr: "MR",
};

export default function LocaleSwitcher() {
  const { locale, setLocale, supportedLocales } = useI18n();

  return (
    <div className="flex items-center gap-1 text-xs text-zinc-600">
      {supportedLocales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={`rounded-full border px-2 py-0.5 transition-colors ${
            locale === code
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-300 bg-white hover:border-zinc-400"
          }`}
        >
          {LABELS[code] ?? code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

