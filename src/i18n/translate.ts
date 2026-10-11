import { zhDictionary } from "./dictionary";
import { getLanguage, type Language } from "./store";

export type TranslateVars = Record<string, string | number>;

export function translateFor(
	language: Language,
	key: string,
	vars?: TranslateVars,
): string {
	const template = language === "zh" ? (zhDictionary[key] ?? key) : key;
	if (!vars) return template;

	return template.replace(/\{(\w+)\}/g, (match, name: string) =>
		Object.hasOwn(vars, name) ? String(vars[name]) : match,
	);
}

/** Non-React helper; uses the current language from the store. */
export function translate(key: string, vars?: TranslateVars): string {
	return translateFor(getLanguage(), key, vars);
}
