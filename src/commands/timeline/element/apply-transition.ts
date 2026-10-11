import { Command, type CommandResult } from "@/commands/base-command";
import { EditorCore } from "@/core";
import { isVisualElement, updateElementInSceneTracks } from "@/timeline";
import type { SceneTracks } from "@/timeline";
import { resolveAnimationTarget } from "@/timeline/animation-targets";
import { upsertPathKeyframe } from "@/animation";
import { getTransitionDefinition } from "@/transitions";
import {
	type MediaTime,
	maxMediaTime,
	minMediaTime,
	roundMediaTime,
	ZERO_MEDIA_TIME,
} from "@/wasm";

export class ApplyTransitionCommand extends Command {
	private savedState: SceneTracks | null = null;
	private readonly trackId: string;
	private readonly elementId: string;
	private readonly transitionType: string;
	private readonly durationTicks: MediaTime;

	constructor({
		trackId,
		elementId,
		transitionType,
		durationTicks,
	}: {
		trackId: string;
		elementId: string;
		transitionType: string;
		durationTicks: MediaTime;
	}) {
		super();
		this.trackId = trackId;
		this.elementId = elementId;
		this.transitionType = transitionType;
		this.durationTicks = durationTicks;
	}

	execute(): CommandResult | undefined {
		const editor = EditorCore.getInstance();
		this.savedState = editor.scenes.getActiveScene().tracks;

		const definition = getTransitionDefinition(this.transitionType);

		const updatedTracks = updateElementInSceneTracks({
			tracks: this.savedState,
			trackId: this.trackId,
			elementId: this.elementId,
			elementPredicate: isVisualElement,
			update: (element) => {
				const writes = definition.buildKeyframes({
					element,
					durationTicks: this.durationTicks,
				});

				let animations = element.animations;
				for (const write of writes) {
					const target = resolveAnimationTarget({
						element,
						path: write.propertyPath,
					});
					if (!target) {
						continue;
					}

					const boundedTime = maxMediaTime({
						a: ZERO_MEDIA_TIME,
						b: minMediaTime({
							a: roundMediaTime({ time: write.time }),
							b: element.duration,
						}),
					});

					animations = upsertPathKeyframe({
						animations,
						propertyPath: write.propertyPath,
						time: boundedTime,
						value: write.value,
						channelLayout: target.channelLayout,
						coerceValue: target.coerceValue,
					});
				}

				return { ...element, animations };
			},
		});

		editor.timeline.updateTracks(updatedTracks);
		return undefined;
	}

	undo(): void {
		if (!this.savedState) {
			return;
		}

		const editor = EditorCore.getInstance();
		editor.timeline.updateTracks(this.savedState);
	}
}
