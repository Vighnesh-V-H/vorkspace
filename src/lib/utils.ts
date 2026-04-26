import { OrganizationInvitation } from "@/db/schema";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isInvitationActive(
  invitation: OrganizationInvitation,
): boolean {
  return (
    invitation.status === "pending" &&
    new Date(invitation.expiresAt) > new Date()
  );
}
