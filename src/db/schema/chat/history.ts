import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth/user";
import { organization } from "../organization";

export const chatSession = pgTable(
  "chat_session",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    title: text("title").notNull().default("New Chat"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("chat_session_user_idx").on(t.userId),
    index("chat_session_org_idx").on(t.organizationId),
    index("chat_session_org_user_idx").on(t.organizationId, t.userId),
    index("chat_session_updated_idx").on(t.updatedAt),
  ],
);

export type ChatSession = typeof chatSession.$inferSelect;
export type NewChatSession = typeof chatSession.$inferInsert;
