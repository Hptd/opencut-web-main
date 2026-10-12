import type { EditorCore } from "@/core";
import type { MediaTime } from "@/wasm";
import { getElementBookmarkAbsoluteTime } from "./element-utils";

/**
 * Seeks to the nearest bookmark (global or element-attached) before/after the
 * current playhead. Element labels are projected to absolute time from their
 * owning element's start.
 */
export function seekToAdjacentBookmark({
	editor,
	direction,
}: {
	editor: EditorCore;
	direction: "previous" | "next";
}): void {
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
}
