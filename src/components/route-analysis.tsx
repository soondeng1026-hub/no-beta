"use client";

import { useEffect, useRef, useState } from "react";

import type { RouteAnalysisResult } from "@/lib/analysis-types";
import { isRouteAnalysisResult } from "@/lib/analysis-types";
import { compressWallImageToJpegBlob } from "@/lib/compress-wall-image";
import { appendRouteAnalysis } from "@/lib/route-analysis-history";
import { AppPageBackground } from "@/components/app-page-background";
import { cn } from "@/lib/utils";

const MAX_BYTES = 10 * 1024 * 1024;

function parseDataUrl(
  dataUrl: string,
): { mime: string; base64: string } | null {
  const m = dataUrl.match(/^data:([^;]+);base64,([\s\S]+)$/);
  if (!m) return null;
  return { mime: m[1], base64: (m[2] ?? "").replace(/\s/g, "") };
}

const HEIC_TYPES = new Set(["image/heic", "image/heif"]);

function validateWallImage(
  f: File,
):
  | { ok: true; mime: string }
  | { ok: false; message: string } {
  if (HEIC_TYPES.has(f.type)) {
    return {
      ok: false,
      message:
        "HEIC is not supported in the browser. Export or pick JPG / PNG in Photos.",
    };
  }
  if (
    f.type === "image/jpeg" ||
    f.type === "image/png" ||
    f.type === "image/webp"
  ) {
    return { ok: true, mime: f.type };
  }
  const n = f.name.toLowerCase();
  if (/\.(jpe?g)$/.test(n)) return { ok: true, mime: "image/jpeg" };
  if (/\.png$/i.test(n)) return { ok: true, mime: "image/png" };
  if (/\.webp$/i.test(n)) return { ok: true, mime: "image/webp" };
  if (/\.heic$/i.test(n) || /\.heif$/i.test(n)) {
    return {
      ok: false,
      message:
        "HEIC is not supported. Save or share the photo as JPEG first, then upload.",
    };
  }
  if (!f.type || f.type === "application/octet-stream") {
    return {
      ok: false,
      message:
        "Could not detect image type. Please use a JPG, PNG, or WebP file.",
    };
  }
  return {
    ok: false,
    message: "Please choose a JPG, PNG, or WebP photo.",
  };
}

function readFileAsDataParts(
  file: File,
): Promise<{ mime: string; base64: string } | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      if (typeof url !== "string") {
        resolve(null);
        return;
      }
      resolve(parseDataUrl(url));
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 4v12M8 8l4-4 4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="4"
        y="16"
        width="16"
        height="4"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-6 animate-spin text-[#1a1a1a]", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-80"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

type Step = "pick" | "ready" | "loading" | "done" | "failed";

/** 使用 blob: 预览，避免超长 data URL；JPG/PNG/WebP 浏览器均可解码 */
function LocalImagePreview({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- 本地 blob: 预览
    <img src={src} alt={alt} className={className} decoding="async" />
  );
}

export function RouteAnalysis() {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<File | null>(null);
  const pickedMimeRef = useRef<string>("image/jpeg");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("pick");
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [failMessage, setFailMessage] = useState<string | null>(null);
  const [result, setResult] = useState<RouteAnalysisResult | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const resetAll = () => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    fileRef.current = null;
    setResult(null);
    setStep("pick");
    setSizeError(null);
    setFailMessage(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setSizeError(null);
    setFailMessage(null);
    if (!f) return;
    if (f.size > MAX_BYTES) {
      setSizeError("Image too large, max 10MB");
      return;
    }

    const check = validateWallImage(f);
    if (!check.ok) {
      setSizeError(check.message);
      return;
    }

    void (async () => {
      try {
        const jpegBlob = await compressWallImageToJpegBlob(f);
        if (jpegBlob.size > MAX_BYTES) {
          setSizeError("Image too large, max 10MB");
          return;
        }
        const baseName = f.name.replace(/\.[^.]+$/, "") || "wall";
        const compressedFile = new File([jpegBlob], `${baseName}.jpg`, {
          type: "image/jpeg",
        });
        pickedMimeRef.current = "image/jpeg";
        fileRef.current = compressedFile;
        setResult(null);
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(compressedFile);
        });
        setStep("ready");
      } catch (err) {
        setSizeError(
          err instanceof Error ? err.message : "Could not compress image",
        );
      }
    })();
  };

  const runAnalyze = async () => {
    const file = fileRef.current;
    if (!file) return;

    const parts = await readFileAsDataParts(file);
    if (!parts?.base64) {
      setFailMessage("Invalid image data");
      setStep("failed");
      return;
    }

    let mime = parts.mime;
    if (!mime.startsWith("image/")) {
      mime = pickedMimeRef.current;
    }

    setStep("loading");
    setSizeError(null);
    setFailMessage(null);

    try {
      /** 完整 data URL，与方舟 image_url.url 一致；服务端也接受裸 base64 + mimeType */
      const imageDataUrl = `data:${mime};base64,${parts.base64}`;

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imageDataUrl,
          mimeType: mime,
        }),
      });

      const rawText = await res.text();
      let body: unknown = {};
      if (rawText) {
        try {
          body = JSON.parse(rawText) as unknown;
        } catch {
          body = {};
        }
      }

      const errObj = body as {
        error?: string;
        message?: string;
        detail?: string;
        preview?: string;
      };

      if (res.status === 400 && errObj.error === "too_large") {
        setSizeError("Image too large, max 10MB");
        setStep("failed");
        return;
      }

      if (res.status === 503 && errObj.error === "missing_api_key") {
        setFailMessage(
          errObj.message ||
            "Server missing DOUBAO_API_KEY or ARK_API_KEY. Set in Vercel env or .env.local and redeploy / restart.",
        );
        setStep("failed");
        return;
      }

      if (!res.ok) {
        const pieces = [
          errObj.message,
          errObj.detail,
          errObj.preview,
          !errObj.message && rawText ? rawText.slice(0, 280) : null,
        ].filter(Boolean);
        setFailMessage(
          pieces.length > 0
            ? pieces.join(" · ")
            : errObj.error || `HTTP ${res.status}`,
        );
        setStep("failed");
        return;
      }

      if (!isRouteAnalysisResult(body)) {
        setFailMessage(
          `Invalid response from server · ${rawText.slice(0, 200)}`,
        );
        setStep("failed");
        return;
      }

      setResult(body);
      setStep("done");

      appendRouteAnalysis({
        imageBase64: parts.base64,
        mimeType: mime,
        result: body,
        timestamp: Date.now(),
      });
    } catch (e) {
      console.error("[RouteAnalysis] analyze fetch failed", e);
      const msg =
        e instanceof TypeError && e.message.includes("fetch")
          ? "Network error (offline, CORS, or blocked request)"
          : e instanceof Error
            ? e.message
            : "Analysis failed, please try again";
      setFailMessage(msg);
      setStep("failed");
    }
  };

  const openPicker = () => inputRef.current?.click();

  const tooLargeFail =
    sizeError === "Image too large, max 10MB" && step === "failed";

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <AppPageBackground />
      <main className="relative z-10 mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col px-5 pt-14 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">
          Route Analysis
        </h1>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png"
          className="sr-only"
          onChange={onFileChange}
        />

        {sizeError && step === "pick" && (
          <p
            className="mt-3 rounded-[4px] border-2 border-[#1a1a1a] bg-white px-3 py-2 text-sm text-[#1a1a1a]"
            role="alert"
          >
            {sizeError}
          </p>
        )}

        {step === "done" && result && previewUrl && (
          <div className="mt-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] border-2 border-[#1a1a1a] bg-white">
              <LocalImagePreview
                src={previewUrl}
                alt="Wall preview"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <StatCard label="Route Color" value={result.routeColor} />
              <StatCard label="Grade" value={result.grade} />
              <StatCard label="Hold Count" value={String(result.holdCount)} />
            </div>

            <section className="mt-4 rounded-[4px] border-2 border-[#1a1a1a] bg-white p-4">
              <h2 className="text-sm font-semibold text-[#1a1a1a]">
                Movement Sequence
              </h2>
              <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm leading-relaxed text-[#1a1a1a]/85">
                {result.movementSequence.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </section>

            <section className="mt-3 rounded-[4px] border-2 border-[#1a1a1a] bg-amber-100 p-4">
              <h2 className="text-sm font-semibold text-[#1a1a1a]">
                Key Moves
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-[#1a1a1a]/90">
                {result.keyMoves.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>

            <section className="mt-3 rounded-[4px] border-2 border-[#1a1a1a] bg-sky-100 p-4">
              <h2 className="text-sm font-semibold text-[#1a1a1a]">
                Body Tips
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-[#1a1a1a]/90">
                {result.bodyPositionTips.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </section>

            <button
              type="button"
              onClick={resetAll}
              className="mt-6 w-full rounded-[4px] py-3 text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a]/[0.06]"
            >
              Upload New Photo
            </button>
          </div>
        )}

        {(step === "pick" ||
          step === "ready" ||
          step === "loading" ||
          step === "failed") && (
          <div className="mt-8 flex flex-col">
            {step === "pick" && (
              <button
                type="button"
                onClick={openPicker}
                className="flex min-h-[240px] w-full flex-col items-center justify-center rounded-[4px] border-2 border-dashed border-[#1a1a1a]/45 bg-white px-6 py-10 text-center transition-colors hover:border-[#1a1a1a]/70 hover:bg-[#faf9f6]"
              >
                <UploadIcon className="size-12 text-[#1a1a1a]/70" />
                <p className="mt-4 text-base font-semibold text-[#1a1a1a]">
                  Tap to upload a wall photo
                </p>
                <p className="mt-1 text-sm text-[#1a1a1a]/55">
                  JPG or PNG, max 10MB
                </p>
              </button>
            )}

            {(step === "ready" || step === "loading" || step === "failed") &&
              previewUrl && (
                <div className="flex flex-col">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] border-2 border-[#1a1a1a] bg-white">
                    <LocalImagePreview
                      src={previewUrl}
                      alt="Selected wall"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>

                  {step === "ready" && (
                    <button
                      type="button"
                      onClick={runAnalyze}
                      className="mt-5 h-12 w-full rounded-[4px] border-2 border-[#1a1a1a] bg-[#1a1a1a] text-sm font-semibold text-white transition-colors hover:bg-[#2a2a2a]"
                    >
                      Analyse Route
                    </button>
                  )}

                  {step === "loading" && (
                    <div className="mt-6 flex flex-col items-center gap-3 py-4">
                      <Spinner />
                      <p className="text-sm font-medium text-[#1a1a1a]">
                        Analysing...
                      </p>
                    </div>
                  )}

                  {step === "failed" && (
                    <div className="mt-5 rounded-[4px] border-2 border-[#1a1a1a] bg-white p-4 text-center">
                      <p className="text-sm font-medium text-[#1a1a1a]">
                        {tooLargeFail
                          ? "Image too large, max 10MB"
                          : failMessage || "Analysis failed, please try again"}
                      </p>
                      {tooLargeFail ? (
                        <button
                          type="button"
                          onClick={resetAll}
                          className="mt-4 h-10 w-full rounded-[4px] border-2 border-[#1a1a1a] bg-white text-sm font-semibold text-[#1a1a1a] hover:bg-[#f5f4f0]"
                        >
                          Choose another photo
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={runAnalyze}
                          className="mt-4 h-10 w-full rounded-[4px] border-2 border-[#1a1a1a] bg-[#1a1a1a] text-sm font-semibold text-white hover:bg-[#2a2a2a]"
                        >
                          Retry
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[4px] border-2 border-[#1a1a1a] bg-white px-2 py-3 text-center">
      <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-[#1a1a1a]/55">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-bold text-[#1a1a1a]">{value}</p>
    </div>
  );
}
