import type { MediaType } from "@/media/types";
import type { SerializedProject } from "@/services/storage/types";

export const PROJECT_FILE_EXTENSION = ".ocut";
export const PROJECT_FILE_FORMAT = "opencut-project";
export const PROJECT_FILE_VERSION = 1;

/** Where the project manifest lives inside the zip container. */
export const PROJECT_MANIFEST_ENTRY = "project.json";

/** Folder prefix for embedded media inside the zip container. */
export const PROJECT_ASSETS_PREFIX = "assets/";

/** JSON-serializable metadata for one embedded media file. */
export interface ProjectFileAsset {
	id: string;
	name: string;
	type: MediaType;
	mimeType?: string;
	size: number;
	lastModified: number;
	width?: number;
	height?: number;
	duration?: number;
	thumbnailUrl?: string;
	/** Entry path inside the zip, e.g. `assets/<id>`. */
	entryPath: string;
}

export interface ProjectFileManifest {
	format: typeof PROJECT_FILE_FORMAT;
	fileVersion: number;
	app: string;
	project: SerializedProject;
	assets: ProjectFileAsset[];
}

export interface OpenProjectFileResult {
	manifest: ProjectFileManifest;
	assetFiles: Map<string, Blob>;
	fileName: string;
}
