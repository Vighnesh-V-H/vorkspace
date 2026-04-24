import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";
import { user } from "../auth/user";
import { sql } from "drizzle-orm";

export const organizationRoleEnum = pgEnum("organization_role", [
  "owner",
  "admin",
  "member",
  "viewer",
]);

export const invitationStatusEnum = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "declined",
  "expired",
  "revoked",
]);

export const organization = pgTable(
  "organization",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    address: jsonb("address"),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deletedAt", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("organization_email_unique").on(t.email),
    index("organization_owner_idx").on(t.ownerId),
  ],
);

export const organizationMember = pgTable(
  "organization_member",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    role: organizationRoleEnum("role").notNull().default("member"),
    createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
    lastActiveAt: timestamp("lastActiveAt", { withTimezone: true }),
    removedAt: timestamp("removedAt", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("organization_member_org_user_unique")
      .on(t.organizationId, t.userId)
      .where(sql`${t.removedAt} IS NULL`),
    index("organization_member_org_idx").on(t.organizationId),
    index("organization_member_user_idx").on(t.userId),
  ],
);

export const organizationInvitation = pgTable(
  "organization_invitation",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    email: text("email").notNull(),
    role: organizationRoleEnum("role").notNull().default("member"),
    status: invitationStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
    expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
    invitedBy: text("invited_by").references(() => user.id, {
      onDelete: "set null",
      onUpdate: "cascade",
    }),
    respondedAt: timestamp("respondedAt", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("organization_invitation_org_email_unique")
      .on(t.organizationId, t.email)
      .where(sql`${t.status} = 'pending'`),
    index("organization_invitation_org_idx").on(t.organizationId),
    index("organization_invitation_email_idx").on(t.email),
    index("organization_invitation_expires_idx").on(t.expiresAt),
    check(
      "invitation_expires_after_created",
      sql`${t.expiresAt} > ${t.createdAt}`,
    ),
  ],
);

export type Organization = typeof organization.$inferSelect;
export type NewOrganization = typeof organization.$inferInsert;

export type OrganizationMember = typeof organizationMember.$inferSelect;
export type NewOrganizationMember = typeof organizationMember.$inferInsert;

export type OrganizationInvitation = typeof organizationInvitation.$inferSelect;
export type NewOrganizationInvitation =
  typeof organizationInvitation.$inferInsert;

export type OrganizationRole = (typeof organizationRoleEnum.enumValues)[number];

export type InvitationStatus = (typeof invitationStatusEnum.enumValues)[number];

export function isInvitationActive(
  invitation: OrganizationInvitation,
): boolean {
  return (
    invitation.status === "pending" &&
    new Date(invitation.expiresAt) > new Date()
  );
}
