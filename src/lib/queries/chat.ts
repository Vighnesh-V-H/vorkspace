import { db } from "@/db";
import { chatSession, chatMessage } from "@/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";

export async function createChatSession(
  userId: string,
  organizationId: string,
  title: string = "New Chat",
) {
  const [session] = await db
    .insert(chatSession)
    .values({ userId, organizationId, title })
    .returning();
  return session;
}

export async function getChatSessionsByOrg(
  userId: string,
  organizationId: string,
) {
  return db
    .select()
    .from(chatSession)
    .where(
      and(
        eq(chatSession.userId, userId),
        eq(chatSession.organizationId, organizationId),
      ),
    )
    .orderBy(desc(chatSession.updatedAt));
}

export async function getChatSessionById(sessionId: string) {
  const [session] = await db
    .select()
    .from(chatSession)
    .where(eq(chatSession.id, sessionId))
    .limit(1);
  return session ?? null;
}

export async function updateChatSessionTitle(
  sessionId: string,
  title: string,
) {
  const [updated] = await db
    .update(chatSession)
    .set({ title })
    .where(eq(chatSession.id, sessionId))
    .returning();
  return updated;
}

export async function deleteChatSession(sessionId: string) {
  await db.delete(chatSession).where(eq(chatSession.id, sessionId));
}

export async function touchChatSession(sessionId: string) {
  await db
    .update(chatSession)
    .set({ updatedAt: new Date() })
    .where(eq(chatSession.id, sessionId));
}

export async function createChatMessage(
  sessionId: string,
  role: "user" | "assistant" | "system" | "tool",
  content?: string,
  parts?: unknown,
) {
  const messageContent =
    (parts as any[])
      ?.filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("\n") ?? content;

  const [message] = await db
    .insert(chatMessage)
    .values({ sessionId, role, content: messageContent, parts })
    .returning();
  return message;
}

export async function getMessagesBySession(sessionId: string) {
  return db
    .select()
    .from(chatMessage)
    .where(eq(chatMessage.sessionId, sessionId))
    .orderBy(asc(chatMessage.createdAt));
}
