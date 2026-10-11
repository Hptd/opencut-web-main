"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEditor } from "@/editor/use-editor";
import { LanguageToggle, useTranslation } from "@/i18n";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	Delete02Icon,
	FolderOpenIcon,
	PlusSignIcon,
	Video01Icon,
} from "@hugeicons/core-free-icons";
import {
	listRecentFiles,
	removeRecentFile,
	type RecentFileRecord,
} from "@/services/project-file";

export default function ProjectsPage() {
	const editor = useEditor();
	const router = useRouter();
	const { t } = useTranslation();
	const [recent, setRecent] = useState<RecentFileRecord[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const isSupported = editor.project.isFileAccessSupported();

	const refreshRecent = useCallback(async () => {
		const records = await listRecentFiles();
		setRecent(records);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		void refreshRecent();
	}, [refreshRecent]);

	const navigateToProject = (projectId: string) => {
		router.push(`/editor?project_id=${projectId}`);
	};

	const handleNew = async () => {
		try {
			const projectId = await editor.project.createNewProject({
				name: t("Untitled Project"),
			});
			navigateToProject(projectId);
		} catch (error) {
			toast.error(t("Failed to create project"), {
				description: error instanceof Error ? error.message : t("Please try again"),
			});
		}
	};

	const handleOpen = async () => {
		const projectId = await editor.project.openProjectFile();
		if (projectId) {
			await refreshRecent();
			navigateToProject(projectId);
		}
	};

	const handleOpenRecent = async (record: RecentFileRecord) => {
		const opened = await editor.project.openFromId({ id: record.projectId });
		if (opened) {
			navigateToProject(record.projectId);
			return;
		}
		toast.error(t("Could not open recent project"), {
			description: t("Open the .ocut file manually instead."),
		});
	};
	const handleRemoveRecent = async (projectId: string) => {
		await removeRecentFile({ projectId });
		await refreshRecent();
	};

	return (
		<div className="bg-background min-h-screen">
			<header className="mx-auto flex max-w-3xl flex-col gap-6 px-6 pt-16">
				<div className="flex items-start justify-between gap-4">
					<div className="flex flex-col gap-2">
						<h1 className="text-3xl font-bold tracking-tight">OpenCut</h1>
						<p className="text-muted-foreground text-sm">
							{t(
								"Your projects are stored as local .ocut files. Open one to keep editing.",
							)}
						</p>
					</div>
					<div className="flex shrink-0 items-center gap-1">
						<LanguageToggle />
						<ThemeToggle />
					</div>
				</div>

				{!isSupported && (
					<div className="text-destructive text-sm">
						{t(
							"Opening and saving project files needs a Chromium-based browser (Chrome / Edge).",
						)}
					</div>
				)}

				<div className="flex items-center gap-3">
					<Button onClick={handleNew} className="gap-2">
						<HugeiconsIcon icon={PlusSignIcon} />
						{t("New project")}
					</Button>
					<Button
						variant="outline"
						onClick={handleOpen}
						disabled={!isSupported}
						className="gap-2"
					>
						<HugeiconsIcon icon={FolderOpenIcon} />
						{t("Open project…")}
					</Button>
				</div>
			</header>

			<main className="mx-auto max-w-3xl px-6 pt-10 pb-16">
				<h2 className="mb-4 text-lg font-medium">{t("Recent")}</h2>
				{isLoading ? (
					<p className="text-muted-foreground text-sm">{t("Loading…")}</p>
				) : recent.length === 0 ? (
					<div className="text-muted-foreground flex flex-col items-center gap-3 py-16 text-center">
						<HugeiconsIcon icon={Video01Icon} className="size-10 opacity-50" />
						<p className="text-sm">{t("No recent projects yet.")}</p>
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{recent.map((record) => (
							<Card key={record.projectId} className="border">
								<CardContent className="flex items-center gap-4 py-3">
									<HugeiconsIcon
										icon={Video01Icon}
										className="text-muted-foreground size-5 shrink-0"
									/>
									<button
										type="button"
										className="flex min-w-0 flex-1 flex-col items-start text-left"
										onClick={() => void handleOpenRecent(record)}
									>
										<span className="w-full truncate text-sm font-medium">
											{record.name}
										</span>
										<span className="text-muted-foreground text-xs">
											{new Date(record.openedAt).toLocaleString()}
										</span>
									</button>
									<Button
										variant="ghost"
										size="icon"
										aria-label={t("Remove from recent")}
										onClick={() => void handleRemoveRecent(record.projectId)}
									>
										<HugeiconsIcon icon={Delete02Icon} className="size-4" />
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
