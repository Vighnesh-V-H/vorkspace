import { db } from "@/db";
import { user } from "@/db/schema/auth/user";
import { or, ilike, eq } from "drizzle-orm";

export async function searchUsers(q: string) {
  const results = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    })
    .from(user)
    .where(or(ilike(user.name, `%${q}%`), ilike(user.email, `%${q}%`)))
    .limit(10);

  return results;
}

export async function getUserByEmail(email: string) {
  const [result] = await db
    .select()
    .from(user)
    .where(eq(user.email, email));
  return result;
}
