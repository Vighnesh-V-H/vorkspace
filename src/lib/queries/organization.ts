import { db } from "@/db";
import { organization, organizationMember } from "@/db/schema";
import { Session } from "better-auth";
import { and, eq } from "drizzle-orm";

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
