import type { Metadata } from "next";

import { RouteAnalysis } from "@/components/route-analysis";

/**
 * Route Analysis：选图预览 → POST /api/analyze（base64）→ 豆包视觉 → 展示统计与步骤。
 * 选图后在 Client 内用 Canvas 压至最大宽 800px、JPEG quality 0.7，再转 base64（见 `route-analysis.tsx` + `lib/compress-wall-image.ts`）。
 */
export const metadata: Metadata = {
  title: "Route Analysis · No Beta",
  description: "Upload a boulder wall photo for AI route analysis (Doubao vision).",
};

export default function AnalyzePage() {
  return <RouteAnalysis />;
}
