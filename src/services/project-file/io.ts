import {
	ZipWriter,
	ZipReader,
	BlobReader,
	BlobWriter,
	TextReader,
	TextWriter,
} from "@zip.js/zip.js";
import {
	PROJECT_MANIFEST_ENTRY,
	PROJECT_FILE_FORMAT,
	type OpenProjectFileResult,
	type ProjectFileManifest,
} from "./types";

type SaveFilePicker = (options?: {
	suggestedName?: string;
	types?: Array<{ description?: string; accept: Record<string, string[]> }>;
	excludeAcceptAllOption?: boolean;
}) => Promise<FileSystemFileHandle>;

type OpenFilePicker = (options?: {
	types?: Array<{ description?: string; accept: Record<string, string[]> }>;
	multiple?: boolean;
	excludeAcceptAllOption?: boolean;
}) => Promise<FileSystemFileHandle[]>;

type PermissionCapableHandle = FileSystemFileHandle & {
	queryPermission?: (descriptor: {
		mode: "read" | "readwrite";
	}) => Promise<PermissionState>;
	requestPermission?: (descriptor: {
		mode: "read" | "readwrite";
	}) => Promise<PermissionState>;
};

const PROJECT_ACCEPT = {
	description: "OpenCut project",
	accept: { "application/zip": [".ocut"] },
};

function pickerWindow(): {
	showSaveFilePicker?: SaveFilePicker;
	showOpenFilePicker?: OpenFilePicker;
} {
	if (typeof window === "undefined") return {};
	return window as unknown as {
		showSaveFilePicker?: SaveFilePicker;
		showOpenFilePicker?: OpenFilePicker;
	};
}

export function isFileSystemAccessSupported(): boolean {
	const w = pickerWindow();
	return (
		typeof w.showSaveFilePicker === "function" &&
		typeof w.showOpenFilePicker === "function"
	);
}

function isAbortError(error: unknown): boolean {
	return (
		error instanceof DOMException &&
		(error.name === "AbortError" || error.name === "NotAllowedError")
	);
}

export async function pickSaveHandle({
	suggestedName,
}: {
	suggestedName: string;
}): Promise<FileSystemFileHandle | null> {
	const w = pickerWindow();
	if (!w.showSaveFilePicker) return null;
	try {
		return await w.showSaveFilePicker({
			suggestedName,
			types: [PROJECT_ACCEPT],
		});
	} catch (error) {
		if (isAbortError(error)) return null;
		throw error;
	}
}

export async function pickOpenHandle(): Promise<FileSystemFileHandle | null> {
	const w = pickerWindow();
	if (!w.showOpenFilePicker) return null;
	try {
		const [handle] = await w.showOpenFilePicker({
			types: [PROJECT_ACCEPT],
			multiple: false,
		});
		return handle ?? null;
	} catch (error) {
		if (isAbortError(error)) return null;
		throw error;
	}
}

/**
 * Verifies (and, if needed, requests) read/write permission for a handle.
 * Must be called from a user gesture for the request to be allowed.
 */
export async function ensureReadWritePermission({
	handle,
}: {
	handle: FileSystemFileHandle;
}): Promise<boolean> {
	const capable = handle as PermissionCapableHandle;
	if (!capable.queryPermission) {
		// Browsers without the permission API: assume the picker grant holds.
		return true;
	}

	const query = await capable.queryPermission({ mode: "readwrite" });
	if (query === "granted") return true;
	if (!capable.requestPermission) return false;

	const request = await capable.requestPermission({ mode: "readwrite" });
	return request === "granted";
}

export interface ZipAsset {
	entryPath: string;
	file: File | Blob;
}

/**
 * Builds the whole `.ocut` container as a Blob. Media is stored uncompressed
 * (level 0) so already-compressed video/audio isn't re-compressed. The Blob is
 * backed by the browser (spills to disk), so large projects are not held in RAM.
 */
export async function createProjectZipBlob({
	manifest,
	assets,
}: {
	manifest: ProjectFileManifest;
	assets: ZipAsset[];
}): Promise<Blob> {
	const zipWriter = new ZipWriter(new BlobWriter("application/zip"), {
		level: 0,
		bufferedWrite: false,
		useWebWorkers: false,
	});

	await zipWriter.add(
		PROJECT_MANIFEST_ENTRY,
		new TextReader(JSON.stringify(manifest)),
	);

	for (const asset of assets) {
		await zipWriter.add(asset.entryPath, new BlobReader(asset.file), {
			level: 0,
		});
	}

	return await zipWriter.close();
}

export async function readProjectZip({
	file,
}: {
	file: File;
}): Promise<OpenProjectFileResult> {
	const reader = new ZipReader(new BlobReader(file));
	try {
		const entries = await reader.getEntries();
		const byName = new Map(entries.map((entry) => [entry.filename, entry]));

		const manifestEntry = byName.get(PROJECT_MANIFEST_ENTRY);
		if (!manifestEntry || manifestEntry.directory || !manifestEntry.getData) {
			throw new Error("Not an OpenCut project file (missing project.json)");
		}

		const manifestText = await manifestEntry.getData(new TextWriter());
		const manifest = JSON.parse(manifestText) as ProjectFileManifest;
		if (manifest.format !== PROJECT_FILE_FORMAT) {
			throw new Error("Unrecognized project file format");
		}

		const assetFiles = new Map<string, Blob>();
		for (const asset of manifest.assets ?? []) {
			const entry = byName.get(asset.entryPath);
			if (entry && !entry.directory && entry.getData) {
				assetFiles.set(asset.id, await entry.getData(new BlobWriter()));
			}
		}

		return { manifest, assetFiles, fileName: file.name };
	} finally {
		await reader.close();
	}
}
