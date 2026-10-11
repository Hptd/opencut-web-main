"use client";

import { useCallback } from "react";
import { useLanguageStore } from "./store";
import { translateFor, type TranslateVars } from "./translate";

export function useTranslation() {
	const language = useLanguageStore((state) => state.language);

	const t = useCallback(
		(key: string, vars?: TranslateVars) => translateFor(language, key, vars),
		[language],
	);

	return { t, language };
}
