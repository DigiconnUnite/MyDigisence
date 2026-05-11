import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db as prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");
    const unread = searchParams.get("unread");

    // Get professional data
    const professional = await prisma.professional.findFirst({
      where: {
        adminId: session.user.id,
      },
    });

    if (!professional) {
      return NextResponse.json({ error: "Professional not found" }, { status: 404 });
    }

    // Build where clause
    const whereClause: any = {
      OR: [
        {
          senderId: professional.id,
          senderType: "PROFESSIONAL",
        },
        {
          receiverId: professional.id,
          receiverType: "PROFESSIONAL",
        },
      ],
    };

    if (clientId) {
      whereClause.OR = [
        {
          AND: [
            { senderId: professional.id, senderType: "PROFESSIONAL" },
            { receiverId: clientId, receiverType: "CLIENT" },
          ],
        },
        {
          AND: [
            { receiverId: professional.id, receiverType: "PROFESSIONAL" },
            { senderId: clientId, senderType: "CLIENT" },
          ],
        },
      ];
    }

    if (unread === "true") {
      whereClause.read = false;
      whereClause.receiverId = professional.id;
      whereClause.receiverType = "PROFESSIONAL";
    }

    // Get messages
    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform data
    const transformedMessages = messages.map(message => ({
      id: message.id,
      senderId: message.senderId,
      receiverId: message.receiverId,
      senderType: message.senderType.toLowerCase(),
      receiverType: message.receiverType.toLowerCase(),
      content: message.content,
      read: message.read,
      timestamp: message.createdAt.toISOString(),
      sender: message.sender,
      receiver: message.receiver,
    }));

    return NextResponse.json({ messages: transformedMessages });
  } catch (error) {
    console.error("Messages API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { receiverId, receiverType, content } = body;

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get professional data
    const professional = await prisma.professional.findFirst({
      where: {
        adminId: session.user.id,
      },
    });

    if (!professional) {
      return NextResponse.json({ error: "Professional not found" }, { status: 404 });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId: professional.id,
        senderType: "PROFESSIONAL",
        receiverId,
        receiverType: receiverType.toUpperCase(),
        content,
        read: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Transform response
    const transformedMessage = {
      id: message.id,
      senderId: message.senderId,
      receiverId: message.receiverId,
      senderType: message.senderType.toLowerCase(),
      receiverType: message.receiverType.toLowerCase(),
      content: message.content,
      read: message.read,
      timestamp: message.createdAt.toISOString(),
      sender: message.sender,
      receiver: message.receiver,
    };

    return NextResponse.json({ message: transformedMessage });
  } catch (error) {
    console.error("Create message API error:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { messageId, markAsRead } = body;

    if (!messageId) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    // Get professional data
    const professional = await prisma.professional.findFirst({
      where: {
        adminId: session.user.id,
      },
    });

    if (!professional) {
      return NextResponse.json({ error: "Professional not found" }, { status: 404 });
    }

    // Update message
    const updateData: any = {};
    
    if (markAsRead) {
      updateData.read = true;
      updateData.readAt = new Date();
    }

    const message = await prisma.message.update({
      where: {
        id: messageId,
        receiverId: professional.id,
        receiverType: "PROFESSIONAL",
      },
      data: updateData,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Update message API error:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}
