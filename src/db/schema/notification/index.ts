import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const notification = pgTable("notification", {
  id: text("id").primaryKey(),
  entityId: text("entity_id").notNull(),
  entityType: text("entity_type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Notification = typeof notification.$inferSelect;
