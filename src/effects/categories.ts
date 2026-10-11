export const EFFECT_CATEGORY_ORDER = [
	"blur",
	"color",
	"stylize",
	"distort",
	"generate",
	"channel",
	"perspective",
] as const;

export type EffectCategory = (typeof EFFECT_CATEGORY_ORDER)[number];

export const EFFECT_CATEGORY_LABELS: Record<string, string> = {
	blur: "Blur & Sharpen",
	color: "Color",
	stylize: "Stylize",
	distort: "Distort",
	generate: "Generate",
	channel: "Channel",
	perspective: "Perspective",
};

export const DEFAULT_EFFECT_CATEGORY = "stylize";
