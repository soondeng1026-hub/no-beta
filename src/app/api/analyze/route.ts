import { NextResponse } from "next/server";

import {
  isRouteAnalysisResult,
  normalizeRouteAnalysis,
  type RouteAnalysisResult,
} from "@/lib/analysis-types";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024;

const ARK_URL = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";

/**
 * 方舟 Chat API 的 model：须与控制台「推理接入点」或模型广场展示一致。
 * 多数账号需填 ep-xxxx；若填模型名，官方文档常见为 Doubao-1.5-vision-pro（首字母大写 D）。
 */
const DEFAULT_VISION_MODEL = "Doubao-1.5-vision-pro";

/** 文档调试 curl 里的示例 Bearer，不是可调用密钥，复制进 .env 会 401 */
const DOC_SAMPLE_ARK_API_KEY = "d5779ef6-fbb4-4d8b-a4e5-1046d5486bd2";

const SYSTEM_PROMPT = `你是一名专业的抱石教练，请分析这张抱石岩壁图片，只返回 JSON，不要其他文字：
{
  "route_color": "路线岩点颜色",
  "difficulty": "难度等级如V4或Unknown",
  "hold_count": 数字,
  "sequence": ["第1步", "第2步"...],
  "key_moves": ["关键动作1", "动作2"...],
  "body_tips": ["姿态建议1", "建议2"...]
}`;

function extractAssistantText(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const choices = (data as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || !choices[0]) return null;
  const msg = (choices[0] as { message?: { content?: unknown } }).message;
  const c = msg?.content;
  if (typeof c === "string") return c;
  if (Array.isArray(c)) {
    const parts = c
      .map((p) => {
        if (p && typeof p === "object" && "text" in p) {
          return String((p as { text?: string }).text ?? "");
        }
        return "";
      })
      .join("");
    return parts || null;
  }
  return null;
}

function parseModelJsonToResult(text: string): RouteAnalysisResult {
  const trimmed = text.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  const rawStr = jsonMatch ? jsonMatch[0] : trimmed;
  const parsed: unknown = JSON.parse(rawStr);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid JSON");
  }
  const normalized = normalizeRouteAnalysis(parsed as Record<string, unknown>);
  if (!isRouteAnalysisResult(normalized)) {
    throw new Error("Invalid analysis shape");
  }
  return normalized;
}

type AnalyzeBody = {
  imageBase64?: string;
  mimeType?: string;
};

function normalizeArkApiKey(raw: string): string {
  let k = raw
    .replace(/^\uFEFF/, "")
    .replace(/[\u200b-\u200d\ufeff]/g, "")
    .trim();
  while (
    (k.startsWith('"') && k.endsWith('"')) ||
    (k.startsWith("'") && k.endsWith("'"))
  ) {
    k = k.slice(1, -1).trim();
  }
  if (/^bearer\s+/i.test(k)) {
    k = k.replace(/^bearer\s+/i, "").trim();
  }
  return k;
}

function firstNonEmptyArkKeyEnv(): string {
  for (const v of [process.env.DOUBAO_API_KEY, process.env.ARK_API_KEY]) {
    if (v != null && String(v).trim() !== "") return String(v);
  }
  return "";
}

export async function POST(request: Request) {
  try {
    const rawKey = firstNonEmptyArkKeyEnv();
    const apiKey = rawKey ? normalizeArkApiKey(rawKey) : "";
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "missing_api_key",
          message:
            "DOUBAO_API_KEY or ARK_API_KEY is not configured in .env.local",
        },
        { status: 503 }
      );
    }

    const model =
      process.env.DOUBAO_MODEL?.trim() || DEFAULT_VISION_MODEL;

    let body: AnalyzeBody;
    try {
      body = (await request.json()) as AnalyzeBody;
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }

    let b64 = body.imageBase64?.trim() ?? "";
    let mime = (body.mimeType ?? "image/jpeg").trim();

    if (b64.startsWith("data:")) {
      const m = b64.match(/^data:([^;]+);base64,([\s\S]+)$/);
      if (m) {
        mime = m[1] || mime;
        b64 = m[2] ?? "";
      }
    }

    if (!b64) {
      return NextResponse.json({ error: "no_image" }, { status: 400 });
    }

    let buf: Buffer;
    try {
      buf = Buffer.from(b64, "base64");
    } catch {
      return NextResponse.json({ error: "invalid_base64" }, { status: 400 });
    }

    if (buf.length === 0) {
      return NextResponse.json({ error: "no_image" }, { status: 400 });
    }

    if (buf.length > MAX_BYTES) {
      return NextResponse.json({ error: "too_large" }, { status: 400 });
    }

    if (!mime.startsWith("image/")) {
      return NextResponse.json({ error: "invalid_mime" }, { status: 400 });
    }

    const res = await fetch(ARK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      // 结构对齐官方示例：先 image_url 再 text；图片用 data URL（本地上传无公网 URL 时）
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              {
                image_url: {
                  url: `data:${mime};base64,${b64}`,
                },
                type: "image_url",
              },
              {
                text: "请根据上图输出上述 JSON 结构。",
                type: "text",
              },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      let message = `Ark HTTP ${res.status}: ${errText.slice(0, 280)}`;
      if (res.status === 401) {
        message +=
          " — Use YOUR Ark API Key from console → API Key management (not IAM AccessKey/Secret). Env: DOUBAO_API_KEY or ARK_API_KEY; one line, no quotes around the value.";
        if (apiKey.toLowerCase() === DOC_SAMPLE_ARK_API_KEY) {
          message +=
            " 【当前值是官方 curl 里的示例 Key，无法调用】请到控制台新建 API Key 并替换 .env.local，然后重启 next dev。";
        }
      }
      if (res.status === 404 || errText.includes("InvalidEndpointOrModel")) {
        message +=
          " — Set DOUBAO_MODEL to your inference endpoint ID from Ark console (starts with ep-), copied from the endpoint list / “API 调用”. Model name strings vary by account; ep- ID is most reliable.";
      }
      return NextResponse.json(
        { error: "upstream_error", message },
        { status: 502 }
      );
    }

    const data: unknown = await res.json();
    const content = extractAssistantText(data);
    if (!content) {
      return NextResponse.json({ error: "empty_model_response" }, { status: 502 });
    }

    let result: RouteAnalysisResult;
    try {
      result = parseModelJsonToResult(content);
    } catch {
      return NextResponse.json({ error: "parse_failed" }, { status: 502 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "analysis_failed" }, { status: 500 });
  }
}
