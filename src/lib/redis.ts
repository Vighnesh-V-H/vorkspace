import Redis from "ioredis";
import {
  ORG_CACHE_PREFIX,
  ORG_CACHE_TTL,
  ORG_USER_CACHE_PREFIX,
} from "./consts/keys";
import {
  getOrganizationByMembership,
  getOrganizationsByUserId,
} from "./queries/organization";
import { Organization } from "@/db/schema";

export const redis = new Redis(process.env.REDIS_URL!);

export type OrganizationByMembership = {
  organization: Organization;
};

export async function getCachedOrgMembership(
  orgId: string,
  userId: string,
): Promise<Organization> {
  const key = `${ORG_CACHE_PREFIX}${orgId}:${userId}`;
  const cached = await redis.get(key);
  if (cached !== null) return JSON.parse(cached);
  const data = await getOrganizationByMembership(orgId, userId);
  await redis.set(key, JSON.stringify(data), "EX", ORG_CACHE_TTL);
  return data;
}

export async function getCachedOrganizationsByUserId(
  userId: string,
): Promise<OrganizationByMembership[]> {
  const key = `${ORG_USER_CACHE_PREFIX}${userId}`;
  const cached = await redis.get(key);
  if (cached !== null) return JSON.parse(cached);
  const data = await getOrganizationsByUserId(userId);
  await redis.set(key, JSON.stringify(data), "EX", ORG_CACHE_TTL);
  return data;
}

export async function invalidateOrgMembershipCache(
  orgId: string,
  userId: string,
) {
  await redis.del(`${ORG_CACHE_PREFIX}${orgId}:${userId}`);
}

export async function invalidateUserOrganizationsCache(userId: string) {
  await redis.del(`${ORG_USER_CACHE_PREFIX}${userId}`);
}
