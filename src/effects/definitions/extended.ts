import type { EffectDefinition } from "@/effects/types";
import type { ParamDefinition, ParamValues } from "@/params";

function readNumber(params: ParamValues, key: string, fallback = 0): number {
	const value = params[key];
	if (typeof value === "number") return value;
	const parsed = Number.parseFloat(String(value));
	return Number.isFinite(parsed) ? parsed : fallback;
}

function readString(params: ParamValues, key: string, fallback = ""): string {
	const value = params[key];
	return typeof value === "string" ? value : fallback;
}

function hexToRgba(hex: string): [number, number, number, number] {
	const normalized = hex.replace("#", "").trim();
	const parse = (start: number) =>
		Number.parseInt(normalized.slice(start, start + 2), 16);
	if (normalized.length < 6) {
		return [0, 0, 0, 1];
	}
	const r = parse(0) / 255;
	const g = parse(2) / 255;
	const b = parse(4) / 255;
	const a = normalized.length >= 8 ? parse(6) / 255 : 1;
	const safe = (n: number) => (Number.isFinite(n) ? n : 0);
	return [safe(r), safe(g), safe(b), safe(a)];
}

function numberParam(
	key: string,
	label: string,
	defaultValue: number,
	min: number,
	max: number,
	step: number,
): ParamDefinition {
	return { key, label, type: "number", default: defaultValue, min, max, step };
}

function colorParam(
	key: string,
	label: string,
	defaultValue: string,
): ParamDefinition {
	return { key, label, type: "color", default: defaultValue };
}

function selectParam(
	key: string,
	label: string,
	defaultValue: string,
	options: Array<{ value: string; label: string }>,
): ParamDefinition {
	return { key, label, type: "select", default: defaultValue, options };
}

function singlePassEffect({
	type,
	name,
	keywords,
	category,
	params,
	shader,
	buildUniforms,
}: {
	type: string;
	name: string;
	keywords: string[];
	category: string;
	params: ParamDefinition[];
	shader: string;
	buildUniforms: (params: ParamValues) => Record<string, number | number[]>;
}): EffectDefinition {
	return {
		type,
		name,
		keywords,
		category,
		params,
		renderer: {
			passes: [
				{
					shader,
					uniforms: ({ effectParams }) => buildUniforms(effectParams),
				},
			],
		},
	};
}

export const directionalBlurDefinition = singlePassEffect({
	type: "directional-blur",
	name: "Directional Blur",
	keywords: ["blur", "motion", "direction"],
	category: "blur",
	shader: "directional-blur",
	params: [
		numberParam("angle", "Angle", 0, -180, 180, 1),
		numberParam("length", "Length", 20, 0, 100, 1),
	],
	buildUniforms: (params) => ({
		u_params: [readNumber(params, "angle"), readNumber(params, "length", 20)],
	}),
});

export const radialBlurDefinition = singlePassEffect({
	type: "radial-blur",
	name: "Radial Blur",
	keywords: ["blur", "radial", "spin", "zoom"],
	category: "blur",
	shader: "radial-blur",
	params: [
		numberParam("amount", "Amount", 0.3, 0, 1, 0.01),
		numberParam("centerX", "Center X", 0, -1, 1, 0.01),
		numberParam("centerY", "Center Y", 0, -1, 1, 0.01),
	],
	buildUniforms: (params) => ({
		u_params: [
			readNumber(params, "amount", 0.3),
			readNumber(params, "centerX"),
			readNumber(params, "centerY"),
		],
	}),
});

export const unsharpMaskDefinition = singlePassEffect({
	type: "unsharp-mask",
	name: "Unsharp Mask",
	keywords: ["sharpen", "unsharp", "detail"],
	category: "blur",
	shader: "unsharp-mask",
	params: [
		numberParam("amount", "Amount", 1, 0, 3, 0.01),
		numberParam("radius", "Radius", 2, 0.5, 20, 0.5),
	],
	buildUniforms: (params) => ({
		u_params: [readNumber(params, "amount", 1), readNumber(params, "radius", 2)],
	}),
});

export const gammaDefinition = singlePassEffect({
	type: "gamma",
	name: "Gamma Correction",
	keywords: ["gamma", "color", "exposure"],
	category: "color",
	shader: "gamma",
	params: [numberParam("gamma", "Gamma", 1, 0.1, 3, 0.01)],
	buildUniforms: (params) => ({ u_params: [readNumber(params, "gamma", 1)] }),
});

export const colorBalanceDefinition = singlePassEffect({
	type: "color-balance",
	name: "Color Balance",
	keywords: ["color balance", "rgb", "tint"],
	category: "color",
	shader: "color-balance",
	params: [
		numberParam("red", "Red", 0, -1, 1, 0.01),
		numberParam("green", "Green", 0, -1, 1, 0.01),
		numberParam("blue", "Blue", 0, -1, 1, 0.01),
	],
	buildUniforms: (params) => ({
		u_params: [
			readNumber(params, "red"),
			readNumber(params, "green"),
			readNumber(params, "blue"),
		],
	}),
});

export const colorPassDefinition = singlePassEffect({
	type: "color-pass",
	name: "Color Pass",
	keywords: ["color pass", "selective", "keep color"],
	category: "color",
	shader: "color-pass",
	params: [
		colorParam("color", "Keep Color", "#ff0000"),
		numberParam("tolerance", "Tolerance", 0.2, 0, 1, 0.01),
		numberParam("softness", "Softness", 0.2, 0, 1, 0.01),
	],
	buildUniforms: (params) => ({
		u_color: hexToRgba(readString(params, "color", "#ff0000")),
		u_params: [
			readNumber(params, "tolerance", 0.2),
			readNumber(params, "softness", 0.2),
		],
	}),
});

export const colorReplaceDefinition = singlePassEffect({
	type: "color-replace",
	name: "Color Replace",
	keywords: ["color replace", "swap", "replace"],
	category: "color",
	shader: "color-replace",
	params: [
		colorParam("color", "Target", "#00ff00"),
		colorParam("color2", "Replace With", "#ff0000"),
		numberParam("tolerance", "Tolerance", 0.2, 0, 1, 0.01),
		numberParam("softness", "Softness", 0.2, 0, 1, 0.01),
	],
	buildUniforms: (params) => ({
		u_color: hexToRgba(readString(params, "color", "#00ff00")),
		u_color2: hexToRgba(readString(params, "color2", "#ff0000")),
		u_params: [
			readNumber(params, "tolerance", 0.2),
			readNumber(params, "softness", 0.2),
		],
	}),
});

export const findEdgesDefinition = singlePassEffect({
	type: "find-edges",
	name: "Find Edges",
	keywords: ["edges", "outline", "sobel"],
	category: "stylize",
	shader: "find-edges",
	params: [numberParam("amount", "Amount", 1, 0, 1, 0.01)],
	buildUniforms: (params) => ({ u_params: [readNumber(params, "amount", 1)] }),
});

export const embossDefinition = singlePassEffect({
	type: "emboss",
	name: "Emboss",
	keywords: ["emboss", "relief", "stylize"],
	category: "stylize",
	shader: "emboss",
	params: [
		numberParam("amount", "Amount", 1, 0, 1, 0.01),
		numberParam("angle", "Angle", 45, -180, 180, 1),
	],
	buildUniforms: (params) => ({
		u_params: [readNumber(params, "amount", 1), readNumber(params, "angle", 45)],
	}),
});

export const colorEmbossDefinition = singlePassEffect({
	type: "color-emboss",
	name: "Color Emboss",
	keywords: ["emboss", "color", "relief"],
	category: "stylize",
	shader: "color-emboss",
	params: [
		numberParam("amount", "Amount", 1, 0, 3, 0.01),
		numberParam("angle", "Angle", 45, -180, 180, 1),
	],
	buildUniforms: (params) => ({
		u_params: [readNumber(params, "amount", 1), readNumber(params, "angle", 45)],
	}),
});

export const thresholdDefinition = singlePassEffect({
	type: "threshold",
	name: "Threshold",
	keywords: ["threshold", "black and white", "posterize"],
	category: "stylize",
	shader: "threshold",
	params: [
		numberParam("level", "Level", 0.5, 0, 1, 0.01),
		numberParam("softness", "Softness", 0.05, 0.001, 0.5, 0.001),
	],
	buildUniforms: (params) => ({
		u_params: [
			readNumber(params, "level", 0.5),
			readNumber(params, "softness", 0.05),
		],
	}),
});

export const posterizeDefinition = singlePassEffect({
	type: "posterize",
	name: "Posterize",
	keywords: ["posterize", "levels", "quantize"],
	category: "stylize",
	shader: "posterize",
	params: [numberParam("levels", "Levels", 8, 2, 32, 1)],
	buildUniforms: (params) => ({ u_params: [readNumber(params, "levels", 8)] }),
});

export const waveWarpDefinition = singlePassEffect({
	type: "wave-warp",
	name: "Wave Warp",
	keywords: ["wave", "warp", "ripple", "distort"],
	category: "distort",
	shader: "wave-warp",
	params: [
		numberParam("amplitude", "Amplitude", 0.1, 0, 1, 0.01),
		numberParam("wavelength", "Wavelength", 8, 1, 50, 0.5),
		numberParam("phase", "Phase", 0, 0, 1, 0.01),
		selectParam("direction", "Direction", "horizontal", [
			{ value: "horizontal", label: "Horizontal" },
			{ value: "vertical", label: "Vertical" },
		]),
	],
	buildUniforms: (params) => ({
		u_params: [
			readNumber(params, "amplitude", 0.1),
			readNumber(params, "wavelength", 8),
			readNumber(params, "phase"),
			readString(params, "direction", "horizontal") === "vertical" ? 1 : 0,
		],
	}),
});

export const spherizeDefinition = singlePassEffect({
	type: "spherize",
	name: "Spherize",
	keywords: ["spherize", "sphere", "bulge", "distort"],
	category: "distort",
	shader: "spherize",
	params: [
		numberParam("amount", "Amount", 0.5, -1, 1, 0.01),
		numberParam("radius", "Radius", 0.5, 0.05, 1, 0.01),
	],
	buildUniforms: (params) => ({
		u_params: [readNumber(params, "amount", 0.5), readNumber(params, "radius", 0.5)],
	}),
});

export const twirlDefinition = singlePassEffect({
	type: "twirl",
	name: "Twirl",
	keywords: ["twirl", "swirl", "spin", "distort"],
	category: "distort",
	shader: "twirl",
	params: [
		numberParam("amount", "Amount", 1, -3, 3, 0.01),
		numberParam("radius", "Radius", 0.5, 0.05, 1, 0.01),
	],
	buildUniforms: (params) => ({
		u_params: [readNumber(params, "amount", 1), readNumber(params, "radius", 0.5)],
	}),
});

export const mirrorDefinition = singlePassEffect({
	type: "mirror-effect",
	name: "Mirror",
	keywords: ["mirror", "reflect", "flip"],
	category: "distort",
	shader: "mirror",
	params: [
		selectParam("axis", "Axis", "horizontal", [
			{ value: "horizontal", label: "Horizontal" },
			{ value: "vertical", label: "Vertical" },
		]),
		numberParam("position", "Position", 0.5, 0, 1, 0.01),
	],
	buildUniforms: (params) => ({
		u_params: [
			readString(params, "axis", "horizontal") === "vertical" ? 1 : 0,
			readNumber(params, "position", 0.5),
		],
	}),
});

export const lensDistortionDefinition = singlePassEffect({
	type: "lens-distortion",
	name: "Lens Distortion",
	keywords: ["lens", "distortion", "barrel", "pincushion"],
	category: "distort",
	shader: "lens-distortion",
	params: [
		numberParam("amount", "Amount", 0.2, -1, 1, 0.01),
		numberParam("radius", "Radius", 0.8, 0.1, 1, 0.01),
	],
	buildUniforms: (params) => ({
		u_params: [readNumber(params, "amount", 0.2), readNumber(params, "radius", 0.8)],
	}),
});

export const magnifyDefinition = singlePassEffect({
	type: "magnify",
	name: "Magnify",
	keywords: ["magnify", "zoom", "loupe"],
	category: "distort",
	shader: "magnify",
	params: [
		numberParam("amount", "Amount", 0.5, 0, 1, 0.01),
		numberParam("radius", "Radius", 0.4, 0.05, 1, 0.01),
	],
	buildUniforms: (params) => ({
		u_params: [readNumber(params, "amount", 0.5), readNumber(params, "radius", 0.4)],
	}),
});

export const rampDefinition = singlePassEffect({
	type: "ramp",
	name: "Ramp",
	keywords: ["ramp", "gradient", "generate"],
	category: "generate",
	shader: "ramp",
	params: [
		colorParam("color", "Color A", "#000000"),
		colorParam("color2", "Color B", "#ffffff"),
		numberParam("angle", "Angle", 90, 0, 360, 1),
	],
	buildUniforms: (params) => ({
		u_color: hexToRgba(readString(params, "color", "#000000")),
		u_color2: hexToRgba(readString(params, "color2", "#ffffff")),
		u_params: [readNumber(params, "angle", 90)],
	}),
});

export const gridDefinition = singlePassEffect({
	type: "grid",
	name: "Grid",
	keywords: ["grid", "lines", "generate"],
	category: "generate",
	shader: "grid",
	params: [
		colorParam("color", "Line Color", "#ffffff"),
		numberParam("cells", "Cells", 12, 2, 64, 1),
		numberParam("thickness", "Thickness", 0.02, 0.005, 0.5, 0.005),
	],
	buildUniforms: (params) => ({
		u_color: hexToRgba(readString(params, "color", "#ffffff")),
		u_params: [readNumber(params, "cells", 12), readNumber(params, "thickness", 0.02)],
	}),
});

export const checkerboardDefinition = singlePassEffect({
	type: "checkerboard",
	name: "Checkerboard",
	keywords: ["checkerboard", "squares", "generate"],
	category: "generate",
	shader: "checkerboard",
	params: [
		colorParam("color", "Color", "#ffffff"),
		numberParam("size", "Size", 32, 2, 128, 1),
	],
	buildUniforms: (params) => ({
		u_color: hexToRgba(readString(params, "color", "#ffffff")),
		u_params: [readNumber(params, "size", 32)],
	}),
});

export const invertDefinition = singlePassEffect({
	type: "invert",
	name: "Invert",
	keywords: ["invert", "negative", "channel"],
	category: "channel",
	shader: "invert",
	params: [numberParam("amount", "Amount", 1, 0, 1, 0.01)],
	buildUniforms: (params) => ({ u_params: [readNumber(params, "amount", 1)] }),
});

export const lumaKeyDefinition = singlePassEffect({
	type: "luma-key",
	name: "Luma Key",
	keywords: ["luma key", "keying", "matte"],
	category: "channel",
	shader: "luma-key",
	params: [
		numberParam("threshold", "Threshold", 0.2, 0, 1, 0.01),
		numberParam("softness", "Softness", 0.05, 0.001, 0.5, 0.001),
	],
	buildUniforms: (params) => ({
		u_params: [
			readNumber(params, "threshold", 0.2),
			readNumber(params, "softness", 0.05),
		],
	}),
});

export const chromaKeyDefinition = singlePassEffect({
	type: "chroma-key",
	name: "Chroma Key",
	keywords: ["chroma key", "green screen", "keying"],
	category: "channel",
	shader: "chroma-key",
	params: [
		colorParam("color", "Key Color", "#00ff00"),
		numberParam("tolerance", "Tolerance", 0.2, 0, 1, 0.01),
		numberParam("softness", "Softness", 0.1, 0.001, 0.5, 0.001),
	],
	buildUniforms: (params) => ({
		u_color: hexToRgba(readString(params, "color", "#00ff00")),
		u_params: [
			readNumber(params, "tolerance", 0.2),
			readNumber(params, "softness", 0.1),
		],
	}),
});

export const dropShadowDefinition = singlePassEffect({
	type: "drop-shadow",
	name: "Drop Shadow",
	keywords: ["shadow", "drop shadow", "perspective"],
	category: "perspective",
	shader: "drop-shadow",
	params: [
		colorParam("color", "Shadow Color", "#000000cc"),
		numberParam("offsetX", "Offset X", 12, -200, 200, 1),
		numberParam("offsetY", "Offset Y", 12, -200, 200, 1),
		numberParam("softness", "Softness", 8, 0, 40, 0.5),
	],
	buildUniforms: (params) => ({
		u_color: hexToRgba(readString(params, "color", "#000000cc")),
		u_params: [
			readNumber(params, "offsetX", 12),
			readNumber(params, "offsetY", 12),
			readNumber(params, "softness", 8),
		],
	}),
});

export const bevelAlphaDefinition = singlePassEffect({
	type: "bevel-alpha",
	name: "Bevel Alpha",
	keywords: ["bevel", "3d", "edge", "perspective"],
	category: "perspective",
	shader: "bevel-alpha",
	params: [
		numberParam("amount", "Amount", 0.5, 0, 1, 0.01),
		numberParam("thickness", "Thickness", 4, 1, 20, 1),
	],
	buildUniforms: (params) => ({
		u_params: [readNumber(params, "amount", 0.5), readNumber(params, "thickness", 4)],
	}),
});

export const extendedEffectDefinitions: EffectDefinition[] = [
	directionalBlurDefinition,
	radialBlurDefinition,
	unsharpMaskDefinition,
	gammaDefinition,
	colorBalanceDefinition,
	colorPassDefinition,
	colorReplaceDefinition,
	findEdgesDefinition,
	embossDefinition,
	colorEmbossDefinition,
	thresholdDefinition,
	posterizeDefinition,
	waveWarpDefinition,
	spherizeDefinition,
	twirlDefinition,
	mirrorDefinition,
	lensDistortionDefinition,
	magnifyDefinition,
	rampDefinition,
	gridDefinition,
	checkerboardDefinition,
	invertDefinition,
	lumaKeyDefinition,
	chromaKeyDefinition,
	dropShadowDefinition,
	bevelAlphaDefinition,
];
