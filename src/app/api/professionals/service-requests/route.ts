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
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");

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
      professionalId: professional.id,
    };

    if (status && status !== "all") {
      whereClause.status = status.toUpperCase();
    }

    if (priority && priority !== "all") {
      whereClause.priority = priority.toUpperCase();
    }

    if (search) {
      whereClause.OR = [
        {
          clientName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          clientEmail: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          service: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Get service requests
    const serviceRequests = await prisma.serviceRequest.findMany({
      where: whereClause,
      include: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
        },
        attachments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform data to match expected format
    const transformedRequests = serviceRequests.map(request => ({
      id: request.id,
      clientName: request.clientName,
      clientEmail: request.clientEmail,
      clientPhone: request.clientPhone,
      service: request.service,
      category: request.category,
      budget: request.budget,
      timeline: request.timeline,
      description: request.description,
      status: request.status.toLowerCase(),
      priority: request.priority.toLowerCase(),
      submittedAt: request.createdAt.toISOString(),
      lastUpdated: request.updatedAt.toISOString(),
      deadline: request.deadline?.toISOString(),
      estimatedValue: request.estimatedValue,
      clientLocation: request.clientLocation,
      attachments: request.attachments.map(att => ({
        name: att.fileName,
        url: att.fileUrl,
        size: att.fileSize,
      })),
      messages: request.messages.map(msg => ({
        id: msg.id,
        sender: msg.senderType.toLowerCase(),
        content: msg.content,
        timestamp: msg.createdAt.toISOString(),
      })),
    }));

    return NextResponse.json({ serviceRequests: transformedRequests });
  } catch (error) {
    console.error("Service requests API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch service requests" },
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
    const {
      clientName,
      clientEmail,
      clientPhone,
      service,
      category,
      budget,
      timeline,
      description,
      priority = "medium",
      deadline,
      estimatedValue,
      clientLocation,
    } = body;

    // Validate required fields
    if (!clientName || !clientEmail || !service || !description) {
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

    // Create service request
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        professionalId: professional.id,
        clientName,
        clientEmail,
        clientPhone,
        service,
        category,
        budget,
        timeline,
        description,
        priority: priority.toUpperCase(),
        status: "PENDING",
        deadline: deadline ? new Date(deadline) : null,
        estimatedValue,
        clientLocation,
      },
      include: {
        messages: true,
        attachments: true,
      },
    });

    // Transform response
    const transformedRequest = {
      id: serviceRequest.id,
      clientName: serviceRequest.clientName,
      clientEmail: serviceRequest.clientEmail,
      clientPhone: serviceRequest.clientPhone,
      service: serviceRequest.service,
      category: serviceRequest.category,
      budget: serviceRequest.budget,
      timeline: serviceRequest.timeline,
      description: serviceRequest.description,
      status: serviceRequest.status.toLowerCase(),
      priority: serviceRequest.priority.toLowerCase(),
      submittedAt: serviceRequest.createdAt.toISOString(),
      lastUpdated: serviceRequest.updatedAt.toISOString(),
      deadline: serviceRequest.deadline?.toISOString(),
      estimatedValue: serviceRequest.estimatedValue,
      clientLocation: serviceRequest.clientLocation,
      attachments: [],
      messages: [],
    };

    return NextResponse.json({ serviceRequest: transformedRequest });
  } catch (error) {
    console.error("Create service request API error:", error);
    return NextResponse.json(
      { error: "Failed to create service request" },
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
    const { id, status, message } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Service request ID is required" },
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

    // Update service request
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (status) {
      updateData.status = status.toUpperCase();
    }

    const serviceRequest = await prisma.serviceRequest.update({
      where: {
        id,
        professionalId: professional.id,
      },
      data: updateData,
      include: {
        messages: true,
        attachments: true,
      },
    });

    // Add message if provided
    if (message) {
      await prisma.serviceRequestMessage.create({
        data: {
          serviceRequestId: id,
          senderType: "PROFESSIONAL",
          content: message,
        },
      });
    }

    return NextResponse.json({ serviceRequest });
  } catch (error) {
    console.error("Update service request API error:", error);
    return NextResponse.json(
      { error: "Failed to update service request" },
      { status: 500 }
    );
  }
}
