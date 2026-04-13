"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import {
  listSessions,
  saveSession,
  type SessionRecord,
} from "@/lib/sessions-db";
import {
  dataUrlFromEntry,
  listRouteAnalyses,
  ROUTE_ANALYSIS_SAVED_EVENT,
  type RouteAnalysisHistoryEntry,
} from "@/lib/route-analysis-history";
import { AppPageBackground } from "@/components/app-page-background";
import { cn } from "@/lib/utils";

const GRADES = [
  "V0",
  "V1",
  "V2",
  "V3",
  "V4",
  "V5",
  "V6",
  "V7",
  "V8",
  "V9",
  "V10",
  "Unknown",
] as const;

function todayLocal(): string {
  const t = new Date();
  const y = t.getFullYear();
  const m = String(t.getMonth() + 1).padStart(2, "0");
  const d = String(t.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BetaLibrary() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [routeAnalyses, setRouteAnalyses] = useState<
    RouteAnalysisHistoryEntry[]
  >([]);
  const [expandedRouteId, setExpandedRouteId] = useState<string | null>(null);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [formOpen, setFormOpen] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<string>("Unknown");
  const [date, setDate] = useState(todayLocal);
  const [notes, setNotes] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const rows = await listSessions();
      setSessions(rows);
    } catch {
      setSessions([]);
    }
  }, []);

  const refreshRouteAnalyses = useCallback(() => {
    setRouteAnalyses(listRouteAnalyses());
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    refreshRouteAnalyses();
    window.addEventListener(ROUTE_ANALYSIS_SAVED_EVENT, refreshRouteAnalyses);
    window.addEventListener("storage", refreshRouteAnalyses);
    return () => {
      window.removeEventListener(
        ROUTE_ANALYSIS_SAVED_EVENT,
        refreshRouteAnalyses,
      );
      window.removeEventListener("storage", refreshRouteAnalyses);
    };
  }, [refreshRouteAnalyses]);

  useEffect(() => {
    const map: Record<string, string> = {};
    for (const s of sessions) {
      map[s.id] = URL.createObjectURL(s.video);
    }
    setUrls(map);
    return () => {
      Object.values(map).forEach((u) => URL.revokeObjectURL(u));
    };
  }, [sessions]);

  const resetForm = () => {
    setVideoFile(null);
    setName("");
    setGrade("Unknown");
    setDate(todayLocal());
    setNotes("");
    setNameError(null);
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("Session name is required");
      return;
    }
    if (!videoFile) {
      setNameError("Please choose a video file");
      return;
    }
    setNameError(null);
    setSaving(true);
    try {
      await saveSession({
        name: name.trim(),
        grade,
        date,
        notes: notes.trim(),
        video: videoFile,
      });
      await load();
      resetForm();
      setFormOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <AppPageBackground />
      <main className="relative z-10 mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col px-5 pt-14 pb-4">
        <header className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">
            Beta Library
          </h1>
          <button
            type="button"
            onClick={() => setFormOpen((o) => !o)}
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-[4px] border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] transition-colors hover:bg-[#f5f4f0]",
              formOpen && "bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]",
            )}
            aria-expanded={formOpen}
            aria-label={formOpen ? "Close upload form" : "Add session"}
          >
            <PlusIcon className="size-5" />
          </button>
        </header>

        {formOpen && (
          <form
            onSubmit={onSave}
            className="mt-5 space-y-4 rounded-[4px] border-2 border-[#1a1a1a] bg-white p-4"
          >
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-[#1a1a1a]/70">
                Video
              </label>
              <input
                type="file"
                accept="video/*"
                className="mt-2 block w-full text-sm text-[#1a1a1a] file:mr-3 file:rounded-[4px] file:border-2 file:border-[#1a1a1a] file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#1a1a1a]"
                onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <div>
              <label
                htmlFor="session-name"
                className="text-xs font-semibold uppercase tracking-wide text-[#1a1a1a]/70"
              >
                Session name
              </label>
              <input
                id="session-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-[4px] border-2 border-[#1a1a1a] bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/25"
                placeholder="e.g. Gym night slab"
                autoComplete="off"
              />
            </div>

            <div>
              <label
                htmlFor="grade"
                className="text-xs font-semibold uppercase tracking-wide text-[#1a1a1a]/70"
              >
                Grade
              </label>
              <select
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="mt-2 w-full rounded-[4px] border-2 border-[#1a1a1a] bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/25"
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="session-date"
                className="text-xs font-semibold uppercase tracking-wide text-[#1a1a1a]/70"
              >
                Date
              </label>
              <input
                id="session-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 w-full rounded-[4px] border-2 border-[#1a1a1a] bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/25"
              />
            </div>

            <div>
              <label
                htmlFor="notes"
                className="text-xs font-semibold uppercase tracking-wide text-[#1a1a1a]/70"
              >
                Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-2 w-full resize-none rounded-[4px] border-2 border-[#1a1a1a] bg-white px-3 py-2 text-sm text-[#1a1a1a] outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/25"
                placeholder="Optional beta notes…"
              />
            </div>

            {nameError && (
              <p className="text-sm font-medium text-red-700" role="alert">
                {nameError}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="h-11 w-full rounded-[4px] border-2 border-[#1a1a1a] bg-[#1a1a1a] text-sm font-semibold text-white transition-colors hover:bg-[#2a2a2a] disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Session"}
            </button>
          </form>
        )}

        <section className="mt-10" aria-label="Route analysis history">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]/55">
            Route analyses
          </h2>
          {routeAnalyses.length === 0 ? (
            <p className="mt-2 text-sm text-[#1a1a1a]/55">
              No route analyses yet — run one on the Analyze tab.
            </p>
          ) : (
            <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {routeAnalyses.map((a) => {
                const src = dataUrlFromEntry(a);
                const open = expandedRouteId === a.id;
                return (
                  <li key={a.id} className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => setExpandedRouteId(open ? null : a.id)}
                      className="w-full overflow-hidden rounded-[4px] border-2 border-[#1a1a1a] bg-white text-left transition-colors hover:bg-[#faf9f6]"
                    >
                      <div className="relative aspect-[4/3] w-full bg-[#1a1a1a]/5">
                        <Image
                          src={src}
                          alt="Analyzed wall"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="p-2.5">
                        <p className="truncate text-sm font-semibold text-[#1a1a1a]">
                          {a.result.grade} · {a.result.routeColor}
                        </p>
                        <p className="mt-1 text-[0.7rem] text-[#1a1a1a]/50">
                          {new Date(a.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </button>
                    {open && (
                      <div className="mt-2 space-y-2 rounded-[4px] border-2 border-[#1a1a1a] bg-white p-3 text-sm">
                        <div className="grid grid-cols-3 gap-1.5 text-center text-[0.65rem]">
                          <div className="rounded border border-[#1a1a1a]/25 px-1 py-1.5">
                            <div className="font-semibold text-[#1a1a1a]/50">
                              Color
                            </div>
                            <div className="font-bold text-[#1a1a1a]">
                              {a.result.routeColor}
                            </div>
                          </div>
                          <div className="rounded border border-[#1a1a1a]/25 px-1 py-1.5">
                            <div className="font-semibold text-[#1a1a1a]/50">
                              Grade
                            </div>
                            <div className="font-bold text-[#1a1a1a]">
                              {a.result.grade}
                            </div>
                          </div>
                          <div className="rounded border border-[#1a1a1a]/25 px-1 py-1.5">
                            <div className="font-semibold text-[#1a1a1a]/50">
                              Holds
                            </div>
                            <div className="font-bold text-[#1a1a1a]">
                              {a.result.holdCount}
                            </div>
                          </div>
                        </div>
                        {a.result.movementSequence.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-[#1a1a1a]">
                              Sequence
                            </p>
                            <ol className="mt-1 list-decimal pl-4 text-[#1a1a1a]/85">
                              {a.result.movementSequence.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ol>
                          </div>
                        )}
                        {a.result.keyMoves.length > 0 && (
                          <div className="rounded bg-amber-100 px-2 py-2">
                            <p className="text-xs font-bold text-[#1a1a1a]">
                              Key moves
                            </p>
                            <ul className="mt-1 list-disc pl-4 text-[#1a1a1a]/90">
                              {a.result.keyMoves.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {a.result.bodyPositionTips.length > 0 && (
                          <div className="rounded bg-sky-100 px-2 py-2">
                            <p className="text-xs font-bold text-[#1a1a1a]">
                              Body tips
                            </p>
                            <ul className="mt-1 list-disc pl-4 text-[#1a1a1a]/90">
                              {a.result.bodyPositionTips.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="mt-10" aria-label="Sessions">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]/55">
            Beta videos
          </h2>
          {sessions.length === 0 ? (
            <div className="mt-3 flex flex-col items-center justify-center rounded-[4px] border-2 border-dashed border-[#1a1a1a]/35 bg-white px-6 py-16 text-center">
              <p className="text-base font-medium text-[#1a1a1a]/65">
                No sessions yet · Upload your first beta
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3">
              {sessions.map((s) => (
                <li key={s.id}>
                  <article className="overflow-hidden rounded-[4px] border-2 border-[#1a1a1a] bg-white">
                    <div className="relative aspect-video bg-[#1a1a1a]">
                      {urls[s.id] && (
                        <video
                          src={urls[s.id]}
                          className="absolute inset-0 h-full w-full object-cover opacity-80"
                          muted
                          playsInline
                          preload="metadata"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <PlayIcon className="size-10 text-white/90 drop-shadow" />
                      </div>
                    </div>
                    <div className="p-2.5">
                      <h2 className="truncate text-sm font-semibold text-[#1a1a1a]">
                        {s.name}
                      </h2>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-[4px] border border-[#1a1a1a] bg-[#f5f4f0] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-[#1a1a1a]">
                          {s.grade}
                        </span>
                        <span className="text-[0.7rem] font-medium text-[#1a1a1a]/55">
                          {s.date}
                        </span>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
