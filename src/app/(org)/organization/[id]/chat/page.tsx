"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCreateChatSession } from "@/lib/queries/client/chat";
import { ChatEmpty } from "@/components/chat/chat-empty";
import { ChatInput } from "@/components/chat/chat-input";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params.id as string;
  const [input, setInput] = useState("");

  const createSession = useCreateChatSession(orgId);

  async function handleSend() {
    if (!input.trim()) return;
    const message = input;
    setInput("");

    try {
      const data = await createSession.mutateAsync("New Chat");
      const sessionId = data.session.id;
      sessionStorage.setItem(`chat_pending_${sessionId}`, message);
      router.push(`/organization/${orgId}/chat/${sessionId}`);
    } catch {
      setInput(message);
    }
  }

  function handleSuggestion(suggestion: string) {
    setInput(suggestion);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <ChatEmpty onSuggestionClick={handleSuggestion} />
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSend}
        isLoading={createSession.isPending}
        placeholder="Start a conversation..."
      />
    </div>
  );
}
