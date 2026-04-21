import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { user } from "../auth/user";

export const organization = pgTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  address: jsonb("address"),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const organizationMember = pgTable("organization_member", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("member"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const organizationInvitation = pgTable("organization_invitation", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role").notNull().default("member"),
  status: text("status").notNull().default("pending"), // pending, accepted, declined
  createdAt: timestamp("createdAt").defaultNow(),
  expiresAt: timestamp("expiresAt").notNull(),
});

export type Organization = typeof organization.$inferSelect;
export type OrganizationMember = typeof organizationMember.$inferSelect;
export type OrganizationInvitation = typeof organizationInvitation.$inferSelect;
