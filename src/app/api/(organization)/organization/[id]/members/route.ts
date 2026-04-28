import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { getCachedOrgMembership } from "@/lib/redis";
import { getAllOrganizationMembers } from "@/lib/queries/organization-member";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Invalid organization ID" },
        { status: 400 },
      );
    }

    const membership = await getCachedOrgMembership(id, session.user.id);

    if (!membership) {
      return NextResponse.json(
        { error: "Forbidden: You do not have access to this organization" },
        { status: 403 },
      );
    }

    const members = await getAllOrganizationMembers(id);

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching organization members:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
