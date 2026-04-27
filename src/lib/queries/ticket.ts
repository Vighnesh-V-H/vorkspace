import { db } from "@/db";
import { ticket } from "@/db/schema";
import { user } from "@/db/schema/auth/user";
import { eq } from "drizzle-orm";
import { invalidateTicketsCache } from "../redis";

type CreateTicketInput = {
  title: string;
  description?: string;
  tag: "bug" | "feature" | "improvement";
  organizationId: string;
  assignedTo: string;
  createdBy: string;
};

export async function createTicket(input: CreateTicketInput) {
  const [newTicket] = await db
    .insert(ticket)
    .values({
      title: input.title,
      description: input.description ?? null,
      tag: input.tag,
      organizationId: input.organizationId,
      assignedTo: input.assignedTo,
      createdBy: input.createdBy,
      createdAt: new Date(),
    })
    .returning();

  await invalidateTicketsCache(input.organizationId);
  return newTicket;
}

export async function getTicketsByOrganization(organizationId: string) {
  const tickets = await db
    .select({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      tag: ticket.tag,
      assignedTo: ticket.assignedTo,
      assigneeName: user.name,
      assigneeEmail: user.email,
      createdBy: ticket.createdBy,
      createdAt: ticket.createdAt,
      closedAt: ticket.closedAt,
    })
    .from(ticket)
    .innerJoin(user, eq(ticket.assignedTo, user.id))
    .where(eq(ticket.organizationId, organizationId))
    .orderBy(ticket.createdAt);

  return tickets;
}
