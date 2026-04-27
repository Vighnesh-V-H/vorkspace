"use client";

import { useEffect, useRef } from "react";
import type { UIMessage } from "ai";
import { Bot, User, AlertCircle, Loader2, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatStatus =
  | "submitted"
  | "streaming"
  | "ready"
  | "error";

type ChatMessagesProps = {
  messages: UIMessage[];
  status: ChatStatus;
  error?: Error;
  onClearError?: () => void;
};

export function ChatMessages({
  messages,
  status,
  error,
  onClearError,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, status]);

  if (messages.length === 0) return null;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {status === "streaming" && (
        <div className="flex items-center gap-2 text-muted-foreground px-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Thinking...</span>
        </div>
      )}

      {error && (
        <div className="mx-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-destructive">
              Something went wrong
            </p>
            <p className="text-xs text-destructive/80 mt-1">
              {error.message}
            </p>
          </div>

          {onClearError && (
            <button
              onClick={onClearError}
              className="text-xs underline shrink-0 text-destructive/70 hover:text-destructive"
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 max-w-3xl mx-auto",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "h-8 w-8 shrink-0 rounded-full flex items-center justify-center",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      <div
        className={cn(
          "flex flex-col gap-2 min-w-0 max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        {message.parts.map((part, i) => {
          if (part.type === "text" && part.text?.trim()) {
            return (
              <div
                key={i}
                className={cn(
                  "rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words",
                  isUser
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                )}
              >
                {part.text}
              </div>
            );
          }

          if (isToolPart(part)) {
            return (
              <ToolCallPart
                key={part.toolCallId ?? i}
                part={part}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}


type ToolLikePart = {
  type: string;
  toolCallId?: string;
  toolName?: string;
  state?: string;
  input?: unknown;
  output?: unknown;
};

function isToolPart(part: unknown): part is ToolLikePart {
  if (!part || typeof part !== "object") return false;

  const p = part as Record<string, unknown>;

  return (
    typeof p.type === "string" &&
    (p.type.startsWith("tool-") ||
      p.type === "dynamic-tool" ||
      "toolCallId" in p)
  );
}

function ToolCallPart({ part }: { part: ToolLikePart }) {
  const rawToolName =
    part.toolName ||
    (part.type.startsWith("tool-")
      ? part.type.replace("tool-", "")
      : "Tool");

  const displayName = rawToolName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

  const isLoading = [
    "input-streaming",
    "input-available",
    "call",
  ].includes(part.state ?? "");

  const isComplete = [
    "output-available",
    "result",
  ].includes(part.state ?? "");

  return (
    <div className="w-full max-w-sm rounded-xl border border-border/50 bg-card/50 p-3 text-xs">
      <div className="flex items-center gap-2">
        <Wrench className="h-3.5 w-3.5 text-muted-foreground" />

        <span className="font-medium text-foreground">
          {displayName}
        </span>

        {isLoading && (
          <Loader2 className="ml-auto h-3 w-3 animate-spin text-muted-foreground" />
        )}

        {isComplete && (
          <span className="ml-auto text-[10px] font-medium uppercase tracking-wide text-emerald-500">
            Done
          </span>
        )}
      </div>

      {isComplete && part.output !== undefined && (
        <div className="mt-2 pt-2 border-t border-border/30 text-muted-foreground whitespace-pre-wrap break-words">
          {formatOutput(part.output)}
        </div>
      )}
    </div>
  );
}

function formatOutput(value: unknown) {
  if (typeof value === "string") return value;

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "Unable to render output";
  }
}