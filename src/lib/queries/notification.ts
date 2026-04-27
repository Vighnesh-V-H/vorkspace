import { db } from "@/db";
import { notification } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { getCachedNotificationsByUserId, invalidateNotificationsCache } from "../redis";

export async function getNotificationsByUserId(userId: string) {
  const notifications = await db
    .select()
    .from(notification)
    .where(eq(notification.userId, userId))
    .orderBy(desc(notification.createdAt))
    .limit(50);
  
  return notifications;
}

type CreateNotificationInput = {
  id: string;
  userId: string;
  organizationId: string;
  entityId: string;
  entityType: string;
  title: string;
  message: string;
};

export async function createNotification(data: CreateNotificationInput) {
  const [newNotification] = await db
    .insert(notification)
    .values(data)
    .returning();
    
  await invalidateNotificationsCache(data.userId);
  return newNotification;
}

export async function markAllNotificationsRead(userId: string) {
  await db
    .update(notification)
    .set({ isRead: true })
    .where(
      and(
        eq(notification.userId, userId),
        eq(notification.isRead, false)
      )
    );
    
  await invalidateNotificationsCache(userId);
}

export async function markNotificationRead(userId: string, notificationId: string) {
  await db
    .update(notification)
    .set({ isRead: true })
    .where(
      and(
        eq(notification.id, notificationId),
        eq(notification.userId, userId)
      )
    );
    
  await invalidateNotificationsCache(userId);
}
