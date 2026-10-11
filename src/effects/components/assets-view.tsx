"use client";

import { useEffect, useRef, useCallback } from "react";
import { PanelView } from "@/components/editor/panels/assets/views/base-panel";
import { DraggableItem } from "@/components/editor/panels/assets/draggable-item";
import { effectsRegistry, EFFECT_TARGET_ELEMENT_TYPES } from "@/effects";
import { effectPreviewService } from "@/services/renderer/effect-preview";
import { useEditor } from "@/editor/use-editor";
import { useTranslation } from "@/i18n";
import { buildEffectElement } from "@/timeline/element-utils";
import type { EffectDefinition } from "@/effects/types";
import {
	DEFAULT_EFFECT_CATEGORY,
	EFFECT_CATEGORY_LABELS,
	EFFECT_CATEGORY_ORDER,
} from "@/effects/categories";

const ADJUSTMENT_TYPE_PREFIX = "adjust-";

function isAdjustmentEffect(effect: EffectDefinition): boolean {
	return effect.type.startsWith(ADJUSTMENT_TYPE_PREFIX);
}

function EffectListView({
	title,
	effects,
	emptyLabel,
	grouped = false,
}: {
	title: string;
	effects: EffectDefinition[];
	emptyLabel: string;
	grouped?: boolean;
}) {
	const { t } = useTranslation();

	return (
		<PanelView title={t(title)}>
			{effects.length === 0 ? (
				<div className="text-muted-foreground p-4 text-sm">{t(emptyLabel)}</div>
			) : grouped ? (
				<GroupedEffects effects={effects} />
			) : (
				<EffectsGrid effects={effects} />
			)}
		</PanelView>
	);
}

export function EffectsView() {
	const effects = effectsRegistry
		.getAll()
		.filter((effect) => !isAdjustmentEffect(effect));

	return (
		<EffectListView
			title="Effects"
			effects={effects}
			emptyLabel="No effects available yet."
			grouped
		/>
	);
}

export function AdjustmentsView() {
	const effects = effectsRegistry
		.getAll()
		.filter((effect) => isAdjustmentEffect(effect));

	return (
		<EffectListView
			title="Adjustment"
			effects={effects}
			emptyLabel="No adjustments available yet."
			grouped
		/>
	);
}

function GroupedEffects({ effects }: { effects: EffectDefinition[] }) {
	const { t } = useTranslation();
	const presentCategories = Array.from(
		new Set(effects.map((effect) => effect.category ?? DEFAULT_EFFECT_CATEGORY)),
	);
	const ordered = [
		...EFFECT_CATEGORY_ORDER.filter((category) =>
			presentCategories.includes(category),
		),
		...presentCategories.filter(
			(category) =>
				!EFFECT_CATEGORY_ORDER.includes(
					category as (typeof EFFECT_CATEGORY_ORDER)[number],
				),
		),
	];

	return (
		<div className="flex flex-col gap-4">
			{ordered.map((category) => {
				const items = effects.filter(
					(effect) => (effect.category ?? DEFAULT_EFFECT_CATEGORY) === category,
				);
				if (items.length === 0) return null;
				const label = EFFECT_CATEGORY_LABELS[category] ?? category;
				return (
					<div key={category} className="flex flex-col gap-2">
						<h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
							{t(label)}
						</h4>
						<EffectsGrid effects={items} />
					</div>
				);
			})}
		</div>
	);
}

function EffectsGrid({ effects }: { effects: EffectDefinition[] }) {
	return (
		<div
			className="grid gap-2"
			style={{ gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))" }}
		>
			{effects.map((effect) => (
				<EffectItem key={effect.type} effect={effect} />
			))}
		</div>
	);
}

function EffectPreviewCanvas({ effectType }: { effectType: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const render = () => {
			if (canvasRef.current) {
				effectPreviewService.renderPreview({
					effectType,
					params: {},
					targetCanvas: canvasRef.current,
				});
			}
		};

		render();
		return effectPreviewService.onPreviewImageReady({ callback: render });
	}, [effectType]);

	return <canvas ref={canvasRef} className="size-full" />;
}

function EffectItem({ effect }: { effect: EffectDefinition }) {
	const editor = useEditor();
	const { t } = useTranslation();

	const handleAddToTimeline = useCallback(() => {
		const currentTime = editor.playback.getCurrentTime();
		const element = buildEffectElement({
			effectType: effect.type,
			startTime: currentTime,
		});

		editor.timeline.insertElement({
			placement: { mode: "auto", trackType: "effect" },
			element,
		});
	}, [editor, effect.type]);

	const preview = <EffectPreviewCanvas effectType={effect.type} />;

	return (
		<DraggableItem
			name={t(effect.name)}
			preview={preview}
			dragData={{
				id: effect.type,
				name: effect.name,
				type: "effect",
				effectType: effect.type,
				targetElementTypes: EFFECT_TARGET_ELEMENT_TYPES,
			}}
			onAddToTimeline={handleAddToTimeline}
			aspectRatio={1}
			isRounded
			variant="card"
			containerClassName="w-full"
		/>
	);
}
