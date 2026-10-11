import { defaultTransitionDefinitions } from "./definitions";
import type { TransitionDefinition } from "./types";

export type { TransitionDefinition } from "./types";

const transitionRegistry = new Map<string, TransitionDefinition>(
	defaultTransitionDefinitions.map((definition) => [definition.type, definition]),
);

export function getAllTransitions(): TransitionDefinition[] {
	return Array.from(transitionRegistry.values());
}

export function getTransitionDefinition(type: string): TransitionDefinition {
	const definition = transitionRegistry.get(type);
	if (!definition) {
		throw new Error(`Unknown transition: ${type}`);
	}
	return definition;
}
