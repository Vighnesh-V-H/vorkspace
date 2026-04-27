import Redis from "ioredis";
import {
  NOTIFICATIONS_CACHE_PREFIX,
  NOTIFICATIONS_CACHE_TTL,
  ORG_CACHE_PREFIX,
  ORG_CACHE_TTL,
  ORG_USER_CACHE_PREFIX,
  TICKETS_CACHE_PREFIX,
  TICKETS_CACHE_TTL,
} from "./consts/keys";
import {
  getOrganizationByMembership,
  getOrganizationsByUserId,
} from "./queries/organization";
import { getNotificationsByUserId } from "./queries/notification";
import { getTicketsByOrganization } from "./queries/ticket";
import { Notification, Organization } from "@/db/schema";

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

export async function getCachedNotificationsByUserId(
  userId: string,
): Promise<Notification[]> {
  const key = `${NOTIFICATIONS_CACHE_PREFIX}${userId}`;
  const cached = await redis.get(key);
  if (cached !== null) return JSON.parse(cached);
  const data = await getNotificationsByUserId(userId);
  await redis.set(key, JSON.stringify(data), "EX", NOTIFICATIONS_CACHE_TTL);
  return data;
}

export async function invalidateNotificationsCache(userId: string) {
  await redis.del(`${NOTIFICATIONS_CACHE_PREFIX}${userId}`);
}

export async function getCachedTicketsByOrganization(
  organizationId: string,
) {
  const key = `${TICKETS_CACHE_PREFIX}${organizationId}`;
  const cached = await redis.get(key);
  if (cached !== null) return JSON.parse(cached);
  const data = await getTicketsByOrganization(organizationId);
  await redis.set(key, JSON.stringify(data), "EX", TICKETS_CACHE_TTL);
  return data;
}

export async function invalidateTicketsCache(organizationId: string) {
  await redis.del(`${TICKETS_CACHE_PREFIX}${organizationId}`);
}
