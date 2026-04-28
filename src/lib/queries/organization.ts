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

export async function getOrganizationsByUserId(userId: string) {
  const userorganization = await db
    .select({
      organization: organization,
    })
    .from(organizationMember)
    .innerJoin(
      organization,
      eq(organizationMember.organizationId, organization.id),
    )
    .where(eq(organizationMember.userId, userId));

  return userorganization;
}

export async function getOrganizationByMembership(
  organizationId: string,
  userId: string,
) {
  const [result] = await db
    .select({ organization })
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

  return result.organization ?? null;
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

export async function hasOrganizationOwner(
  organizationId: string,
): Promise<boolean> {
  const [owner] = await db
    .select()
    .from(organizationMember)
    .where(
      and(
        eq(organizationMember.organizationId, organizationId),
        eq(organizationMember.role, "owner"),
      ),
    )
    .limit(1);

  return !!owner;
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

export async function updateOrganization(
  organizationId: string,
  data: { name: string },
) {
  const [updatedOrganization] = await db
    .update(organization)
    .set(data)
    .where(eq(organization.id, organizationId))
    .returning();

  return updatedOrganization;
}

export async function deleteOrganization(organizationId: string) {
  const [deletedOrganization] = await db
    .delete(organization)
    .where(eq(organization.id, organizationId))
    .returning();

  return deletedOrganization;
}
