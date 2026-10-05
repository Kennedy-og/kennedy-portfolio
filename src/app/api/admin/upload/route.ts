import { NextResponse } from "next/server";
import { saveUploadedImage } from "@/lib/portfolio-store";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  const isAllowed = await requireAdmin();
  if (!isAllowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: "Images must be 4 MB or smaller." }, { status: 413 });
    }

    if (folder !== "profile" && folder !== "projects") {
      return NextResponse.json({ error: "Invalid upload target." }, { status: 400 });
    }

    const url = await saveUploadedImage(file, folder);
    if (!url) {
      return NextResponse.json({ error: "Image upload failed." }, { status: 500 });
    }

    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 500 });
  }
}
