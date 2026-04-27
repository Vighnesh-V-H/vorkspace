import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { sendNotification } from "@/lib/notifications";
import { getOrganizationMembership } from "@/lib/queries/organization-member";
import { getUserByEmail } from "@/lib/queries/user";
import { createOrganizationInvitation } from "@/lib/queries/invitation";
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
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const membership = await getOrganizationMembership(
      organizationId,
      session.user.id,
    );

    if (
      !membership ||
      (membership.role !== "admin" && membership.role !== "owner")
    ) {
      return NextResponse.json(
        { error: "You don't have permission to invite members" },
        { status: 403 },
      );
    }

    const invitedUser = await getUserByEmail(email);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const inviteId = crypto.randomUUID();

    await createOrganizationInvitation({
      id: inviteId,
      organizationId,
      email,
      role: role || "member",
      status: "pending",
      expiresAt,
      invitedBy: session.user.id,
    });

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
  } catch (error: unknown) {
    const err = error as { code?: string };
    console.error("Error creating invitation:", error);
    if (err.code === "23505") {
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
