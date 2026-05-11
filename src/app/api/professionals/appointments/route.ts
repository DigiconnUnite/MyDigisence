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
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

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

    if (startDate && endDate) {
      whereClause.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Get appointments
    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            duration,
            price,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    // Transform data
    const transformedAppointments = appointments.map(appointment => ({
      id: appointment.id,
      clientId: appointment.clientId,
      client: appointment.client,
      serviceId: appointment.serviceId,
      service: appointment.service,
      title: appointment.title,
      description: appointment.description,
      status: appointment.status.toLowerCase(),
      startTime: appointment.startTime.toISOString(),
      endTime: appointment.endTime.toISOString(),
      duration: appointment.duration,
      location: appointment.location,
      meetingType: appointment.meetingType,
      meetingUrl: appointment.meetingUrl,
      notes: appointment.notes,
      createdAt: appointment.createdAt.toISOString(),
      updatedAt: appointment.updatedAt.toISOString(),
    }));

    return NextResponse.json({ appointments: transformedAppointments });
  } catch (error) {
    console.error("Appointments API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
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
      clientId,
      serviceId,
      title,
      description,
      startTime,
      endTime,
      duration,
      location,
      meetingType,
      meetingUrl,
      notes,
    } = body;

    if (!clientId || !title || !startTime || !endTime) {
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

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        professionalId: professional.id,
        clientId,
        serviceId,
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration,
        location,
        meetingType: meetingType?.toUpperCase(),
        meetingUrl,
        notes,
        status: "SCHEDULED",
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            duration,
            price,
          },
        },
      },
    });

    // Transform response
    const transformedAppointment = {
      id: appointment.id,
      clientId: appointment.clientId,
      client: appointment.client,
      serviceId: appointment.serviceId,
      service: appointment.service,
      title: appointment.title,
      description: appointment.description,
      status: appointment.status.toLowerCase(),
      startTime: appointment.startTime.toISOString(),
      endTime: appointment.endTime.toISOString(),
      duration: appointment.duration,
      location: appointment.location,
      meetingType: appointment.meetingType,
      meetingUrl: appointment.meetingUrl,
      notes: appointment.notes,
      createdAt: appointment.createdAt.toISOString(),
      updatedAt: appointment.updatedAt.toISOString(),
    };

    return NextResponse.json({ appointment: transformedAppointment });
  } catch (error) {
    console.error("Create appointment API error:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
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
    const { id, status, notes, startTime, endTime } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
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

    // Update appointment
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (status) {
      updateData.status = status.toUpperCase();
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (startTime) {
      updateData.startTime = new Date(startTime);
    }

    if (endTime) {
      updateData.endTime = new Date(endTime);
    }

    const appointment = await prisma.appointment.update({
      where: {
        id,
        professionalId: professional.id,
      },
      data: updateData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            duration,
            price,
          },
        },
      },
    });

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error("Update appointment API error:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get("id");

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
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

    // Delete appointment
    await prisma.appointment.delete({
      where: {
        id: appointmentId,
        professionalId: professional.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete appointment API error:", error);
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
