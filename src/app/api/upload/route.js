import { NextResponse } from "next/server";
import { uploadToMinio, uploadBase64ToMinio } from "@/lib/minio";

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // 1. Multipart Form Data (file upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") || formData.get("image");

      if (!file || typeof file === "string") {
        return NextResponse.json(
          { success: false, error: "No image file provided in form-data" },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = file.name || `image_${Date.now()}.png`;
      const mimeType = file.type || "image/png";

      const publicUrl = await uploadToMinio(buffer, filename, mimeType);

      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename,
      });
    }

    // 2. JSON Body (base64 image or direct upload)
    const body = await request.json();
    const { image, filename = "image" } = body || {};

    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image data is required" },
        { status: 400 }
      );
    }

    // If already http/https
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return NextResponse.json({ success: true, url: image });
    }

    // Base64 upload
    const publicUrl = await uploadBase64ToMinio(image, filename);

    return NextResponse.json({
      success: true,
      url: publicUrl,
    });
  } catch (error) {
    console.error("MinIO Upload Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to upload image to MinIO storage",
      },
      { status: 500 }
    );
  }
}
