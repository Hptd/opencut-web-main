"use client";

import { useState, useEffect } from "react";
import { useEditor } from "@/editor/use-editor";
import { formatTimecode } from "opencut-wasm";
import { invokeAction } from "@/actions";
import { EditableTimecode } from "@/components/editable-timecode";
import { Button } from "@/components/ui/button";
import {
	ArrowLeftDoubleIcon,
	ArrowRightDoubleIcon,
	Bookmark01Icon,
	Bookmark02Icon,
	FullScreenIcon,
	NextIcon,
	PauseIcon,
	PlayIcon,
	PreviousIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Separator } from "@/components/ui/separator";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectSeparator,
} from "@/components/ui/select";
import { PREVIEW_ZOOM_PRESETS } from "@/preview/zoom";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "@/i18n";
import { getElementBookmarkAbsoluteTime } from "@/timeline/bookmarks/element-utils";
import { usePreviewViewport } from "./preview-viewport";
import { GridPopover } from "./guide-popover";
import { usePreviewStore } from "@/preview/preview-store";
import type { MediaTime } from "@/wasm";

export function PreviewToolbar({
	onToggleFullscreen,
}: {
	onToggleFullscreen: () => void;
}) {
	return (
		<div className="grid grid-cols-[1fr_auto_1fr] items-center pb-3 pt-5 px-5">
			<TimecodeDisplay />
			<TransportControls />
			<div className="justify-self-end flex items-center gap-2.5">
				<ZoomSelect />
				<Separator orientation="vertical" className="h-4" />
				{/* v0.4.0 */}
				{/* <GridPopover>
					<Button
						variant={activeGuideDefinition ? "secondary" : "text"}
						size="icon"
					>
						{activeGuideDefinition ? (
							activeGuideDefinition.renderTriggerIcon()
						) : (
							<HugeiconsIcon icon={GridTableIcon} />
						)}
					</Button>
				</GridPopover> */}
				<Button variant="text" onClick={onToggleFullscreen}>
					<HugeiconsIcon icon={FullScreenIcon} />
				</Button>
			</div>
		</div>
	);
}

function TimecodeDisplay() {
	const editor = useEditor();
	const totalDuration = useEditor((e) => e.timeline.getTotalDuration());
	const fps = useEditor((e) => e.project.getActive().settings.fps);
	const [currentTime, setCurrentTime] = useState<MediaTime>(() =>
		editor.playback.getCurrentTime(),
	);

	useEffect(() => {
		const unsubscribeUpdate = editor.playback.onUpdate(setCurrentTime);
		const unsubscribeSeek = editor.playback.onSeek(setCurrentTime);
		return () => {
			unsubscribeUpdate();
			unsubscribeSeek();
		};
	}, [editor.playback]);

	return (
		<div className="flex items-center">
			<EditableTimecode
				time={currentTime}
				duration={totalDuration}
				format="HH:MM:SS:FF"
				fps={fps}
				onTimeChange={({ time }) => editor.playback.seek({ time })}
				className="text-center"
			/>
			<span className="text-muted-foreground px-2 font-mono text-xs">/</span>
			<span className="text-muted-foreground font-mono text-xs">
				{formatTimecode({
					time: totalDuration,
					format: "HH:MM:SS:FF",
					rate: fps,
				})}
			</span>
		</div>
	);
}

function ZoomSelect() {
	const { isAtFit, zoomPercent, fitToScreen, setViewportPercent } =
		usePreviewViewport();

	const displayLabel = isAtFit ? "Fit" : `${zoomPercent}%`;

	const onValueChange = (value: string) => {
		if (value === "fit") {
			fitToScreen();
		} else {
			setViewportPercent({ percent: Number(value) });
		}
	};

	return (
		<Select
			value={isAtFit ? "fit" : String(zoomPercent)}
			onValueChange={onValueChange}
		>
			<SelectTrigger className="tabular-nums">{displayLabel}</SelectTrigger>
			<SelectContent>
				<SelectItem value="fit">Fit</SelectItem>
				<SelectSeparator />
				{PREVIEW_ZOOM_PRESETS.map((preset) => (
					<SelectItem key={preset} value={String(preset)}>
						{preset}%
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

function TransportControls() {
	const editor = useEditor();
	const { t } = useTranslation();

	const seekToAdjacentBookmark = ({
		direction,
	}: {
		direction: "previous" | "next";
	}) => {
		const scene = editor.scenes.getActiveScene();
		const currentTime = editor.playback.getCurrentTime();

		const bookmarkTimes = new Set<MediaTime>();
		for (const bookmark of scene.bookmarks) {
			bookmarkTimes.add(bookmark.time);
		}
		for (const track of [
			...scene.tracks.overlay,
			scene.tracks.main,
			...scene.tracks.audio,
		]) {
			for (const element of track.elements) {
				for (const bookmark of element.bookmarks ?? []) {
					bookmarkTimes.add(
						getElementBookmarkAbsoluteTime({ element, bookmark }),
					);
				}
			}
		}

		const sortedTimes = [...bookmarkTimes].sort((a, b) => a - b);
		const target =
			direction === "previous"
				? [...sortedTimes].reverse().find((time) => time < currentTime)
				: sortedTimes.find((time) => time > currentTime);
		if (target === undefined) return;
		editor.playback.seek({ time: target });
	};

	return (
		<div className="flex items-center gap-1">
			<TransportButton
				icon={PreviousIcon}
				label={t("Go to start")}
				onClick={() => invokeAction("goto-start")}
			/>
			<TransportButton
				icon={Bookmark01Icon}
				label={t("Previous bookmark")}
				onClick={() => seekToAdjacentBookmark({ direction: "previous" })}
			/>
			<TransportButton
				icon={ArrowLeftDoubleIcon}
				label={t("Previous frame")}
				onClick={() => invokeAction("frame-step-backward")}
			/>
			<PlayPauseButton />
			<TransportButton
				icon={ArrowRightDoubleIcon}
				label={t("Next frame")}
				onClick={() => invokeAction("frame-step-forward")}
			/>
			<TransportButton
				icon={Bookmark02Icon}
				label={t("Next bookmark")}
				onClick={() => seekToAdjacentBookmark({ direction: "next" })}
			/>
			<TransportButton
				icon={NextIcon}
				label={t("Go to end")}
				onClick={() => invokeAction("goto-end")}
			/>
		</div>
	);
}

function TransportButton({
	icon,
	label,
	onClick,
}: {
	icon: IconSvgElement;
	label: string;
	onClick: () => void;
}) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button variant="text" size="icon" aria-label={label} onClick={onClick}>
					<HugeiconsIcon icon={icon} />
				</Button>
			</TooltipTrigger>
			<TooltipContent>{label}</TooltipContent>
		</Tooltip>
	);
}

function PlayPauseButton() {
	const isPlaying = useEditor((e) => e.playback.getIsPlaying());

	return (
		<Button
			variant="text"
			size="icon"
			onClick={() => invokeAction("toggle-play")}
		>
			<HugeiconsIcon icon={isPlaying ? PauseIcon : PlayIcon} />
		</Button>
	);
}
