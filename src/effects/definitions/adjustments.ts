import type { EffectDefinition } from "@/effects/types";
import type { ParamDefinition, ParamValues } from "@/params";

function readNumber(params: ParamValues, key: string, fallback = 0): number {
	const value = params[key];
	if (typeof value === "number") return value;
	const parsed = Number.parseFloat(String(value));
	return Number.isFinite(parsed) ? parsed : fallback;
}

function numberParam({
	key = "amount",
	label = "Amount",
	defaultValue = 0,
	min = -1,
	max = 1,
	step = 0.01,
}: {
	key?: string;
	label?: string;
	defaultValue?: number;
	min?: number;
	max?: number;
	step?: number;
}): ParamDefinition {
	return {
		key,
		label,
		type: "number",
		default: defaultValue,
		min,
		max,
		step,
	};
}

function singleParamAdjustment({
	type,
	name,
	keywords,
	shader,
	param,
}: {
	type: string;
	name: string;
	keywords: string[];
	shader: string;
	param: ParamDefinition;
}): EffectDefinition {
	return {
		type,
		name,
		keywords,
		category: "color",
		params: [param],
		renderer: {
			passes: [
				{
					shader,
					uniforms: ({ effectParams }) => ({
						u_params: [readNumber(effectParams, param.key)],
					}),
				},
			],
		},
	};
}

export const brightnessAdjustmentDefinition = singleParamAdjustment({
	type: "adjust-brightness",
	name: "Brightness",
	keywords: ["brightness", "light", "dark", "adjust", "exposure"],
	shader: "brightness",
	param: numberParam({ label: "Brightness" }),
});

export const contrastAdjustmentDefinition = singleParamAdjustment({
	type: "adjust-contrast",
	name: "Contrast",
	keywords: ["contrast", "adjust"],
	shader: "contrast",
	param: numberParam({ label: "Contrast" }),
});

export const saturationAdjustmentDefinition = singleParamAdjustment({
	type: "adjust-saturation",
	name: "Saturation",
	keywords: ["saturation", "vibrance", "color", "adjust"],
	shader: "saturation",
	param: numberParam({ label: "Saturation" }),
});

export const exposureAdjustmentDefinition = singleParamAdjustment({
	type: "adjust-exposure",
	name: "Exposure",
	keywords: ["exposure", "light", "stops", "adjust"],
	shader: "exposure",
	param: numberParam({ label: "Exposure", min: -2, max: 2 }),
});

export const hueAdjustmentDefinition = singleParamAdjustment({
	type: "adjust-hue",
	name: "Hue",
	keywords: ["hue", "color", "rotate", "adjust"],
	shader: "hue",
	param: numberParam({ label: "Hue", min: -180, max: 180, step: 1 }),
});

export const temperatureAdjustmentDefinition = singleParamAdjustment({
	type: "adjust-temperature",
	name: "Temperature",
	keywords: ["temperature", "warm", "cool", "white balance", "adjust"],
	shader: "temperature",
	param: numberParam({ label: "Temperature" }),
});

export const tintAdjustmentDefinition = singleParamAdjustment({
	type: "adjust-tint",
	name: "Tint",
	keywords: ["tint", "green", "magenta", "white balance", "adjust"],
	shader: "tint",
	param: numberParam({ label: "Tint" }),
});

export const highlightsAdjustmentDefinition = singleParamAdjustment({
	type: "adjust-highlights",
	name: "Highlights",
	keywords: ["highlights", "light", "tone", "adjust"],
	shader: "highlights",
	param: numberParam({ label: "Highlights" }),
});

export const shadowsAdjustmentDefinition = singleParamAdjustment({
	type: "adjust-shadows",
	name: "Shadows",
	keywords: ["shadows", "dark", "tone", "adjust"],
	shader: "shadows",
	param: numberParam({ label: "Shadows" }),
});

export const clarityAdjustmentDefinition: EffectDefinition = {
	type: "adjust-clarity",
	name: "Clarity",
	keywords: ["clarity", "detail", "local contrast", "adjust"],
	category: "color",
	params: [
		numberParam({ label: "Clarity", defaultValue: 0.3 }),
		numberParam({
			key: "radius",
			label: "Radius",
			defaultValue: 4,
			min: 1,
			max: 20,
			step: 1,
		}),
	],
	renderer: {
		passes: [
			{
				shader: "clarity",
				uniforms: ({ effectParams }) => ({
					u_params: [
						readNumber(effectParams, "amount"),
						readNumber(effectParams, "radius", 4),
					],
				}),
			},
		],
	},
};

export const adjustmentEffectDefinitions: EffectDefinition[] = [
	brightnessAdjustmentDefinition,
	contrastAdjustmentDefinition,
	saturationAdjustmentDefinition,
	exposureAdjustmentDefinition,
	hueAdjustmentDefinition,
	temperatureAdjustmentDefinition,
	tintAdjustmentDefinition,
	highlightsAdjustmentDefinition,
	shadowsAdjustmentDefinition,
	clarityAdjustmentDefinition,
];
