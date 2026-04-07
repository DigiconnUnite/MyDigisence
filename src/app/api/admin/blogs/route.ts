import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getTokenFromRequest, verifyToken } from "@/lib/jwt";

const prisma = db as any;

const createBlogSchema = z.object({
  title: z.string().min(5),
  excerpt: z.string().min(20),
  category: z.string().min(2),
  author: z.string().min(2),
  readTime: z.string().min(3),
  coverImage: z.string().trim().optional().nullable(),
  contentHtml: z.string().min(1),
  isPublished: z.boolean().default(false),
});

async function getSuperAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request) || request.cookies.get("auth-token")?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload || payload.role !== "SUPER_ADMIN") return null;

  return payload;
}

async function generateUniqueSlug(title: string) {
  let baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (!baseSlug) {
    baseSlug = "blog-post";
  }

  let slug = baseSlug;
  let counter = 1;

  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
}

export async function GET(request: NextRequest) {
  try {
    const admin = await getSuperAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";

    const where: {
      isPublished?: boolean;
      OR?: Array<
        | { title: { contains: string; mode: "insensitive" } }
        | { excerpt: { contains: string; mode: "insensitive" } }
        | { category: { contains: string; mode: "insensitive" } }
        | { author: { contains: string; mode: "insensitive" } }
      >;
    } = {};

    if (status === "published") {
      where.isPublished = true;
    } else if (status === "draft") {
      where.isPublished = false;
    }

    if (search.trim()) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
      ];
    }

    const blogs = await prisma.blogPost.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
    });

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getSuperAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createBlogSchema.parse(body);

    const slug = await generateUniqueSlug(parsed.title);
    const publishedAt = parsed.isPublished ? new Date() : null;

    const blog = await prisma.blogPost.create({
      data: {
        title: parsed.title,
        slug,
        excerpt: parsed.excerpt,
        category: parsed.category,
        author: parsed.author,
        readTime: parsed.readTime,
        coverImage: parsed.coverImage || null,
        contentHtml: parsed.contentHtml,
        sections: [],
        isPublished: parsed.isPublished,
        publishedAt,
      },
    });

    return NextResponse.json({ blog }, { status: 201 });
  } catch (error) {
    console.error("Failed to create blog:", error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 400 });
  }
}
