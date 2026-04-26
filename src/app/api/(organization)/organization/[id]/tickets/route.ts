import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { createTicket, getTicketsByOrganization } from "@/lib/queries/ticket";
import { createTicketSchema } from "@/lib/zod/ticket";
import { sendNotification } from "@/lib/notifications";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: organizationId } = await params;
    const tickets = await getTicketsByOrganization(organizationId);

    return NextResponse.json({ tickets }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: organizationId } = await params;
    const body = await req.json();

    const parsed = createTicketSchema.safeParse({
      ...body,
      organizationId,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const newTicket = await createTicket({
      title: parsed.data.title,
      description: parsed.data.description,
      tag: parsed.data.tag,
      organizationId: parsed.data.organizationId,
      assignedTo: parsed.data.assignedTo,
      createdBy: session.user.id,
    });

    if (parsed.data.assignedTo && parsed.data.assignedTo !== session.user.id) {
      await sendNotification({
        userId: parsed.data.assignedTo,
        organizationId: parsed.data.organizationId,
        entityId: newTicket.id.toString(),
        entityType: "ticket",
        title: "New Ticket Assigned",
        message: `You have been assigned to a new ticket: ${newTicket.title}`,
      });
    }

    return NextResponse.json(
      { success: true, ticket: newTicket },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 },
    );
  }
}
