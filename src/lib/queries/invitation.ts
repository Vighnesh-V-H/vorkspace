import { db } from "@/db";
import { organizationInvitation } from "@/db/schema";

type CreateInvitationInput = {
  id: string;
  organizationId: string;
  email: string;
  role: "viewer" | "admin" | "member";
  status: "pending" | "accepted" | "declined" | "expired" | "revoked";
  expiresAt: Date;
  invitedBy: string;
};

export type BulkInviteInput = {
  organizationId: string;
  invitedBy: string;
  invites: { email: string; role?: "admin" | "member" | "viewer" }[];
};

export async function createOrganizationInvitation(
  data: CreateInvitationInput,
) {
  const [invitation] = await db
    .insert(organizationInvitation)
    .values(data)
    .returning();

  return invitation;
}

export async function createBulkOrganizationInvitations({
  organizationId,
  invitedBy,
  invites,
}: BulkInviteInput) {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + 7);

  const normalized = Array.from(
    new Map(
      invites.map((i) => [
        i.email.trim().toLowerCase(),
        {
          email: i.email.trim().toLowerCase(),
          role: i.role ?? "member",
        },
      ]),
    ).values(),
  );
  const rows = normalized.map((invite) => ({
    id: crypto.randomUUID(),
    organizationId,
    email: invite.email,
    role: invite.role,
    status: "pending" as const,
    invitedBy,
    expiresAt,
  }));

  return db.transaction(async (tx) => {
    const inserted = await tx
      .insert(organizationInvitation)
      .values(rows)
      .onConflictDoNothing()
      .returning();

    return inserted;
  });
}
