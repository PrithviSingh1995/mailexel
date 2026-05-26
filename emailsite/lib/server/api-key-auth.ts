import { NextResponse } from "next/server";

export function checkApiKey(req: Request): { ok: boolean; response?: Response } {
  const key = process.env.EXTERNAL_API_KEY;
  if (!key) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: "External API is disabled. Set EXTERNAL_API_KEY environment variable to enable it." },
        { status: 503 }
      ),
    };
  }
  const provided = req.headers.get("x-api-key");
  if (provided !== key) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: "Invalid or missing API key. Pass it via the X-API-Key header." },
        { status: 401 }
      ),
    };
  }
  return { ok: true };
}
