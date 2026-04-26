import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { searchOrganizationMembers } from "@/lib/queries/organization-member";

export async function GET(
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
    const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

    if (q.length < 2) {
      return NextResponse.json([], {
        status: 200,
        headers: { "Cache-Control": "private, max-age=10" },
      });
    }

    const results = await searchOrganizationMembers(organizationId, q);

    return NextResponse.json(results, {
      status: 200,
      headers: {
        "Cache-Control": "private, max-age=30, stale-while-revalidate=120",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to search members" },
      { status: 500 },
    );
  }
}
