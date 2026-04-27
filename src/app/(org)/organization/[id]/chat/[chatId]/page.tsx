"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";

import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatEmpty } from "@/components/chat/chat-empty";
import Loader from "@/components/ui/loader";

export default function ChatSessionPage() {
  const params = useParams();

  const orgId = params.id as string;
  const chatId = params.chatId as string;

  const [initialMessages, setInitialMessages] = useState<UIMessage[] | null>(
    null,
  );
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  useEffect(() => {
    const pending = sessionStorage.getItem(`chat_pending_${chatId}`);

    if (pending) {
      setPendingMessage(pending);
      sessionStorage.removeItem(`chat_pending_${chatId}`);
    }

    async function loadMessages() {
      try {
        const res = await fetch(`/api/chat/sessions/${chatId}`);

        if (!res.ok) {
          setInitialMessages([]);
          return;
        }

        const data = await res.json();

        const msgs: UIMessage[] = (data.messages ?? []).map(
          (m: {
            id: string;
            role: "user" | "assistant" | "system";
            content: string;
            parts?: unknown[];
          }) => ({
            id: m.id,
            role: m.role,
            parts: (m.parts as UIMessage["parts"]) ?? [
              { type: "text", text: m.content },
            ],
          }),
        );

        setInitialMessages(msgs);
      } catch {
        setInitialMessages([]);
      } finally {
        setLoadingHistory(false);
      }
    }

    void loadMessages();
  }, [chatId]);

  if (loadingHistory || initialMessages === null) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <ChatSessionInner
      chatId={chatId}
      orgId={orgId}
      initialMessages={initialMessages}
      pendingMessage={pendingMessage}
    />
  );
}

function ChatSessionInner({
  chatId,
  orgId,
  initialMessages,
  pendingMessage,
}: {
  chatId: string;
  orgId: string;
  initialMessages: UIMessage[];
  pendingMessage: string | null;
}) {
  const [input, setInput] = useState("");
  const [hasSentPending, setHasSentPending] = useState(false);

  const { messages, sendMessage, status, stop, error, clearError } = useChat({
    id: chatId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        chatId,
        orgId,
      },
    }),
    onError: (err) => {
      console.error("Chat error:", err);
    },
  });

  const sendPending = useCallback(() => {
    if (!pendingMessage || hasSentPending || status !== "ready") return;

    setHasSentPending(true);

    sendMessage({
      role: "user",
      parts: [{ type: "text", text: pendingMessage }],
    });
  }, [pendingMessage, hasSentPending, status, sendMessage]);

  useEffect(() => {
    sendPending();
  }, [sendPending]);

  const isLoading = status === "submitted" || status === "streaming";

  function handleSubmit() {
    const text = input.trim();

    if (!text || isLoading) return;

    setInput("");

    sendMessage({
      role: "user",
      parts: [{ type: "text", text }],
    });
  }

  function handleSuggestion(suggestion: string) {
    if (isLoading) return;

    setInput("");

    sendMessage({
      role: "user",
      parts: [{ type: "text", text: suggestion }],
    });
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {messages.length === 0 && !isLoading ? (
        <ChatEmpty onSuggestionClick={handleSuggestion} />
      ) : (
        <ChatMessages
          messages={messages}
          status={status}
          error={error}
          onClearError={clearError}
        />
      )}

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        onStop={stop}
        isLoading={isLoading}
      />
    </div>
  );
}
