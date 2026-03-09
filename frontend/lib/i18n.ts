import en from "../locales/en.json";
import hi from "../locales/hi.json";
import mr from "../locales/mr.json";

export type Messages = typeof en;

export const messagesByLocale = {
  en,
  hi,
  mr,
} as const;

export type Locale = keyof typeof messagesByLocale;

export const DEFAULT_LOCALE: Locale = "en";
export const SUPPORTED_LOCALES: Locale[] = ["en", "hi", "mr"];

export function getMessages(locale: Locale): Messages {
  return messagesByLocale[locale] ?? en;
}

