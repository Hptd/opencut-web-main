import type { ElementBookmark, TimelineElement } from "@/timeline/types";
import { generateUUID } from "@/utils/id";
import {
	addMediaTime,
	type MediaTime,
	roundMediaTime,
	subMediaTime,
} from "@/wasm";

export function getElementBookmarkAbsoluteTime({
	element,
	bookmark,
}: {
	element: TimelineElement;
	bookmark: ElementBookmark;
}): MediaTime {
	return addMediaTime({ a: element.startTime, b: bookmark.time });
}

export function isElementBookmarkAtTime({
	bookmarks,
	relativeTime,
}: {
	bookmarks: ElementBookmark[] | undefined;
	relativeTime: MediaTime;
}): boolean {
	return (bookmarks ?? []).some((bookmark) => bookmark.time === relativeTime);
}

export function toggleElementBookmarkInArray({
	bookmarks,
	relativeTime,
}: {
	bookmarks: ElementBookmark[] | undefined;
	relativeTime: MediaTime;
}): ElementBookmark[] {
	const current = bookmarks ?? [];

	if (current.some((bookmark) => bookmark.time === relativeTime)) {
		return current.filter((bookmark) => bookmark.time !== relativeTime);
	}

	return [
		...current,
		{ id: generateUUID(), time: relativeTime },
	].sort((a, b) => a.time - b.time);
}

export function clampElementBookmarksToDuration({
	bookmarks,
	duration,
}: {
	bookmarks: ElementBookmark[] | undefined;
	duration: MediaTime;
}): ElementBookmark[] | undefined {
	if (!bookmarks || bookmarks.length === 0) {
		return bookmarks;
	}

	const clamped = bookmarks.filter((bookmark) => bookmark.time <= duration);
	if (clamped.length === bookmarks.length) {
		return bookmarks;
	}
	return clamped;
}

/**
 * Splits element bookmarks at a relative time. A bookmark exactly on the
 * boundary stays on the left half only, so the two halves never share a
 * bookmark (dedupe on overlap).
 */
export function splitElementBookmarksAtTime({
	bookmarks,
	splitTime,
}: {
	bookmarks: ElementBookmark[] | undefined;
	splitTime: MediaTime;
}): {
	leftBookmarks: ElementBookmark[] | undefined;
	rightBookmarks: ElementBookmark[] | undefined;
} {
	if (!bookmarks || bookmarks.length === 0) {
		return { leftBookmarks: bookmarks, rightBookmarks: undefined };
	}

	const leftBookmarks: ElementBookmark[] = [];
	const rightBookmarks: ElementBookmark[] = [];

	for (const bookmark of bookmarks) {
		if (bookmark.time < splitTime) {
			leftBookmarks.push(bookmark);
			continue;
		}
		if (bookmark.time > splitTime) {
			rightBookmarks.push({
				...bookmark,
				id: generateUUID(),
				time: roundMediaTime({
					time: subMediaTime({ a: bookmark.time, b: splitTime }),
				}),
			});
			continue;
		}
		leftBookmarks.push(bookmark);
	}

	return {
		leftBookmarks: leftBookmarks.length > 0 ? leftBookmarks : undefined,
		rightBookmarks: rightBookmarks.length > 0 ? rightBookmarks : undefined,
	};
}

export function cloneElementBookmarks({
	bookmarks,
	shouldRegenerateIds,
}: {
	bookmarks: ElementBookmark[] | undefined;
	shouldRegenerateIds: boolean;
}): ElementBookmark[] | undefined {
	if (!bookmarks) {
		return undefined;
	}

	return bookmarks.map((bookmark) =>
		shouldRegenerateIds ? { ...bookmark, id: generateUUID() } : { ...bookmark },
	);
}
