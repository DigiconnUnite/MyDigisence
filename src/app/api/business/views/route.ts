import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";

const viewSchema = z.object({
  slug: z.string().min(1),
});

function getClientIdentifier(request: NextRequest, slug: string) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip") || "unknown";
  return `business_view:${slug}:${ip}`;
}

function startOfDayUtc(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug } = viewSchema.parse(body);

    const rateResult = await checkRateLimit(getClientIdentifier(request, slug));
    if (!rateResult.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const business = await db.business.update({
      where: { slug },
      data: { profileViews: { increment: 1 } },
      select: { id: true, profileViews: true },
    }).catch(() => null);

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const today = startOfDayUtc(new Date());
    await db.businessViewDaily.upsert({
      where: { businessId_date: { businessId: business.id, date: today } },
      update: { views: { increment: 1 } },
      create: { businessId: business.id, date: today, views: 1 },
    });

    return NextResponse.json({ success: true, views: business.profileViews });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
