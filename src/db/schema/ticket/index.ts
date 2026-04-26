import {
  index,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "../auth";
import { organization } from "../organization";

export const ticketTagEnum = pgEnum("ticket_tag", [
  "bug",
  "feature",
  "improvement",
]);

export const ticket = pgTable(
  "ticket",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    tag: ticketTagEnum("tag").notNull().default("bug"),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    assignedTo: text("assignedTo")
      .notNull()
      .references(() => user.id),
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    closedAt: timestamp("closedAt"),
  },
  (t) => [
    index("ticket_assigned_to_idx").on(t.assignedTo),
    index("ticket_org_idx").on(t.organizationId),
    index("ticket_tag_idx").on(t.tag),
    index("ticket_assigned_open_idx").on(t.assignedTo, t.closedAt),
    index("ticket_created_at_idx").on(t.createdAt),
    index("ticket_closed_at_idx").on(t.closedAt),
    index("ticket_assigned_created_idx").on(t.assignedTo, t.createdAt),
  ],
);

export type Ticket = typeof ticket.$inferSelect;
export type NewTicket = typeof ticket.$inferInsert;
export type TicketTag = (typeof ticketTagEnum.enumValues)[number];
