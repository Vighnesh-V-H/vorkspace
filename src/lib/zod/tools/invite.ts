import z from "zod";

export const inviteMemberSchema = z.object({
  organizationId: z.string().describe("Organization ID"),
  email: z.email().describe("Email of the user to invite"),
  role: z.enum(["member", "admin"]).optional(),
});
