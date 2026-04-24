import z from "zod";

export const organizationRoleEnum = [
  "owner",
  "admin",
  "member",
  "viewer",
] as const;

export const inviteMemberSchema = z.object({
  email: z.email("Enter a valid email address"),

  role: z.enum(organizationRoleEnum, {
    error: "Please select a role",
  }),
});

export type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;
