"use client";

import { useState } from "react";
import { PanelView } from "@/components/editor/panels/assets/views/base-panel";
import { getAllTransitions } from "@/transitions";
import { useEditor } from "@/editor/use-editor";
import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { mediaTimeFromSeconds, ZERO_MEDIA_TIME } from "@/wasm";
import { cn } from "@/utils/ui";

const DURATION_OPTIONS = [0.3, 0.5, 1] as const;

export function TransitionsView() {
	const editor = useEditor();
	const { t } = useTranslation();
	const [durationSeconds, setDurationSeconds] = useState<number>(0.5);
	const transitions = getAllTransitions();

	const handleApply = ({ type }: { type: string }) => {
		const selected = editor.selection.getSelectedElements();
		if (selected.length !== 1) {
			toast.error(t("Select a single clip to apply a transition."));
			return;
		}

		const { trackId, elementId } = selected[0];
		const durationTicks =
			mediaTimeFromSeconds({ seconds: durationSeconds }) ?? ZERO_MEDIA_TIME;

		editor.timeline.applyTransition({
			trackId,
			elementId,
			transitionType: type,
			durationTicks,
		});
	};

	return (
		<PanelView title={t("Transitions")}>
			<div className="flex flex-col gap-3 p-1">
				<div className="flex items-center gap-1.5">
					<span className="text-muted-foreground text-xs">{t("Duration")}</span>
					{DURATION_OPTIONS.map((option) => (
						<Button
							key={option}
							size="sm"
							variant={option === durationSeconds ? "secondary" : "ghost"}
							className="h-6 px-2 text-xs"
							onClick={() => setDurationSeconds(option)}
						>
							{option}s
						</Button>
					))}
				</div>

				<div
					className="grid gap-2"
					style={{ gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))" }}
				>
					{transitions.map((transition) => (
						<button
							key={transition.type}
							type="button"
							onClick={() => handleApply({ type: transition.type })}
							className={cn(
								"flex aspect-square flex-col items-center justify-center gap-1",
								"rounded-sm border bg-muted/30 p-2 text-center text-xs",
								"hover:bg-accent",
							)}
						>
							<span className="font-medium">{t(transition.name)}</span>
						</button>
					))}
				</div>

				<p className="text-muted-foreground px-1 text-xs">
					{t("Select a clip, then click a transition to animate its entrance.")}
				</p>
			</div>
		</PanelView>
	);
}
