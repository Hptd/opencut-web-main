/**
 * Persists File System Access API handles so the editor can re-save to the
 * same `.ocut` file without asking the user to pick it again.
 *
 * Handles are structured-cloneable, so they can be stored in IndexedDB
 * directly. Access still requires a permission re-grant tied to a user gesture
 * (see `ensureReadWritePermission`).
 */

const DB_NAME = "opencut-project-files";
const DB_VERSION = 1;
const CURRENT_STORE = "current";
const RECENT_STORE = "recent";

const CURRENT_KEY = "current";

export interface CurrentFileRecord {
	handle: FileSystemFileHandle;
	name: string;
	projectId: string;
	savedAt: number;
}

export interface RecentFileRecord {
	projectId: string;
	handle: FileSystemFileHandle;
	name: string;
	openedAt: number;
}

function isSupported(): boolean {
	return typeof indexedDB !== "undefined";
}

function openDatabase(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);
		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);
		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(CURRENT_STORE)) {
				db.createObjectStore(CURRENT_STORE);
			}
			if (!db.objectStoreNames.contains(RECENT_STORE)) {
				db.createObjectStore(RECENT_STORE, { keyPath: "projectId" });
			}
		};
	});
}

async function withStore<T>(
	storeName: string,
	mode: IDBTransactionMode,
	run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
	const db = await openDatabase();
	try {
		return await new Promise<T>((resolve, reject) => {
			const transaction = db.transaction(storeName, mode);
			const request = run(transaction.objectStore(storeName));
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
			transaction.onabort = () =>
				reject(transaction.error ?? new Error("Transaction aborted"));
		});
	} finally {
		db.close();
	}
}

export async function getCurrentFile(): Promise<CurrentFileRecord | null> {
	if (!isSupported()) return null;
	const record = await withStore<CurrentFileRecord | undefined>(
		CURRENT_STORE,
		"readonly",
		(store) => store.get(CURRENT_KEY) as IDBRequest<CurrentFileRecord | undefined>,
	);
	return record ?? null;
}

export async function setCurrentFile({
	handle,
	name,
	projectId,
}: {
	handle: FileSystemFileHandle;
	name: string;
	projectId: string;
}): Promise<void> {
	if (!isSupported()) return;
	const record: CurrentFileRecord = {
		handle,
		name,
		projectId,
		savedAt: Date.now(),
	};
	await withStore(CURRENT_STORE, "readwrite", (store) =>
		store.put(record, CURRENT_KEY),
	);
}

export async function clearCurrentFile(): Promise<void> {
	if (!isSupported()) return;
	await withStore(CURRENT_STORE, "readwrite", (store) =>
		store.delete(CURRENT_KEY),
	);
}

export async function listRecentFiles(): Promise<RecentFileRecord[]> {
	if (!isSupported()) return [];
	const records = await withStore<RecentFileRecord[]>(
		RECENT_STORE,
		"readonly",
		(store) => store.getAll() as IDBRequest<RecentFileRecord[]>,
	);
	return records.sort((a, b) => b.openedAt - a.openedAt);
}

export async function upsertRecentFile({
	handle,
	name,
	projectId,
}: {
	handle: FileSystemFileHandle;
	name: string;
	projectId: string;
}): Promise<void> {
	if (!isSupported()) return;
	const record: RecentFileRecord = {
		handle,
		name,
		projectId,
		openedAt: Date.now(),
	};
	await withStore(RECENT_STORE, "readwrite", (store) => store.put(record));
}

export async function removeRecentFile({
	projectId,
}: {
	projectId: string;
}): Promise<void> {
	if (!isSupported()) return;
	await withStore(RECENT_STORE, "readwrite", (store) =>
		store.delete(projectId),
	);
}
