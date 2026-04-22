import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "../auth/user";

export const organization = pgTable(
  "organization",
  {
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
  },
  (t) => [
    uniqueIndex("organization_email_unique").on(t.email),
    index("organization_owner_idx").on(t.ownerId),
    index("organization_created_at_idx").on(t.createdAt),
    index("organization_owner_created_idx").on(t.ownerId, t.createdAt),
  ],
);

export const organizationMember = pgTable(
  "organization_member",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role").notNull().default("member"),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (t) => [
    uniqueIndex("organization_member_org_user_unique").on(
      t.organizationId,
      t.userId,
    ),
    index("organization_member_org_idx").on(t.organizationId),
    index("organization_member_user_idx").on(t.userId),
    index("organization_member_role_idx").on(t.role),
  ],
);

export const organizationInvitation = pgTable(
  "organization_invitation",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role").notNull().default("member"),
    status: text("status").notNull().default("pending"), // pending, accepted, declined
    createdAt: timestamp("createdAt").defaultNow(),
    expiresAt: timestamp("expiresAt").notNull(),
  },
  (t) => [
    uniqueIndex("organization_invitation_org_email_unique").on(
      t.organizationId,
      t.email,
    ),
    index("organization_invitation_org_idx").on(t.organizationId),
    index("organization_invitation_email_idx").on(t.email),
    index("organization_invitation_status_idx").on(t.status),
    index("organization_invitation_expires_idx").on(t.expiresAt),
    index("organization_invitation_org_status_idx").on(
      t.organizationId,
      t.status,
    ),
  ],
);

export type Organization = typeof organization.$inferSelect;
export type OrganizationMember = typeof organizationMember.$inferSelect;
export type OrganizationInvitation = typeof organizationInvitation.$inferSelect;
