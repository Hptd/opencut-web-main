import type { EditorCore } from "@/core";
import type {
	TProject,
	TProjectMetadata,
	TProjectSortKey,
	TProjectSortOption,
	TProjectSettings,
	TTimelineViewState,
} from "@/project/types";
import type { ExportOptions, ExportResult, ExportState } from "@/export";
import { storageService } from "@/services/storage/service";
import {
	PROJECT_FILE_EXTENSION,
	buildMediaAsset,
	buildProjectManifest,
	ensureReadWritePermission,
	isFileSystemAccessSupported,
	listRecentFiles,
	pickOpenHandle,
	pickSaveHandle,
	readProjectZip,
	setCurrentFile,
	upsertRecentFile,
	createProjectZipBlob,
} from "@/services/project-file";
import { toast } from "sonner";
import { generateUUID } from "@/utils/id";
import { UpdateProjectSettingsCommand } from "@/commands/project";
import { DEFAULT_BACKGROUND_COLOR } from "@/background/color";
import { DEFAULT_CANVAS_SIZE } from "@/canvas/sizes";
import { DEFAULT_FPS } from "@/fps/defaults";
import { buildDefaultScene, getProjectDurationFromScenes } from "@/timeline/scenes";
import { buildScene } from "@/services/renderer/scene-builder";
import { CanvasRenderer } from "@/services/renderer/canvas-renderer";
import {
	CURRENT_PROJECT_VERSION,
	migrations,
	runStorageMigrations,
	type MigrationProgress,
} from "@/services/storage/migrations";
import { loadFonts } from "@/fonts/google-fonts";
import { DEFAULTS } from "@/timeline/defaults";
import { getElementFontFamilies } from "@/timeline/element-utils";
import { getRaisedProjectFpsForImportedMedia } from "@/fps/utils";
import type { MediaAsset } from "@/media/types";

export interface MigrationState {
	isMigrating: boolean;
	fromVersion: number | null;
	toVersion: number | null;
	projectName: string | null;
}

export class ProjectManager {
	private active: TProject | null = null;
	private savedProjects: TProjectMetadata[] = [];
	private isLoading = true;
	private isInitialized = false;
	private invalidProjectIds = new Set<string>();
	private storageMigrationPromise: Promise<void> | null = null;
	private listeners = new Set<() => void>();
	private migrationState: MigrationState = {
		isMigrating: false,
		fromVersion: null,
		toVersion: null,
		projectName: null,
	};
	private exportState: ExportState = {
		isExporting: false,
		progress: 0,
		result: null,
	};
	private exportCancelRequested = false;
	private fileHandle: FileSystemFileHandle | null = null;
	private fileName: string | null = null;

	constructor(private editor: EditorCore) {}

	private async ensureStorageMigrations(): Promise<void> {
		if (this.storageMigrationPromise) {
			await this.storageMigrationPromise;
			return;
		}

		this.storageMigrationPromise = (async () => {
			await runStorageMigrations({
				migrations,
				onProgress: (progress: MigrationProgress) => {
					this.migrationState = progress;
					this.notify();
				},
			});
		})();

		await this.storageMigrationPromise;
	}

	async createNewProject({ name }: { name: string }): Promise<string> {
		const mainScene = buildDefaultScene({ name: "Main scene", isMain: true });
		const newProject: TProject = {
			metadata: {
				id: generateUUID(),
				name,
				duration: getProjectDurationFromScenes({ scenes: [mainScene] }),
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			scenes: [mainScene],
			currentSceneId: mainScene.id,
			settings: {
				fps: DEFAULT_FPS,
				canvasSize: DEFAULT_CANVAS_SIZE,
				canvasSizeMode: "preset",
				lastCustomCanvasSize: null,
				originalCanvasSize: null,
				background: {
					type: "color",
					color: DEFAULT_BACKGROUND_COLOR,
				},
			},
			version: CURRENT_PROJECT_VERSION,
		};

		this.active = newProject;
		this.notify();

		this.editor.media.clearAllAssets();
		this.editor.scenes.initializeScenes({
			scenes: newProject.scenes,
			currentSceneId: newProject.currentSceneId,
		});

		this.fileHandle = null;
		this.fileName = null;
		this.updateMetadata(newProject);

		return newProject.metadata.id;
	}

	async loadProject({ id }: { id: string }): Promise<void> {
		if (!this.isInitialized) {
			this.isLoading = true;
			this.notify();
		}

		this.editor.save.pause();
		await this.ensureStorageMigrations();
		this.editor.media.clearAllAssets();
		this.editor.scenes.clearScenes();

		try {
			const result = await storageService.loadProject({ id });
			if (!result) {
				throw new Error(`Project with id ${id} not found`);
			}

			const project = result.project;

			this.active = project;
			this.notify();

			if (project.scenes && project.scenes.length > 0) {
				this.editor.scenes.initializeScenes({
					scenes: project.scenes,
					currentSceneId: project.currentSceneId,
				});
			}

			await this.editor.media.loadProjectMedia({ projectId: id });

			await loadFonts({
				families: [
					...new Set(
						(project.scenes ?? []).flatMap((scene) =>
							getElementFontFamilies({ tracks: scene.tracks }),
						),
					),
				],
			});

			if (!project.metadata.thumbnail) {
				try {
					const didUpdateThumbnail = await this.updateThumbnailFromTimeline();
					if (didUpdateThumbnail) {
						await this.saveCurrentProject();
					}
				} catch (error) {
					console.error("Failed to generate project thumbnail:", error);
				}
			}
		} catch (error) {
			console.error("Failed to load project:", error);
			throw error;
		} finally {
			this.isLoading = false;
			this.notify();
			this.editor.save.resume();
		}
	}

	getFileHandle(): FileSystemFileHandle | null {
		return this.fileHandle;
	}

	getFileName(): string | null {
		return this.fileName;
	}

	isFileAccessSupported(): boolean {
		return isFileSystemAccessSupported();
	}

	private async writeProjectToHandle({
		handle,
	}: {
		handle: FileSystemFileHandle;
	}): Promise<void> {
		const project = this.getActive();
		const assets = this.editor.media.getAssets();
		const { manifest, zipAssets } = buildProjectManifest({ project, assets });
		const blob = await createProjectZipBlob({
			manifest,
			assets: zipAssets,
		});

		const writable = await handle.createWritable();
		try {
			await writable.write(blob);
			await writable.close();
		} catch (error) {
			await writable.abort().catch(() => {});
			throw error;
		}
	}

	async saveToFile(): Promise<boolean> {
		if (!this.active) return false;
		if (!isFileSystemAccessSupported()) {
			toast.error("Saving needs a Chromium-based browser");
			return false;
		}

		if (!this.fileHandle) {
			return this.saveAsToFile();
		}

		const granted = await ensureReadWritePermission({ handle: this.fileHandle });
		if (!granted) {
			return this.saveAsToFile();
		}

		try {
			await this.writeProjectToHandle({ handle: this.fileHandle });
			await upsertRecentFile({
				handle: this.fileHandle,
				name: this.fileName ?? this.fileHandle.name,
				projectId: this.active.metadata.id,
			});
			this.editor.save.clearDirty();
			toast.success("Project saved");
			return true;
		} catch (error) {
			console.error("Failed to save project file:", error);
			toast.error("Failed to save project", {
				description: error instanceof Error ? error.message : undefined,
			});
			return false;
		}
	}

	async saveAsToFile(): Promise<boolean> {
		if (!this.active) return false;
		if (!isFileSystemAccessSupported()) {
			toast.error("Saving needs a Chromium-based browser");
			return false;
		}

		const handle = await pickSaveHandle({
			suggestedName: `${this.active.metadata.name}${PROJECT_FILE_EXTENSION}`,
		});
		if (!handle) return false;

		try {
			await this.writeProjectToHandle({ handle });
			this.fileHandle = handle;
			this.fileName = handle.name;
			await setCurrentFile({
				handle,
				name: handle.name,
				projectId: this.active.metadata.id,
			});
			await upsertRecentFile({
				handle,
				name: handle.name,
				projectId: this.active.metadata.id,
			});
			this.editor.save.clearDirty();
			this.notify();
			toast.success("Project saved");
			return true;
		} catch (error) {
			console.error("Failed to save project file:", error);
			toast.error("Failed to save project", {
				description: error instanceof Error ? error.message : undefined,
			});
			return false;
		}
	}

	async openProjectFile(): Promise<string | null> {
		if (!isFileSystemAccessSupported()) {
			toast.error("Opening project files needs a Chromium-based browser");
			return null;
		}

		const handle = await pickOpenHandle();
		if (!handle) return null;

		try {
			return await this.loadFromFileHandle({ handle, addToRecent: true });
		} catch (error) {
			console.error("Failed to open project file:", error);
			toast.error("Failed to open project", {
				description: error instanceof Error ? error.message : undefined,
			});
			return null;
		}
	}

	async openFromId({ id }: { id: string }): Promise<boolean> {
		if (this.active?.metadata.id === id) return true;

		const recent = await listRecentFiles();
		const record = recent.find((entry) => entry.projectId === id);
		if (!record) return false;

		const granted = await ensureReadWritePermission({ handle: record.handle });
		if (!granted) return false;

		try {
			await this.loadFromFileHandle({
				handle: record.handle,
				addToRecent: true,
			});
			return true;
		} catch (error) {
			console.error("Failed to reopen recent project:", error);
			return false;
		}
	}

	async loadFromFileHandle({
		handle,
		addToRecent,
	}: {
		handle: FileSystemFileHandle;
		addToRecent: boolean;
	}): Promise<string> {
		const file = await handle.getFile();
		const { manifest, assetFiles, fileName } = await readProjectZip({ file });
		const project = storageService.deserializeProject({
			serializedProject: manifest.project,
		});
		const projectId = project.metadata.id;

		this.editor.save.pause();
		try {
			this.editor.media.clearAllAssets();
			this.editor.scenes.clearScenes();

			this.active = project;
			this.notify();

			if (project.scenes.length > 0) {
				this.editor.scenes.initializeScenes({
					scenes: project.scenes,
					currentSceneId: project.currentSceneId,
				});
			}

			for (const meta of manifest.assets ?? []) {
				const blob = assetFiles.get(meta.id);
				if (!blob) continue;
				const mediaAsset = buildMediaAsset({ meta, blob });
				await storageService.saveMediaAsset({ projectId, mediaAsset });
			}

			await this.editor.media.loadProjectMedia({ projectId });

			await loadFonts({
				families: [
					...new Set(
						project.scenes.flatMap((scene) =>
							getElementFontFamilies({ tracks: scene.tracks }),
						),
					),
				],
			});

			this.fileHandle = handle;
			this.fileName = fileName;
			await setCurrentFile({ handle, name: fileName, projectId });
			if (addToRecent) {
				await upsertRecentFile({ handle, name: fileName, projectId });
			}
			this.updateMetadata(project);
			return projectId;
		} finally {
			this.editor.save.resume();
		}
	}

	async saveCurrentProject(): Promise<void> {
		if (!this.active) return;

		try {
			const scenes = this.editor.scenes.getScenes();
			const updatedProject = {
				...this.active,
				scenes,
				metadata: {
					...this.active.metadata,
					duration: getProjectDurationFromScenes({ scenes }),
					updatedAt: new Date(),
				},
			};

			this.active = updatedProject;
			this.updateMetadata(updatedProject);
		} catch (error) {
			console.error("Failed to save project:", error);
		}
	}

	async export({ options }: { options: ExportOptions }): Promise<ExportResult> {
		this.exportCancelRequested = false;
		this.exportState = { isExporting: true, progress: 0, result: null };
		this.notify();

		const result = await this.editor.renderer.exportProject({
			options,
			onProgress: ({ progress }) => {
				this.exportState = { ...this.exportState, progress };
				this.notify();
			},
			onCancel: () => this.exportCancelRequested,
		});

		this.exportState = {
			isExporting: false,
			progress: this.exportState.progress,
			result,
		};
		this.notify();

		return result;
	}

	cancelExport(): void {
		this.exportCancelRequested = true;
	}

	clearExportState(): void {
		this.exportState = { isExporting: false, progress: 0, result: null };
		this.notify();
	}

	getExportState(): ExportState {
		return this.exportState;
	}

	async loadAllProjects(): Promise<void> {
		if (!this.isInitialized) {
			this.isLoading = true;
			this.notify();
		}

		try {
			await this.ensureStorageMigrations();
			try {
				const metadata = await storageService.loadAllProjectsMetadata();
				this.savedProjects = metadata;
				this.notify();
			} catch (error) {
				console.error("Failed to load projects:", error);
			} finally {
				this.isLoading = false;
				this.isInitialized = true;
				this.notify();
			}
		} catch (error) {
			console.error("Failed to run migrations:", error);
			this.isLoading = false;
			this.isInitialized = true;
			this.notify();
		}
	}

	async deleteProjects({ ids }: { ids: string[] }): Promise<void> {
		const uniqueIds = Array.from(new Set(ids));
		if (uniqueIds.length === 0) return;

		try {
			await Promise.all(
				uniqueIds.map((id) =>
					Promise.all([
						storageService.deleteProjectMedia({ projectId: id }),
						storageService.deleteProject({ id }),
					]),
				),
			);

			const idSet = new Set(uniqueIds);
			this.savedProjects = this.savedProjects.filter(
				(project) => !idSet.has(project.id),
			);

			const shouldClearActive =
				this.active && idSet.has(this.active.metadata.id);

			if (shouldClearActive) {
				this.active = null;
				this.editor.media.clearAllAssets();
				this.editor.scenes.clearScenes();
			}

			this.notify();
		} catch (error) {
			console.error("Failed to delete projects:", error);
		}
	}

	closeProject(): void {
		this.active = null;
		this.notify();

		this.editor.media.clearAllAssets();
		this.editor.scenes.clearScenes();
	}

	async renameProject({
		id,
		name,
	}: {
		id: string;
		name: string;
	}): Promise<void> {
		try {
			if (this.active?.metadata.id === id) {
				this.active = {
					...this.active,
					metadata: {
						...this.active.metadata,
						name,
						updatedAt: new Date(),
					},
				};
				this.notify();
				this.updateMetadata(this.active);
			}
		} catch (error) {
			console.error("Failed to rename project:", error);
			toast.error("Failed to rename project", {
				description:
					error instanceof Error ? error.message : "Please try again",
			});
		}
	}

	async duplicateProjects({ ids }: { ids: string[] }): Promise<string[]> {
		const uniqueIds = Array.from(new Set(ids));
		if (uniqueIds.length === 0) return [];

		try {
			const getDuplicateBaseName = ({ name }: { name: string }) => {
				const match = name.match(/^\((\d+)\)\s+(.+)$/);
				const number = match ? Number.parseInt(match[1], 10) : null;
				const baseName = match ? match[2] : name;
				return { baseName, number };
			};

			const loadResults = await Promise.all(
				uniqueIds.map(async (projectId) => {
					const result = await storageService.loadProject({ id: projectId });
					return { projectId, project: result?.project ?? null };
				}),
			);

			const missingProjectIds = loadResults
				.filter((result) => !result.project)
				.map((result) => result.projectId);

			if (missingProjectIds.length > 0) {
				toast.error(
					missingProjectIds.length === 1
						? "Project not found"
						: "Projects not found",
					{
						description:
							missingProjectIds.length === 1
								? "Please try again"
								: "Some projects could not be found",
					},
				);
				throw new Error(`Projects not found: ${missingProjectIds.join(", ")}`);
			}

			const projectsToDuplicate = loadResults.flatMap((result) =>
				result.project ? [result.project] : [],
			);

			const maxNumberByBaseName = new Map<string, number>();

			for (const project of this.savedProjects) {
				const { baseName, number } = getDuplicateBaseName({
					name: project.name,
				});

				if (number === null) continue;

				const currentMax = maxNumberByBaseName.get(baseName);
				if (currentMax === undefined || number > currentMax) {
					maxNumberByBaseName.set(baseName, number);
				}
			}

			const nextNumberByBaseName = new Map<string, number>();
			for (const [baseName, maxNumber] of maxNumberByBaseName) {
				nextNumberByBaseName.set(baseName, maxNumber + 1);
			}

			const duplicationPlans = projectsToDuplicate.map((project) => {
				const { baseName } = getDuplicateBaseName({
					name: project.metadata.name,
				});
				const nextNumber = nextNumberByBaseName.get(baseName) ?? 1;
				nextNumberByBaseName.set(baseName, nextNumber + 1);

				const newProjectId = generateUUID();
				const newProject: TProject = {
					...project,
					metadata: {
						...project.metadata,
						id: newProjectId,
						name: `(${nextNumber}) ${baseName}`,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				};

				return {
					newProjectId,
					newProject,
					sourceProjectId: project.metadata.id,
				};
			});

			await Promise.all(
				duplicationPlans.map(({ newProject }) =>
					storageService.saveProject({ project: newProject }),
				),
			);

			await Promise.all(
				duplicationPlans.map(async ({ sourceProjectId, newProjectId }) => {
					const sourceMediaAssets = await storageService.loadAllMediaAssets({
						projectId: sourceProjectId,
					});

					await Promise.all(
						sourceMediaAssets.map((mediaAsset) =>
							storageService.saveMediaAsset({
								projectId: newProjectId,
								mediaAsset,
							}),
						),
					);
				}),
			);

			for (const { newProject } of duplicationPlans) {
				this.updateMetadata(newProject);
			}

			return duplicationPlans.map((plan) => plan.newProjectId);
		} catch (error) {
			console.error("Failed to duplicate projects:", error);
			toast.error("Failed to duplicate projects", {
				description:
					error instanceof Error ? error.message : "Please try again",
			});
			throw error;
		}
	}

	async updateSettings({
		settings,
		pushHistory = true,
	}: {
		settings: Partial<TProjectSettings>;
		pushHistory?: boolean;
	}): Promise<void> {
		if (!this.active) return;

		const command = new UpdateProjectSettingsCommand(settings);
		if (pushHistory) {
			this.editor.command.execute({ command });
			return;
		}

		command.execute();
	}

	ratchetFpsForImportedMedia({
		importedAssets,
	}: {
		importedAssets: Array<Pick<MediaAsset, "type" | "fps">>;
	}): import("opencut-wasm").FrameRate | null {
		if (!this.active) return null;

		const nextFps = getRaisedProjectFpsForImportedMedia({
			currentFps: this.active.settings.fps,
			importedAssets,
		});
		if (nextFps === null) return null;

		new UpdateProjectSettingsCommand({ fps: nextFps }).execute();
		return nextFps;
	}

	async updateThumbnail({ thumbnail }: { thumbnail: string }): Promise<void> {
		if (!this.active) return;

		const updatedProject: TProject = {
			...this.active,
			metadata: { ...this.active.metadata, thumbnail, updatedAt: new Date() },
		};
		this.active = updatedProject;
		this.notify();
		this.updateMetadata(updatedProject);
		this.editor.save.markDirty();
	}

	async prepareExit(): Promise<void> {
		if (!this.active) return;

		try {
			const didUpdateThumbnail = await this.updateThumbnailFromTimeline();
			if (didUpdateThumbnail) {
				await this.editor.save.flush();
			}
		} catch (error) {
			console.error("Failed to generate project thumbnail on exit:", error);
		}
	}

	getFilteredAndSortedProjects({
		searchQuery,
		sortOption,
	}: {
		searchQuery: string;
		sortOption: TProjectSortOption;
	}): TProjectMetadata[] {
		const filteredProjects = this.savedProjects.filter((project) =>
			project.name.toLowerCase().includes(searchQuery.toLowerCase()),
		);

		const [key, order] = sortOption.split("-") as [
			TProjectSortKey,
			"asc" | "desc",
		];

		const sortedProjects = [...filteredProjects].sort((a, b) => {
			const aValue = a[key];
			const bValue = b[key];

			if (order === "asc") {
				if (aValue < bValue) return -1;
				if (aValue > bValue) return 1;
				return 0;
			}
			if (aValue > bValue) return -1;
			if (aValue < bValue) return 1;
			return 0;
		});

		return sortedProjects;
	}

	isInvalidProjectId({ id }: { id: string }): boolean {
		return this.invalidProjectIds.has(id);
	}

	markProjectIdAsInvalid({ id }: { id: string }): void {
		this.invalidProjectIds.add(id);
		this.notify();
	}

	clearInvalidProjectIds(): void {
		this.invalidProjectIds.clear();
		this.notify();
	}

	getActive(): TProject {
		if (!this.active) {
			throw new Error("No active project");
		}
		return this.active;
	}

	/**
	 * for agents:
	 * in most cases, the project is guaranteed to be active, in which getActive() should be used instead.
	 * for very rare cases, this function may be used.
	 */
	getActiveOrNull(): TProject | null {
		return this.active;
	}

	getTimelineViewState(): TTimelineViewState {
		return this.active?.timelineViewState ?? DEFAULTS.timeline.viewState;
	}

	setTimelineViewState({ viewState }: { viewState: TTimelineViewState }): void {
		if (!this.active) return;
		this.active = {
			...this.active,
			timelineViewState: viewState ?? undefined,
		};
		this.editor.save.markDirty();
		this.notify();
	}

	getSavedProjects(): TProjectMetadata[] {
		return this.savedProjects;
	}

	getIsLoading(): boolean {
		return this.isLoading;
	}

	getIsInitialized(): boolean {
		return this.isInitialized;
	}

	getMigrationState(): MigrationState {
		return this.migrationState;
	}

	setActiveProject({ project }: { project: TProject }): void {
		this.active = project;
		this.notify();
	}

	subscribe(listener: () => void): () => void {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	private async updateThumbnailFromTimeline(): Promise<boolean> {
		if (!this.active) return false;

		const tracks = this.editor.scenes.getActiveScene().tracks;
		const mediaAssets = this.editor.media.getAssets();
		const duration = this.editor.timeline.getTotalDuration();
		const { canvasSize, background } = this.active.settings;

		const scene = buildScene({
			tracks,
			mediaAssets,
			duration: duration || 1,
			canvasSize,
			background,
		});

		const renderer = new CanvasRenderer({
			width: canvasSize.width,
			height: canvasSize.height,
			fps: this.active.settings.fps,
		});

		const tempCanvas = document.createElement("canvas");
		tempCanvas.width = canvasSize.width;
		tempCanvas.height = canvasSize.height;

		await renderer.renderToCanvas({
			node: scene,
			time: 0,
			targetCanvas: tempCanvas,
		});

		const thumbnailDataUrl = tempCanvas.toDataURL("image/png");

		await this.updateThumbnail({ thumbnail: thumbnailDataUrl });
		return true;
	}

	private updateMetadata(project: TProject): void {
		const index = this.savedProjects.findIndex(
			(p) => p.id === project.metadata.id,
		);

		if (index !== -1) {
			this.savedProjects = this.savedProjects.with(index, project.metadata);
		} else {
			this.savedProjects = [project.metadata, ...this.savedProjects];
		}

		this.notify();
	}

	private notify(): void {
		this.listeners.forEach((fn) => {
			fn();
		});
	}
}
