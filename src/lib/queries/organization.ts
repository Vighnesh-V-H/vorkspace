import { db } from "@/db";
import { organization, organizationMember } from "@/db/schema";
import { Session } from "better-auth";
import { and, eq } from "drizzle-orm";

type CreateOrganizationInput = {
  name: string;
  email: string;
  city?: string;
  state?: string;
  zipCode?: string;
  ownerId: string;
};

export async function getOrganizationsBySession(session: Session) {
  const userorganization = await db
    .select({
      organization: organization,
    })
    .from(organizationMember)
    .innerJoin(
      organization,
      eq(organizationMember.organizationId, organization.id),
    )
    .where(eq(organizationMember.userId, session.userId));

  return userorganization;
}

export async function getMembershipById(
  organizationId: string,
  userId: string,
) {
  const membership = await db
    .select({
      organization: organization,
    })
    .from(organizationMember)
    .innerJoin(
      organization,
      eq(organizationMember.organizationId, organization.id),
    )
    .where(
      and(
        eq(organizationMember.organizationId, organizationId),
        eq(organizationMember.userId, userId),
      ),
    )
    .limit(1);

  return membership;
}

export async function getOrganizationById(organizationId: string) {
  const org = await db
    .select({
      organization: organization,
    })
    .from(organization)
    .where(eq(organization.id, organizationId))
    .limit(1);

  return org;
}

export async function createOrganizationWithOwner({
  name,
  email,
  city,
  state,
  zipCode,
  ownerId,
}: CreateOrganizationInput) {
  const organizationId = crypto.randomUUID();

  const [newOrganization] = await db
    .insert(organization)
    .values({
      id: organizationId,
      name,
      email,
      address: {
        city,
        state,
        zipCode,
      },
      ownerId,
    })
    .returning();

  await db.insert(organizationMember).values({
    id: crypto.randomUUID(),
    organizationId: newOrganization.id,
    userId: ownerId,
    role: "owner",
  });

  return newOrganization;
}
