"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ChatSession, ChatMessage } from "@/db/schema";

export const chatQueryKeys = {
  sessions: (orgId: string) => ["chat-sessions", orgId] as const,
  messages: (sessionId: string) => ["chat-messages", sessionId] as const,
};

export function useChatSessionsQuery(orgId: string) {
  return useQuery<ChatSession[]>({
    queryKey: chatQueryKeys.sessions(orgId),
    queryFn: async () => {
      const res = await fetch(`/api/chat/sessions?orgId=${orgId}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch chat sessions");
      const data = await res.json();
      return data.sessions;
    },
    enabled: Boolean(orgId),
  });
}

export function useCreateChatSession(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title?: string) => {
      const res = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId: orgId, title }),
      });
      if (!res.ok) throw new Error("Failed to create chat session");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.sessions(orgId),
      });
    },
  });
}

export function useDeleteChatSession(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await fetch(`/api/chat/sessions/${sessionId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete chat session");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.sessions(orgId),
      });
    },
  });
}

export function useChatMessagesQuery(sessionId: string) {
  return useQuery<ChatMessage[]>({
    queryKey: chatQueryKeys.messages(sessionId),
    queryFn: async () => {
      const res = await fetch(`/api/chat/sessions/${sessionId}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      return data.messages;
    },
    enabled: Boolean(sessionId),
  });
}
