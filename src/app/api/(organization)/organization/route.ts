import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { createOrganizationWithOwner } from "@/lib/queries/organization";
import { getCachedOrganizationsByUserId } from "@/lib/redis";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userOrganizations = await getCachedOrganizationsByUserId(
      session.session.userId,
    );

    return NextResponse.json(
      {
        organizations: userOrganizations.map(
          ({ organization }) => organization,
        ),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error getting organizations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

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

    const newOrg = await createOrganizationWithOwner({
      name,
      email,
      city,
      state,
      zipCode,
      ownerId: session.user.id,
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
