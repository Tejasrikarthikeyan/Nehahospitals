import { NextResponse } from "next/server";

const TARGET_BASE_URL = "https://hydration-cycle-answering.ngrok-free.dev/nehahospital";

async function proxyHandler(req: Request, props: { params: Promise<{ path: string[] }> }) {
  try {
    const params = await props.params;
    const pathSegments = params.path || [];
    const pathStr = pathSegments.join("/");
    const searchStr = new URL(req.url).search;

    const targetUrl = `${TARGET_BASE_URL}/${pathStr}/${searchStr}`;

    const headers: Record<string, string> = {
      "ngrok-skip-browser-warning": "true",
      "X-Staff-Key": req.headers.get("X-Staff-Key") || "NEHA2026",
    };

    const contentType = req.headers.get("content-type");
    if (contentType) headers["Content-Type"] = contentType;

    let body: string | undefined = undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      body = await req.text();
    }

    const res = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
    });

    const text = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Proxy request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const GET = proxyHandler;
export const POST = proxyHandler;
export const PATCH = proxyHandler;
export const PUT = proxyHandler;
export const DELETE = proxyHandler;
