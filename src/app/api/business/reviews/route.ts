import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const reviewSchema = z.object({
  slug: z.string().min(1),
  rating: z.number().min(1).max(5),
  title: z.string().max(120).optional(),
  content: z.string().min(10).max(2000),
  authorName: z.string().min(2).max(80),
  authorImage: z.string().url().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Business slug required" }, { status: 400 });
    }

    const business = await db.business.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const reviews = await db.review.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, rating, title, content, authorName, authorImage } = reviewSchema.parse(body);

    const business = await db.business.findUnique({
      where: { slug },
      select: { id: true, totalReviews: true, averageRating: true },
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const review = await db.review.create({
      data: {
        rating,
        title: title?.trim() || null,
        content,
        authorName,
        authorImage: authorImage || null,
        businessId: business.id,
      },
    });

    const totalReviews = business.totalReviews + 1;
    const averageRating =
      totalReviews === 0
        ? rating
        : (business.averageRating * business.totalReviews + rating) / totalReviews;

    await db.business.update({
      where: { id: business.id },
      data: {
        totalReviews,
        averageRating,
      },
    });

    return NextResponse.json({
      success: true,
      review,
      stats: { totalReviews, averageRating },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
