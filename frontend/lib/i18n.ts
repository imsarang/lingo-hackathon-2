import en from "../locales/en.json";

type Messages = typeof en;

// Very small, static i18n helper.
// For now we only use `en` at runtime; CI will keep other locale files in sync.

export function t<Key extends keyof Messages>(key: Key): Messages[Key] {
  return en[key];
}

