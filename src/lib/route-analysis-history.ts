import {
  isRouteAnalysisResult,
  type RouteAnalysisResult,
} from "@/lib/analysis-types";

const STORAGE_KEY = "no-beta-route-analyses";
const MAX_ITEMS = 40;

export type RouteAnalysisHistoryEntry = {
  id: string;
  imageBase64: string;
  mimeType: string;
  result: RouteAnalysisResult;
  timestamp: number;
};

export const ROUTE_ANALYSIS_SAVED_EVENT = "no-beta-route-analysis-saved";

export function listRouteAnalyses(): RouteAnalysisHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isHistoryEntry);
  } catch {
    return [];
  }
}

function isHistoryEntry(v: unknown): v is RouteAnalysisHistoryEntry {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.imageBase64 === "string" &&
    typeof o.mimeType === "string" &&
    typeof o.timestamp === "number" &&
    isRouteAnalysisResult(o.result)
  );
}

export function appendRouteAnalysis(
  entry: Omit<RouteAnalysisHistoryEntry, "id">
): void {
  if (typeof window === "undefined") return;
  const id = crypto.randomUUID();
  const prev = listRouteAnalyses();
  const next: RouteAnalysisHistoryEntry[] = [
    { id, ...entry },
    ...prev.filter((e) => e.id !== id),
  ].slice(0, MAX_ITEMS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(ROUTE_ANALYSIS_SAVED_EVENT));
  } catch {
    // QuotaExceededError 等：静默失败，分析页仍可用
    console.warn("Could not save route analysis to localStorage");
  }
}

export function dataUrlFromEntry(e: RouteAnalysisHistoryEntry): string {
  return `data:${e.mimeType};base64,${e.imageBase64}`;
}
