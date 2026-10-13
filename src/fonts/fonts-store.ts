import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_RECENT_FONTS = 20;

function sanitizeFontNames(input: unknown): string[] {
	if (!Array.isArray(input)) return [];
	const result: string[] = [];
	for (const name of input) {
		if (typeof name !== "string" || name.length === 0) continue;
		if (result.includes(name)) continue;
		result.push(name);
	}
	return result;
}

interface FontsStore {
	favorites: string[];
	recentFonts: string[];
	toggleFavorite: ({ family }: { family: string }) => void;
	addRecentFont: ({ family }: { family: string }) => void;
	clearRecentFonts: () => void;
}

export const useFontsStore = create<FontsStore>()(
	persist(
		(set) => ({
			favorites: [],
			recentFonts: [],

			toggleFavorite: ({ family }) =>
				set((state) => ({
					favorites: state.favorites.includes(family)
						? state.favorites.filter((name) => name !== family)
						: [...state.favorites, family],
				})),

			addRecentFont: ({ family }) =>
				set((state) => ({
					recentFonts: [
						family,
						...state.recentFonts.filter((name) => name !== family),
					].slice(0, MAX_RECENT_FONTS),
				})),

			clearRecentFonts: () => set({ recentFonts: [] }),
		}),
		{
			name: "font-settings",
			version: 1,
			merge: (persistedState, currentState) => {
				const persisted = (persistedState ?? {}) as Partial<FontsStore>;
				return {
					...currentState,
					favorites: sanitizeFontNames(persisted.favorites),
					recentFonts: sanitizeFontNames(persisted.recentFonts),
				};
			},
			partialize: (state) => ({
				favorites: state.favorites,
				recentFonts: state.recentFonts,
			}),
		},
	),
);
