import { NextResponse } from "next/server";
import { writePortfolioData } from "@/lib/portfolio-store";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  const isAllowed = await requireAdmin();
  if (!isAllowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ error: "Invalid portfolio payload." }, { status: 400 });
    }

    await writePortfolioData(payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save portfolio." }, { status: 500 });
  }
}
