import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { organizationInvitation, organizationMember, user } from "@/db/schema";
import { sendNotification } from "@/lib/notifications";
import { eq, and } from "drizzle-orm";

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
    const { email, role } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    // Check if the current user has permission to invite
    const [membership] = await db
      .select()
      .from(organizationMember)
      .where(
        and(
          eq(organizationMember.organizationId, organizationId),
          eq(organizationMember.userId, session.user.id),
        ),
      );

    if (!membership || (membership.role !== "admin" && membership.role !== "owner")) {
      return NextResponse.json(
        { error: "You don't have permission to invite members" },
        { status: 403 },
      );
    }

    // Check if user exists
    const [invitedUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

    // Create the invitation
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // expires in 7 days

    const inviteId = crypto.randomUUID();

    await db.insert(organizationInvitation).values({
      id: inviteId,
      organizationId,
      email,
      role: role || "member",
      status: "pending",
      expiresAt,
      invitedBy: session.user.id,
    });

    // If the user is already registered on our platform, send them a real-time notification
    if (invitedUser) {
      await sendNotification({
        userId: invitedUser.id,
        organizationId,
        entityId: inviteId,
        entityType: "invitation",
        title: "New Organization Invitation",
        message: `You have been invited to join an organization by ${session.user.email}.`,
      });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating invitation:", error);
    if (error.code === '23505') { // Unique violation
       return NextResponse.json(
        { error: "Invitation already sent to this email" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
