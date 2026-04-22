import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organization } from "../organization";
import { user } from "../auth/user";

export const notification = pgTable(
  "notification",
  {
    id: text("id").primaryKey(),

    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id),

    userId: text("user_id")
      .notNull()
      .references(() => user.id),

    entityId: text("entity_id").notNull(),
    entityType: text("entity_type").notNull(),

    title: text("title").notNull(),
    message: text("message").notNull(),

    isRead: boolean("is_read").default(false).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("notification_user_idx").on(t.userId),

    index("notification_org_idx").on(t.organizationId),

    index("notification_user_created_idx").on(t.userId, t.createdAt),

    index("notification_user_unread_idx").on(t.userId, t.isRead),

    index("notification_entity_idx").on(t.entityType, t.entityId),
  ],
);

export type Notification = typeof notification.$inferSelect;
