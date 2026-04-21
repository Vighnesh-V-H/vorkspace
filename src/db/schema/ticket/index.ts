import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "../auth";

export const ticket = pgTable("ticket", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  assignedTo: text("assignedTo")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("createdAt").notNull(),
  closedAt: timestamp("closedAt"),
});
