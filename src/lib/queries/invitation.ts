import { db } from "@/db";
import { organizationInvitation } from "@/db/schema";

type CreateInvitationInput = {
  id: string;
  organizationId: string;
  email: string;
  role: "owner" | "admin" | "member";
  status: "pending" | "accepted" | "declined" | "expired" | "revoked";
  expiresAt: Date;
  invitedBy: string;
};

export async function createOrganizationInvitation(data: CreateInvitationInput) {
  const [invitation] = await db
    .insert(organizationInvitation)
    .values(data)
    .returning();
    
  return invitation;
}
