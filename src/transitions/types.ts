import type { TimelineElement } from "@/timeline";

export interface TransitionKeyframeWrite {
	propertyPath: string;
	time: number;
	value: number;
}

export interface TransitionBuildContext {
	element: TimelineElement;
	durationTicks: number;
}

export interface TransitionDefinition {
	type: string;
	name: string;
	keywords: string[];
	buildKeyframes: (context: TransitionBuildContext) => TransitionKeyframeWrite[];
}
