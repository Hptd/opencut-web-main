import type {
	TimelineTrack,
	TrackType,
	VideoTrack,
	AudioTrack,
	GraphicTrack,
	TextTrack,
	EffectTrack,
} from "@/timeline";

const AUDIO_CAPABLE_TRACK_TYPES: ReadonlySet<TrackType> = new Set([
	"audio",
	"video",
]);

const HIDDEN_CAPABLE_TRACK_TYPES: ReadonlySet<TrackType> = new Set([
	"video",
	"text",
	"graphic",
	"effect",
]);

export function canTrackHaveAudio(
	track: TimelineTrack,
): track is VideoTrack | AudioTrack {
	return AUDIO_CAPABLE_TRACK_TYPES.has(track.type);
}

export function canTrackBeHidden(
	track: TimelineTrack,
): track is VideoTrack | TextTrack | GraphicTrack | EffectTrack {
	return HIDDEN_CAPABLE_TRACK_TYPES.has(track.type);
}
