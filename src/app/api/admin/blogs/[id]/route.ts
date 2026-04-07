import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getTokenFromRequest, verifyToken } from "@/lib/jwt";

const prisma = db as any;

const updateBlogSchema = z.object({
  title: z.string().min(5).optional(),
  excerpt: z.string().min(20).optional(),
  category: z.string().min(2).optional(),
  author: z.string().min(2).optional(),
  readTime: z.string().min(3).optional(),
  coverImage: z.string().trim().optional().nullable(),
  contentHtml: z.string().min(1).optional(),
  isPublished: z.boolean().optional(),
});

async function getSuperAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request) || request.cookies.get("auth-token")?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload || payload.role !== "SUPER_ADMIN") return null;

  return payload;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await getSuperAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateBlogSchema.parse(body);

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const shouldPublishNow = parsed.isPublished === true && !existing.isPublished;

    const blog = await prisma.blogPost.update({
      where: { id },
      data: {
        ...parsed,
        coverImage: parsed.coverImage === undefined ? undefined : parsed.coverImage || null,
        contentHtml: parsed.contentHtml,
        publishedAt:
          parsed.isPublished === undefined
            ? undefined
            : parsed.isPublished
              ? existing.publishedAt ?? (shouldPublishNow ? new Date() : existing.publishedAt)
              : null,
      },
    });

    return NextResponse.json({ blog });
  } catch (error) {
    console.error("Failed to update blog:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await getSuperAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.blogPost.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete blog:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 400 });
  }
}
