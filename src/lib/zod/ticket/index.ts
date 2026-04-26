import z from "zod";

export const ticketTagValues = ["bug", "feature", "improvement"] as const;

export const createTicketSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be under 200 characters"),
  description: z
    .string()
    .max(2000, "Description must be under 2000 characters")
    .optional(),
  tag: z.enum(ticketTagValues, {
    error: "Please select a tag",
  }),
  assignedTo: z.string().min(1, "Please select a member to assign"),
  organizationId: z.string().min(1, "Organization ID is required"),
});

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;
