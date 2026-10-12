import { getPersistedKeybindingsState } from "../persisted-state";

const PREVIOUS_DEFAULTS = {
	k: "toggle-play",
	s: "split",
} as const;

const NEW_DEFAULTS: Record<string, string> = {
	m: "toggle-bookmark",
	"shift+m": "next-bookmark",
	"alt+shift+m": "previous-bookmark",
};

export function v7ToV8({ state }: { state: unknown }): unknown {
	const v7 = getPersistedKeybindingsState({ state });
	if (!v7) return state;

	const keybindings = { ...v7.keybindings };

	// Only realign mappings that still carry the old defaults. Leave any
	// user-customized keys untouched.
	if (!v7.isCustomized) {
		// Free "k" from its previous toggle-play default so split can take it.
		if (keybindings.k === PREVIOUS_DEFAULTS.k) {
			delete keybindings.k;
		}

		// Move split off the old "s" default onto "k".
		if (keybindings.s === PREVIOUS_DEFAULTS.s && keybindings.k === undefined) {
			delete keybindings.s;
			keybindings.k = "split";
		}
	}

	// Add the new bookmark shortcuts unless the user already bound those keys.
	for (const [key, action] of Object.entries(NEW_DEFAULTS)) {
		if (keybindings[key] === undefined) {
			keybindings[key] = action;
		}
	}

	return { ...v7, keybindings };
}
