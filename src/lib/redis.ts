import Redis from "ioredis";
import { ORG_CACHE_PREFIX, ORG_CACHE_TTL } from "./consts/keys";
import { getOrganizationByMembership } from "./queries/organization";

export const redis = new Redis(process.env.REDIS_URL!);

export async function getCachedOrgMembership(orgId: string, userId: string) {
  const key = `${ORG_CACHE_PREFIX}${orgId}:${userId}`;

  const cached = await redis.get(key);
  if (cached !== null) return cached;

  const data = await getOrganizationByMembership(orgId, userId);
  await redis.set(key, JSON.stringify(data), "EX", ORG_CACHE_TTL);
  return data;
}

export async function invalidateOrgMembershipCache(
  orgId: string,
  userId: string,
) {
  await redis.del(`${ORG_CACHE_PREFIX}${orgId}:${userId}`);
}
