import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "zh" | "en";

interface LanguageState {
	language: Language;
	setLanguage: (language: Language) => void;
	toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
	persist(
		(set, get) => ({
			language: "zh",
			setLanguage: (language) => set({ language }),
			toggleLanguage: () =>
				set({ language: get().language === "zh" ? "en" : "zh" }),
		}),
		{ name: "opencut-language" },
	),
);

export function getLanguage(): Language {
	return useLanguageStore.getState().language;
}
