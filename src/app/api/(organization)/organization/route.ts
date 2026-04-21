import { NextResponse } from "next/server";
import { db } from "@/db";
import { organization, organizationMember } from "@/db/schema/organization";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { getOrganizationById } from "@/lib/queries/organization";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, city, state, zipCode } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    const orgId = crypto.randomUUID();

    const [newOrg] = await db
      .insert(organization)
      .values({
        id: orgId,
        name,
        email,
        address: { city, state, zipCode },
        ownerId: session.user.id,
      })
      .returning();

    await db.insert(organizationMember).values({
      id: crypto.randomUUID(),
      organizationId: newOrg.id,
      userId: session.user.id,
      role: "owner",
    });

    return NextResponse.json(
      { success: true, organization: newOrg },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
