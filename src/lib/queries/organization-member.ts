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
