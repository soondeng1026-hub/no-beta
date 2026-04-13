/** 前端与 API 返回统一使用的结构（camelCase） */
export type RouteAnalysisResult = {
  routeColor: string;
  grade: string;
  holdCount: number;
  movementSequence: string[];
  keyMoves: string[];
  bodyPositionTips: string[];
};

export function isRouteAnalysisResult(v: unknown): v is RouteAnalysisResult {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.routeColor === "string" &&
    typeof o.grade === "string" &&
    typeof o.holdCount === "number" &&
    Array.isArray(o.movementSequence) &&
    o.movementSequence.every((x) => typeof x === "string") &&
    Array.isArray(o.keyMoves) &&
    o.keyMoves.every((x) => typeof x === "string") &&
    Array.isArray(o.bodyPositionTips) &&
    o.bodyPositionTips.every((x) => typeof x === "string")
  );
}

function stringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string");
}

/** 将模型返回的 snake_case（或混写）规范为 RouteAnalysisResult */
export function normalizeRouteAnalysis(raw: Record<string, unknown>): RouteAnalysisResult {
  const holdRaw = raw.hold_count ?? raw.holdCount;
  const holdCount =
    typeof holdRaw === "number" && Number.isFinite(holdRaw)
      ? holdRaw
      : Number.parseInt(String(holdRaw ?? "0"), 10) || 0;

  return {
    routeColor: String(raw.route_color ?? raw.routeColor ?? "").trim() || "Unknown",
    grade: String(raw.difficulty ?? raw.grade ?? "Unknown").trim() || "Unknown",
    holdCount,
    movementSequence: stringArray(raw.sequence ?? raw.movementSequence),
    keyMoves: stringArray(raw.key_moves ?? raw.keyMoves),
    bodyPositionTips: stringArray(
      raw.body_tips ?? raw.bodyTips ?? raw.bodyPositionTips
    ),
  };
}
