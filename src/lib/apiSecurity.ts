import { NextRequest, NextResponse } from "next/server";

const NAME_REGEX = /^[A-Za-z0-9][A-Za-z0-9 _-]{0,79}$/;
const INGREDIENT_TYPES = new Set(["Language", "Library", "Framework", "Tool"]);

const rateWindowMap = new Map<string, number[]>();

export function validateName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!NAME_REGEX.test(trimmed)) return null;
  return trimmed;
}

export function validateIngredientType(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return INGREDIENT_TYPES.has(value) ? value : null;
}

export function validateTextField(
  value: unknown,
  maxLength: number,
): string | null {
  if (typeof value !== "string") return null;
  if (value.length === 0 || value.length > maxLength) return null;
  return value;
}

export function parseBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

export async function parseJsonBody(
  req: NextRequest,
): Promise<{ data: Record<string, unknown> } | { response: NextResponse }> {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return {
        response: NextResponse.json(
          { error: "Invalid JSON payload" },
          { status: 400 },
        ),
      };
    }

    return { data: body as Record<string, unknown> };
  } catch {
    return {
      response: NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      ),
    };
  }
}

export function enforceWriteApiKey(req: NextRequest): NextResponse | null {
  const requiredApiKey = process.env.API_WRITE_TOKEN;

  // Optional auth: if token is not configured, keep backwards compatibility.
  if (!requiredApiKey) return null;

  const providedApiKey = req.headers.get("x-api-key")?.trim();
  if (!providedApiKey || providedApiKey !== requiredApiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return req.headers.get("x-real-ip") || "unknown";
}

export function enforceRateLimit(
  req: NextRequest,
  key: string,
  limit = Number(process.env.API_RATE_LIMIT ?? 60),
  windowMs = Number(process.env.API_RATE_WINDOW_MS ?? 60_000),
): NextResponse | null {
  const ip = getClientIp(req);
  const now = Date.now();
  const bucketKey = `${key}:${ip}`;

  const existing = rateWindowMap.get(bucketKey) ?? [];
  const activeWindow = existing.filter((ts) => now - ts < windowMs);

  if (activeWindow.length >= limit) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(windowMs / 1000)),
        },
      },
    );
  }

  activeWindow.push(now);
  rateWindowMap.set(bucketKey, activeWindow);

  return null;
}
