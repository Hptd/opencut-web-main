import type { ShortcutKey } from "./keybinding";
import { getActionDefinition, type TAction } from "./definitions";

export function formatShortcutLabel({
	shortcut,
}: {
	shortcut: ShortcutKey;
}): string {
	return shortcut
		.split("+")
		.map((token) => token.charAt(0).toUpperCase() + token.slice(1))
		.join("+");
}

/**
 * First default shortcut for an action, formatted for display (e.g. "Shift+M").
 * Returns null when the action has no default shortcut.
 */
export function getActionShortcutLabel({
	action,
}: {
	action: TAction;
}): string | null {
	const shortcuts = getActionDefinition({ action }).defaultShortcuts;
	if (!shortcuts || shortcuts.length === 0) {
		return null;
	}
	return formatShortcutLabel({ shortcut: shortcuts[0] });
}
