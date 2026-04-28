import { db } from "@/db";
import { organizationMember } from "@/db/schema";
import { user } from "@/db/schema/auth/user";
import { and, eq, ilike, isNull, or } from "drizzle-orm";

export async function searchOrganizationMembers(
  organizationId: string,
  query: string,
) {
  const results = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: organizationMember.role,
    })
    .from(organizationMember)
    .innerJoin(user, eq(organizationMember.userId, user.id))
    .where(
      and(
        eq(organizationMember.organizationId, organizationId),
        isNull(organizationMember.removedAt),
        or(ilike(user.name, `%${query}%`), ilike(user.email, `%${query}%`)),
      ),
    )
    .limit(10);

  return results;
}

export async function getOrganizationMembership(
  organizationId: string,
  userId: string,
) {
  const [membership] = await db
    .select()
    .from(organizationMember)
    .where(
      and(
        eq(organizationMember.organizationId, organizationId),
        eq(organizationMember.userId, userId),
      ),
    );

  return membership;
}

export async function getOrganizationMemberRole(
  organizationId: string,
  userId: string,
) {
  const [membership] = await db
    .select({ role: organizationMember.role })
    .from(organizationMember)
    .where(
      and(
        eq(organizationMember.organizationId, organizationId),
        eq(organizationMember.userId, userId),
      ),
    );

  return membership?.role ?? null;
}

export async function getAllOrganizationMembers(organizationId: string) {
  const members = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: organizationMember.role,
    })
    .from(organizationMember)
    .innerJoin(user, eq(organizationMember.userId, user.id))
    .where(
      and(
        eq(organizationMember.organizationId, organizationId),
        isNull(organizationMember.removedAt),
      ),
    );

  return members;
}
