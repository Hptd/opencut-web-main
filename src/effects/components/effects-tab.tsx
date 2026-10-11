"use client";

import { useState } from "react";
import type { ParamDefinition, ParamValue, ParamValues } from "@/params";
import type { Effect } from "@/effects/types";
import type { EffectElement, VisualElement } from "@/timeline";
import { effectsRegistry } from "@/effects";
import { useEditor } from "@/editor/use-editor";
import { useElementPreview } from "@/timeline/hooks/use-element-preview";
import { useElementPlayhead } from "@/components/editor/panels/properties/hooks/use-element-playhead";
import { useKeyframedParamProperty } from "@/components/editor/panels/properties/hooks/use-keyframed-param-property";
import {
	buildEffectParamPath,
	resolveAnimationPathValueAtTime,
} from "@/animation";
import {
	Section,
	SectionContent,
	SectionHeader,
	SectionTitle,
	SectionFields,
} from "@/components/section";
import { PropertyParamField } from "@/components/editor/panels/properties/components/property-param-field";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "@/i18n";
import {
	Delete02Icon,
	ViewIcon,
	ViewOffSlashIcon,
	MagicWand05Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/utils/ui";
import { Separator } from "@/components/ui/separator";
import { useAssetsPanelStore } from "@/components/editor/panels/assets/assets-panel-store";

export function StandaloneEffectTab({
	element,
	trackId,
}: {
	element: EffectElement;
	trackId: string;
}) {
	const { t } = useTranslation();
	const { renderElement } = useElementPreview({
		trackId,
		elementId: element.id,
		fallback: element,
	});

	const liveElement = renderElement as EffectElement;
	const effect: Effect = {
		id: element.id,
		type: element.effectType,
		params: liveElement.params,
		enabled: true,
	};

	return (
		<div className="flex flex-col h-full">
			<div className="border-b px-3.5 h-11 shrink-0 flex items-center">
				<SectionTitle>{t("Effect")}</SectionTitle>
			</div>
			<EffectSection
				effect={effect}
				element={liveElement}
				trackId={trackId}
				renderParams={liveElement.params}
				enableKeyframes
			/>
		</div>
	);
}

export function ClipEffectsTab({
	element,
	trackId,
}: {
	element: VisualElement;
	trackId: string;
}) {
	const { t } = useTranslation();
	const [dragIndex, setDragIndex] = useState<number | null>(null);
	const [dropIndex, setDropIndex] = useState<number | null>(null);
	const [isExternalDropTarget, setIsExternalDropTarget] = useState(false);
	const editor = useEditor();
	const { renderElement } = useElementPreview({
		trackId,
		elementId: element.id,
		fallback: element,
	});

	const liveElement = renderElement as VisualElement;
	const effects: Effect[] = liveElement.effects ?? [];

	const getRenderParams = ({ effectId }: { effectId: string }): ParamValues => {
		return (
			liveElement.effects?.find((ef) => ef.id === effectId)?.params ?? {}
		);
	};

	const handleDragStart = ({ index }: { index: number }) => setDragIndex(index);

	const handleDragOver = ({
		event,
		index,
	}: {
		event: React.DragEvent;
		index: number;
	}) => {
		event.preventDefault();
		if (index !== dropIndex) setDropIndex(index);
	};

	const handleDrop = ({ toIndex }: { toIndex: number }) => {
		if (dragIndex !== null && dragIndex !== toIndex) {
			editor.timeline.reorderClipEffects({
				trackId,
				elementId: element.id,
				fromIndex: dragIndex,
				toIndex,
			});
		}
		setDragIndex(null);
		setDropIndex(null);
	};

	const handleDragEnd = () => {
		setDragIndex(null);
		setDropIndex(null);
	};

	// Accept effects dragged in from the Assets panel's Effects/Adjustment tabs.
	const readDraggedEffect = (): string | null => {
		const dragData = editor.timeline.dragSource.getActive();
		if (!dragData || dragData.type !== "effect") return null;
		if (!dragData.targetElementTypes.includes(element.type)) return null;
		return dragData.effectType;
	};

	const handleExternalDragOver = (event: React.DragEvent) => {
		if (!readDraggedEffect()) return;
		event.preventDefault();
		event.dataTransfer.dropEffect = "copy";
		if (!isExternalDropTarget) setIsExternalDropTarget(true);
	};

	const handleExternalDragLeave = (event: React.DragEvent) => {
		if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
			return;
		}
		setIsExternalDropTarget(false);
	};

	const handleExternalDrop = (event: React.DragEvent) => {
		const effectType = readDraggedEffect();
		setIsExternalDropTarget(false);
		if (!effectType) return;
		event.preventDefault();
		editor.timeline.addClipEffect({
			trackId,
			elementId: element.id,
			effectType,
		});
	};

	return (
		<div
			className={cn(
				"flex flex-col h-full",
				isExternalDropTarget && "ring-primary ring-2 ring-inset rounded-sm",
			)}
			onDragOver={handleExternalDragOver}
			onDragLeave={handleExternalDragLeave}
			onDrop={handleExternalDrop}
		>
			<div className="border-b px-3.5 h-11 shrink-0 flex items-center">
				<SectionTitle>{t("Effects")}</SectionTitle>
			</div>
			{effects.length === 0 ? (
				<EmptyView />
			) : (
				<ul className="flex flex-col">
					{effects.map((effect, index) => {
						const resolvedDragIndex = dragIndex ?? -1;
						const isDragging = dragIndex === index;
						const isDropTarget =
							dropIndex === index && dragIndex !== null && dragIndex !== index;
						const showTopDropIndicator =
							isDropTarget && index < resolvedDragIndex;
						const showBottomDropIndicator =
							isDropTarget && index > resolvedDragIndex;

						return (
							<li
								key={effect.id}
								draggable
								onDragStart={() => handleDragStart({ index })}
								onDragOver={(event) => handleDragOver({ event, index })}
								onDrop={() => handleDrop({ toIndex: index })}
								onDragEnd={handleDragEnd}
								className={cn(
									"group list-none",
									isDragging && "opacity-40",
									showTopDropIndicator && "border-t-2 border-primary",
									showBottomDropIndicator && "border-b-2 border-primary",
								)}
							>
								<EffectSection
									effect={effect}
									element={liveElement}
									trackId={trackId}
									renderParams={getRenderParams({ effectId: effect.id })}
									enableKeyframes
									onToggle={() =>
										editor.timeline.toggleClipEffect({
											trackId,
											elementId: element.id,
											effectId: effect.id,
										})
									}
									onRemove={() =>
										editor.timeline.removeClipEffect({
											trackId,
											elementId: element.id,
											effectId: effect.id,
										})
									}
								/>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}

function EmptyView() {
	const setActiveTab = useAssetsPanelStore((s) => s.setActiveTab);
	const { t } = useTranslation();

	return (
		<div className="flex flex-col h-full items-center justify-center gap-4 text-center">
			<HugeiconsIcon
				icon={MagicWand05Icon}
				className="size-10 text-muted-foreground"
				strokeWidth={1}
			/>
			<div className="flex flex-col gap-2">
				<h3 className="font-medium text-foreground">{t("No effects")}</h3>
				<p className="text-muted-foreground text-sm text-balance max-w-44">
					{t("Add effects to this layer from the Assets panel.")}
				</p>
			</div>
			<Button
				variant="default"
				size="sm"
				onClick={() => setActiveTab("effects")}
			>
				{t("Open effects")}
			</Button>
		</div>
	);
}

function EffectSection({
	effect,
	element,
	trackId,
	renderParams,
	enableKeyframes,
	onToggle,
	onRemove,
}: {
	effect: Effect;
	element: VisualElement | EffectElement;
	trackId: string;
	renderParams: ParamValues;
	enableKeyframes: boolean;
	onToggle?: () => void;
	onRemove?: () => void;
}) {
	const definition = effectsRegistry.get(effect.type);
	const { t } = useTranslation();

	return (
		<Section
			sectionKey={onToggle ? `clip-effect:${effect.id}` : undefined}
			showTopBorder={false}
		>
			<SectionHeader
				className={cn(onToggle && "cursor-move")}
				trailing={
					onToggle && (
						<div className="flex items-center gap-1">
							<Button
								variant={effect.enabled ? "secondary" : "ghost"}
								size="icon"
								aria-label={t("Toggle {name}", { name: definition.name })}
								onClick={onToggle}
							>
								<HugeiconsIcon
									icon={effect.enabled ? ViewIcon : ViewOffSlashIcon}
								/>
							</Button>
							<Button
								variant="ghost"
								size="icon"
								aria-label={t("Remove {name}", { name: definition.name })}
								onClick={onRemove}
							>
								<HugeiconsIcon icon={Delete02Icon} />
							</Button>
						</div>
					)
				}
			>
				<SectionTitle
					className={cn(onToggle && !effect.enabled && "text-muted-foreground")}
				>
					{t(definition.name)}
				</SectionTitle>
			</SectionHeader>
			<SectionContent
				className={cn("p-0", onToggle && !effect.enabled && "opacity-50")}
			>
				<SectionFields>
					{definition.params.map((param) => (
						<EffectParamField
							key={param.key}
							effect={effect}
							element={element}
							trackId={trackId}
							param={param}
							fallbackValue={renderParams[param.key] ?? param.default}
							enableKeyframes={enableKeyframes}
						/>
					))}
				</SectionFields>
			</SectionContent>
		</Section>
	);
}

function EffectParamField({
	effect,
	element,
	trackId,
	param,
	fallbackValue,
	enableKeyframes,
}: {
	effect: Effect;
	element: VisualElement | EffectElement;
	trackId: string;
	param: ParamDefinition;
	fallbackValue: ParamValue;
	enableKeyframes: boolean;
}) {
	const { localTime, isPlayheadWithinElementRange } = useElementPlayhead({
		startTime: element.startTime,
		duration: element.duration,
	});

	const propertyPath = buildEffectParamPath({
		effectId: effect.id,
		paramKey: param.key,
	});

	const resolvedValue = enableKeyframes
		? resolveAnimationPathValueAtTime({
				animations: element.animations,
				propertyPath,
				localTime,
				fallbackValue,
			})
		: fallbackValue;

	const animatedParam = useKeyframedParamProperty({
		param,
		trackId,
		elementId: element.id,
		animations: element.animations,
		propertyPath,
		localTime,
		isPlayheadWithinElementRange,
		resolvedValue,
		buildBaseUpdates: ({ value }) =>
			element.type === "effect"
				? { params: { ...element.params, [param.key]: value } }
				: {
						effects: (element.effects ?? []).map((candidate) =>
							candidate.id !== effect.id
								? candidate
								: {
										...candidate,
										params: { ...candidate.params, [param.key]: value },
									},
						),
					},
	});

	return (
		<div className="flex flex-col gap-3.5">
			<div className="px-4">
				<PropertyParamField
					param={param}
					value={resolvedValue}
					onPreview={animatedParam.onPreview}
					onCommit={animatedParam.onCommit}
					keyframe={
						enableKeyframes && param.keyframable !== false
							? {
									isActive: animatedParam.isKeyframedAtTime,
									isDisabled: !isPlayheadWithinElementRange,
									onToggle: animatedParam.toggleKeyframe,
								}
							: undefined
					}
				/>
			</div>
			<Separator />
		</div>
	);
}
