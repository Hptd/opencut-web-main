import type {
	TransitionDefinition,
	TransitionKeyframeWrite,
} from "./types";

const NEUTRAL_VALUE: Record<string, number> = {
	opacity: 1,
	"transform.scaleX": 1,
	"transform.scaleY": 1,
	"transform.rotate": 0,
	"transform.positionX": 0,
	"transform.positionY": 0,
};

const SLIDE_OFFSET = 600;

function ramp({
	propertyPath,
	from,
	durationTicks,
}: {
	propertyPath: string;
	from: number;
	durationTicks: number;
}): TransitionKeyframeWrite[] {
	return [
		{ propertyPath, time: 0, value: from },
		{ propertyPath, time: durationTicks, value: NEUTRAL_VALUE[propertyPath] ?? 0 },
	];
}

function scaleRamp({
	from,
	durationTicks,
}: {
	from: number;
	durationTicks: number;
}): TransitionKeyframeWrite[] {
	return [
		...ramp({ propertyPath: "transform.scaleX", from, durationTicks }),
		...ramp({ propertyPath: "transform.scaleY", from, durationTicks }),
	];
}

function defineTransition({
	type,
	name,
	keywords,
	buildKeyframes,
}: TransitionDefinition): TransitionDefinition {
	return { type, name, keywords, buildKeyframes };
}

export const crossDissolveTransition: TransitionDefinition = defineTransition({
	type: "cross-dissolve",
	name: "Cross Dissolve",
	keywords: ["dissolve", "cross", "fade", "blend"],
	buildKeyframes: ({ durationTicks }) =>
		ramp({ propertyPath: "opacity", from: 0, durationTicks }),
});

export const fadeTransition: TransitionDefinition = defineTransition({
	type: "fade",
	name: "Fade",
	keywords: ["fade", "in", "dissolve"],
	buildKeyframes: ({ durationTicks }) =>
		ramp({ propertyPath: "opacity", from: 0, durationTicks }),
});

export const fadeToBlackTransition: TransitionDefinition = defineTransition({
	type: "fade-to-black",
	name: "Fade to Black",
	keywords: ["fade", "black", "dark"],
	buildKeyframes: ({ durationTicks }) => [
		{ propertyPath: "opacity", time: 0, value: 0 },
		{ propertyPath: "opacity", time: durationTicks * 0.4, value: 0 },
		{ propertyPath: "opacity", time: durationTicks, value: 1 },
	],
});

export const flashWhiteTransition: TransitionDefinition = defineTransition({
	type: "flash-white",
	name: "Flash White",
	keywords: ["flash", "white", "blink", "strobe"],
	buildKeyframes: ({ durationTicks }) => [
		{ propertyPath: "opacity", time: 0, value: 0 },
		{ propertyPath: "opacity", time: durationTicks * 0.25, value: 0 },
		{ propertyPath: "opacity", time: durationTicks, value: 1 },
		...scaleRamp({ from: 1.08, durationTicks }),
	],
});

export const zoomInTransition: TransitionDefinition = defineTransition({
	type: "zoom-in",
	name: "Zoom In",
	keywords: ["zoom", "in", "scale", "push"],
	buildKeyframes: ({ durationTicks }) => scaleRamp({ from: 0.85, durationTicks }),
});

export const zoomOutTransition: TransitionDefinition = defineTransition({
	type: "zoom-out",
	name: "Zoom Out",
	keywords: ["zoom", "out", "scale"],
	buildKeyframes: ({ durationTicks }) => scaleRamp({ from: 1.15, durationTicks }),
});

export const slideLeftTransition: TransitionDefinition = defineTransition({
	type: "slide-left",
	name: "Slide Left",
	keywords: ["slide", "push", "left", "pan"],
	buildKeyframes: ({ durationTicks }) =>
		ramp({
			propertyPath: "transform.positionX",
			from: -SLIDE_OFFSET,
			durationTicks,
		}),
});

export const slideRightTransition: TransitionDefinition = defineTransition({
	type: "slide-right",
	name: "Slide Right",
	keywords: ["slide", "push", "right", "pan"],
	buildKeyframes: ({ durationTicks }) =>
		ramp({
			propertyPath: "transform.positionX",
			from: SLIDE_OFFSET,
			durationTicks,
		}),
});

export const rotateTransition: TransitionDefinition = defineTransition({
	type: "rotate",
	name: "Rotate",
	keywords: ["rotate", "spin", "turn"],
	buildKeyframes: ({ durationTicks }) => [
		...ramp({
			propertyPath: "transform.rotate",
			from: -20,
			durationTicks,
		}),
		...ramp({ propertyPath: "opacity", from: 0, durationTicks }),
	],
});

export const shakeTransition: TransitionDefinition = defineTransition({
	type: "shake",
	name: "Shake",
	keywords: ["shake", "jitter", "vibrate", "impact"],
	buildKeyframes: ({ durationTicks }) => {
		const step = durationTicks * 0.2;
		return [
			{ propertyPath: "transform.positionX", time: 0, value: 0 },
			{ propertyPath: "transform.positionX", time: step, value: 40 },
			{ propertyPath: "transform.positionX", time: step * 2, value: -40 },
			{ propertyPath: "transform.positionX", time: step * 3, value: 24 },
			{ propertyPath: "transform.positionX", time: step * 4, value: -12 },
			{ propertyPath: "transform.positionX", time: step * 5, value: 0 },
		];
	},
});

export const defaultTransitionDefinitions: TransitionDefinition[] = [
	crossDissolveTransition,
	fadeTransition,
	fadeToBlackTransition,
	flashWhiteTransition,
	zoomInTransition,
	zoomOutTransition,
	slideLeftTransition,
	slideRightTransition,
	rotateTransition,
	shakeTransition,
];
