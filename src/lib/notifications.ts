import { db } from "@/db";
import { notification } from "@/db/schema/notification";
import { redis } from "@/lib/redis";

type SendNotificationParams = {
  userId: string;
  organizationId: string;
  entityId: string;
  entityType: string;
  title: string;
  message: string;
};

export async function sendNotification(params: SendNotificationParams) {
  const id = crypto.randomUUID();

  const [newNotification] = await db
    .insert(notification)
    .values({
      id,
      ...params,
    })
    .returning();

  await redis.publish(
    `notifications:${params.userId}`,
    JSON.stringify(newNotification)
  );

  return newNotification;
}
