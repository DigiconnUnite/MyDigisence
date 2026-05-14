import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getTokenFromRequest, verifyToken } from "@/lib/jwt";

async function getProfessionalAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request) || request.cookies.get("auth-token")?.value;

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload || payload.role !== "PROFESSIONAL_ADMIN") {
    return null;
  }

  return payload;
}

export async function GET(request: NextRequest) {
  try {
    const admin = await getProfessionalAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const professional = await db.professional.findFirst({
      where: { adminId: admin.userId },
      include: {
        workExperience: true,
        education: true,
        services: true,
        portfolio: true,
        skills: true,
      },
    });

    if (!professional) {
      return NextResponse.json({ error: "Professional not found" }, { status: 404 });
    }

    return NextResponse.json(
      { professional },
      {
        headers: {
          "Cache-Control": "private, no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Professional me fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
