export type SessionRecord = {
  id: string;
  name: string;
  grade: string;
  date: string;
  notes: string;
  createdAt: number;
  video: Blob;
};

const DB_NAME = "no-beta-library";
const STORE = "sessions";
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error ?? new Error("IDB open failed"));
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
  });
}

export async function saveSession(record: Omit<SessionRecord, "id" | "createdAt"> & { id?: string; createdAt?: number }): Promise<string> {
  const db = await openDb();
  const id = record.id ?? crypto.randomUUID();
  const row: SessionRecord = {
    id,
    name: record.name,
    grade: record.grade,
    date: record.date,
    notes: record.notes,
    createdAt: record.createdAt ?? Date.now(),
    video: record.video,
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.oncomplete = () => resolve(id);
    tx.onerror = () => reject(tx.error ?? new Error("IDB write failed"));
    tx.objectStore(STORE).put(row);
  });
}

export async function listSessions(): Promise<SessionRecord[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onerror = () => reject(req.error ?? new Error("IDB read failed"));
    req.onsuccess = () => {
      const rows = (req.result ?? []) as SessionRecord[];
      rows.sort((a, b) => b.createdAt - a.createdAt);
      resolve(rows);
    };
  });
}
