import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const selectPathSchema = z.object({
  userId: z.string(),
  path: z.enum(["BUSINESS", "PROFESSIONAL", "NORMAL_USER"]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, path } = selectPathSchema.parse(body);

    // Update user path
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { userPath: path }
    } as any);

    return NextResponse.json({
      success: true,
      message: "Path selected successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        userPath: updatedUser.userPath,
      }
    });

  } catch (error) {
    console.error("Path selection error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An error occurred during path selection" },
      { status: 500 }
    );
  }
}
