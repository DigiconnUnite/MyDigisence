import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getTokenFromRequest, verifyToken } from "@/lib/jwt";
import {
  uploadToS3,
  getOptimizedImageUrl,
  getOptimizedVideoUrl,
} from "@/lib/s3-upload";

async function getBusinessAdmin(request: NextRequest) {
  const token =
    getTokenFromRequest(request) || request.cookies.get("auth-token")?.value;

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload || payload.role !== "BUSINESS_ADMIN") {
    return null;
  }

  // Use businessId directly from JWT if available (avoiding DB lookup)
  if (payload.businessId) {
    return { ...payload, businessId: payload.businessId };
  }

  // Fallback: Get the business for this admin if not in JWT
  const business = await db.business.findUnique({
    where: { adminId: payload.userId },
    select: { id: true },
  });

  if (!business) {
    return null;
  }

  return { ...payload, businessId: business.id };
}

async function getBusinessId(adminId: string) {
  const business = await db.business.findUnique({
    where: { adminId },
    select: { id: true },
  });
  return business?.id;
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getBusinessAdmin(request);
    if (!admin || !admin.businessId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type");

    // Check if it's a multipart/form-data (file upload)
    if (contentType && contentType.includes("multipart/form-data")) {
      // Handle file upload
      const formData = await request.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json(
          { error: "No file provided" },
          { status: 400 },
        );
      }

      // Validate file
      const maxSize = 50 * 1024 * 1024; // 50MB for videos
      const allowedImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
        "image/tiff",
        "image/svg+xml",
      ];
      const allowedVideoTypes = [
        "video/mp4",
        "video/webm",
        "video/ogg",
        "video/avi",
        "video/mov",
      ];
      const allowedPdfTypes = ["application/pdf"];
      const allowedTypes = [
        ...allowedImageTypes,
        ...allowedVideoTypes,
        ...allowedPdfTypes,
      ];

      if (file.size > maxSize) {
        return NextResponse.json(
          { error: "File size must be less than 50MB" },
          { status: 400 },
        );
      }

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          {
            error:
              "Invalid file type. Allowed: JPEG, JPG, PNG, GIF, WebP, BMP, TIFF, SVG, MP4, WebM, OGG, AVI, MOV, PDF",
          },
          { status: 400 },
        );
      }

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Determine if it's video or image for folder organization
      const isVideo = allowedVideoTypes.includes(file.type);
      const isPdf = allowedPdfTypes.includes(file.type);
      const folder = `bdpp-business/${admin.businessId}`;

      // Upload to S3
      const uploadResult = await uploadToS3(buffer, file.name, {
        folder,
        contentType: file.type,
      });

      if (!uploadResult.success) {
        return NextResponse.json(
          {
            error: "Failed to upload media",
            details: uploadResult.error,
          },
          { status: 500 },
        );
      }

      // Generate optimized URLs for videos
      let optimizedUrls = {};
      if (isVideo && uploadResult.url) {
        optimizedUrls = {
          optimized_720p: getOptimizedVideoUrl(uploadResult.url, {
            width: 720,
            height: 480,
          }),
          optimized_480p: getOptimizedVideoUrl(uploadResult.url, {
            width: 480,
            height: 320,
          }),
        };
      }

      return NextResponse.json({
        success: true,
        url: uploadResult.url,
        filename: file.name,
        size: file.size,
        type: file.type,
        resourceType: isVideo ? "video" : isPdf ? "raw" : "image",
        optimizedUrls,
        message: `${isVideo ? "Video" : isPdf ? "PDF" : "Image"} uploaded successfully`,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to upload media",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
