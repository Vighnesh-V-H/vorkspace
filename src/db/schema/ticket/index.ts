import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth";

export const ticket = pgTable(
  "ticket",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    assignedTo: text("assignedTo")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("createdAt").notNull(),
    closedAt: timestamp("closedAt"),
  },
  (t) => [
    index("ticket_assigned_to_idx").on(t.assignedTo),

    index("ticket_assigned_open_idx").on(t.assignedTo, t.closedAt),

    index("ticket_created_at_idx").on(t.createdAt),
    index("ticket_closed_at_idx").on(t.closedAt),

    index("ticket_assigned_created_idx").on(t.assignedTo, t.createdAt),
  ],
);
