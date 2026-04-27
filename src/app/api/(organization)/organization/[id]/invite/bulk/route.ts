import { auth } from "@/lib/auth/auth";
import { createBulkOrganizationInvitations } from "@/lib/queries/invitation";
import { getOrganizationMembership } from "@/lib/queries/organization-member";
import { getUsersByEmails } from "@/lib/queries/user";
import { sendNotification } from "@/lib/notifications";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const organizationId = resolvedParams.id;

    const body = await req.json();
    const invites = body?.invites;

    if (!Array.isArray(invites) || invites.length === 0) {
      return NextResponse.json(
        { error: "invites must be a non-empty array" },
        { status: 400 },
      );
    }

    const membership = await getOrganizationMembership(
      organizationId,
      session.user.id,
    );

    if (!membership || !["owner", "admin"].includes(membership.role)) {
      return NextResponse.json(
        { error: "You don't have permission to invite members" },
        { status: 403 },
      );
    }

    const inserted = await createBulkOrganizationInvitations({
      organizationId,
      invitedBy: session.user.id,
      invites,
    });

    const users = inserted.length
      ? await getUsersByEmails(inserted.map((row) => row.email))
      : [];

    const userMap = new Map(users.map((u) => [u.email.toLowerCase(), u]));

    await Promise.all(
      inserted.map(async (invite) => {
        const target = userMap.get(invite.email.toLowerCase());
        if (!target) return;
        await sendNotification({
          userId: target.id,
          organizationId,
          entityId: invite.id,
          entityType: "invitation",
          title: "New Organization Invitation",
          message: `You have been invited to join an organization by ${session.user.email}.`,
        });
      }),
    );

    return NextResponse.json(
      {
        success: true,
        requested: invites.length,
        created: inserted.length,
        skipped: invites.length - inserted.length,
        invitations: inserted,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating bulk invitations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
