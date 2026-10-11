import type { ElementAnimations } from "@/animation/types";
import type { ParamValues } from "@/params";
import type { EffectPass } from "@/effects/types";
import { BaseNode } from "./base-node";

export type EffectLayerNodeParams = {
	elementId: string;
	effectType: string;
	effectParams: ParamValues;
	animations?: ElementAnimations;
	timeOffset: number;
	duration: number;
};

export type ResolvedEffectLayerNodeState = {
	passes: EffectPass[];
};

export class EffectLayerNode extends BaseNode<
	EffectLayerNodeParams,
	ResolvedEffectLayerNodeState
> {}
