import type { EffectDefinition } from "@/effects/types";
import type { ParamDefinition, ParamValues } from "@/params";

function readNumber(params: ParamValues, key: string, fallback = 0): number {
	const value = params[key];
	if (typeof value === "number") return value;
	const parsed = Number.parseFloat(String(value));
	return Number.isFinite(parsed) ? parsed : fallback;
}

function numberParam({
	key,
	label,
	defaultValue,
	min,
	max,
	step,
}: {
	key: string;
	label: string;
	defaultValue: number;
	min: number;
	max: number;
	step: number;
}): ParamDefinition {
	return { key, label, type: "number", default: defaultValue, min, max, step };
}

export const sharpenEffectDefinition: EffectDefinition = {
	type: "sharpen",
	name: "Sharpen",
	keywords: ["sharpen", "detail", "crisp", "focus"],
	category: "blur",
	params: [
		numberParam({
			key: "amount",
			label: "Amount",
			defaultValue: 0.5,
			min: 0,
			max: 2,
			step: 0.01,
		}),
	],
	renderer: {
		passes: [
			{
				shader: "sharpen",
				uniforms: ({ effectParams }) => ({
					u_params: [readNumber(effectParams, "amount", 0.5)],
				}),
			},
		],
	},
};

export const grayscaleEffectDefinition: EffectDefinition = {
	type: "grayscale",
	name: "Black & White",
	keywords: ["grayscale", "black and white", "bw", "mono", "desaturate"],
	category: "color",
	params: [
		numberParam({
			key: "amount",
			label: "Amount",
			defaultValue: 1,
			min: 0,
			max: 1,
			step: 0.01,
		}),
	],
	renderer: {
		passes: [
			{
				shader: "grayscale",
				uniforms: ({ effectParams }) => ({
					u_params: [readNumber(effectParams, "amount", 1)],
				}),
			},
		],
	},
};

export const sepiaEffectDefinition: EffectDefinition = {
	type: "sepia",
	name: "Sepia",
	keywords: ["sepia", "vintage", "retro", "old", "film", "brown"],
	category: "color",
	params: [
		numberParam({
			key: "amount",
			label: "Amount",
			defaultValue: 1,
			min: 0,
			max: 1,
			step: 0.01,
		}),
	],
	renderer: {
		passes: [
			{
				shader: "sepia",
				uniforms: ({ effectParams }) => ({
					u_params: [readNumber(effectParams, "amount", 1)],
				}),
			},
		],
	},
};

export const noiseEffectDefinition: EffectDefinition = {
	type: "noise",
	name: "Noise & Grain",
	keywords: ["noise", "grain", "film", "static", "dust"],
	category: "stylize",
	params: [
		numberParam({
			key: "amount",
			label: "Amount",
			defaultValue: 0.08,
			min: 0,
			max: 0.3,
			step: 0.005,
		}),
		numberParam({
			key: "seed",
			label: "Seed",
			defaultValue: 0,
			min: 0,
			max: 100,
			step: 1,
		}),
	],
	renderer: {
		passes: [
			{
				shader: "noise",
				uniforms: ({ effectParams }) => ({
					u_params: [
						readNumber(effectParams, "amount", 0.08),
						readNumber(effectParams, "seed", 0),
					],
				}),
			},
		],
	},
};

export const glowEffectDefinition: EffectDefinition = {
	type: "glow",
	name: "Glow",
	keywords: ["glow", "bloom", "shine", "light", "soft"],
	category: "stylize",
	params: [
		numberParam({
			key: "amount",
			label: "Intensity",
			defaultValue: 0.6,
			min: 0,
			max: 2,
			step: 0.01,
		}),
		numberParam({
			key: "radius",
			label: "Radius",
			defaultValue: 6,
			min: 1,
			max: 24,
			step: 1,
		}),
		numberParam({
			key: "threshold",
			label: "Threshold",
			defaultValue: 0.5,
			min: 0,
			max: 1,
			step: 0.01,
		}),
	],
	renderer: {
		passes: [
			{
				shader: "glow",
				uniforms: ({ effectParams }) => ({
					u_params: [
						readNumber(effectParams, "amount", 0.6),
						readNumber(effectParams, "radius", 6),
						readNumber(effectParams, "threshold", 0.5),
					],
				}),
			},
		],
	},
};

export const vignetteEffectDefinition: EffectDefinition = {
	type: "vignette",
	name: "Vignette",
	keywords: ["vignette", "dark corners", "frame", "lens"],
	category: "color",
	params: [
		numberParam({
			key: "amount",
			label: "Amount",
			defaultValue: 0.6,
			min: 0,
			max: 1,
			step: 0.01,
		}),
		numberParam({
			key: "radius",
			label: "Radius",
			defaultValue: 0.75,
			min: 0.1,
			max: 1,
			step: 0.01,
		}),
		numberParam({
			key: "softness",
			label: "Softness",
			defaultValue: 0.4,
			min: 0.01,
			max: 1,
			step: 0.01,
		}),
	],
	renderer: {
		passes: [
			{
				shader: "vignette",
				uniforms: ({ effectParams }) => ({
					u_params: [
						readNumber(effectParams, "amount", 0.6),
						readNumber(effectParams, "radius", 0.75),
						readNumber(effectParams, "softness", 0.4),
					],
				}),
			},
		],
	},
};

export const pixelateEffectDefinition: EffectDefinition = {
	type: "pixelate",
	name: "Pixelate",
	keywords: ["pixelate", "mosaic", "blocks", "8bit", "retro"],
	category: "stylize",
	params: [
		numberParam({
			key: "size",
			label: "Block Size",
			defaultValue: 8,
			min: 2,
			max: 64,
			step: 1,
		}),
	],
	renderer: {
		passes: [
			{
				shader: "pixelate",
				uniforms: ({ effectParams }) => ({
					u_params: [readNumber(effectParams, "size", 8)],
				}),
			},
		],
	},
};

export const glitchEffectDefinition: EffectDefinition = {
	type: "glitch",
	name: "Glitch",
	keywords: ["glitch", "rgb split", "chromatic", "vhs", "error", "broken"],
	category: "channel",
	params: [
		numberParam({
			key: "amount",
			label: "Amount",
			defaultValue: 0.4,
			min: 0,
			max: 1,
			step: 0.01,
		}),
		numberParam({
			key: "seed",
			label: "Seed",
			defaultValue: 0,
			min: 0,
			max: 100,
			step: 1,
		}),
	],
	renderer: {
		passes: [
			{
				shader: "glitch",
				uniforms: ({ effectParams }) => ({
					u_params: [
						readNumber(effectParams, "amount", 0.4),
						readNumber(effectParams, "seed", 0),
					],
				}),
			},
		],
	},
};

export const distortEffectDefinition: EffectDefinition = {
	type: "distort",
	name: "Ripple",
	keywords: ["distort", "ripple", "wave", "warp", "water"],
	category: "distort",
	params: [
		numberParam({
			key: "amount",
			label: "Amount",
			defaultValue: 0.5,
			min: 0,
			max: 1,
			step: 0.01,
		}),
		numberParam({
			key: "frequency",
			label: "Frequency",
			defaultValue: 4,
			min: 1,
			max: 20,
			step: 0.5,
		}),
		numberParam({
			key: "phase",
			label: "Phase",
			defaultValue: 0,
			min: 0,
			max: 1,
			step: 0.01,
		}),
	],
	renderer: {
		passes: [
			{
				shader: "distort",
				uniforms: ({ effectParams }) => ({
					u_params: [
						readNumber(effectParams, "amount", 0.5),
						readNumber(effectParams, "frequency", 4),
						readNumber(effectParams, "phase", 0),
					],
				}),
			},
		],
	},
};

export const clipEffectDefinitions: EffectDefinition[] = [
	sharpenEffectDefinition,
	grayscaleEffectDefinition,
	sepiaEffectDefinition,
	noiseEffectDefinition,
	glowEffectDefinition,
	vignetteEffectDefinition,
	pixelateEffectDefinition,
	glitchEffectDefinition,
	distortEffectDefinition,
];
