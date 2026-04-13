import type { Metadata } from "next";

import { RouteAnalysis } from "@/components/route-analysis";

/**
 * Route Analysis：选图预览 → POST /api/analyze（base64）→ 豆包视觉 → 展示统计与步骤。
 * 交互与 UI 实现在 `src/components/route-analysis.tsx`。
 */
export const metadata: Metadata = {
  title: "Route Analysis · No Beta",
  description: "Upload a boulder wall photo for AI route analysis (Doubao vision).",
};

export default function AnalyzePage() {
  return <RouteAnalysis />;
}
