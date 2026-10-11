import { effectsRegistry } from "../registry";
import { blurEffectDefinition } from "./blur";
import { adjustmentEffectDefinitions } from "./adjustments";
import { clipEffectDefinitions } from "./effects";
import { extendedEffectDefinitions } from "./extended";

const defaultEffects = [
	blurEffectDefinition,
	...clipEffectDefinitions,
	...extendedEffectDefinitions,
	...adjustmentEffectDefinitions,
];

export function registerDefaultEffects(): void {
	for (const definition of defaultEffects) {
		if (effectsRegistry.has(definition.type)) {
			continue;
		}
		effectsRegistry.register({
			key: definition.type,
			definition,
		});
	}
}
