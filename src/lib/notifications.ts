import { redis } from "@/lib/redis";
import { createNotification } from "./queries/notification";

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

  const newNotification = await createNotification({
    id,
    ...params,
  });

  await redis.publish(
    `notifications:${params.userId}`,
    JSON.stringify(newNotification)
  );

  return newNotification;
}
