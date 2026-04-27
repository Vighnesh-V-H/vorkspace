import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { chatSession } from "./history";

export const chatRoleEnum = pgEnum("chat_role", [
  "user",
  "assistant",
  "system",
  "tool",
]);

export const chatMessage = pgTable(
  "chat_message",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    sessionId: text("session_id")
      .notNull()
      .references(() => chatSession.id, { onDelete: "cascade" }),
    role: chatRoleEnum("role").notNull(),
    content: text("content").notNull(),
    parts: jsonb("parts"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("chat_message_session_idx").on(t.sessionId),
    index("chat_message_session_created_idx").on(t.sessionId, t.createdAt),
  ],
);

export type ChatMessage = typeof chatMessage.$inferSelect;
export type NewChatMessage = typeof chatMessage.$inferInsert;
