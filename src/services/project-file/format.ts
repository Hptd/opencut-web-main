import type { MediaAsset } from "@/media/types";
import type { TProject } from "@/project/types";
import { storageService } from "@/services/storage/service";
import type { ZipAsset } from "./io";
import {
	PROJECT_ASSETS_PREFIX,
	PROJECT_FILE_FORMAT,
	PROJECT_FILE_VERSION,
	type ProjectFileAsset,
	type ProjectFileManifest,
} from "./types";

export function buildProjectManifest({
	project,
	assets,
}: {
	project: TProject;
	assets: MediaAsset[];
}): { manifest: ProjectFileManifest; zipAssets: ZipAsset[] } {
	const manifestAssets: ProjectFileAsset[] = [];
	const zipAssets: ZipAsset[] = [];

	for (const asset of assets) {
		const entryPath = `${PROJECT_ASSETS_PREFIX}${asset.id}`;
		manifestAssets.push({
			id: asset.id,
			name: asset.name,
			type: asset.type,
			mimeType: asset.file.type || undefined,
			size: asset.file.size,
			lastModified: asset.file.lastModified,
			width: asset.width,
			height: asset.height,
			duration: asset.duration,
			thumbnailUrl: asset.thumbnailUrl,
			entryPath,
		});
		zipAssets.push({ entryPath, file: asset.file });
	}

	const manifest: ProjectFileManifest = {
		format: PROJECT_FILE_FORMAT,
		fileVersion: PROJECT_FILE_VERSION,
		app: "OpenCut",
		project: storageService.serializeProject({ project }),
		assets: manifestAssets,
	};

	return { manifest, zipAssets };
}

/** Rebuilds an in-memory `MediaAsset` from a manifest entry + extracted blob. */
export function buildMediaAsset({
	meta,
	blob,
}: {
	meta: ProjectFileAsset;
	blob: Blob;
}): MediaAsset {
	const file =
		typeof File !== "undefined" && blob instanceof File
			? blob
			: new File([blob], meta.name, {
					type: meta.mimeType ?? blob.type ?? "",
					lastModified: meta.lastModified,
				});

	return {
		id: meta.id,
		name: meta.name,
		type: meta.type,
		file,
		width: meta.width,
		height: meta.height,
		duration: meta.duration,
		thumbnailUrl: meta.thumbnailUrl,
	};
}
