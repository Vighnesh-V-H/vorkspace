import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { getMembershipById } from "@/lib/queries/organization";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if the user is a member of the organization.
    // getMembershipById joins organizationMember and organization and filters by orgId and userId.
    const membership = await getMembershipById(id, session.user.id);

    if (!membership || membership.length === 0) {
      return NextResponse.json(
        { error: "Organization not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, organization: membership[0].organization },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting organization by id:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
