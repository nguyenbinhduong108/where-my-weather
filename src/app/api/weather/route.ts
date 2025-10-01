import { NextResponse } from "next/server";
import { serverPost } from "@/app/api/base";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await serverPost("/tasks/get", body);
    return NextResponse.json(result.data, { status: result.status });
  } catch (err) {
    return NextResponse.json({ error: "Server proxy error", detail: (err as Error).message }, { status: 500 });
  }
}
