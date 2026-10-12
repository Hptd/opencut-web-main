export const MIN_BOOKMARK_WIDTH_PX = 2;
export const BOOKMARK_MARKER_WIDTH_PX = 12;
export const BOOKMARK_MARKER_HEIGHT_PX = 15;
export const BOOKMARK_HALF_WIDTH_PX = BOOKMARK_MARKER_WIDTH_PX / 2;
const BOOKMARK_MARKER_CLIP_PATH =
	"polygon(50% 100%, 12% 72%, 12% 10%, 88% 10%, 88% 72%)";

/**
 * The original timeline bookmark flag visual, positionable by either the
 * bookmarks row or inside an element block. Caller provides the positioned
 * wrapper; this only renders the marker shape (and optional duration bar).
 */
export function BookmarkMarker({
	color,
	durationWidth = 0,
}: {
	color: string;
	durationWidth?: number;
}) {
	const clampedDurationWidth = Math.max(durationWidth, 0);
	const hasDurationRange = clampedDurationWidth > MIN_BOOKMARK_WIDTH_PX;
	const rightHalfLeft = BOOKMARK_HALF_WIDTH_PX + clampedDurationWidth;

	return (
		<>
			{hasDurationRange ? (
				<div
					className="absolute opacity-30"
					style={{
						top: 1.5,
						height: BOOKMARK_MARKER_HEIGHT_PX - 2.5,
						left: BOOKMARK_HALF_WIDTH_PX,
						width: clampedDurationWidth,
						backgroundColor: color,
					}}
				/>
			) : null}
			<div
				className="absolute top-0 overflow-hidden"
				style={{
					left: 0,
					width: BOOKMARK_HALF_WIDTH_PX,
					height: BOOKMARK_MARKER_HEIGHT_PX,
				}}
			>
				<div
					className="absolute inset-0"
					style={{
						width: BOOKMARK_MARKER_WIDTH_PX,
						height: BOOKMARK_MARKER_HEIGHT_PX,
						clipPath: BOOKMARK_MARKER_CLIP_PATH,
						backgroundColor: "hsl(var(--background))",
					}}
				/>
				<div
					className="absolute"
					style={{
						top: 1,
						left: 1,
						width: BOOKMARK_MARKER_WIDTH_PX - 2,
						height: BOOKMARK_MARKER_HEIGHT_PX - 2,
						clipPath: BOOKMARK_MARKER_CLIP_PATH,
						backgroundColor: color,
					}}
				/>
			</div>
			<div
				className="absolute top-0 overflow-hidden"
				style={{
					left: rightHalfLeft,
					width: BOOKMARK_HALF_WIDTH_PX,
					height: BOOKMARK_MARKER_HEIGHT_PX,
				}}
			>
				<div
					className="absolute top-0"
					style={{
						left: -BOOKMARK_HALF_WIDTH_PX,
						width: BOOKMARK_MARKER_WIDTH_PX,
						height: BOOKMARK_MARKER_HEIGHT_PX,
						clipPath: BOOKMARK_MARKER_CLIP_PATH,
						backgroundColor: "hsl(var(--background))",
					}}
				/>
				<div
					className="absolute"
					style={{
						top: 1,
						left: 1 - BOOKMARK_HALF_WIDTH_PX,
						width: BOOKMARK_MARKER_WIDTH_PX - 2,
						height: BOOKMARK_MARKER_HEIGHT_PX - 2,
						clipPath: BOOKMARK_MARKER_CLIP_PATH,
						backgroundColor: color,
					}}
				/>
			</div>
		</>
	);
}
